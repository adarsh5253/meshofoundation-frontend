import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X, UserCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Impact", to: "/impact" },
  { label: "Gallery", to: "/gallery" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar(_: { darkMode: boolean; toggleDarkMode: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-narrow flex items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Mesho Foundation"
            className="w-9 h-9 rounded-lg object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-heading font-semibold text-base text-white">
              Mesho Foundation
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-1 ml-3">
              <Link
                to="/profile"
                title={user?.email}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-1.5 ${
                  location.pathname === "/profile"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <UserCircle size={16} />
                <span className="hidden xl:inline max-w-[120px] truncate">
                  {user?.name?.split(" ")[0] || "Profile"}
                </span>
                <span className="xl:hidden">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-3">
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
          <Link to="/donate" className="ml-3 btn-primary !px-5 !py-2 text-sm">
            Donate
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border/60"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all block ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-white hover:bg-muted/40"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                      location.pathname === "/profile"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-white hover:bg-muted/40"
                    }`}
                  >
                    <UserCircle size={16} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-white hover:bg-muted/40 flex items-center gap-2 text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/signup"
                  className="px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-white hover:bg-muted/40 block"
                >
                  Sign up
                </Link>
              )}
              <Link to="/donate" className="btn-primary mt-2 w-full">
                Donate Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
