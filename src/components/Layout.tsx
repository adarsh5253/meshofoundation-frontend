import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";

export default function Layout() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Global animated starfield background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarField />
      </div>
      <div className="relative z-10">
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
