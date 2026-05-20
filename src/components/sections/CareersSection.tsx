import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Briefcase, Clock, MapPin, Upload, X, Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { openCheckout, paymentsApi } from "@/lib/razorpay";

const positions = [
  { title: "Community Outreach Intern", duration: "3 months", location: "Remote / On-site", type: "Internship" },
  { title: "Environmental Research Intern", duration: "6 months", location: "New Delhi", type: "Internship" },
  { title: "Social Media Coordinator", duration: "Full-time", location: "Remote", type: "Job" },
  { title: "Program Manager", duration: "Full-time", location: "Mumbai", type: "Job" },
];

const APPLICATION_FEE_RUPEES = 1000;

export default function CareersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [showForm, setShowForm] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = (roleTitle: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in or create an account to apply.");
      navigate("/login", { state: { from: "/careers" } });
      return;
    }
    setActiveRole(roleTitle);
    setShowForm(true);
  };

  const closeForm = () => {
    if (processing) return;
    setShowForm(false);
    setActiveRole(null);
  };

  const handleSubmitApplication = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to submit your application.");
      navigate("/login", { state: { from: "/careers" } });
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setProcessing(true);
    try {
      const order = await paymentsApi.createOrder({
        amount: APPLICATION_FEE_RUPEES * 100,
        currency: "INR",
        purpose: "career-application",
        note: activeRole ? `Application: ${activeRole}` : "Career application",
      });

      const result = await openCheckout({
        order,
        name: "Mesho Foundation",
        description: activeRole
          ? `Application fee — ${activeRole}`
          : "Application fee",
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: phone,
        },
        notes: {
          purpose: "career-application",
          ...(activeRole ? { role: activeRole } : {}),
        },
      });

      if (result.kind === "success") {
        toast.success("Application submitted! We'll review and reach out soon.");
        setShowForm(false);
        setActiveRole(null);
        setPhone("");
      } else if (result.kind === "dismissed") {
        toast.info("Payment cancelled. Your application wasn't submitted.");
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
          <span className="section-badge">Careers</span>
          <h2 className="section-title">Join Our Mission</h2>
          <p className="section-desc">
            Be part of a team that's making a real difference. Application fee: ₹1000 for internship positions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {positions.map((pos, i) => (
            <motion.div
              key={pos.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="card-elevated rounded-2xl p-6 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="section-badge text-[10px] py-1 px-2.5">
                    {pos.type}
                  </span>
                  <h4 className="font-heading font-bold text-foreground text-lg mt-3">{pos.title}</h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="text-primary" size={18} />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-5">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {pos.duration}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {pos.location}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApplyClick(pos.title)}
                className="gradient-btn w-full py-3 rounded-xl text-sm flex items-center justify-center gap-1.5"
              >
                {isAuthenticated ? "Apply Now" : (<><Lock size={14} /> Sign in to Apply</>)}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeForm}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-strong rounded-3xl p-8 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-heading font-bold text-xl text-foreground">Apply Now</h3>
                <button
                  onClick={closeForm}
                  disabled={processing}
                  className="p-2 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
              {activeRole && (
                <p className="text-sm text-muted-foreground mb-5">
                  Applying for <span className="text-foreground font-medium">{activeRole}</span>
                </p>
              )}
              <div className="space-y-4">
                <input
                  placeholder="Full Name"
                  className="input-field"
                  defaultValue={user?.name || ""}
                />
                <input
                  placeholder="Email Address"
                  className="input-field"
                  defaultValue={user?.email || ""}
                  readOnly={!!user?.email}
                />
                <input
                  placeholder="Phone Number"
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                />
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="mx-auto text-muted-foreground mb-2" size={24} />
                  <p className="text-sm text-muted-foreground">Upload Resume (PDF, DOC)</p>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Application fee: ₹{APPLICATION_FEE_RUPEES.toLocaleString()} — paid securely via Razorpay.
                </p>
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  disabled={processing}
                  className="gradient-btn w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing…
                    </>
                  ) : (
                    `Pay ₹${APPLICATION_FEE_RUPEES.toLocaleString()} & Submit`
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
