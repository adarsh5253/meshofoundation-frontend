import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Instagram } from "lucide-react";
import team1 from "@/assets/team-1.jpg";

const team = [
  {
    name: "Aseem Mishra",
    role: "Founder & CEO",
    bio:
      "Visionary leader driving Mesho Foundation's mission for a sustainable future. With over a decade of grassroots experience across rural development, climate action, and youth empowerment, the Founder shapes our long-term strategy, forges partnerships with mission-aligned organisations, and ensures every initiative we run is measurably advancing our core promise — a step to a better life for the underserved.",
    img: team1,
  },
  
];

export default function TeamSection() {
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
          <span className="section-badge">Our Team</span>
          <h2 className="section-title">Meet the Changemakers</h2>
          <p className="section-desc">Passionate individuals driving real change in communities worldwide.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="card-elevated rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
                  <a href="#" className="p-2.5 rounded-xl bg-primary-foreground/20 text-primary-foreground hover:bg-primary transition-colors backdrop-blur-sm">
                    <Linkedin size={16} />
                  </a>
                  <a href="#" className="p-2.5 rounded-xl bg-primary-foreground/20 text-primary-foreground hover:bg-primary transition-colors backdrop-blur-sm">
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-heading font-bold text-foreground">{member.name}</h4>
                <p className="text-primary text-sm font-semibold">{member.role}</p>
                <p className="text-muted-foreground text-sm mt-2">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
