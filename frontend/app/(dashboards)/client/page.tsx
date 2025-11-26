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
  MessageCircle,
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
import { authAPI } from "@/lib/api";
// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<any[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [vendorsError, setVendorsError] = useState<string | null>(null);
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

    // Fetch vendors data
    const fetchVendors = async () => {
      try {
        setVendorsLoading(true);
        setVendorsError(null);

        const response = await authAPI.getVendors();
        console.log("Vendors response:", response);

        if (response.data && response.data.success) {
          setVendors(response.data.data);
          console.log("Vendors loaded:", response.data.data);
        } else {
          console.error("Invalid vendors response:", response);
          setVendorsError("Invalid response format");
        }
      } catch (error: any) {
        console.error("Error fetching vendors:", error);

        let errorMessage = "Failed to load vendors";
        if (error.response) {
          console.error(
            "Server error:",
            error.response.status,
            error.response.data
          );
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          console.error("Network error:", error.request);
          errorMessage = "Network error - please check your connection";
        } else {
          console.error("Error:", error.message);
          errorMessage = error.message;
        }

        setVendorsError(errorMessage);
      } finally {
        setVendorsLoading(false);
      }
    };

    fetchVendors();
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

  // Default fallback images for different categories
  const getCategoryFallbackImage = (category: string) => {
    const categoryImages: Record<string, string> = {
      Catering:
        "https://images.unsplash.com/photo-1466978913421-dc2cf60dab96?w=600&h=400&fit=crop",
      Photography:
        "https://images.unsplash.com/photo-1542038784886-63d5b10c2c6e?w=600&h=400&fit=crop",
      "Sound & DJ":
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop",
      Decoration:
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a4907?w=600&h=400&fit=crop",
      Music:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      Video:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop",
      Planning:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop",
      default:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop",
    };
    return categoryImages[category] || categoryImages.default;
  };

  // Generate realistic service titles based on vendor category and name
  const generateServiceTitle = (vendorName: string, category: string) => {
    const serviceTemplates: Record<string, string[]> = {
      Catering: [
        "Premium Event Catering",
        "Gourmet Food Service",
        "Wedding Reception Catering",
      ],
      Photography: [
        "Professional Event Photography",
        "Wedding Photography Service",
        "Corporate Event Coverage",
      ],
      "Sound & DJ": [
        "Professional DJ Services",
        "Sound System Rental",
        "Wedding Entertainment",
      ],
      Decoration: [
        "Event Decoration & Styling",
        "Wedding Decor Service",
        "Theme Party Setup",
      ],
      Music: [
        "Live Music Performance",
        "Band for Events",
        "Musical Entertainment",
      ],
      Video: [
        "Event Videography",
        "Wedding Video Production",
        "Professional Video Services",
      ],
      Planning: [
        "Full Event Planning",
        "Wedding Coordination",
        "Corporate Event Management",
      ],
      default: [
        "Professional Event Service",
        "Quality Service Provider",
        "Event Support Service",
      ],
    };

    const templates = serviceTemplates[category] || serviceTemplates.default;
    const randomTemplate =
      templates[Math.floor(Math.random() * templates.length)];
    return `${randomTemplate} by ${vendorName}`;
  };

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

  // Helper function to normalize vendor data
  const normalizeVendorData = (vendor: any) => {
    // If it's from the API, transform it to match the expected structure
    if (vendor.email && !vendor.recentWork) {
      return {
        id: vendor._id || vendor.id,
        name: vendor.businessName || vendor.name,
        category: vendor.category || "Service Provider",
        rating: vendor.rating || 4.5,
        reviews: vendor.reviewsCount || 0,
        image:
          vendor.profileImage ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop",
        recentWork: {
          title: `Professional ${vendor.businessName || vendor.name} Service`,
          image:
            vendor.profileBackground ||
            vendor.profileImage ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop",
          date: new Date(vendor.createdAt || Date.now()).toLocaleDateString(),
        },
        icon: Utensils, // Default icon, could be made dynamic based on category
        isVerified: vendor.isVerified || false,
        email: vendor.email,
        phone: vendor.phone,
      };
    }
    // If it's already in the expected format, return as-is
    return vendor;
  };

  // Process API vendors data
  const processedVendors =
    vendors.length > 0 ? vendors.map(normalizeVendorData) : [];

  const filteredVendors = processedVendors.filter((vendor) => {
    const matchesFilter =
      vendorFilter === "all" ||
      (vendor.category &&
        vendor.category.toLowerCase().includes(vendorFilter.toLowerCase())) ||
      (vendor.name &&
        vendor.name.toLowerCase().includes(vendorFilter.toLowerCase()));

    const matchesSearch =
      !searchQuery ||
      (vendor.name &&
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vendor.category &&
        vendor.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vendor.email &&
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vendor.recentWork?.title &&
        vendor.recentWork.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

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
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 rounded-full mb-6">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                  Premium Vendors
                </span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Featured{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  Event Partners
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                Connect with top-rated professionals who bring your vision to
                life.
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {" "}
                  Message them instantly
                </span>{" "}
                to start planning your perfect event.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30">
              {/* Vendor Filter and Search */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
                  <Input
                    placeholder="Search by vendor name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 py-3 w-full sm:w-72 border-2 border-emerald-200/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      title="Clear search"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors p-1 hover:bg-emerald-50 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <select
                  title="Select category filter"
                  value={vendorFilter}
                  onChange={(e) => setVendorFilter(e.target.value)}
                  className="px-5 py-3 border-2 border-emerald-200/50 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 font-medium text-sm transition-all cursor-pointer"
                >
                  <option value="all">🎯 All Categories</option>
                  <option value="Catering">🍽️ Catering</option>
                  <option value="Photography">📸 Photography</option>
                  <option value="Sound & DJ">🎵 Sound & DJ</option>
                  <option value="Decoration">🎨 Decoration</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 whitespace-nowrap px-6 py-3 rounded-xl font-semibold backdrop-blur-sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {vendorsLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Loading vendors...
                  </span>
                </div>
              </div>
            )}

            {/* Error State */}
            {vendorsError && !vendorsLoading && (
              <div className="text-center py-20">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                    Failed to Load Vendors
                  </h3>
                  <p className="text-red-600 dark:text-red-300 text-sm mb-4">
                    {vendorsError}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* Vendors Grid */}
            {!vendorsLoading && !vendorsError && (
              <>
                <div
                  ref={vendorsRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {filteredVendors
                    .slice(0, showMoreVendors ? filteredVendors.length : 4)
                    .map((vendor) => (
                      <Card
                        key={vendor.id}
                        className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 group border-0 rounded-2xl transform hover:-translate-y-2"
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                      >
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={vendor.recentWork.image}
                            alt={vendor.recentWork.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4 bg-emerald-500/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center gap-1.5">
                              <div className="text-white text-xs">
                                {getCategoryIcon(vendor.category)}
                              </div>
                              <span className="text-white text-xs font-semibold">
                                {vendor.category}
                              </span>
                            </div>
                          </div>

                          {/* Verification Badge */}
                          {vendor.isVerified && (
                            <div className="absolute top-4 right-4 bg-blue-500/95 backdrop-blur-sm rounded-full p-2 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                              <Award className="h-3 w-3 text-white" />
                            </div>
                          )}

                          {/* Rating Badge */}
                          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-3 py-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-white text-white" />
                              <span className="text-sm font-bold text-white">
                                {vendor.rating}
                              </span>
                            </div>
                          </div>

                          {/* Hover Actions */}
                          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <div className="flex gap-2">
                              <Link href={`/vendors/${vendor.id}`}>
                                <Button
                                  size="sm"
                                  className="bg-white/95 hover:bg-white text-gray-900 font-semibold transition-all backdrop-blur-sm border-0 shadow-lg"
                                >
                                  <Eye className="h-4 w-4 mr-1.5" />
                                  View
                                </Button>
                              </Link>
                              <Link
                                href={`/messaging?vendor=${
                                  vendor.id
                                }&name=${encodeURIComponent(vendor.name)}`}
                              >
                                <Button
                                  size="sm"
                                  className="bg-emerald-500/95 hover:bg-emerald-600 text-white font-semibold transition-all backdrop-blur-sm border-0 shadow-lg"
                                >
                                  <MessageCircle className="h-4 w-4 mr-1.5" />
                                  Message
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-4 px-6 pt-5">
                          <div className="space-y-3">
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
                              {vendor.name}
                            </CardTitle>

                            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 min-h-10">
                              {vendor.recentWork.title}
                            </CardDescription>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0 px-6 pb-6">
                          <div className="flex items-center justify-between text-sm mb-4">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">
                                {vendor.reviews} reviews
                              </span>
                            </div>
                            <div className="text-gray-400 dark:text-gray-500 text-xs">
                              {vendor.recentWork.date}
                            </div>
                          </div>

                          {/* Contact Info for API vendors */}
                          {vendor.email && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span>Available for new projects</span>
                            </div>
                          )}

                          {/* Default Action Buttons (visible when not hovering) */}
                          <div className="flex gap-2 mt-4 group-hover:opacity-0 transition-opacity duration-300">
                            <Link
                              href={`/vendors/${vendor.id}`}
                              className="flex-1"
                            >
                              <Button
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition-all border-0"
                                size="sm"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
                            </Link>
                            <Link
                              href={`/messaging?vendor=${
                                vendor.id
                              }&name=${encodeURIComponent(vendor.name)}`}
                            >
                              <Button
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all px-4"
                                size="sm"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {/* Explore More Vendors Button */}
                {filteredVendors.length > 4 && (
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
              </>
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
