"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
import { useRouter } from "next/navigation";
import { getAuthCookie } from "@/lib/cookies";
// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClientDashboard() {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const auth = await getAuthCookie();
      setAuthToken(auth);
    };

    init();
  }, []);

  console.log("Auth token", authToken);
  const { user } = useAuth();

  const [vendors, setVendors] = useState<any[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [vendorsError, setVendorsError] = useState<string | null>(null);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [showMoreVendors, setShowMoreVendors] = useState(false);
  const [showMoreGallery, setShowMoreGallery] = useState(false);
  const [featuredLimit, setFeaturedLimit] = useState(4);

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

  // Simple hover effect without movement
  const handleCardHover = () => {
    // Removed annoying movement animations
  };

  // Handle messaging with vendor
  const handleMessage = async (vendor: any) => {
    try {
      // Check if user is authenticated
      if (!user?._id) {
        toast.error("Please log in to start a conversation");
        return; // Important: Exit the function here
      }

      // Store vendor data in session storage for the messages page
      const vendorData = {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        image: vendor.recentWork?.image || vendor.image,
        category: vendor.category,
      };

      sessionStorage.setItem(
        "newConversationVendor",
        JSON.stringify({
          ...vendorData,
          checkExisting: true, // Flag to indicate we should check for existing conversations
        })
      );

      toast.success(`Starting conversation with ${vendor.name}`);

      // Navigate to messages page
      router.push("/client/messages");
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen w-full max-w-full overflow-x-hidden bg-linear-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-950">
        {/* Hero Section with Professional Emerald Overlay - Responsive Height */}
        <div ref={heroRef} className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] w-full max-w-full overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/herobg.png"
              alt="Hero Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-emerald-900/90 via-emerald-800/80 to-teal-900/70" />

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-lg leading-tight px-2">
              Welcome back, {user?.name || "Guest"}!
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 max-w-3xl mb-6 sm:mb-8 md:mb-10 px-2">
              Your dream event is just a click away. Let's create something
              memorable together.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 w-full max-w-md sm:max-w-none px-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 sm:px-8 md:px-12 py-3 sm:py-4 shadow-xl font-semibold text-sm sm:text-base transition-all hover:shadow-2xl transform hover:-translate-y-1 min-h-[44px]"
              >
                Explore Vendors
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white bg-transparent hover:bg-white hover:text-emerald-900 rounded-full px-6 sm:px-8 md:px-12 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-all hover:shadow-xl transform hover:-translate-y-1 min-h-[44px]"
              >
                Plan My Event
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 md:max-w-7xl md:mx-auto space-y-8 sm:space-y-10 md:space-y-12">
          {/* Stats Section - Fully Responsive */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-full"
          >
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors duration-200 w-full overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className={`p-2 sm:p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 shrink-0`}>
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.colorClass}`} />
                  </div>
                  <div className="text-right min-w-0 flex-1">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                      {stat.value}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                    {stat.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {stat.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Featured Vendors Section - Responsive */}
          <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
            <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                  Premium Vendors
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight px-2">
                Featured{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  Event Partners
                </span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
                Connect with top-rated professionals who bring your vision to
                life.
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {" "}
                  Message them instantly
                </span>{" "}
                to start planning your perfect event.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-100 dark:border-emerald-900/30 w-full max-w-full overflow-x-hidden">
              {/* Vendor Filter and Search - Fully Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                <div className="relative flex-1 sm:flex-none w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFeaturedLimit(4);
                    }}
                    className="pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 w-full border-2 border-emerald-200/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 rounded-lg sm:rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all text-sm sm:text-base min-h-[44px]"
                  />
                  {searchQuery && (
                    <button
                      title="Clear search"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors p-1 hover:bg-emerald-50 rounded-full min-h-[32px] min-w-[32px] flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <select
                  title="Select category filter"
                  value={vendorFilter}
                  onChange={(e) => {
                    setVendorFilter(e.target.value);
                    setFeaturedLimit(4);
                  }}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-emerald-200/50 rounded-lg sm:rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 font-medium text-sm transition-all cursor-pointer min-h-[44px] w-full sm:w-auto"
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
                  className="border-2 border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold backdrop-blur-sm text-xs sm:text-sm min-h-[44px] w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Advanced</span>
                  <span className="sm:hidden">More</span>
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

            {/* No Results State */}
            {!vendorsLoading &&
              !vendorsError &&
              filteredVendors.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No vendors found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {searchQuery
                        ? `No vendors match "${searchQuery}"`
                        : `No vendors found in "${vendorFilter}" category`}
                    </p>
                    <div className="flex gap-2 justify-center">
                      {searchQuery && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear search
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setVendorFilter("all");
                          setSearchQuery("");
                        }}
                      >
                        View all vendors
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            {/* Vendors Grid - Fully Responsive */}
            {!vendorsLoading && !vendorsError && filteredVendors.length > 0 && (
              <>
                <div
                  ref={vendorsRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-full overflow-x-hidden"
                >
                  {filteredVendors.slice(0, featuredLimit).map((vendor) => (
                    <Card
                      key={vendor.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors duration-200 overflow-hidden w-full max-w-full"
                    >
                      {/* Compact Image Section - Responsive Height */}
                      <div className="relative h-40 sm:h-44 md:h-48 lg:h-32 overflow-hidden">
                        <Image
                          src={vendor.recentWork.image}
                          alt={vendor.recentWork.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                        {/* Fixed Position Badges - No Movement */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-emerald-600 text-white text-xs px-2 py-1">
                            {vendor.category}
                          </Badge>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1">
                          {vendor.isVerified && (
                            <div className="bg-blue-600 rounded-full p-1">
                              <Award className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className="bg-yellow-500 rounded px-2 py-1 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-white text-white" />
                            <span className="text-xs font-bold text-white">
                              {vendor.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Compact Content Section */}
                      <div className="p-3">
                        <div className="mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                            {vendor.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {vendor.recentWork.title}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Users className="h-3 w-3" />
                            <span>{vendor.reviews} reviews</span>
                          </div>
                          {vendor.email && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 dark:text-green-400">
                                Available
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Fixed Action Buttons - Always Visible */}
                        <div className="flex gap-2">
                          <Link
                            href={`/vendors/${vendor.id}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs h-8 border-gray-200 dark:border-gray-600"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3"
                            onClick={() => handleMessage(vendor)}
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Explore More Vendors Button */}
                {filteredVendors.length > featuredLimit && (
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 rounded-full"
                      onClick={() => {
                        if (featuredLimit >= filteredVendors.length) {
                          setFeaturedLimit(4);
                        } else {
                          setFeaturedLimit(featuredLimit + 4);
                        }
                      }}
                    >
                      {featuredLimit >= filteredVendors.length ? (
                        <>
                          Show Less
                          <X className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Show More Vendors (
                          {filteredVendors.length - featuredLimit} more)
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Event Gallery
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Get inspired by our successful events
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>

            {/* Gallery Filter Tabs */}
            <Tabs
              value={galleryFilter}
              onValueChange={setGalleryFilter}
              className="w-full"
            >
              <TabsList className="inline-flex h-10 items-center justify-start rounded-lg bg-gray-100 dark:bg-gray-800 p-1 gap-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  All Events
                </TabsTrigger>
                <TabsTrigger
                  value="wedding"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  Weddings
                </TabsTrigger>
                <TabsTrigger
                  value="corporate"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  Corporate
                </TabsTrigger>
                <TabsTrigger
                  value="birthday"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  Birthdays
                </TabsTrigger>
              </TabsList>

              <TabsContent value={galleryFilter} className="mt-6">
                <div
                  ref={galleryRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredGalleryItems
                    .slice(0, showMoreGallery ? filteredGalleryItems.length : 6)
                    .map((item) => (
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
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
                          <h3 className="text-lg font-bold mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-white/80 mb-2">
                            {item.vendor}
                          </p>
                          <p className="text-xs text-white/70">{item.date}</p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Gallery See More Button */}
                {filteredGalleryItems.length > 6 && (
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 rounded-full"
                      onClick={() => setShowMoreGallery(!showMoreGallery)}
                    >
                      {showMoreGallery ? (
                        <>
                          Show Less
                          <X className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          See More Gallery ({filteredGalleryItems.length - 6}{" "}
                          more)
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
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
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors duration-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant={
                        event.status === "confirmed" ? "default" : "outline"
                      }
                      className={`text-xs ${
                        event.status === "confirmed"
                          ? "bg-emerald-600 text-white"
                          : "border-amber-500 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {event.status === "confirmed" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" /> Confirmed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" /> Pending
                        </>
                      )}
                    </Badge>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {event.time}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {event.name}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {event.vendor}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-emerald-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-emerald-600" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
