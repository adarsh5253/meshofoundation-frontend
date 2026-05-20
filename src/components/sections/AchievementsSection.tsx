import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TreePine, Users, Globe, Droplets } from "lucide-react";

const stats = [
  { icon: TreePine, value: 50000, label: "Trees Planted", suffix: "+" },
  { icon: Users, value: 25000, label: "People Helped", suffix: "+" },
  { icon: Globe, value: 15, label: "Countries Reached", suffix: "" },
  { icon: Droplets, value: 200, label: "Clean Water Wells", suffix: "+" },
];

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <>{count.toLocaleString()}</>;
}

export default function AchievementsSection() {
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
          <span className="section-badge">Achievements</span>
          <h2 className="section-title">Our Impact in Numbers</h2>
          <p className="section-desc">Real results from years of dedicated work across communities worldwide.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, suffix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="card-elevated rounded-2xl p-8 text-center cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <Icon className="text-primary" size={28} />
              </div>
              <div className="font-heading font-extrabold text-3xl md:text-4xl text-foreground">
                <CountUp target={value} inView={inView} />{suffix}
              </div>
              <p className="text-muted-foreground text-sm mt-2 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
