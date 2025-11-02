"use client";

import { useEffect, useRef } from "react";
import {
  Camera,
  Utensils,
  MapPin,
  Palette,
  Music,
  Calendar,
  Truck,
  MoreHorizontal,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function CategoryShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards animation on scroll
      const cards = cardsRef.current?.querySelectorAll(".category-card");

      if (cards && cards.length > 0) {
        ScrollTrigger.batch(Array.from(cards), {
          onEnter: (elements) => {
            gsap.from(elements, {
              opacity: 0,
              y: 60,
              stagger: 0.1,
              duration: 0.8,
              ease: "power3.out",
            });
          },
          start: "top 80%",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    {
      title: "Photography",
      description:
        "Capture every precious moment with professional photographers and videographers.",
      icon: <Camera className="w-8 h-8" />,
      vendorCount: "120+",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Catering",
      description:
        "Delight every palate with exquisite cuisine from top-rated caterers.",
      icon: <Utensils className="w-8 h-8" />,
      vendorCount: "85+",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Venue",
      description:
        "Find your perfect space from our curated collection of event venues.",
      icon: <MapPin className="w-8 h-8" />,
      vendorCount: "65+",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Decoration",
      description:
        "Transform any space into a magical setting with expert decorators.",
      icon: <Palette className="w-8 h-8" />,
      vendorCount: "95+",
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Entertainment",
      description:
        "Keep your guests engaged with live bands, DJs, and performers.",
      icon: <Music className="w-8 h-8" />,
      vendorCount: "70+",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Event Planning",
      description:
        "Professional planners to coordinate every detail of your special day.",
      icon: <Calendar className="w-8 h-8" />,
      vendorCount: "45+",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Transportation",
      description:
        "Reliable transport services for guests and event logistics.",
      icon: <Truck className="w-8 h-8" />,
      vendorCount: "30+",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "More Services",
      description:
        "Explore additional services including floristry, makeup, and more.",
      icon: <MoreHorizontal className="w-8 h-8" />,
      vendorCount: "50+",
      color: "bg-teal-100 text-teal-600",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-padding bg-white dark:bg-gray-900 px-3 sm:px-6 transition-colors duration-300"
    >
      <div className="container">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Whatever Your Event Needs, We've Got You Covered
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
            Browse through our extensive categories and find the perfect vendors
            for your special occasion
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative z-10 max-w-7xl mx-auto gap-y-0"
        >
          {categories.map((category, index) => (
            <CategoryCard key={category.title} {...category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const CategoryCard = ({
  title,
  description,
  icon,
  vendorCount,
  color,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  vendorCount: string;
  color: string;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "category-card flex flex-col lg:border-r border-gray-200 dark:border-gray-700 py-8 sm:py-10 relative group/feature transition-colors duration-300",
        (index === 0 || index === 4) &&
          "lg:border-l border-gray-200 dark:border-gray-700",
        index < 4 && "lg:border-b border-gray-200 dark:border-gray-700",
        "border-b sm:border-b-0",
        index % 2 === 0 && "sm:border-r",
        index < 6 && "sm:border-b"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-t from-green-50 dark:from-green-950/30 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-b from-green-50 dark:from-green-950/30 to-transparent pointer-events-none" />
      )}

      {/* Icon */}
      <div className="mb-3 sm:mb-4 relative z-10 px-6 sm:px-10">
        <div
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover/feature:scale-110 transition-transform duration-300",
            color
          )}
        >
          {icon}
        </div>
      </div>

      {/* Title */}
      <div className="text-base sm:text-lg font-bold mb-2 relative z-10 px-6 sm:px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-300 dark:bg-gray-600 group-hover/feature:bg-green-main transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-gray-900 dark:text-white">
          {title}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs relative z-10 px-6 sm:px-10 mb-2 sm:mb-3">
        {description}
      </p>

      {/* Vendor Count */}
      <div className="relative z-10 px-6 sm:px-10">
        <span className="text-xs sm:text-sm font-semibold text-green-main dark:text-green-400">
          {vendorCount} vendors
        </span>
      </div>
    </div>
  );
};
