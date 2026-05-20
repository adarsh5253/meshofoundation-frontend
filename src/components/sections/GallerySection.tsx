import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import activity1 from "@/assets/activity-1.jpg";
import activity2 from "@/assets/activity-2.jpg";
import activity3 from "@/assets/activity-3.jpg";
import activity4 from "@/assets/activity-4.jpg";
import activity5 from "@/assets/activity-5.jpg";
import activity6 from "@/assets/activity-6.jpg";
import activity7 from "@/assets/activity-7.jpg";
import activity8 from "@/assets/activity-8.jpg";

const images = [
  { src: activity1, alt: "Waste segregation awareness drive", span: "col-span-2 row-span-1" },
  { src: activity2, alt: "Community cleanup campaign", span: "col-span-1 row-span-1" },
  { src: activity3, alt: "Vanashakti conservation initiative", span: "col-span-1 row-span-2" },
  { src: activity4, alt: "Sustainability awareness in parks", span: "col-span-1 row-span-1" },
  { src: activity5, alt: "Heritage site awareness campaign", span: "col-span-2 row-span-1" },
  { src: activity6, alt: "Outdoor environmental session", span: "col-span-1 row-span-1" },
  { src: activity7, alt: "Building Sustainable Future banner", span: "col-span-1 row-span-1" },
  { src: activity8, alt: "Heritage monument campaign", span: "col-span-1 row-span-1" },
];

export default function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const navigate = (dir: number) => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + dir + images.length) % images.length);
  };

  return (
    <section className="section-padding pt-28">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="section-header"
        >
          <span className="section-badge">Gallery</span>
          <h2 className="section-title">Moments of Impact</h2>
          <p className="section-desc">Real moments from our work on the ground — making change happen.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[260px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }}
              className={`${img.span} relative rounded-2xl overflow-hidden cursor-pointer group`}
              onClick={() => setLightboxIdx(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-5">
                <span className="text-primary-foreground font-heading font-semibold text-sm drop-shadow-lg">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <button className="absolute top-6 right-6 text-primary-foreground z-10 p-2 rounded-xl hover:bg-primary-foreground/10 transition-colors" onClick={() => setLightboxIdx(null)}>
              <X size={24} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground p-3 rounded-xl hover:bg-primary-foreground/10 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            >
              <ChevronLeft size={28} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground p-3 rounded-xl hover:bg-primary-foreground/10 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
            >
              <ChevronRight size={28} />
            </button>
            <motion.img
              key={lightboxIdx}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              src={images[lightboxIdx].src}
              alt={images[lightboxIdx].alt}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
