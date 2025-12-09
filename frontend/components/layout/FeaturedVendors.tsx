"use client";

import { useEffect, useRef } from "react";
import {
  Camera,
  Utensils,
  Music,
  Palette,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { VendorCard } from "@/components/ui/VendorCard";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedVendors() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section reveal animation
      gsap.from(".section-header", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Cards animation
      gsap.from(".vendor-card-item", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const vendors = [
    {
      id: 1,
      name: "Moments Photography",
      category: "Photography & Videography",
      rating: 4.9,
      reviewCount: 127,
      location: "Nairobi, Kenya",
      startingPrice: "25,000",
      image:
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop&q=80",
      badge: { type: "top-rated", text: "Top Rated" },
      icon: Camera,
      description: "Award-winning photographers capturing your special moments",
    },
    {
      id: 2,
      name: "Savanna Caterers",
      category: "Catering Services",
      rating: 4.8,
      reviewCount: 95,
      location: "Mombasa, Kenya",
      startingPrice: "15,000",
      image:
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop&q=80",
      badge: { type: "most-booked", text: "Most Booked" },
      icon: Utensils,
      description: "Exquisite cuisine for unforgettable dining experiences",
    },
    {
      id: 3,
      name: "Elite Event Planners",
      category: "Event Planning",
      rating: 4.9,
      reviewCount: 84,
      location: "Nairobi, Kenya",
      startingPrice: "30,000",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80",
      badge: { type: "top-rated", text: "Top Rated" },
      icon: Calendar,
      description: "Professional coordination for flawless events",
    },
    {
      id: 4,
      name: "Rhythm Masters Band",
      category: "Entertainment",
      rating: 4.7,
      reviewCount: 68,
      location: "Kisumu, Kenya",
      startingPrice: "20,000",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop&q=80",
      badge: { type: "rising-star", text: "Rising Star" },
      icon: Music,
      description: "Live music and entertainment for memorable celebrations",
    },
    {
      id: 5,
      name: "Creative Designs Studio",
      category: "Decoration & Design",
      rating: 4.8,
      reviewCount: 102,
      location: "Nairobi, Kenya",
      startingPrice: "18,000",
      image:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop&q=80",
      badge: { type: "most-booked", text: "Most Booked" },
      icon: Palette,
      description: "Transforming venues into stunning event spaces",
    },
    {
      id: 6,
      name: "Safari Sounds DJ",
      category: "DJ Services",
      rating: 4.6,
      reviewCount: 56,
      location: "Mombasa, Kenya",
      startingPrice: "12,000",
      image:
        "https://images.unsplash.com/photo-1571266028243-8c1c594deeb8?w=800&h=600&fit=crop&q=80",
      badge: { type: "rising-star", text: "Rising Star" },
      icon: Music,
      description: "High-energy DJ services for any occasion",
    },
  ];

  return (
    <section
      id="vendors"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
    >
      <div className="container relative z-10">
        <div className="section-header text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold mb-4">
              ⭐ Featured Professionals
            </span>
          </motion.div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Meet Our Most Trusted Vendors
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Hand-picked professionals with proven track records of excellence
            and outstanding customer reviews
          </p>
        </div>

        {/* Vendors Grid - Mobile-First Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {vendors.map((vendor, index) => (
            <VendorCard key={vendor.id} vendor={vendor} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 sm:mt-16">
          <button className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
            Explore All Vendors
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
