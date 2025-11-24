"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Heart,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  PartyPopper,
  Sparkles,
  Camera,
  Music,
  Utensils,
  Palette,
  Eye,
  Filter,
  Play,
  ChevronRight,
  Grid3X3,
  Film,
  Image as ImageIcon,
  Search,
  X,
  ArrowRight,
  Users,
  Award,
  MoreHorizontal,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [showMoreVendors, setShowMoreVendors] = useState(false);

  // Refs for GSAP animations
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const vendorsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  // GSAP animations on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Hero animation
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Stats animation
    if (statsRef.current?.children) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Vendors animation
    if (vendorsRef.current?.children) {
      gsap.fromTo(
        vendorsRef.current.children,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: vendorsRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Gallery animation
    if (galleryRef.current?.children) {
      gsap.fromTo(
        galleryRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Events animation
    if (eventsRef.current?.children) {
      gsap.fromTo(
        eventsRef.current.children,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: eventsRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  const stats = [
    {
      title: "My Bookings",
      value: "8",
      change: "+2 this month",
      icon: Calendar,
      colorClass: "text-emerald-500",
      description: "Active bookings",
    },
    {
      title: "Upcoming Events",
      value: "3",
      change: "Next: Dec 15",
      icon: Clock,
      colorClass: "text-blue-500",
      description: "Scheduled events",
    },
    {
      title: "Saved Vendors",
      value: "24",
      change: "+5 recently",
      icon: Heart,
      colorClass: "text-red-500",
      description: "Favorited",
    },
    {
      title: "Total Spent",
      value: "KSh 180K",
      change: "+15% this year",
      icon: TrendingUp,
      colorClass: "text-purple-500",
      description: "All time",
    },
  ];

  const upcomingEvents = [
    {
      name: "Wedding Reception",
      date: "Dec 15, 2025",
      vendor: "Elite Catering",
      location: "Nairobi",
      status: "confirmed",
      time: "2:00 PM",
    },
    {
      name: "Corporate Dinner",
      date: "Jan 10, 2026",
      vendor: "Pro Photographers",
      location: "Mombasa",
      status: "pending",
      time: "6:00 PM",
    },
    {
      name: "Birthday Party",
      date: "Feb 20, 2026",
      vendor: "Sound Masters",
      location: "Kisumu",
      status: "confirmed",
      time: "4:00 PM",
    },
  ];

  // Featured vendors with their recent work
  const featuredVendors = [
    {
      id: 1,
      name: "Sarah's Catering",
      category: "Catering",
      rating: 4.9,
      reviews: 234,
      image:
        "https://images.unsplash.com/photo-1466978913421-dc2cf60dab96?w=600&h=400&fit=crop",
      recentWork: {
        title: "Elegant Wedding Reception",
        image:
          "https://images.unsplash.com/photo-1466978913421-dc2cf60dab96?w=600&h=400&fit=crop",
        date: "Nov 28, 2025",
      },
      icon: Utensils,
    },
    {
      id: 2,
      name: "Elite Photographers",
      category: "Photography",
      rating: 4.8,
      reviews: 189,
      image:
        "https://images.unsplash.com/photo-1542038784886-63d5b10c2c6e?w=600&h=400&fit=crop",
      recentWork: {
        title: "Corporate Gala",
        image:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop",
        date: "Nov 15, 2025",
      },
      icon: Camera,
    },
    {
      id: 3,
      name: "Sound Masters Pro",
      category: "Sound & DJ",
      rating: 4.7,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop",
      recentWork: {
        title: "Birthday Celebration",
        image:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop",
        date: "Nov 5, 2025",
      },
      icon: Music,
    },
    {
      id: 4,
      name: "Floral Dreams",
      category: "Decoration",
      rating: 4.9,
      reviews: 201,
      image:
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a4907?w=600&h=400&fit=crop",
      recentWork: {
        title: "Garden Party Setup",
        image:
          "https://images.unsplash.com/photo-1530549387789-4c1017266635e?w=600&h=400&fit=crop",
        date: "Oct 20, 2025",
      },
      icon: Palette,
    },
  ];

  // Gallery items for successful events
  const galleryItems = [
    {
      id: 1,
      title: "Luxury Wedding at Serena Hotel",
      category: "wedding",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1519220540063-56045a915d6b?w=600&h=400&fit=crop",
      vendor: "Elite Photographers",
      date: "Oct 15, 2025",
      description:
        "A breathtaking wedding ceremony with elegant decorations and gourmet catering.",
    },
    {
      id: 2,
      title: "Corporate Product Launch",
      category: "corporate",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
      vendor: "Sound Masters Pro",
      date: "Sep 28, 2025",
      description:
        "A high-energy product launch event with professional sound and lighting.",
      videoUrl: "#",
    },
    {
      id: 3,
      title: "Birthday Extravaganza",
      category: "birthday",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1530103862676-de8c9c2b4d85?w=600&h=400&fit=crop",
      vendor: "Floral Dreams",
      date: "Sep 10, 2025",
      description:
        "A vibrant birthday celebration with stunning floral arrangements.",
    },
    {
      id: 4,
      title: "Beach Wedding Ceremony",
      category: "wedding",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      vendor: "Sarah's Catering",
      date: "Aug 22, 2025",
      description:
        "A romantic beach wedding with exquisite catering and ocean views.",
      videoUrl: "#",
    },
    {
      id: 5,
      title: "Annual Charity Gala",
      category: "corporate",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1540575467063-178f50002c4b?w=600&h=400&fit=crop",
      vendor: "Elite Photographers",
      date: "Jul 30, 2025",
      description:
        "An elegant charity gala that raised funds for community development.",
    },
    {
      id: 6,
      title: "Sweet 16 Celebration",
      category: "birthday",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop",
      vendor: "Sound Masters Pro",
      date: "Jul 15, 2025",
      description:
        "A memorable Sweet 16 party with DJ, dancing, and entertainment.",
      videoUrl: "#",
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Catering":
        return <Utensils className="h-4 w-4" />;
      case "Photography":
        return <Camera className="h-4 w-4" />;
      case "Sound & DJ":
        return <Music className="h-4 w-4" />;
      case "Decoration":
        return <Palette className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  // Fixed filter functions
  const filteredGalleryItems = galleryItems.filter(
    (item) => galleryFilter === "all" || item.category === galleryFilter
  );

  const filteredVendors = featuredVendors.filter(
    (vendor) =>
      vendorFilter === "all" ||
      vendor.category === vendorFilter ||
      (searchQuery &&
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Card hover animation
  const handleCardHover = (
    e: React.MouseEvent<HTMLDivElement>,
    isEntering: boolean
  ) => {
    const card = e.currentTarget;
    if (isEntering) {
      gsap.to(card, {
        y: -5,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen w-full bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-950">
        {/* Hero Section with Professional Emerald Overlay and Rounded Corners */}
        <div ref={heroRef} className="relative h-[60vh] w-full overflow-hidden">
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <Image
              src="/public/herobg.png"
              alt="Hero Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/80 to-teal-900/70" />

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Welcome back, {user?.name || "Guest"}!
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-10">
              Your dream event is just a click away. Let's create something
              memorable together.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-12 py-4 shadow-xl font-semibold transition-all hover:shadow-2xl transform hover:-translate-y-1"
              >
                Explore Vendors
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white hover:text-emerald-900 rounded-full px-12 py-4 font-semibold transition-all hover:shadow-xl transform hover:-translate-y-1"
              >
                Plan My Event
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
          {/* Stats Section */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0"
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-full" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.colorClass}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stat.value}
                  </div>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium mt-1">
                    {stat.change}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Vendors Section */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  Featured Vendors
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Discover amazing services for your event
                </p>
              </div>

              {/* Vendor Filter and Search */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full sm:w-64 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  {searchQuery && (
                    <button
                    title="Clear search"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <select
                title='select filter'
                  value={vendorFilter}
                  onChange={(e) => setVendorFilter(e.target.value)}
                  className="px-4 py-3 border border-emerald-200 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Catering">Catering</option>
                  <option value="Photography">Photography</option>
                  <option value="Sound & DJ">Sound & DJ</option>
                  <option value="Decoration">Decoration</option>
                </select>

                <Button
                  variant="outline"
                  size="default"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-6"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div
              ref={vendorsRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredVendors
                .slice(0, showMoreVendors ? featuredVendors.length : 4)
                .map((vendor) => (
                  <Card
                    key={vendor.id}
                    className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 group"
                    onMouseEnter={(e) => handleCardHover(e, true)}
                    onMouseLeave={(e) => handleCardHover(e, false)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={vendor.recentWork.image}
                        alt={vendor.recentWork.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        {getCategoryIcon(vendor.category)}
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-sm px-3 py-1"
                        >
                          {vendor.category}
                        </Badge>
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {vendor.rating}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">
                        {vendor.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {vendor.recentWork.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-5 text-sm text-gray-500 dark:text-gray-400">
                        <span>{vendor.recentWork.date}</span>
                        <span>{vendor.reviews} reviews</span>
                      </div>
                      <Link href={`/vendors/${vendor.id}`}>
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all py-3"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Explore More Vendors Button */}
            {featuredVendors.length > 4 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 rounded-full"
                  onClick={() => setShowMoreVendors(!showMoreVendors)}
                >
                  {showMoreVendors ? (
                    <>
                      Show Less
                      <X className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Explore More Vendors
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Gallery Section */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  Event Gallery
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Get inspired by our successful events
                </p>
              </div>
              <Button
                variant="outline"
                size="default"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-6"
              >
                <Grid3X3 className="h-5 w-5 mr-2" />
                View All
              </Button>
            </div>

            {/* Gallery Filter Tabs */}
            <Tabs
              value={galleryFilter}
              onValueChange={setGalleryFilter}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-base py-3"
                >
                  All Events
                </TabsTrigger>
                <TabsTrigger
                  value="wedding"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-base py-3"
                >
                  Weddings
                </TabsTrigger>
                <TabsTrigger
                  value="corporate"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-base py-3"
                >
                  Corporate
                </TabsTrigger>
                <TabsTrigger
                  value="birthday"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-base py-3"
                >
                  Birthdays
                </TabsTrigger>
              </TabsList>

              <TabsContent value={galleryFilter} className="mt-0">
                <div
                  ref={galleryRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredGalleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Play button for videos */}
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-emerald-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                              <Play className="h-6 w-6 text-white fill-white" />
                            </div>
                          </div>
                        )}

                        {/* Image icon */}
                        {item.type === "image" && (
                          <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2">
                            <ImageIcon className="h-4 w-4 text-gray-700" />
                          </div>
                        )}
                      </div>

                      {/* Card content on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                        <p className="text-sm text-white/80 mb-2">
                          {item.vendor}
                        </p>
                        <p className="text-xs text-white/70">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Upcoming Events Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Your Upcoming Events
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Stay on top of your upcoming bookings
              </p>
            </div>
            <div
              ref={eventsRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {upcomingEvents.map((event, index) => (
                <Card
                  key={index}
                  className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800"
                  onMouseEnter={(e) => handleCardHover(e, true)}
                  onMouseLeave={(e) => handleCardHover(e, false)}
                >
                  {/* Top accent bar instead of left border */}
                  <div
                    className={`h-2 w-full ${
                      event.status === "confirmed"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />

                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        variant={
                          event.status === "confirmed" ? "default" : "outline"
                        }
                        className={`${
                          event.status === "confirmed"
                            ? "bg-emerald-600 hover:bg-emerald-700 px-3 py-1"
                            : "border-amber-500 text-amber-700 dark:text-amber-400 px-3 py-1"
                        }`}
                      >
                        {event.status === "confirmed" ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" /> Confirmed
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 mr-1" /> Pending
                          </>
                        )}
                      </Badge>
                      <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                        {event.time}
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                      {event.name}
                    </CardTitle>
                    <CardDescription className="text-lg text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                      {event.vendor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-base text-gray-700 dark:text-gray-300 mb-4">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-base text-gray-700 dark:text-gray-300">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
