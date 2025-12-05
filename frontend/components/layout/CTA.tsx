"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Users,
  Store,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Shield,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const clientCardRef = useRef<HTMLDivElement>(null);
  const vendorCardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Badge animation
      gsap.from(badgeRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -20,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Client card animation
      gsap.from(clientCardRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Vendor card animation
      gsap.from(vendorCardRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Floating sparkles animation
      gsap.to(".floating-sparkle", {
        y: "+=20",
        rotation: "+=15",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      });

      // Pulse animation for check icons
      gsap.to(".check-icon", {
        scale: 1.1,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const clientFeatures = [
    { icon: Calendar, text: "Book your dream event easily" },
    { icon: Shield, text: "100% verified vendors" },
    { icon: CheckCircle2, text: "Secure payment protection" },
  ];

  const vendorFeatures = [
    { icon: Users, text: "Reach thousands of clients" },
    { icon: TrendingUp, text: "Grow your business" },
    { icon: CheckCircle2, text: "Get paid securely" },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-white dark:bg-gray-950 overflow-hidden relative transition-colors duration-300"
    >
      <div className="container lg:w-[90%] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 dark:from-green-900/30 to-emerald-100 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              Join Our Community
            </p>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Get Started?
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're planning an event or offering services, PlanIt has
            everything you need
          </p>
        </div>

        {/* Dual CTA Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Client CTA Card */}
          <motion.div
            ref={clientCardRef}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden relative">
              {/* Content */}
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                  For Event Planners
                </h3>

                <p className="text-base sm:text-lg text-green-50 mb-6 leading-relaxed">
                  Find and book verified vendors for your perfect event. From
                  weddings to corporate gatherings.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {clientFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-white"
                    >
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm sm:text-base">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register" className="flex-1">
                    <button className="w-full bg-white text-green-600 font-bold px-6 py-4 rounded-xl hover:bg-green-50 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-base sm:text-lg">
                      Start Planning
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link href="/vendors" className="flex-1">
                    <button className="w-full bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-4 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 text-base sm:text-lg">
                      Browse Vendors
                    </button>
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-green-100 mt-4 text-center sm:text-left">
                  ✓ Free to browse • No credit card required
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vendor CTA Card */}
          <motion.div
            ref={vendorCardRef}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="h-full bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden relative border border-gray-200 dark:border-gray-600">
              {/* Badge */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 px-3 py-1 bg-green-500 dark:bg-green-600 text-white text-xs sm:text-sm font-bold rounded-full">
                Earn More
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  For Vendors
                </h3>

                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  List your services and connect with thousands of clients
                  actively looking for your expertise.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {vendorFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-700 dark:text-white"
                    >
                      <div className="w-6 h-6 bg-green-500/20 dark:bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm sm:text-base">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register" className="flex-1">
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-base sm:text-lg">
                      Become a Vendor
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link href="/vendors" className="flex-1">
                    <button className="w-full bg-gray-100 dark:bg-white/10 dark:backdrop-blur-sm text-gray-900 dark:text-white font-semibold px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-white/20 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300 text-base sm:text-lg">
                      Learn More
                    </button>
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4 text-center sm:text-left">
                  ✓ Free to list • Commission-based pricing
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 sm:mt-20 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-6">
            Trusted by thousands across Kenya
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
                50K+
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Active Users
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
                5K+
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Verified Vendors
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
                98%
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
