"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // GSAP animation for navbar
    if (navbarRef.current) {
      gsap.from(navbarRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Vendors", href: "#vendors" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg dark:shadow-gray-800/50 py-3"
          : "bg-white dark:bg-gray-900 py-5 md:bg-transparent md:dark:bg-transparent"
      }`}
    >
      <div className="max-w-[90vw] mx-auto lg:px-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-linear-to-br from-green-main to-green-dark rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span
              className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-900 dark:text-white"
                  : "text-black md:text-white dark:text-white"
              }`}
            >
              PlanIt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300 hover:text-green-main dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800"
                    : "text-white hover:text-green-light hover:bg-white/10 dark:hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/login"
              className={`font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 dark:text-gray-300 hover:text-green-main dark:hover:text-green-400"
                  : "text-white hover:text-green-light"
              }`}
            >
              Sign In
            </Link>
            <Link className="btn-primary" href="/register">Get Started</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden ${
              isScrolled
                ? "text-gray-700 dark:text-gray-300"
                : "text-black md:text-white dark:text-white"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800/50 rounded-b-lg mt-2 px-6">
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block font-medium text-gray-700 dark:text-gray-300 hover:text-green-main dark:hover:text-green-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </span>
                <ThemeToggle />
              </div>
              <Link
                href="#signin"
                className="block font-medium text-gray-700 dark:text-gray-300 hover:text-green-main dark:hover:text-green-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <button className="btn-primary w-full">Get Started</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
