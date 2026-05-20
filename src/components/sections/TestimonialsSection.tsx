import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "Mesho Foundation transformed our village. Clean water, a new school, and trained teachers — they actually deliver.",
    name: "Aisha Patel",
    role: "Community Leader, Gujarat",
  },
  {
    quote: "Their reforestation program brought back the birds and the rain. We are seeing nature heal in front of our eyes.",
    name: "Daniel Okafor",
    role: "Local Farmer, Kenya",
  },
  {
    quote: "The transparency, the data, the people on the ground — it's the most professional NGO I've ever partnered with.",
    name: "Dr. Helena Voss",
    role: "Climate Researcher, ETH Zürich",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 nebula-bg opacity-30 pointer-events-none" />
      <div className="container-narrow relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="section-header"
        >
          <span className="section-badge">Voices of Impact</span>
          <h2 className="section-title">
            Trusted by <span className="gradient-text">Communities Worldwide</span>
          </h2>
          <p className="section-desc">
            Real stories from the people, partners, and experts who walk this journey with us.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="glass rounded-2xl p-7 relative overflow-hidden group"
            >
              <div className="absolute -top-4 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={88} className="text-primary" strokeWidth={1.5} />
              </div>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 text-base leading-relaxed mb-7 relative z-10">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-border/50">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-heading font-bold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-heading font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
