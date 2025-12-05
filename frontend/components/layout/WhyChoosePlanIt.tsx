"use client";

import { useEffect, useRef } from "react";
import {
  Shield,
  Lock,
  Star,
  Headset,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

export default function WhyChoosePlanIt() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Badge animation
      gsap.from(badgeRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Heading animation
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Description animation
      gsap.from(descriptionRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Cards stagger animation
      gsap.from(".feature-card", {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description:
        "Every vendor is thoroughly vetted for quality and reliability through our rigorous screening process",
      stat: "100% Verified",
      gradient: "from-green-400 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description:
        "Your payments are protected with bank-level security and encrypted transactions",
      stat: "SSL Encrypted",
      gradient: "from-green-500 to-teal-600",
      bgGradient: "from-green-50 to-teal-50",
    },
    {
      icon: Star,
      title: "Real Reviews",
      description:
        "Authentic reviews from verified customers who've experienced the service firsthand",
      stat: "15,000+ Reviews",
      gradient: "from-green-400 to-lime-600",
      bgGradient: "from-green-50 to-lime-50",
    },
    {
      icon: Headset,
      title: "24/7 Support",
      description:
        "Our dedicated team is always here to help make your event absolutely perfect",
      stat: "Always Available",
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-white dark:bg-gray-900 overflow-hidden relative transition-colors duration-300"
    >
      <div className="container lg:w-[90%] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full mb-6"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              Trusted by Thousands
            </p>
          </div>

          <h2
            ref={headingRef}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Why Choose{" "}
            <span className="text-green-600 dark:text-green-400">PlanIt</span>?
          </h2>

          <p
            ref={descriptionRef}
            className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            More than just a marketplace - we're your partner in creating
            unforgettable events with confidence
          </p>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card group"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`relative h-full rounded-2xl p-6 sm:p-8 border shadow-lg hover:shadow-2xl dark:shadow-green-900/20 dark:hover:shadow-green-500/20 transition-all duration-300 overflow-hidden
                  ${feature.bgGradient}
                  dark:bg-gradient-to-br dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-700/95
                  border-green-100 dark:border-green-800/50
                  backdrop-blur-sm
                  dark:ring-1 dark:ring-green-500/10
                `}
              >
                {/* Glow effect on hover - visible only in dark mode */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark:opacity-0 dark:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 rounded-2xl"></div>
                </div>

                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div
                    className={`feature-icon w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl transition-all duration-300`}
                  >
                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  {/* Icon shadow - enhanced for dark mode */}
                  <div
                    className={`absolute top-2 left-2 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-20 dark:opacity-30 blur-md -z-10`}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stat Badge */}
                  <div className="stat-badge inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700/50 shadow-md">
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {feature.stat}
                    </span>
                  </div>
                </div>

                {/* Hover arrow indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Join{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              50,000+
            </span>{" "}
            happy event planners
          </p>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">
                4.9/5 Rating
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
