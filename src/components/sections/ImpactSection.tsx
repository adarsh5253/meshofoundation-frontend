import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Recycle, GraduationCap, HeartHandshake } from "lucide-react";

const impacts = [
  { icon: Recycle, title: "Carbon Offset", value: 85, unit: "tons CO₂ offset annually", color: "bg-primary" },
  { icon: GraduationCap, title: "Education", value: 92, unit: "% literacy rate in program areas", color: "bg-secondary" },
  { icon: HeartHandshake, title: "Livelihood", value: 78, unit: "% income increase for participants", color: "bg-primary" },
  { icon: TrendingUp, title: "Growth", value: 95, unit: "% community satisfaction rate", color: "bg-secondary" },
];

function ProgressBar({ value, inView, color }: { value: number; inView: boolean; color: string }) {
  return (
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </div>
  );
}

export default function ImpactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding pt-28">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="section-header"
        >
          <span className="section-badge">Our Impact</span>
          <h2 className="section-title">Measurable Change</h2>
          <p className="section-desc">Tracking real progress across communities and ecosystems.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {impacts.map(({ icon: Icon, title, value, unit, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="card-elevated rounded-2xl p-8 cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary" size={26} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground text-lg">{title}</h4>
                  <p className="text-sm text-muted-foreground">{unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ProgressBar value={value} inView={inView} color={color} />
                <span className="font-heading font-extrabold text-foreground text-lg min-w-[3rem]">{value}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
