"use client";

import { useEffect, useRef } from "react";
import { Search, Calendar, MessageCircle, PartyPopper } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Badge animation - slide in from top
      gsap.from(badgeRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Heading animation - fade and scale
      gsap.from(headingRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Description animation - slide up
      gsap.from(descriptionRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Cards stagger animation - slide up and fade in with stagger
      gsap.from(".how-it-works-cards > div > div", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        },
      });

      // CTA button animation - bounce in
      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.8,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 90%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      icon: <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
      title: "Browse & Compare",
      description:
        "Explore hundreds of verified vendors by category, location, and budget. Filter by reviews, pricing, and availability.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&q=80",
    },
    {
      icon: <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
      title: "Book Your Service",
      description:
        "Select your preferred date, review package details, and confirm your booking instantly with secure payment.",
      image:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop&q=80",
    },
    {
      icon: <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
      title: "Coordinate & Communicate",
      description:
        "Stay connected with your vendor through our messaging platform. Share details and track progress.",
      image:
        "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop&q=80",
    },
    {
      icon: <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
      title: "Celebrate Your Event",
      description:
        "Enjoy your perfectly planned event with peace of mind. Share your experience and leave a review.",
      image:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop&q=80",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="section-padding bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300"
    >
      <div className="container lg:w-[90vw]">
        {/* Section Header */}
        <div className="how-it-works-header text-center mb-12 sm:mb-16">
          <div
            ref={badgeRef}
            className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 sm:mb-6"
          >
            <p className="text-sm sm:text-base font-semibold text-green-700 dark:text-green-400">
              Simple Process
            </p>
          </div>
          <h2
            ref={headingRef}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6"
          >
            How It Works
          </h2>
          <p
            ref={descriptionRef}
            className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Planning an event has never been easier. Follow our simple 4-step
            process to connect with the best vendors and create unforgettable
            moments.
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="how-it-works-cards">
          <HoverEffect items={steps} />
        </div>

        {/* CTA Section */}
        <div ref={ctaRef} className="text-center mt-12 sm:mt-16">
          <button className="inline-flex items-center gap-2 bg-green-main dark:bg-green-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 text-base sm:text-lg">
            Start Planning Your Event
            <PartyPopper className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
