import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Heart, ArrowRight } from "lucide-react";
import aboutImg from "@/assets/about-real.jpg";

const timeline = [
  { year: "2018", title: "Founded", desc: "Mesho Foundation was established with a vision for change." },
  { year: "2020", title: "First Major Project", desc: "Launched reforestation initiative across 3 states." },
  { year: "2022", title: "10,000 Lives", desc: "Impacted over 10,000 lives through education programs." },
  { year: "2024", title: "Global Reach", desc: "Expanded operations to 5 countries worldwide." },
];

const values = [
  { icon: Target, title: "Mission", desc: "Empower communities through sustainable practices and education." },
  { icon: Eye, title: "Vision", desc: "A world where every community thrives sustainably and equitably." },
  { icon: Heart, title: "Values", desc: "Integrity, compassion, innovation, and environmental stewardship." },
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding pt-28">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-badge">About Us</span>
          <h2 className="section-title">Our Story & Mission</h2>
          <p className="section-desc">Dedicated to creating a sustainable future for communities worldwide since 2018.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group"
          >
            <div className="relative overflow-hidden rounded-3xl">
              <img src={aboutImg} alt="Mesho Foundation team in action" className="w-full object-cover aspect-[4/3]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              Mesho Foundation is a non-profit organization dedicated to creating a sustainable future for communities worldwide. Through our programs in education, environmental conservation, and community development, we empower individuals and protect our planet.
            </p>
            <div className="grid gap-4">
              {values.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="flex gap-4 p-5 rounded-2xl card-elevated cursor-pointer group/item"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={22} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-bold text-foreground flex items-center gap-2">
                      {title}
                      <ArrowRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-primary" />
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <h3 className="section-title text-2xl md:text-3xl text-center mb-12">Our Journey</h3>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="grid gap-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className={`flex flex-col md:flex-row items-center gap-4 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="card-elevated p-6 rounded-2xl inline-block cursor-pointer"
                    >
                      <span className="text-primary font-heading font-bold text-lg">{item.year}</span>
                      <h4 className="font-heading font-bold text-foreground mt-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </motion.div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background flex-shrink-0 z-10 shadow-md" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
