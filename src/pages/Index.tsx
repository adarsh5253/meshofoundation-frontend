import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      {/* Minimal intro + page navigation */}
      <section className="section-padding border-t border-border/40">
        <div className="container-narrow text-center max-w-3xl">
          <span className="section-badge">Our Mission</span>
          <h2 className="section-title">
            A small step today, a <span className="text-highlight">better world</span> tomorrow.
          </h2>
          <p className="section-desc">
            Mesho Foundation works at the intersection of people and planet—planting trees,
            empowering education, and building resilient communities that thrive for generations.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/about" className="btn-primary">
              Our Story <ArrowRight size={16} />
            </Link>
            <Link to="/impact" className="btn-secondary">
              Explore Our Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
