"use client";

import { Star, MapPin, Heart, Share2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { type LucideIcon } from "lucide-react";

interface VendorCardProps {
  vendor: {
    id: number | string;
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    location: string;
    startingPrice: string;
    image: string;
    badge?: {
      type: string;
      text: string;
    };
    icon?: LucideIcon;
    description?: string;
  };
  index?: number;
  onViewDetails?: () => void;
}

export function VendorCard({
  vendor,
  index = 0,
  onViewDetails,
}: VendorCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "top-rated":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "most-booked":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "rising-star":
        return "bg-gradient-to-r from-blue-500 to-indigo-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group h-full"
    >
      {/* Card Container - Mobile-First Design */}
      <div className="relative h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl dark:shadow-gray-950/50 transition-all duration-500 border border-gray-200 dark:border-gray-800">
        {/* Image Section */}
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
          )}

          {/* Image */}
          <Image
            src={vendor.image}
            alt={vendor.name}
            fill
            className={`object-cover transform group-hover:scale-105 transition-transform duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badge */}
          {vendor.badge && (
            <div className="absolute top-3 left-3">
              <div
                className={`${getBadgeColor(
                  vendor.badge.type
                )} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm`}
              >
                {vendor.badge.text}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="w-9 h-9 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg active:scale-95"
              aria-label="Like"
            >
              <Heart
                size={16}
                className={`transition-colors ${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              />
            </button>
            <button
              className="w-9 h-9 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg active:scale-95"
              aria-label="Share"
            >
              <Share2 size={16} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Category Icon (Bottom Left) */}
          {vendor.icon && (
            <div className="absolute bottom-3 left-3">
              <div className="w-10 h-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                <vendor.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5">
          {/* Title & Category */}
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {vendor.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
              {vendor.category}
            </p>
          </div>

          {/* Description */}
          {vendor.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {vendor.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(vendor.rating) ? "fill-current" : ""
                  }
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {vendor.rating}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({vendor.reviewCount})
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-4">
            <MapPin
              size={14}
              className="text-green-600 dark:text-green-400 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm line-clamp-1">
              {vendor.location}
            </span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                From
              </p>
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                KES {vendor.startingPrice}
              </p>
            </div>
            <button
              onClick={onViewDetails}
              className="group/btn px-4 py-2 bg-green-600 text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-green-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              <span className="hidden sm:inline">View</span>
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
}
