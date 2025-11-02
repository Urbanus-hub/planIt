"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon: React.ReactNode;
    image: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-green-50 dark:bg-green-950/30 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardImage image={item.image} />
            <CardIcon>{item.icon}</CardIcon>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative z-20 transition-all duration-300 group-hover:border-green-300 dark:group-hover:border-green-600 group-hover:shadow-xl",
        className
      )}
    >
      <div className="relative z-50 h-full">
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

export const CardImage = ({ image }: { image: string }) => {
  return (
    <div className="relative h-40 sm:h-48 -m-4 sm:-m-6 mb-4 sm:mb-6 overflow-hidden bg-green-50 dark:bg-green-950/20">
      <Image
        src={image}
        alt="Step illustration"
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};

export const CardIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-main dark:bg-green-600 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
      {children}
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
};
