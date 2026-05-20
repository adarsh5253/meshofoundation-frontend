import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import a1 from "@/assets/activity-1.jpg";
import a2 from "@/assets/activity-2.jpg";
import a3 from "@/assets/activity-3.jpg";
import a4 from "@/assets/activity-4.jpg";

const works = [
  { img: a1, title: "Reforestation", subtitle: "Restoring native forests", tag: "Environment" },
  { img: a2, title: "Clean Water", subtitle: "Wells & filtration systems", tag: "Health" },
  { img: a3, title: "Education", subtitle: "Schools for rural children", tag: "Learning" },
  { img: a4, title: "Empowerment", subtitle: "Skill-building programs", tag: "Livelihood" },
];

export default function WorkSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-narrow relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="section-header"
        >
          <span className="section-badge">Our Work</span>
          <h2 className="section-title">
            Programs That <span className="gradient-text">Change Lives</span>
          </h2>
          <p className="section-desc">
            From climate action to community development — every project is designed for measurable, lasting impact.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {works.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer glass"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src={w.img}
                  alt={w.title}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                {/* Neon edge glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: "inset 0 0 60px hsl(158 100% 50% / 0.25)" }} />
              </div>

              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 backdrop-blur">
                  {w.tag}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-heading font-bold text-xl text-foreground mb-1">
                  {w.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{w.subtitle}</p>
                <Link
                  to="/impact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider group/link"
                >
                  Learn more
                  <ArrowUpRight size={14} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
