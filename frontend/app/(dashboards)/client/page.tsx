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

  // Empty array to show empty state for upcoming events
  const upcomingEvents: any[] = [];

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
    {
      id: 7,
      title: "Garden Wedding Reception",
      category: "wedding",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop",
      vendor: "Elegant Events Co.",
      date: "Jun 20, 2025",
      description:
        "An enchanting garden wedding with beautiful floral arrangements and ambient lighting.",
    },
    {
      id: 8,
      title: "Tech Conference 2025",
      category: "corporate",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop",
      vendor: "AV Solutions Kenya",
      date: "May 18, 2025",
      description:
        "A large-scale tech conference with state-of-the-art AV equipment and networking.",
      videoUrl: "#",
    },
    {
      id: 9,
      title: "Milestone 50th Birthday",
      category: "birthday",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&h=400&fit=crop",
      vendor: "Party Perfect Planners",
      date: "Apr 12, 2025",
      description:
        "A sophisticated 50th birthday celebration with live entertainment and gourmet dining.",
    },
    {
      id: 10,
      title: "Outdoor Wedding at Sunset",
      category: "wedding",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop",
      vendor: "Dreamscape Weddings",
      date: "Mar 25, 2025",
      description:
        "A magical sunset wedding ceremony with stunning views and romantic ambiance.",
      videoUrl: "#",
    },
    {
      id: 11,
      title: "Corporate Team Building Event",
      category: "corporate",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
      vendor: "Adventure Events Kenya",
      date: "Feb 28, 2025",
      description:
        "An exciting team building event with outdoor activities and catering.",
    },
    {
      id: 12,
      title: "Kids Birthday Party",
      category: "birthday",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop",
      vendor: "Fun Times Entertainment",
      date: "Jan 15, 2025",
      description:
        "A colorful and fun-filled kids birthday party with entertainers and games.",
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
      <div className="flex-1 min-h-screen w-full max-w-full overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/50">
        {/* Modern Hero Section - Optimized for Mobile */}
        <div
          ref={heroRef}
          className="relative min-h-[45vh] sm:min-h-[50vh] md:min-h-[55vh] w-full max-w-full overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/herobg.png"
              alt="Hero Background"
              fill
              className="object-cover scale-105"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-br from-emerald-900/95 via-emerald-800/90 to-teal-900/85 dark:from-emerald-950/98 dark:via-emerald-900/95 dark:to-teal-950/90" />

            {/* Subtle animated overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[50vh] md:min-h-[55vh] text-center px-4 sm:px-6 py-8 sm:py-12">
            {/* Mobile-optimized heading */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 sm:mb-3 drop-shadow-2xl leading-tight">
                Welcome back,
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-300 drop-shadow-lg">
                {user?.name || "Guest"}!
              </p>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mb-8 sm:mb-10 px-4 leading-relaxed">
              Your dream event is one tap away
            </p>

            {/* Mobile-first button layout */}
            <div className="flex flex-col w-full max-w-sm sm:max-w-md gap-3 px-4">
              <Link href="/client/vendors" className="w-full">
                <Button
                  size="lg"
                  className="w-full bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl px-8 py-6 sm:py-7 shadow-2xl font-bold text-base sm:text-lg transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] min-h-14"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Vendors
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-white/80 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 sm:py-7 font-semibold text-base sm:text-lg transition-all hover:border-white min-h-14"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Plan My Event
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-full overflow-x-hidden px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:max-w-7xl md:mx-auto space-y-6 sm:space-y-8">
          {/* Modern Stats Section - Mobile Optimized */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full"
          >
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="relative p-4 sm:p-5 bg-linear-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border-0 shadow-md hover:shadow-xl dark:shadow-gray-900/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
              >
                {/* Gradient accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-emerald-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-3">
                  {/* Icon and value row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2.5 rounded-xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/10 shrink-0">
                      <stat.icon className={`h-5 w-5 ${stat.colorClass}`} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                      {stat.title}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      {stat.change}
                    </p>
                  </div>
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
              <Link href="/client/vendors" className="inline-block mt-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold px-8 py-3 min-h-11">
                  View All Vendors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-white/50 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-100 dark:border-gray-700 w-full max-w-full overflow-x-hidden">
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
                    className="pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 w-full border-2 border-emerald-200/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 rounded-lg sm:rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all text-sm sm:text-base min-h-11"
                  />
                  {searchQuery && (
                    <button
                      title="Clear search"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors p-1 hover:bg-emerald-50 rounded-full min-h-8 min-w-8 flex items-center justify-center"
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
                  className="px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-emerald-200/50 rounded-lg sm:rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 font-medium text-sm transition-all cursor-pointer min-h-11 w-full sm:w-auto"
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
                  className="border-2 border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold backdrop-blur-sm text-xs sm:text-sm min-h-11 w-full sm:w-auto"
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

            {/* Modern Vendors Grid - Mobile Optimized */}
            {!vendorsLoading && !vendorsError && filteredVendors.length > 0 && (
              <>
                <div
                  ref={vendorsRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 w-full max-w-full overflow-x-hidden"
                >
                  {filteredVendors.slice(0, featuredLimit).map((vendor) => (
                    <Card
                      key={vendor.id}
                      className="group relative bg-white dark:bg-gray-800 border-0 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02] w-full max-w-full"
                    >
                      {/* Modern Image Section with Gradient Overlay */}
                      <div className="relative h-48 sm:h-52 overflow-hidden">
                        <Image
                          src={vendor.recentWork.image}
                          alt={vendor.recentWork.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Modern gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Floating badges with modern design */}
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                          <Badge className="bg-white/95 text-gray-900 border-0 backdrop-blur-sm font-semibold text-xs px-3 py-1 rounded-full shadow-lg">
                            {vendor.category}
                          </Badge>
                          <div className="flex gap-1.5">
                            {vendor.isVerified && (
                              <div className="p-1.5 bg-emerald-500 rounded-full shadow-lg">
                                <Award className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rating badge - bottom left */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white font-bold text-sm">
                            {vendor.rating}
                          </span>
                        </div>
                      </div>

                      {/* Modern Card Content */}
                      <div className="p-4 space-y-3">
                        {/* Vendor info */}
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {vendor.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                            {vendor.recentWork.title}
                          </p>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                            <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-medium">
                              {vendor.reviews} reviews
                            </span>
                          </div>
                          {vendor.email && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-green-600 dark:text-green-400 font-semibold">
                                Available
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Modern Action Buttons */}
                        <div className="flex gap-2 pt-1">
                          <Link
                            href={`/vendors/${vendor.id}`}
                            className="flex-1"
                          >
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm min-h-11 shadow-sm"
                            >
                              <Eye className="mr-1.5 h-4 w-4" />
                              View Profile
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl min-w-11 min-h-11"
                            onClick={() => handleMessage(vendor)}
                            title="Message vendor"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Modern "Show More" Button */}
                {filteredVendors.length > featuredLimit && (
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <Button
                      variant="outline"
                      className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 rounded-2xl font-semibold min-h-12 transition-all hover:scale-105"
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
                          <X className="h-5 w-5 ml-2" />
                        </>
                      ) : (
                        <>
                          Show More ({filteredVendors.length - featuredLimit}{" "}
                          more)
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modern Gallery Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  Event Gallery
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get inspired by successful events
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl font-semibold min-h-11 px-6"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>

            {/* Modern Gallery Filter Tabs */}
            <Tabs
              value={galleryFilter}
              onValueChange={setGalleryFilter}
              className="w-full"
            >
              <TabsList className="inline-flex h-auto items-center justify-start rounded-xl bg-gray-100 dark:bg-gray-800 p-1.5 gap-2 overflow-x-auto w-full scrollbar-hide">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg px-5 py-2.5 text-sm font-semibold whitespace-nowrap min-h-11 transition-all"
                >
                  All Events
                </TabsTrigger>
                <TabsTrigger
                  value="wedding"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg px-5 py-2.5 text-sm font-semibold whitespace-nowrap min-h-11 transition-all"
                >
                  Weddings
                </TabsTrigger>
                <TabsTrigger
                  value="corporate"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg px-5 py-2.5 text-sm font-semibold whitespace-nowrap min-h-11 transition-all"
                >
                  Corporate
                </TabsTrigger>
                <TabsTrigger
                  value="birthday"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg px-5 py-2.5 text-sm font-semibold whitespace-nowrap min-h-11 transition-all"
                >
                  Birthdays
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-5 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredGalleryItems
                    .slice(0, showMoreGallery ? filteredGalleryItems.length : 6)
                    .map((item) => (
                      <Card
                        key={item.id}
                        className="group overflow-hidden border-0 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                      >
                        {/* Image Section */}
                        <div className="relative h-56 sm:h-64 overflow-hidden">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                          {/* Type Badge - Top Right */}
                          <div className="absolute top-3 right-3">
                            {item.type === "video" ? (
                              <div className="bg-emerald-500 rounded-full p-2 shadow-lg">
                                <Play className="h-4 w-4 text-white fill-white" />
                              </div>
                            ) : (
                              <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                <ImageIcon className="h-4 w-4 text-gray-700" />
                              </div>
                            )}
                          </div>

                          {/* Play button overlay for videos */}
                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-emerald-500/90 rounded-full p-4 shadow-2xl">
                                <Play className="h-8 w-8 text-white fill-white" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                              {item.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs capitalize"
                            >
                              {item.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="line-clamp-1">{item.vendor}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>

                {/* Modern Gallery "See More" Button */}
                {filteredGalleryItems.length > 6 && (
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <Button
                      variant="outline"
                      className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 rounded-2xl font-semibold min-h-12 transition-all hover:scale-105"
                      onClick={() => setShowMoreGallery(!showMoreGallery)}
                    >
                      {showMoreGallery ? (
                        <>
                          Show Less
                          <X className="h-5 w-5 ml-2" />
                        </>
                      ) : (
                        <>
                          See More ({filteredGalleryItems.length - 6} more)
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="wedding" className="mt-5 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredGalleryItems
                    .slice(0, showMoreGallery ? filteredGalleryItems.length : 6)
                    .map((item) => (
                      <Card
                        key={item.id}
                        className="group overflow-hidden border-0 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                      >
                        {/* Image Section */}
                        <div className="relative h-56 sm:h-64 overflow-hidden">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                          {/* Type Badge - Top Right */}
                          <div className="absolute top-3 right-3">
                            {item.type === "video" ? (
                              <div className="bg-emerald-500 rounded-full p-2 shadow-lg">
                                <Play className="h-4 w-4 text-white fill-white" />
                              </div>
                            ) : (
                              <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                <ImageIcon className="h-4 w-4 text-gray-700" />
                              </div>
                            )}
                          </div>

                          {/* Play button overlay for videos */}
                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-emerald-500/90 rounded-full p-4 shadow-2xl">
                                <Play className="h-8 w-8 text-white fill-white" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                              {item.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs capitalize"
                            >
                              {item.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="line-clamp-1">{item.vendor}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>

                {/* Modern Gallery "See More" Button */}
                {filteredGalleryItems.length > 6 && (
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <Button
                      variant="outline"
                      className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 rounded-2xl font-semibold min-h-12 transition-all hover:scale-105"
                      onClick={() => setShowMoreGallery(!showMoreGallery)}
                    >
                      {showMoreGallery ? (
                        <>
                          Show Less
                          <X className="h-5 w-5 ml-2" />
                        </>
                      ) : (
                        <>
                          See More ({filteredGalleryItems.length - 6} more)
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="corporate" className="mt-5 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredGalleryItems
                    .slice(0, showMoreGallery ? filteredGalleryItems.length : 6)
                    .map((item) => (
                      <Card
                        key={item.id}
                        className="group overflow-hidden border-0 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                      >
                        {/* Image Section */}
                        <div className="relative h-56 sm:h-64 overflow-hidden">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                          {/* Type Badge - Top Right */}
                          <div className="absolute top-3 right-3">
                            {item.type === "video" ? (
                              <div className="bg-emerald-500 rounded-full p-2 shadow-lg">
                                <Play className="h-4 w-4 text-white fill-white" />
                              </div>
                            ) : (
                              <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                <ImageIcon className="h-4 w-4 text-gray-700" />
                              </div>
                            )}
                          </div>

                          {/* Play button overlay for videos */}
                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-emerald-500/90 rounded-full p-4 shadow-2xl">
                                <Play className="h-8 w-8 text-white fill-white" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                              {item.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs capitalize"
                            >
                              {item.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="line-clamp-1">{item.vendor}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>

                {/* Modern Gallery "See More" Button */}
                {filteredGalleryItems.length > 6 && (
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <Button
                      variant="outline"
                      className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 rounded-2xl font-semibold min-h-12 transition-all hover:scale-105"
                      onClick={() => setShowMoreGallery(!showMoreGallery)}
                    >
                      {showMoreGallery ? (
                        <>
                          Show Less
                          <X className="h-5 w-5 ml-2" />
                        </>
                      ) : (
                        <>
                          See More ({filteredGalleryItems.length - 6} more)
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="birthday" className="mt-5 sm:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredGalleryItems
                    .slice(0, showMoreGallery ? filteredGalleryItems.length : 6)
                    .map((item) => (
                      <Card
                        key={item.id}
                        className="group overflow-hidden border-0 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                      >
                        {/* Image Section */}
                        <div className="relative h-56 sm:h-64 overflow-hidden">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                          {/* Type Badge - Top Right */}
                          <div className="absolute top-3 right-3">
                            {item.type === "video" ? (
                              <div className="bg-emerald-500 rounded-full p-2 shadow-lg">
                                <Play className="h-4 w-4 text-white fill-white" />
                              </div>
                            ) : (
                              <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                <ImageIcon className="h-4 w-4 text-gray-700" />
                              </div>
                            )}
                          </div>

                          {/* Play button overlay for videos */}
                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-emerald-500/90 rounded-full p-4 shadow-2xl">
                                <Play className="h-8 w-8 text-white fill-white" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                              {item.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs capitalize"
                            >
                              {item.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="line-clamp-1">{item.vendor}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>

                {/* Modern Gallery "See More" Button */}
                {filteredGalleryItems.length > 6 && (
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <Button
                      variant="outline"
                      className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 rounded-2xl font-semibold min-h-12 transition-all hover:scale-105"
                      onClick={() => setShowMoreGallery(!showMoreGallery)}
                    >
                      {showMoreGallery ? (
                        <>
                          Show Less
                          <X className="h-5 w-5 ml-2" />
                        </>
                      ) : (
                        <>
                          See More ({filteredGalleryItems.length - 6} more)
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Modern Upcoming Events Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Upcoming Events
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Stay on top of your bookings
                </p>
              </div>
            </div>

            {upcomingEvents.length > 0 ? (
              <div
                ref={eventsRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
              >
                {upcomingEvents.map((event, index) => (
                  <Card
                    key={index}
                    className="group relative bg-linear-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border-0 rounded-2xl overflow-hidden shadow-md hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 hover:scale-[1.02] p-5"
                  >
                    {/* Accent border on top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                    <div className="space-y-4">
                      {/* Header with badge and time */}
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          className={`shrink-0 font-semibold px-3 py-1.5 rounded-full text-xs ${
                            event.status === "confirmed"
                              ? "bg-emerald-500 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {event.status === "confirmed" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" />
                              Confirmed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Pending
                            </span>
                          )}
                        </Badge>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {event.time}
                        </span>
                      </div>

                      {/* Event info */}
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                          {event.name}
                        </h3>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {event.vendor}
                        </p>
                      </div>

                      {/* Event details with modern icon badges */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                            <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm font-medium">
                            {event.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm font-medium line-clamp-1">
                            {event.location}
                          </span>
                        </div>
                      </div>

                      {/* Action button */}
                      <Button
                        variant="default"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold min-h-11 mt-2"
                      >
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 sm:p-12 text-center bg-linear-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 border-0 rounded-2xl">
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No Upcoming Events
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Start planning your next event by browsing vendors
                    </p>
                  </div>
                  <Link href="/client/vendors" className="w-full sm:w-auto">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold min-h-11 px-8">
                      Browse Vendors
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
