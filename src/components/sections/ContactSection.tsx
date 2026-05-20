import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    const { name, email, message } = result.data;
    const subject = encodeURIComponent(`New contact from ${name} — Mesho Foundation`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:meshofoundation@gmail.com?subject=${subject}&body=${body}`;
    toast.success("Opening your email app to send the message…");
  };

  return (
    <section className="section-padding pt-28">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="section-header"
        >
          <span className="section-badge">Contact</span>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-desc">Have questions? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.form
            onSubmit={handleSend}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="card-elevated rounded-3xl p-8"
          >
            <div className="space-y-4">
              <input
                placeholder="Your Name"
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                required
              />
              <input
                placeholder="Email Address"
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                required
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="input-field resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="gradient-btn w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Send size={16} /> Send Message
              </motion.button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-5"
          >
            {[
              { icon: MapPin, title: "Address", desc: "Mesho Foundation HQ, India" },
              { icon: Mail, title: "Email", desc: "meshofoundation@gmail.com", href: "mailto:meshofoundation@gmail.com" },
              { icon: Phone, title: "Phone", desc: "+91 72755 65700", href: "tel:+917275565700" },
            ].map(({ icon: Icon, title, desc, href }) => (
              <motion.div
                key={title}
                whileHover={{ x: 6 }}
                className="flex gap-4 card-elevated rounded-2xl p-5 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary" size={22} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground">{title}</h4>
                  {href ? (
                    <a href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors break-all">{desc}</a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  )}
                </div>
              </motion.div>
            ))}
            <div className="card-elevated rounded-2xl overflow-hidden h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto text-primary mb-2" size={32} />
                <p className="text-sm text-muted-foreground font-medium">Interactive Map</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
