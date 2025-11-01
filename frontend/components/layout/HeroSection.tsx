"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Star, Camera, Music, Utensils, Sparkles } from "lucide-react";
import { gsap } from "gsap";

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate heading
      if (headingRef.current) {
        tl.from(headingRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          delay: 0.5,
        });
      }

      // Animate subheading
      if (subheadingRef.current) {
        tl.from(
          subheadingRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        );
      }

      // Animate search bar
      if (searchBarRef.current) {
        tl.from(
          searchBarRef.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
          },
          "-=0.4"
        );
      }

      // Animate stats
      if (statsRef.current) {
        const statItems = statsRef.current.children;
        tl.from(
          statItems,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
          },
          "-=0.3"
        );
      }

      // Animate floating cards
      if (floatingCardsRef.current) {
        const cards = floatingCardsRef.current.children;
        gsap.from(cards, {
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          delay: 1,
          ease: "back.out(1.2)",
        });

        // Continuous floating animation
        Array.from(cards).forEach((card, index) => {
          gsap.to(card, {
            y: "+=20",
            duration: 2 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: "500+", label: "Verified Vendors" },
    { value: "10,000+", label: "Events Planned" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const floatingCards = [
    { icon: Camera, name: "Photography", rating: 4.9 },
    { icon: Utensils, name: "Catering", rating: 4.8 },
    { icon: Music, name: "Entertainment", rating: 4.7 },
    { icon: Sparkles, name: "Decoration", rating: 4.9 },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen h-screen flex items-center justify-center overflow-visible pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8"
    >
      {/* Background Image with Green Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Hero Background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          quality={100}
          priority
        />
        {/* Darker gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-br from-black/60 via-green-900/70 to-emerald-800/80"></div>
        {/* Additional bottom gradient for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center text-white py-12 sm:py-20">
        <h1
          ref={headingRef}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-2xl px-2"
        >
          Plan Your Perfect Event with Kenya's Top Vendors
        </h1>
        <p
          ref={subheadingRef}
          className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-10 max-w-3xl mx-auto text-white/90 drop-shadow-lg px-4"
        >
          From weddings to corporate events, connect with verified professionals
          who bring your vision to life
        </p>

        {/* Search Bar */}
        <div
          ref={searchBarRef}
          className="bg-white rounded-lg shadow-xl p-2 sm:p-3 max-w-3xl mx-auto mb-6 sm:mb-10"
        >
          <div className="flex flex-col md:flex-row gap-2">
            <label htmlFor="category-select" className="sr-only">
              Category
            </label>
            <select
              id="category-select"
              aria-label="Category"
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-main"
            >
              <option>All Categories</option>
              <option>Photography</option>
              <option>Catering</option>
              <option>Venue</option>
              <option>Decoration</option>
              <option>Entertainment</option>
            </select>
            <input
              type="text"
              placeholder="Enter location..."
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-main"
            />
            <button className="btn-primary px-4 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base whitespace-nowrap">
              <Search className="inline-block mr-1 sm:mr-2" size={16} />
              <span className="hidden sm:inline">Find Services</span>
              <span className="sm:hidden">Search</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-12 mb-12 sm:mb-16 px-2"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center backdrop-blur-sm bg-white/10 rounded-lg px-4 sm:px-6 py-3 sm:py-4 min-w-[100px] sm:min-w-[120px]"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-white/80 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Vendor Cards */}

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 sm:bottom-32 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-30">
        <svg
          width="24"
          height="24"
          viewBox="0 0 30 30"
          className="sm:w-[30px] sm:h-[30px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 20L10 15L11.4 13.6L15 17.2L18.6 13.6L20 15L15 20Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Scrolling Service Section - Overlaps Next Section */}
      {/*<div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-[130px] bg-white rounded-2xl shadow-2xl z-30 px-8 py-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Popular Services
          </h3>
          <p className="text-gray-600 mb-4">
            Browse our most requested event services
          </p>
          {/* Add your animated services content here 
        </div>
      </div>*/}
    </section>
  );
};

export default HeroSection;
