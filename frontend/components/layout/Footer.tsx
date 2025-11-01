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
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-section", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const footerSections = [
    {
      title: "About PlanIt",
      links: [
        { name: "About Us", href: "#about" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Become a Vendor", href: "#become-vendor" },
        { name: "Careers", href: "#careers" },
        { name: "Press", href: "#press" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Photography", href: "#photography" },
        { name: "Catering", href: "#catering" },
        { name: "Venues", href: "#venues" },
        { name: "Decoration", href: "#decoration" },
        { name: "Entertainment", href: "#entertainment" },
        { name: "All Categories", href: "#services" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Contact Us", href: "#contact" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Privacy Policy", href: "#privacy" },
        { name: "FAQs", href: "#faq" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#facebook" },
    { icon: Twitter, href: "#twitter" },
    { icon: Instagram, href: "#instagram" },
    { icon: Linkedin, href: "#linkedin" },
  ];

  return (
    <footer
      ref={footerRef}
      className="bg-gray-50 text-gray-800 section-padding border-t border-gray-200 px-3 sm:px-6"
    >
      <div className="container lg:w-[90%] mx-auto px-4 sm:px-6 lg:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Logo and Description */}
          <div className="footer-section">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-green-main to-green-dark rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg sm:text-xl">
                  P
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                PlanIt
              </span>
            </div>
            <p className="text-sm mb-3 sm:mb-4 text-gray-600">
              Your trusted partner for finding the best event vendors in Kenya.
              Plan your perfect event with confidence.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 hover:bg-green-main text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300"
                  aria-label={`Visit our ${social.icon.name}`}
                >
                  <social.icon size={18} className="sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h3 className="text-gray-900 font-bold mb-3 sm:mb-4 text-base sm:text-lg">
                {section.title}
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-green-main transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm gap-3 sm:gap-0">
          <p className="text-gray-600 text-center md:text-left">
            © {new Date().getFullYear()} PlanIt. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-600">
            <a
              href="#contact"
              className="flex items-center hover:text-green-main transition-colors"
            >
              <Mail size={14} className="mr-1 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">hello@planit.co.ke</span>
            </a>
            <a
              href="#phone"
              className="flex items-center hover:text-green-main transition-colors"
            >
              <Phone size={14} className="mr-1 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">+254 700 000 000</span>
            </a>
            <a
              href="#location"
              className="flex items-center hover:text-green-main transition-colors"
            >
              <MapPin size={14} className="mr-1 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Nairobi, Kenya</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
