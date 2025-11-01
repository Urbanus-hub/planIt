"use client";

import { useEffect, useRef } from "react";
import {
  Star,
  MapPin,
  Award,
  TrendingUp,
  Camera,
  Utensils,
  Music,
  Palette,
  Calendar,
  ArrowRight,
  Heart,
  Share2,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import Image from "next/image";

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
        y: 50,
        duration: 0.8,
        stagger: 0.15,
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
      gradient: "from-purple-500 to-pink-500",
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
      gradient: "from-orange-500 to-red-500",
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
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: 4,
      name: "Melody Makers",
      category: "Entertainment",
      rating: 4.7,
      reviewCount: 62,
      location: "Kisumu, Kenya",
      startingPrice: "20,000",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80",
      badge: { type: "rising-star", text: "Rising Star" },
      icon: Music,
      description: "Live bands, DJs, and performers for every occasion",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      id: 5,
      name: "Decor Dreams",
      category: "Decoration & Styling",
      rating: 4.8,
      reviewCount: 76,
      location: "Nairobi, Kenya",
      startingPrice: "18,000",
      image:
        "/decor.jpg",
      badge: { type: "most-booked", text: "Most Booked" },
      icon: Palette,
      description: "Transform spaces into magical settings",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: 6,
      name: "Garden Paradise Venues",
      category: "Venue Rental",
      rating: 4.9,
      reviewCount: 103,
      location: "Karen, Nairobi",
      startingPrice: "50,000",
      image:
        "/venue.jpg",
      badge: { type: "top-rated", text: "Premium" },
      icon: MapPin,
      description: "Stunning outdoor and indoor event spaces",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section
      id="vendors"
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container relative z-10">
        <div className="section-header text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
              ⭐ Featured Professionals
            </span>
          </motion.div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Meet Our Most Trusted Vendors
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Hand-picked professionals with proven track records of excellence
            and outstanding customer reviews
          </p>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {vendors.map((vendor, index) => (
            <VendorCard key={vendor.id} vendor={vendor} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 sm:mt-16">
          <button className="group inline-flex items-center gap-2 px-8 py-4 bg-green-main text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:bg-green-dark transition-all duration-300 transform hover:scale-105">
            Explore All Vendors
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

// Vendor Card Component
const VendorCard = ({ vendor, index }: { vendor: any; index: number }) => {
  const getBadgeIcon = (type: string) => {
    switch (type) {
      case "top-rated":
        return <Award size={14} className="text-yellow-600" />;
      case "most-booked":
        return <TrendingUp size={14} className="text-green-600" />;
      case "rising-star":
        return <Star size={14} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "top-rated":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "most-booked":
        return "bg-green-50 text-green-800 border-green-200";
      case "rising-star":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const Icon = vendor.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="vendor-card-item group"
    >
      <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100">
        {/* Image Container */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
            style={{ backgroundImage: `url(${vendor.image})` }}
          />
          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${vendor.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${getBadgeColor(
                vendor.badge.type
              )}`}
            >
              {getBadgeIcon(vendor.badge.type)}
              <span>{vendor.badge.text}</span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button title="heart" className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <Heart size={16} className="text-gray-700" />
            </button>
            <button title="share"  className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <Share2 size={16} className="text-gray-700" />
            </button>
          </div>

          {/* Category Icon */}
          <div className="absolute bottom-4 left-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${vendor.gradient} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Title & Category */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-main transition-colors">
              {vendor.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {vendor.category}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {vendor.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(vendor.rating) ? "fill-current" : ""
                  }
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {vendor.rating}
            </span>
            <span className="text-sm text-gray-500">
              ({vendor.reviewCount} reviews)
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-600 mb-4">
            <MapPin size={16} className="text-green-main" />
            <span className="text-sm">{vendor.location}</span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
              <p className="text-xl font-bold text-gray-900">
                KES {vendor.startingPrice}
              </p>
            </div>
            <button className="group/btn px-5 py-2.5 bg-green-main text-white rounded-lg font-semibold text-sm hover:bg-green-dark transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg">
              View Details
              <ArrowRight
                size={16}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
