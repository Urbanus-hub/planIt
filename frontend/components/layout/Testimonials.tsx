"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Sparkles } from "lucide-react";

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Badge animation
      gsap.from(badgeRef.current, {
        opacity: 0,
        scale: 0.8,
        rotation: -10,
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

      // Testimonials container animation
      gsap.from(testimonialsRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    {
      quote:
        "PlanIt completely transformed our wedding planning experience! We found the most amazing photographer and decorator. Everything was seamless, professional, and within our budget. Highly recommend!",
      name: "Sarah & David Kimani",
      designation: "Dream Wedding in Karen • June 2024",
      src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1000&fit=crop&q=80",
      rating: 5,
    },
    {
      quote:
        "Organizing our corporate gala was stress-free thanks to PlanIt. The vendor quality was exceptional, and the platform made coordination so easy. Our CEO was thoroughly impressed!",
      name: "Michael Omondi",
      designation: "Tech Summit Nairobi • Corporate Event",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80",
      rating: 5,
    },
    {
      quote:
        "I compared prices, read authentic reviews, and booked the perfect caterer and entertainment for my daughter's graduation party. Saved time and money while getting top-quality service!",
      name: "Grace Wanjiru",
      designation: "Graduation Celebration • Westlands",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&q=80",
      rating: 5,
    },
    {
      quote:
        "As a first-time event planner, I was nervous about my company's product launch. PlanIt connected me with verified professionals who made everything perfect. The event was a huge success!",
      name: "James Mwangi",
      designation: "Product Launch Event • KICC",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop&q=80",
      rating: 5,
    },
    {
      quote:
        "Planning my 50th birthday party was an absolute joy with PlanIt. From venue to DJ to catering - everything exceeded expectations. My guests are still raving about it!",
      name: "Betty Akinyi",
      designation: "Milestone Birthday Bash • Lavington",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&q=80",
      rating: 5,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-gray-50 dark:from-gray-800 via-white dark:via-gray-900 to-gray-50 dark:to-gray-800 overflow-hidden relative transition-colors duration-300"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 dark:bg-green-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 dark:bg-emerald-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="container lg:w-[90%] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 dark:from-green-900/30 to-emerald-100 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              Client Success Stories
            </p>
          </div>

          <h2
            ref={headingRef}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            What Our{" "}
            <span className="text-green-600 dark:text-green-400">
              Happy Clients
            </span>{" "}
            Say
          </h2>

          <p
            ref={descriptionRef}
            className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Real stories from real people who created unforgettable moments with
            PlanIt
          </p>
        </div>

        {/* Animated Testimonials */}
        <div ref={testimonialsRef} className="max-w-7xl mx-auto">
          <div className=" rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 ">
            <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { number: "50,000+", label: "Happy Clients" },
            { number: "98%", label: "Satisfaction Rate" },
            { number: "15,000+", label: "Verified Reviews" },
            { number: "24/7", label: "Support Available" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-green-50 dark:from-green-950/30 to-emerald-50 dark:to-emerald-950/30 rounded-2xl border border-green-100 dark:border-green-900/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
