"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { bookingsAPI } from "@/lib/api";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  User,
  DollarSign,
  Users,
  MoreHorizontal,
  Eye,
  CheckCircle,
  X,
  TrendingUp,
  Check,
  AlertCircle,
  Search,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Shield,
  Sparkles,
  Crown,
  BarChart3,
  Star,
  Flame,
  ArrowRight,
  Award,
  Rocket,
  Target,
  Heart,
  Smile,
  Zap,
} from "lucide-react";
import AnimatedList from "@/components/ui/animated-list";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useAuth } from "@/contexts/AuthContext";

type Booking = {
  _id: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceTitle?: string;
  date?: string;
  time?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  amount?: number;
  location?: string;
  guestCount?: number;
  notes?: string;
};

type BoostFeature = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  benefits: string[];
  duration: string;
  color: string;
  bgColor: string;
  badge: string;
};

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingsAPI.getForVendor(user?._id as string);
      const data = res.data?.data || res.data || [];
      setBookings(data as Booking[]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch bookings"
      );
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    let list = bookings;

    if (activeTab === "pending") {
      list = bookings.filter((b) => b.status === "pending");
    } else if (activeTab === "confirmed") {
      list = bookings.filter((b) => b.status === "confirmed");
    } else if (activeTab === "completed") {
      list = bookings.filter((b) => b.status === "completed");
    } else if (activeTab === "cancelled") {
      list = bookings.filter((b) => b.status === "cancelled");
    }

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (b) =>
        (b.clientName || "").toLowerCase().includes(q) ||
        (b.serviceTitle || "").toLowerCase().includes(q) ||
        (b.clientEmail || "").toLowerCase().includes(q)
    );
  }, [bookings, query, activeTab]);

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const conversionRate =
      bookings.length > 0 ? Math.round((confirmed / bookings.length) * 100) : 0;

    return { pending, confirmed, completed, totalRevenue, conversionRate };
  }, [bookings]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await bookingsAPI.update(bookingId, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus as any } : b
        )
      );
      toast.success(`Booking ${newStatus}`);
    } catch (err: any) {
      toast.error("Failed to update booking");
    }
  };

  const requestCancelBooking = (id: string) => {
    setPendingCancelId(id);
    setCancelOpen(true);
  };

  const performCancelBooking = async () => {
    if (!pendingCancelId) return;
    try {
      await bookingsAPI.cancel(pendingCancelId);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === pendingCancelId ? { ...b, status: "cancelled" } : b
        )
      );
      toast.success("Booking cancelled");
      setSelectedBooking(null);
    } catch (err: any) {
      toast.error("Failed to cancel booking");
    } finally {
      setCancelOpen(false);
      setPendingCancelId(null);
    }
  };

  // Create animated list items with rich booking cards
  const animatedListItems = filtered.map((booking) => (
    <div key={booking._id} className="w-full">
      <div
        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all cursor-pointer shadow-sm hover:shadow-md"
        onClick={() => setSelectedBooking(booking)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {booking.clientName?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-gray-900 font-semibold truncate text-sm">
                  {booking.clientName || "Unknown"}
                </h4>
                <p className="text-emerald-600 truncate font-medium text-xs">
                  {booking.serviceTitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-3">
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                <Calendar className="h-3 w-3 text-emerald-600" />
                <span className="truncate">
                  {booking.date
                    ? new Date(booking.date).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                <Clock className="h-3 w-3 text-emerald-600" />
                <span className="truncate">{booking.time || "—"}</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                <DollarSign className="h-3 w-3 text-emerald-600" />
                <span className="truncate font-medium">
                  KSh {(booking.amount || 0) / 1000}K
                </span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                <Users className="h-3 w-3 text-emerald-600" />
                <span className="truncate">{booking.guestCount || "—"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge
                className={`text-xs font-semibold ${
                  booking.status === "confirmed"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : booking.status === "pending"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : booking.status === "completed"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
                variant="outline"
              >
                {booking.status
                  ? booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)
                  : "Unknown"}
              </Badge>
              <div className="text-xs text-gray-500 font-medium">
                {booking.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {booking.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBooking(booking);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  ));

  const boostFeatures: BoostFeature[] = [
    {
      id: "featured-weekly",
      name: "Featured Weekly",
      description: "Get top placement for 7 days",
      icon: <Zap className="h-6 w-6" />,
      price: 2999,
      benefits: [
        "Top placement in searches",
        "Featured badge on all listings",
        "7-day visibility boost",
        "Early bird advantage",
      ],
      duration: "7 days",
      color: "text-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      badge: "Popular",
    },
    {
      id: "featured-monthly",
      name: "Premium Monthly",
      description: "Maximize visibility for 30 days",
      icon: <Crown className="h-6 w-6" />,
      price: 7999,
      benefits: [
        "Premium placement",
        "Featured + Crown icon badge",
        "Priority support",
        "Weekly analytics reports",
        "Social media promotion",
      ],
      duration: "30 days",
      color: "text-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      badge: "Best Value",
    },
    {
      id: "trending",
      name: "Trending Rocket",
      description: "Join top trending services",
      icon: <Flame className="h-6 w-6" />,
      price: 4999,
      benefits: [
        "Trending section placement",
        "Flame badge",
        "15-day visibility",
        "Performance analytics",
        "Client testimonials featured",
      ],
      duration: "15 days",
      color: "text-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      badge: "Hot",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-500 bg-clip-text text-transparent mb-2">
                Bookings Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Manage bookings, track revenue, and grow your business
              </p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="hidden md:block p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200"
            >
              <Rocket className="h-8 w-8 text-emerald-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8"
        >
          {[
            {
              label: "Pending",
              value: stats.pending,
              icon: AlertCircle,
              color: "text-amber-600",
              bg: "from-amber-50 to-amber-100",
            },
            {
              label: "Confirmed",
              value: stats.confirmed,
              icon: CheckCircle,
              color: "text-emerald-600",
              bg: "from-emerald-50 to-emerald-100",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: Check,
              color: "text-blue-600",
              bg: "from-blue-50 to-blue-100",
            },
            {
              label: "Revenue",
              value: `KSh ${(stats.totalRevenue / 1000).toFixed(0)}K`,
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "from-emerald-50 to-emerald-100",
            },
            {
              label: "Conversion",
              value: `${stats.conversionRate}%`,
              icon: BarChart3,
              color: "text-emerald-600",
              bg: "from-emerald-50 to-emerald-100",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="bg-white hover:shadow-md transition-all border-0 shadow-sm">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-xs font-medium">
                          {stat.label}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`bg-gradient-to-br ${stat.bg} p-2 rounded-lg`}
                      >
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by client, service, or email..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={fetchBookings}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings List with AnimatedList */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-10"
        >
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-emerald-600" />
                    Your Bookings
                  </CardTitle>
                  <CardDescription className="text-gray-500 mt-1">
                    {filtered.length} booking{filtered.length !== 1 ? "s" : ""}{" "}
                    • Click to view details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 border border-gray-200 p-1">
                  {[
                    "all",
                    "pending",
                    "confirmed",
                    "completed",
                    "cancelled",
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-xs md:text-sm text-gray-600"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <div className="animate-spin h-10 w-10 border-4 border-gray-200 border-t-emerald-600 rounded-full mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        Loading your bookings...
                      </p>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">{error}</p>
                      <Button
                        onClick={fetchBookings}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Try Again
                      </Button>
                    </motion.div>
                  ) : filtered.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        No bookings in this category
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Bookings will appear here as they come in
                      </p>
                    </motion.div>
                  ) : (
                    <AnimatedList
                      items={animatedListItems}
                      className="w-full"
                      itemClassName="w-full"
                      displayScrollbar={true}
                      enableArrowNavigation={true}
                      showGradients={true}
                      initialSelectedIndex={selectedIndex}
                      onItemSelect={(item, index) => setSelectedIndex(index)}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Boost Your Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-10"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Zap className="h-8 w-8 text-emerald-600" />
              Boost Your Visibility
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Stand out and get more qualified bookings
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {boostFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${feature.bgColor} border border-gray-200`}
                      >
                        <span className={feature.color}>{feature.icon}</span>
                      </div>
                      <Badge
                        className={`${feature.bgColor} text-gray-700 border border-gray-200 text-xs font-semibold`}
                      >
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-gray-900 text-lg">
                      {feature.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 relative z-10">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-2xl font-bold text-gray-900">
                        KSh {feature.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        One-time investment • {feature.duration}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Star className="h-4 w-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        toast.info(`Selected: ${feature.name}`, {
                          description: "Proceeding to payment...",
                        });
                      }}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold transition-all"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Verification & Analytics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="grid md:grid-cols-2 gap-6 mb-10"
        >
          {/* Verification Card */}
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Priority
                </Badge>
              </div>
              <CardTitle className="text-gray-900">Get Verified</CardTitle>
              <CardDescription className="text-gray-600">
                Build trust and credibility with customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Verified Badge
                    </p>
                    <p className="text-xs text-gray-500">
                      Appear verified on all listings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Boost Conversions
                    </p>
                    <p className="text-xs text-gray-500">
                      Get up to 3x more inquiries
                    </p>
                  </div>
                </div>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-gray-500">
                5 of 8 requirements completed
              </p>
              <Button
                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                variant="outline"
              >
                Apply Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Premium
                </Badge>
              </div>
              <CardTitle className="text-gray-900">
                Performance Metrics
              </CardTitle>
              <CardDescription className="text-gray-600">
                Track your booking success rate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Response Rate</span>
                    <span className="text-emerald-600 font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Booking Rate</span>
                    <span className="text-emerald-600 font-semibold">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Client Satisfaction</span>
                    <span className="text-emerald-600 font-semibold">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Full Reports
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                vendor: "Sarah's Events",
                stat: "+145%",
                detail: "Booking growth",
                icon: TrendingUp,
                color: "text-emerald-600",
              },
              {
                vendor: "Photography Pro",
                stat: "4.9★",
                detail: "Average rating",
                icon: Star,
                color: "text-emerald-600",
              },
              {
                vendor: "Elite Services",
                stat: "+89%",
                detail: "Revenue boost",
                icon: TrendingUp,
                color: "text-emerald-600",
              },
            ].map((story, i) => {
              const Icon = story.icon;
              return (
                <Card
                  key={i}
                  className="bg-white border-0 shadow-sm hover:shadow-md transition-all"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {story.vendor}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-3">
                          {story.stat}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {story.detail}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                        <Icon className={`h-5 w-5 ${story.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="mb-10"
        >
          <Card className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-all">
            <CardContent className="p-8">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-emerald-600" />
                    Ready to boost your bookings?
                  </h3>
                  <p className="text-gray-600">
                    Get featured, verified, and start seeing results today
                  </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Explore Plans
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                    disabled
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Booking Details Slide-Out Panel */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            key="booking-details"
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          >
            <div className="flex-1" />
            <motion.div
              initial={{ x: 500 }}
              animate={{ x: 0 }}
              exit={{ x: 500 }}
              className="w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-emerald-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Booking Details
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {selectedBooking.serviceTitle}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    Client Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-900 font-medium">
                      {selectedBooking.clientName}
                    </p>
                    {selectedBooking.clientEmail && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedBooking.clientEmail}
                      </p>
                    )}
                    {selectedBooking.clientPhone && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedBooking.clientPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    Booking Info
                  </h3>
                  <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="text-gray-900 font-medium">
                        {selectedBooking.date
                          ? new Date(selectedBooking.date).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="text-gray-900 font-medium">
                        {selectedBooking.time || "—"}
                      </span>
                    </div>
                    {selectedBooking.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location</span>
                        <span className="text-gray-900 font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedBooking.location}
                        </span>
                      </div>
                    )}
                    {selectedBooking.guestCount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests</span>
                        <span className="text-gray-900 font-medium">
                          {selectedBooking.guestCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-emerald-600">
                      KSh {selectedBooking.amount?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h3 className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                      Notes
                    </h3>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 space-y-3">
                {selectedBooking.status === "pending" && (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedBooking._id, "confirmed");
                      setSelectedBooking(null);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </Button>
                )}
                {selectedBooking.status !== "cancelled" &&
                  selectedBooking.status !== "completed" && (
                    <Button
                      onClick={() => requestCancelBooking(selectedBooking._id)}
                      variant="destructive"
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </Button>
                  )}
                <Button
                  onClick={() => setSelectedBooking(null)}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={(o) => {
          setCancelOpen(o);
          if (!o) setPendingCancelId(null);
        }}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone and may affect your vendor rating."
        confirmLabel="Yes, cancel"
        cancelLabel="No, keep"
        confirmVariant="destructive"
        onConfirm={performCancelBooking}
      />
    </div>
  );
}
