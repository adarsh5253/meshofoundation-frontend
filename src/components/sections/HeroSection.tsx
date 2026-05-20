import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";

const EarthScene = lazy(() => import("../EarthScene"));

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Smooth dark gradient background */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

      {/* Very subtle radial light behind Earth area */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 75% 50%, hsl(122 39% 30% / 0.18) 0%, transparent 45%)",
        }}
      />

      <div className="container-narrow relative z-10 px-4 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-28 pb-16">
        {/* LEFT — Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="section-badge mb-7"
          >
            Mesho Foundation
          </motion.span>

          <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.05] mb-6 text-white tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="block"
            >
              Building a
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="block"
            >
              <span className="text-highlight">Sustainable</span> Future
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-lg"
          >
            We empower communities through environmental conservation, education, and
            sustainable development—creating lasting impact across the globe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <Link to="/donate" className="btn-primary">
              Donate Now <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-secondary">
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT — clean Earth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="h-[340px] sm:h-[460px] lg:h-[560px] relative"
        >
          {/* Soft single shadow / glow underneath */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 55%, hsl(122 39% 40% / 0.18) 0%, transparent 55%)",
              filter: "blur(20px)",
            }}
          />
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            }
          >
            <EarthScene />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
