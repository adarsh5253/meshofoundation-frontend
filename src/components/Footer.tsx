import { Instagram, Mail, MapPin, Phone, Facebook, ShieldCheck, FileText, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const quickLinks = [
  { label: "About", to: "/about" },
  { label: "Achievements", to: "/achievements" },
  { label: "Gallery", to: "/gallery" },
  { label: "Team", to: "/team" },
  { label: "Impact", to: "/impact" },
  { label: "Careers", to: "/careers" },
  { label: "Donate", to: "/donate" },
  { label: "Contact", to: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy", Icon: ShieldCheck },
  { label: "Terms & Conditions", to: "/terms-and-conditions", Icon: FileText },
  { label: "Refund Policy", to: "/refund-policy", Icon: Receipt },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t border-[#2a3a45] overflow-hidden"
      style={{ background: "var(--gradient-section)" }}
    >
      {/* Soft nature glow accents */}
      <div
        className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(142 30% 35% / 0.5), transparent 70%)",
        }}
      />
      <div
        className="absolute -top-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-8 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(45 40% 50% / 0.4), transparent 70%)",
        }}
      />

      <div className="container-narrow relative px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logo}
                alt="Mesho Foundation"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#4a7c59]/30"
              />
              <div>
                <span className="font-heading font-bold text-lg gradient-text block leading-tight">
                  Mesho Foundation
                </span>
                <span className="text-[10px] text-[#8a9a94] tracking-wider uppercase">
                  Step to a Better Life
                </span>
              </div>
            </div>
            <p className="text-[#a0b0a8] text-sm leading-relaxed max-w-sm">
              Building the sustainable future through community empowerment,
              environmental conservation, and education initiatives.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-bold text-[#f5f5f0] mb-5">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-1">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-[#9ab0a5] hover:text-[#5aa070] transition-colors font-medium hover:translate-x-0.5 inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-[#f5f5f0] mb-5">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-[#9ab0a5]">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 text-[#5aa070] shrink-0" />
                Mesho Foundation HQ, India
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 text-[#5aa070] shrink-0" />
                <a
                  href="mailto:meshofoundation@gmail.com"
                  className="hover:text-[#5aa070] transition-colors break-all"
                >
                  meshofoundation@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 text-[#5aa070] shrink-0" />
                <a
                  href="tel:+917275565700"
                  className="hover:text-[#5aa070] transition-colors"
                >
                  +91 72755 65700
                </a>
              </li>
            </ul>
          </div>

          {/* Legal + social */}
          <div>
            <h4 className="font-heading font-bold text-[#f5f5f0] mb-5">Legal</h4>
            <ul className="space-y-2.5 mb-7">
              {legalLinks.map(({ label, to, Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm text-[#9ab0a5] hover:text-[#5aa070] transition-colors font-medium hover:translate-x-0.5"
                  >
                    <Icon size={14} className="text-[#5aa070]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-heading font-bold text-[#f5f5f0] mb-3 text-sm">
              Follow Us
            </h4>
            <div className="flex gap-3 flex-wrap">
              {[
                {
                  Icon: Facebook,
                  href: "https://www.facebook.com/profile.php?id=61580482356743",
                  label: "Facebook",
                },
                {
                  Icon: Instagram,
                  href: "https://www.instagram.com/meshobattery/",
                  label: "Instagram",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-xl border border-[#3a4a55] bg-[#1a2a35]/50 backdrop-blur text-[#8a9a94] hover:text-[#5aa070] hover:border-[#5aa070]/40 hover:shadow-[0_0_20px_hsl(142_30%_40%/0.25)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#2a3a45] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#8a9a94]">
            © {new Date().getFullYear()} Mesho Foundation. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#8a9a94]">
            {legalLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="hover:text-[#5aa070] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
