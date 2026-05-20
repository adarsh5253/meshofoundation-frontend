import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 52400, suffix: "+", label: "Lives Empowered" },
  { value: 128000, suffix: "+", label: "Trees Planted" },
  { value: 15, suffix: "", label: "Countries Reached" },
  { value: 320, suffix: "+", label: "Active Volunteers" },
];

function Counter({ end, suffix, inView }: { end: number; suffix: string; inView: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);
  return (
    <span className="font-heading font-bold text-4xl md:text-5xl text-white">
      {v.toLocaleString()}
      <span className="text-highlight">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative section-padding border-t border-border/40">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-badge">Our Impact</span>
          <h2 className="section-title">
            Numbers that tell <span className="text-highlight">our story</span>
          </h2>
          <p className="section-desc">
            Real change, measured in lives transformed and ecosystems restored.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map(({ value, suffix, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-center md:text-left"
            >
              <Counter end={value} suffix={suffix} inView={inView} />
              <p className="mt-3 text-sm text-muted-foreground tracking-wide">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
