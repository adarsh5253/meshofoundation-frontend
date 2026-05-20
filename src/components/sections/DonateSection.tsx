import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Heart, Shield, Eye, Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { openCheckout, paymentsApi } from "@/lib/razorpay";

const amounts = [500, 1000, 2500, 5000];

export default function DonateSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState(1000);
  const [custom, setCustom] = useState("");
  const [processing, setProcessing] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleDonate = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in or create an account to donate.");
      navigate("/login", { state: { from: "/donate" } });
      return;
    }

    const rupees = Number(custom) || selected;
    if (!Number.isFinite(rupees) || rupees < 1) {
      toast.error("Please enter a valid donation amount.");
      return;
    }
    const amountInPaise = Math.round(rupees * 100);

    setProcessing(true);
    try {
      // 1) Ask the backend to create a Razorpay order
      const order = await paymentsApi.createOrder({
        amount: amountInPaise,
        currency: "INR",
        purpose: "donation",
        note: `Donation of ₹${rupees.toLocaleString()}`,
      });

      // 2) Open the Razorpay modal — verification happens inside on success
      const result = await openCheckout({
        order,
        name: "Mesho Foundation",
        description: `Donation of ₹${rupees.toLocaleString()}`,
        prefill: { name: user?.name, email: user?.email },
        notes: { purpose: "donation" },
      });

      if (result.kind === "success") {
        const firstName = user?.name?.split(" ")[0] || "there";
        toast.success(
          `Thank you ${firstName}! Your ₹${rupees.toLocaleString()} donation was received.`
        );
      } else if (result.kind === "dismissed") {
        toast.info("Donation cancelled.");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't start the payment. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="section-padding pt-28">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="section-header"
        >
          <span className="section-badge">Support Us</span>
          <h2 className="section-title">Make a Difference Today</h2>
          <p className="section-desc">Every contribution helps us build a better, more sustainable world.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto card-elevated rounded-3xl p-8 md:p-10"
        >
          <div className="grid grid-cols-2 gap-3 mb-5">
            {amounts.map((amt) => (
              <motion.button
                key={amt}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setSelected(amt); setCustom(""); }}
                className={`py-4 rounded-2xl font-heading font-bold text-lg transition-all border ${
                  selected === amt && !custom
                    ? "gradient-btn border-transparent"
                    : "bg-muted/50 text-foreground border-border hover:border-primary/50"
                }`}
              >
                ₹{amt.toLocaleString()}
              </motion.button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Custom amount (₹)"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setSelected(0); }}
            className="input-field mb-6"
          />
          <motion.button
            whileHover={{ scale: processing ? 1 : 1.01 }}
            whileTap={{ scale: processing ? 1 : 0.98 }}
            onClick={handleDonate}
            disabled={processing}
            className="gradient-btn w-full py-4 rounded-2xl text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Processing…
              </>
            ) : isAuthenticated ? (
              <>
                <Heart size={20} /> Donate ₹{custom || selected.toLocaleString()}
              </>
            ) : (
              <>
                <Lock size={18} /> Sign in to donate ₹{custom || selected.toLocaleString()}
              </>
            )}
          </motion.button>

          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              You'll need a verified account before contributing.
            </p>
          )}

          <div className="flex justify-center gap-8 mt-6">
            {[
              { icon: Shield, label: "Secure Payment" },
              { icon: Eye, label: "Full Transparency" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Icon size={14} className="text-primary" /> {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
