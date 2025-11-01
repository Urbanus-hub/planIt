"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  rating?: number;
}

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="w-full mx-auto px-4 md:px-8">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">
        {/* Image Section */}
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full order-2 md:order-1">
          <AnimatePresence>
            <motion.div
              key={active}
              initial={{
                opacity: 0,
                scale: 0.9,
                rotateY: randomRotateY(),
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                rotateY: randomRotateY(),
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
              className="absolute inset-0"
            >
              <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={testimonials[active].src}
                  alt={testimonials[active].name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Name Badge on Image */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                  >
                    <h3 className="text-xl font-bold text-gray-900">
                      {testimonials[active].name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {testimonials[active].designation}
                    </p>
                    {testimonials[active].rating && (
                      <div className="flex gap-1 mt-2">
                        {[...Array(testimonials[active].rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Section */}
        <div className="order-1 md:order-2 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* Quote Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Quote className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 fill-green-100" />
              </motion.div>

              {/* Quote Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 leading-relaxed"
              >
                "{testimonials[active].quote}"
              </motion.p>

              {/* Progress Indicators */}
              <div className="flex gap-2 pt-4">
                {testimonials.map((_, index) => (
                  <button
                  title="Go to testimonial {index + 1}"
                    key={index}
                    onClick={() => setActive(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === active
                        ? "w-8 bg-green-600"
                        : "w-4 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-8">
            <button
            title="Previous testimonial"
              onClick={handlePrev}
              className="group h-12 w-12 rounded-full bg-white border-2 border-gray-200 hover:border-green-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
            </button>
            <button
            title="Next testimonial"
              onClick={handleNext}
              className="group h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
