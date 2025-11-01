'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Award, TrendingUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function FeaturedVendors() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section reveal animation
      gsap.from('.section-header', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        }
      });

      // Carousel animation
      gsap.from('.vendor-card', {
        opacity: 0,
        x: 50,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: carouselRef.current,
          start: 'top 80%'
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const vendors = [
    {
      id: 1,
      name: 'Moments Photography',
      category: 'Photography',
      rating: 4.9,
      reviewCount: 127,
      location: 'Nairobi',
      startingPrice: 'KES 25,000',
      image: '/photography.jpg',
      badge: { type: 'top-rated', text: 'Top Rated' }
    },
    {
      id: 2,
      name: 'Savanna Caterers',
      category: 'Catering',
      rating: 4.8,
      reviewCount: 95,
      location: 'Mombasa',
      startingPrice: 'KES 15,000',
      image: '/catering.jpg',
      badge: { type: 'most-booked', text: 'Most Booked' }
    },
    {
      id: 3,
      name: 'Elite Events',
      category: 'Event Planning',
      rating: 4.9,
      reviewCount: 84,
      location: 'Nairobi',
      startingPrice: 'KES 30,000',
      image: '/eventdecor.jpg',
      badge: { type: 'top-rated', text: 'Top Rated' }
    },
    {
      id: 4,
      name: 'Melody Makers',
      category: 'Entertainment',
      rating: 4.7,
      reviewCount: 62,
      location: 'Kisumu',
      startingPrice: 'KES 20,000',
      image: '/dj.jpg',
      badge: { type: 'rising-star', text: 'Rising Star' }
    },
    {
      id: 5,
      name: 'Decor Dreams',
      category: 'Decoration',
      rating: 4.8,
      reviewCount: 76,
      location: 'Nairobi',
      startingPrice: 'KES 18,000',
      image: '/decor.jpg',
      badge: { type: 'most-booked', text: 'Most Booked' }
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % vendors.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + vendors.length) % vendors.length);
  };

  const getVisibleVendors = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(vendors[(currentSlide + i) % vendors.length]);
    }
    return result;
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'top-rated':
        return <Award size={16} className="text-yellow-500" />;
      case 'most-booked':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'rising-star':
        return <Star size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'top-rated':
        return 'bg-yellow-100 text-yellow-800';
      case 'most-booked':
        return 'bg-green-100 text-green-800';
      case 'rising-star':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="vendors" ref={sectionRef} className="section-padding">
      <div className="container lg:w-[90vw]">
        <div className="section-header text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Most Trusted Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hand-picked vendors with proven track records of excellence
          </p>
        </div>

        <div ref={carouselRef} className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out">
              {getVisibleVendors().map((vendor, index) => (
                <div key={vendor.id} className="vendor-card w-full md:w-1/3 px-4">
                  <div className="card h-full">
                    {/* Badge */}
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-4 ${getBadgeColor(vendor.badge.type)}`}>
                      {getBadgeIcon(vendor.badge.type)}
                      <span className="ml-1">{vendor.badge.text}</span>
                    </div>

                    {/* Vendor Image */}
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Vendor Info */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{vendor.name}</h3>
                    <div className="text-sm text-purple-main font-medium mb-2">{vendor.category}</div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(vendor.rating) ? 'fill-current' : ''}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {vendor.rating} ({vendor.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">{vendor.location}</span>
                    </div>

                    {/* Starting Price */}
                    <div className="text-sm text-gray-500 mb-4">
                      Starting from <span className="font-semibold text-gray-900">{vendor.startingPrice}</span>
                    </div>

                    {/* View Profile Button */}
                    <button className="w-full btn-outline">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
            aria-label="Previous vendor"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
            aria-label="Next vendor"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {vendors.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-purple-main' : 'bg-gray-300'
                }`}
                aria-label={`Go to vendor ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}