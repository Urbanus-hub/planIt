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
        y: 50,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        },
      });

      // Icons float animation
      gsap.to(".feature-icon", {
        y: -10,
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      });

      // Stat badges pulse
      gsap.to(".stat-badge", {
        scale: 1.05,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
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
      className="section-padding bg-gradient-to-b from-white via-green-50/30 to-white overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container lg:w-[90%] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full mb-6"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <p className="text-sm font-semibold text-green-700">
              Trusted by Thousands
            </p>
          </div>

          <h2
            ref={headingRef}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Why Choose <span className="text-green-600">PlanIt</span>?
          </h2>

          <p
            ref={descriptionRef}
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
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
                className={`relative h-full bg-gradient-to-br ${feature.bgGradient} rounded-2xl p-6 sm:p-8 border border-green-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/50 rounded-bl-full"></div>

                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div
                    className={`feature-icon w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl rotate-6 group-hover:rotate-12 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  {/* Icon shadow */}
                  <div
                    className={`absolute top-2 left-2 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-20 blur-md -z-10`}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stat Badge */}
                  <div className="stat-badge inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 shadow-md">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-800">
                      {feature.stat}
                    </span>
                  </div>
                </div>

                {/* Hover arrow indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg mb-4">
            Join <span className="font-bold text-green-600">50,000+</span> happy
            event planners
          </p>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="ml-2 text-gray-700 font-semibold">
                4.9/5 Rating
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
