"use client";

import { useEffect, useRef } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  Heart,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Stagger animation for footer sections
      gsap.from(".footer-section", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
      });

      // Social icons animation
      gsap.from(".social-icon", {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        },
      });

      // Newsletter animation
      gsap.from(".newsletter-box", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 75%",
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about", icon: "→" },
        { name: "How It Works", href: "#how-it-works", icon: "→" },
        { name: "Careers", href: "#careers", icon: "→" },
        { name: "Press & Media", href: "#press", icon: "→" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Photography", href: "#photography", icon: "📸" },
        { name: "Catering", href: "#catering", icon: "🍽️" },
        { name: "Venues", href: "#venues", icon: "🏛️" },
        { name: "Decoration", href: "#decoration", icon: "🎨" },
        { name: "Entertainment", href: "#entertainment", icon: "🎵" },
        { name: "View All", href: "#services", icon: "→" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#help", icon: "→" },
        { name: "Blog", href: "#blog", icon: "→" },
        { name: "Event Planning Guide", href: "#guide", icon: "→" },
        { name: "FAQs", href: "#faq", icon: "→" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "#facebook",
      name: "Facebook",
      color: "hover:bg-blue-600",
    },
    {
      icon: Twitter,
      href: "#twitter",
      name: "Twitter",
      color: "hover:bg-sky-500",
    },
    {
      icon: Instagram,
      href: "#instagram",
      name: "Instagram",
      color: "hover:bg-pink-600",
    },
    {
      icon: Linkedin,
      href: "#linkedin",
      name: "LinkedIn",
      color: "hover:bg-blue-700",
    },
  ];

  const trustBadges = [
    { text: "100% Verified", icon: CheckCircle2 },
    { text: "Secure Payments", icon: CheckCircle2 },
    { text: "24/7 Support", icon: CheckCircle2 },
  ];

  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container lg:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        <div className="newsletter-box py-12 sm:py-16 border-b border-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">
                    Stay Updated
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                  Get Event Planning Tips
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Subscribe to our newsletter for exclusive deals, tips, and
                  vendor spotlights
                </p>
              </div>

              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <span>Subscribe</span>
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  No spam, unsubscribe anytime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <div className="flex flex-wrap gap-8 lg:gap-12">
            {/* Brand Section - Takes full width on mobile, half on tablet, 2/5 on desktop */}
            <div className="footer-section w-full sm:w-[calc(50%-1rem)] lg:w-[calc(40%-1.5rem)]">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
                <span className="text-3xl font-bold text-white">PlanIt</span>
              </div>

              <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                Your trusted partner for finding the best event vendors in
                Kenya. Plan your perfect event with confidence and ease.
              </p>

              {/* Trust Badges */}
              <div className="space-y-2 mb-6">
                {trustBadges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <badge.icon className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <p className="text-sm font-semibold text-white mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`social-icon w-11 h-11 bg-gray-700/50 ${social.color} text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:bg-opacity-100 group backdrop-blur-sm border border-gray-600/50`}
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Link Sections - Each takes half width on mobile, auto on tablet, 1/5 on desktop */}
            {footerSections.map((section, index) => (
              <div
                key={index}
                className="footer-section w-[calc(50%-1rem)] sm:w-auto sm:flex-1 lg:w-[calc(20%-1.2rem)]"
              >
                <h3 className="text-white font-bold mb-4 sm:mb-5 text-base sm:text-lg relative inline-block">
                  {section.title}
                  <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-8 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                </h3>
                <ul className="space-y-2.5 sm:space-y-3 mt-6 sm:mt-8">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group text-sm sm:text-base"
                      >
                        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0 duration-300">
                          {link.icon}
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm flex items-center justify-center lg:justify-start gap-1 flex-wrap">
                © {new Date().getFullYear()} PlanIt. Made with
                <Heart className="w-4 h-4 text-red-500 fill-current inline-block" />
                in Kenya. All rights reserved.
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <a
                href="mailto:hello@planit.co.ke"
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>hello@planit.co.ke</span>
              </a>
              <div className="hidden sm:block w-px h-4 bg-gray-700"></div>
              <a
                href="tel:+254700000000"
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm group"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>+254 700 000 000</span>
              </a>
              <div className="hidden sm:block w-px h-4 bg-gray-700"></div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm">
              <a
                href="#privacy"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Privacy
              </a>
              <span className="text-gray-700">•</span>
              <a
                href="#terms"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
