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
  CardFooter,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  List,
  Grid,
} from "lucide-react";
import AnimatedList from "@/components/ui/animated-list";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useAuth } from "@/contexts/AuthContext";

type Booking = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  service: {
    _id: string;
    title: string;
    category: string;
    price: number;
  };
  provider: string;
  startDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "pending";
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  // Legacy fields for backward compatibility
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceTitle?: string;
  date?: string;
  time?: string;
  amount?: number;
  location?: string;
  guestCount?: number;
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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "list">("table");

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
        (b.user?.name || b.clientName || "").toLowerCase().includes(q) ||
        (b.service?.title || b.serviceTitle || "").toLowerCase().includes(q) ||
        (b.user?.email || b.clientEmail || "").toLowerCase().includes(q) ||
        (b.service?.category || "").toLowerCase().includes(q)
    );
  }, [bookings, query, activeTab]);

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.totalPrice || b.amount || 0),
      0
    );
    const conversionRate =
      bookings.length > 0 ? Math.round((confirmed / bookings.length) * 100) : 0;

    return { pending, confirmed, completed, totalRevenue, conversionRate };
  }, [bookings]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
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
      color: "text-green-600",
      bgColor: "from-green-50 to-green-100",
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
      color: "text-amber-600",
      bgColor: "from-amber-50 to-amber-100",
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
      color: "text-orange-600",
      bgColor: "from-orange-50 to-orange-100",
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-500 bg-clip-text text-transparent mb-3">
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
              className="hidden md:block p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200"
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
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
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
                <Card className="bg-white hover:shadow-lg transition-all border border-gray-100 shadow-sm">
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
                        className={`bg-gradient-to-br ${stat.bg} p-3 rounded-lg`}
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
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by client, service, or email..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
          <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2 text-xl">
                    <Heart className="h-5 w-5 text-emerald-600" />
                    Your Bookings
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
                    {filtered.length} booking{filtered.length !== 1 ? "s" : ""}{" "}
                    • Click to view details
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className={
                      viewMode === "table"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }
                  >
                    <Grid className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Table</span>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }
                  >
                    <List className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">List</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 border border-gray-200 p-1 rounded-lg">
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
                      className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-xs md:text-sm text-gray-600 rounded-md"
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
                  ) : viewMode === "table" ? (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableHead className="font-semibold min-w-[200px]">
                              Client
                            </TableHead>
                            <TableHead className="font-semibold min-w-[180px] hidden md:table-cell">
                              Service
                            </TableHead>
                            <TableHead className="font-semibold min-w-[120px] hidden lg:table-cell">
                              Date
                            </TableHead>
                            <TableHead className="font-semibold min-w-[100px]">
                              Amount
                            </TableHead>
                            <TableHead className="font-semibold min-w-[100px] hidden sm:table-cell">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold min-w-[100px] hidden xl:table-cell">
                              Payment
                            </TableHead>
                            <TableHead className="text-right font-semibold min-w-[120px]">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((booking) => {
                            const clientName =
                              booking.user?.name ||
                              booking.clientName ||
                              "Unknown Client";
                            const clientEmail =
                              booking.user?.email || booking.clientEmail || "";
                            const serviceTitle =
                              booking.service?.title ||
                              booking.serviceTitle ||
                              "Unknown Service";
                            const serviceCategory =
                              booking.service?.category || "";
                            const bookingDate =
                              booking.startDate || booking.date || "";
                            const amount =
                              booking.totalPrice || booking.amount || 0;

                            const formattedDate = bookingDate
                              ? new Date(bookingDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "—";

                            const statusConfig = {
                              confirmed: {
                                color: "emerald",
                                bg: "bg-emerald-100 dark:bg-emerald-900/30",
                                text: "text-emerald-700 dark:text-emerald-300",
                                border:
                                  "border-emerald-200 dark:border-emerald-800",
                              },
                              pending: {
                                color: "amber",
                                bg: "bg-amber-100 dark:bg-amber-900/30",
                                text: "text-amber-700 dark:text-amber-300",
                                border:
                                  "border-amber-200 dark:border-amber-800",
                              },
                              completed: {
                                color: "blue",
                                bg: "bg-blue-100 dark:bg-blue-900/30",
                                text: "text-blue-700 dark:text-blue-300",
                                border: "border-blue-200 dark:border-blue-800",
                              },
                              cancelled: {
                                color: "red",
                                bg: "bg-red-100 dark:bg-red-900/30",
                                text: "text-red-700 dark:text-red-300",
                                border: "border-red-200 dark:border-red-800",
                              },
                            };

                            const status =
                              statusConfig[booking.status] ||
                              statusConfig.pending;

                            return (
                              <TableRow
                                key={booking._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                              >
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                                      {clientName[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {clientName}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {clientEmail}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1 md:hidden">
                                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                          KSh {(amount / 1000).toFixed(1)}K
                                        </p>
                                        <Badge
                                          className={`${status.bg} ${status.text} ${status.border} font-semibold text-xs sm:hidden`}
                                        >
                                          {booking.status?.toUpperCase()}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                      {serviceTitle}
                                    </p>
                                    {serviceCategory && (
                                      <Badge
                                        variant="outline"
                                        className="mt-1 text-xs"
                                      >
                                        {serviceCategory}
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    {formattedDate}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <p className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                    KSh {(amount / 1000).toFixed(1)}K
                                  </p>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <Badge
                                    className={`${status.bg} ${status.text} ${status.border} font-semibold whitespace-nowrap`}
                                  >
                                    {booking.status?.toUpperCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                  {booking.paymentStatus === "paid" ? (
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                        Paid
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                        Pending
                                      </span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                      onClick={() => {
                                        setSelectedBooking(booking);
                                        setViewModalOpen(true);
                                      }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                      >
                                        <DropdownMenuLabel>
                                          Quick Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => {
                                            window.location.href = `/vendor/messages?userId=${booking.user._id}`;
                                          }}
                                        >
                                          <MessageCircle className="h-4 w-4 mr-2" />
                                          Message Client
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {booking.status === "pending" && (
                                          <>
                                            <DropdownMenuItem
                                              onClick={() =>
                                                handleStatusChange(
                                                  booking._id,
                                                  "confirmed"
                                                )
                                              }
                                              className="text-emerald-600"
                                            >
                                              <CheckCircle className="h-4 w-4 mr-2" />
                                              Confirm Booking
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => {
                                                setPendingCancelId(booking._id);
                                                setCancelOpen(true);
                                              }}
                                              className="text-red-600"
                                            >
                                              <X className="h-4 w-4 mr-2" />
                                              Cancel Booking
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                        {booking.status === "confirmed" && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleStatusChange(
                                                booking._id,
                                                "completed"
                                              )
                                            }
                                            className="text-blue-600"
                                          >
                                            <Star className="h-4 w-4 mr-2" />
                                            Mark Complete
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filtered.map((booking) => {
                        const clientName =
                          booking.user?.name ||
                          booking.clientName ||
                          "Unknown Client";
                        const clientEmail =
                          booking.user?.email || booking.clientEmail || "";
                        const clientPhone =
                          booking.user?.phone || booking.clientPhone || "";
                        const serviceTitle =
                          booking.service?.title ||
                          booking.serviceTitle ||
                          "Unknown Service";
                        const serviceCategory = booking.service?.category || "";
                        const bookingDate =
                          booking.startDate || booking.date || "";
                        const amount =
                          booking.totalPrice || booking.amount || 0;

                        const formattedDate = bookingDate
                          ? new Date(bookingDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—";

                        const formattedTime = bookingDate
                          ? new Date(bookingDate).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—";

                        const statusConfig = {
                          confirmed: {
                            bg: "bg-emerald-100 dark:bg-emerald-900/30",
                            text: "text-emerald-700 dark:text-emerald-300",
                            border:
                              "border-emerald-200 dark:border-emerald-800",
                            icon: <CheckCircle className="h-4 w-4" />,
                          },
                          pending: {
                            bg: "bg-amber-100 dark:bg-amber-900/30",
                            text: "text-amber-700 dark:text-amber-300",
                            border: "border-amber-200 dark:border-amber-800",
                            icon: <Clock className="h-4 w-4" />,
                          },
                          completed: {
                            bg: "bg-blue-100 dark:bg-blue-900/30",
                            text: "text-blue-700 dark:text-blue-300",
                            border: "border-blue-200 dark:border-blue-800",
                            icon: <Star className="h-4 w-4" />,
                          },
                          cancelled: {
                            bg: "bg-red-100 dark:bg-red-900/30",
                            text: "text-red-700 dark:text-red-300",
                            border: "border-red-200 dark:border-red-800",
                            icon: <X className="h-4 w-4" />,
                          },
                        };

                        const status =
                          statusConfig[booking.status] || statusConfig.pending;

                        return (
                          <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border rounded-lg hover:shadow-lg transition-all bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
                          >
                            <div className="p-6">
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
                                    {clientName[0]?.toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                                      {clientName}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {clientEmail}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge
                                        className={`${status.bg} ${status.text} ${status.border} font-semibold`}
                                      >
                                        {booking.status?.toUpperCase()}
                                      </Badge>
                                      {serviceCategory && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {serviceCategory}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Amount
                                  </p>
                                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    KSh {(amount / 1000).toFixed(1)}K
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    Service
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {serviceTitle}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Date
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {formattedDate}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Time
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {formattedTime}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  {booking.paymentStatus === "paid" ? (
                                    <>
                                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                        Paid
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                        Pending
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    onClick={() => {
                                      setSelectedBooking(booking);
                                      setViewModalOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <MoreHorizontal className="h-4 w-4 mr-2" />
                                        Actions
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-48"
                                    >
                                      <DropdownMenuLabel>
                                        Quick Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => {
                                          window.location.href = `/vendor/messages?userId=${booking.user._id}`;
                                        }}
                                      >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Message Client
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      {booking.status === "pending" && (
                                        <>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleStatusChange(
                                                booking._id,
                                                "confirmed"
                                              )
                                            }
                                            className="text-emerald-600"
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Confirm Booking
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setPendingCancelId(booking._id);
                                              setCancelOpen(true);
                                            }}
                                            className="text-red-600"
                                          >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel Booking
                                          </DropdownMenuItem>
                                        </>
                                      )}
                                      {booking.status === "confirmed" && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleStatusChange(
                                              booking._id,
                                              "completed"
                                            )
                                          }
                                          className="text-blue-600"
                                        >
                                          <Star className="h-4 w-4 mr-2" />
                                          Mark Complete
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
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
                <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${feature.bgColor} border border-gray-200`}
                      >
                        <span className={feature.color}>{feature.icon}</span>
                      </div>
                      <Badge
                        className={`${feature.bgColor} text-white border border-gray-200 text-xs font-semibold`}
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
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Priority
                </Badge>
              </div>
              <CardTitle className="text-gray-900 text-xl">
                Get Verified
              </CardTitle>
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
              <Progress value={65} className="h-2 [&>div]:bg-green-400" />
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
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Premium
                </Badge>
              </div>
              <CardTitle className="text-gray-900 text-xl">
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
                  <Progress value={92} className="h-2 [&>div]:bg-green-400" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Booking Rate</span>
                    <span className="text-emerald-600 font-semibold">78%</span>
                  </div>
                  <Progress value={78} className="h-2 [&>div]:bg-green-400" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Client Satisfaction</span>
                    <span className="text-emerald-600 font-semibold">95%</span>
                  </div>
                  <Progress value={95} className="h-2 [&>div]:bg-green-400" />
                </div>
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-900 text-white"
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
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all"
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
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                    Ready to boost your bookings?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Get featured, verified, and start seeing results today
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:flex-shrink-0">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
                    Explore Plans
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
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

      {/* View Booking Details Sheet */}
      <Sheet open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <SheetContent className="w-full sm:max-w-[50vw] p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold text-white">
                    Booking #{selectedBooking?._id?.slice(-6).toUpperCase()}
                  </SheetTitle>
                  <SheetDescription className="text-emerald-100 text-xs">
                    Complete booking details
                  </SheetDescription>
                </div>
              </div>
            </div>
            {selectedBooking && (
              <div className="flex items-center gap-2 mt-3">
                <Badge
                  className={`px-3 py-1 text-xs font-semibold ${
                    selectedBooking.status === "confirmed"
                      ? "bg-emerald-400 text-emerald-950"
                      : selectedBooking.status === "pending"
                      ? "bg-amber-400 text-amber-950"
                      : selectedBooking.status === "completed"
                      ? "bg-blue-400 text-blue-950"
                      : "bg-red-400 text-red-950"
                  }`}
                >
                  {selectedBooking.status?.toUpperCase()}
                </Badge>
                <Badge
                  className={`px-3 py-1 text-xs font-semibold ${
                    selectedBooking.paymentStatus === "paid"
                      ? "bg-green-400 text-green-950"
                      : "bg-orange-400 text-orange-950"
                  }`}
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  {selectedBooking.paymentStatus?.toUpperCase() || "PENDING"}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="overflow-y-auto px-6 py-5"
            style={{ maxHeight: "calc(100vh - 220px)" }}
          >
            {selectedBooking && (
              <div className="space-y-5">
                {/* Client Information Card */}
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-3 pt-4 px-5">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <User className="h-4 w-4 text-emerald-600" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {(selectedBooking.user?.name ||
                          selectedBooking.clientName ||
                          "U")[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {selectedBooking.user?.name ||
                            selectedBooking.clientName ||
                            "—"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Mail className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">
                              {selectedBooking.user?.email ||
                                selectedBooking.clientEmail ||
                                "—"}
                            </span>
                          </div>
                          {(selectedBooking.user?.phone ||
                            selectedBooking.clientPhone) && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Phone className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                              <span>
                                {selectedBooking.user?.phone ||
                                  selectedBooking.clientPhone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Details Card */}
                <Card className="border-2 border-emerald-500 dark:border-emerald-700">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Service Booked
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {selectedBooking.service?.title ||
                            selectedBooking.serviceTitle ||
                            "—"}
                        </p>
                        {selectedBooking.service?.category && (
                          <Badge className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                            {selectedBooking.service.category}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          KSh{" "}
                          {(
                            (selectedBooking.totalPrice ||
                              selectedBooking.amount ||
                              0) / 1000
                          ).toFixed(1)}
                          K
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes Card */}
                {selectedBooking.notes && (
                  <Card className="border border-amber-500 dark:border-amber-700">
                    <CardHeader className="pb-2 pt-4 px-5">
                      <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <MessageCircle className="h-4 w-4 text-amber-600" />
                        Client Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedBooking.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Event Details Card */}
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-3 pt-4 px-5">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Event Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Event Date
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {selectedBooking.startDate || selectedBooking.date
                            ? new Date(
                                selectedBooking.startDate ||
                                  selectedBooking.date ||
                                  ""
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-emerald-600" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Event Time
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {selectedBooking.startDate || selectedBooking.date
                            ? new Date(
                                selectedBooking.startDate ||
                                  selectedBooking.date ||
                                  ""
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : selectedBooking.time || "—"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-emerald-600" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Booked On
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {selectedBooking.createdAt
                            ? new Date(
                                selectedBooking.createdAt
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>

                      {selectedBooking.location && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Location
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {selectedBooking.location}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Status Card */}
                <Card
                  className={`border-2 ${
                    selectedBooking.paymentStatus === "paid"
                      ? "border-green-500 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20"
                      : "border-orange-500 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-950/20"
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign
                            className={`h-4 w-4 ${
                              selectedBooking.paymentStatus === "paid"
                                ? "text-green-600"
                                : "text-orange-600"
                            }`}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Payment Status
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              selectedBooking.paymentStatus === "paid"
                                ? "bg-green-500"
                                : "bg-orange-500"
                            } animate-pulse`}
                          />
                          <p
                            className={`text-xl font-bold ${
                              selectedBooking.paymentStatus === "paid"
                                ? "text-green-600 dark:text-green-400"
                                : "text-orange-600 dark:text-orange-400"
                            }`}
                          >
                            {selectedBooking.paymentStatus?.toUpperCase() ||
                              "PENDING"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          selectedBooking.paymentStatus === "paid"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      >
                        {selectedBooking.paymentStatus === "paid" ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <Clock className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {selectedBooking && (
            <div className="border-t bg-gray-50 dark:bg-gray-900 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      window.location.href = `/vendor/messages?userId=${selectedBooking.user._id}`;
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  {selectedBooking.status === "pending" && (
                    <Button
                      onClick={() => {
                        handleStatusChange(selectedBooking._id, "confirmed");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                  )}
                  {selectedBooking.status === "confirmed" && (
                    <Button
                      onClick={() => {
                        handleStatusChange(selectedBooking._id, "completed");
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  )}
                  {(selectedBooking.status === "pending" ||
                    selectedBooking.status === "confirmed") && (
                    <Button
                      onClick={() => {
                        setPendingCancelId(selectedBooking._id);
                        setCancelOpen(true);
                      }}
                      variant="destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
