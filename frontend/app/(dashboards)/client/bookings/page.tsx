"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  X,
  Edit,
  MessageSquare,
  Star,
  Download,
  Search,
  Filter,
  ChevronDown,
  CalendarDays,
  CreditCard,
  FileText,
  User,
  Phone,
  Mail,
  TrendingUp,
  Users,
  Check,
  Eye,
  Menu,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { bookingsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// Define the Booking interface to match backend
interface Booking {
  _id: string;
  user: string;
  service: {
    _id: string;
    title: string;
    category: string;
    price: number;
    location: string;
  };
  provider: {
    _id: string;
    name: string;
    businessName: string;
  };
  startDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "paid" | "partial" | "unpaid";
  notes: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the MobileActionSheet props interface
interface MobileActionSheetProps {
  booking: Booking;
}

export default function ClientBookings() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user?._id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await bookingsAPI.getUserBookings(user._id);
      const data = response.data?.data || response.data || [];
      console.log("bookingdata", data);
      setBookings(Array.isArray(data) ? data : []);
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
  }, [user]);

  const handleCancelBooking = async (id: string) => {
    try {
      await bookingsAPI.cancel(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const handleReschedule = (id: string) => {
    toast.info("Reschedule feature coming soon");
  };

  const handleMessage = (vendor: string) => {
    toast.info(`Opening conversation with ${vendor}`);
  };

  const handleMakePayment = (id: string) => {
    toast.info("Redirecting to payment gateway");
  };

  const handleReview = (id: string) => {
    toast.info("Opening review form");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
      case "pending":
        return "border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
      case "completed":
        return "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "cancelled":
        return "border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      default:
        return "border-gray-500 text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20";
      case "partial":
        return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20";
      case "unpaid":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  // Filter bookings based on active tab and search term
  const filteredBookings = bookings.filter((booking: Booking) => {
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    const matchesSearch =
      (booking.provider?.businessName || booking.provider?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (booking.service?.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (booking.service?.location || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Filter options for dropdown
  const filterOptions = [
    { value: "all", label: "All Bookings", count: bookings.length },
    {
      value: "confirmed",
      label: "Confirmed",
      count: bookings.filter((b: Booking) => b.status === "confirmed").length,
    },
    {
      value: "pending",
      label: "Pending",
      count: bookings.filter((b: Booking) => b.status === "pending").length,
    },
    {
      value: "completed",
      label: "Completed",
      count: bookings.filter((b: Booking) => b.status === "completed").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: bookings.filter((b: Booking) => b.status === "cancelled").length,
    },
  ];

  // Mobile Action Sheet Component with proper typing
  const MobileActionSheet: React.FC<MobileActionSheetProps> = ({ booking }) => (
    <div className="space-y-3">
      <div className="text-center pb-3 border-b">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {booking.provider?.businessName ||
            booking.provider?.name ||
            "Unknown Provider"}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {booking.service?.title || "Unknown Service"}
        </p>
      </div>

      <div className="space-y-2">
        <Button
          onClick={() =>
            handleMessage(booking.provider?.businessName || "Provider")
          }
          variant="outline"
          size="sm"
          className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Message
        </Button>

        {booking.status !== "completed" && booking.status !== "cancelled" && (
          <Button
            onClick={() => handleCancelBooking(booking._id)}
            variant="outline"
            size="sm"
            className="w-full border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Booking
          </Button>
        )}

        <Button
          onClick={() => handleMakePayment(booking._id)}
          size="sm"
          disabled
          className="w-full bg-gray-400 cursor-not-allowed text-white opacity-60"
          title="Payment functionality coming soon"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Make Payment (Coming Soon)
        </Button>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen w-full max-w-full overflow-x-hidden bg-linear-to-br from-emerald-50 via-green-50/30 to-teal-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800">
        <div className="w-full max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 md:max-w-7xl md:mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Bookings
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Manage and track all your service bookings
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg w-full sm:w-auto">
                <Calendar className="w-4 h-4 mr-2" />
                New Booking
              </Button>
              <Button
                onClick={fetchBookings}
                variant="outline"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="bg-white dark:bg-gray-800 border-l-4 border-emerald-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium truncate">
                      Confirmed
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {
                        bookings.filter(
                          (b: Booking) => b.status === "confirmed"
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-l-4 border-amber-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-medium truncate">
                      Pending
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {
                        bookings.filter((b: Booking) => b.status === "pending")
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full shrink-0">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium truncate">
                      Completed
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {
                        bookings.filter(
                          (b: Booking) => b.status === "completed"
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/20 rounded-full shrink-0">
                    <Check className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-l-4 border-teal-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 font-medium truncate">
                      Total Spent
                    </p>
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      KSh{" "}
                      {bookings
                        .reduce(
                          (sum, b: Booking) => sum + (b.totalPrice || 0),
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-teal-100 dark:bg-teal-900/20 rounded-full shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Section - Fully Responsive */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-md w-full max-w-full overflow-x-hidden">
            <CardContent className="p-3 sm:p-4 w-full max-w-full overflow-x-hidden">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 w-full max-w-full">
                <div className="relative flex-1 min-w-0 w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-2 w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm sm:text-base min-h-[44px]"
                  />
                  {searchTerm && (
                    <button
                      title="Clear search"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-emerald-200 text-gray-700 dark:text-gray-300 w-full sm:w-auto min-h-[44px]"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Sort</span>
                      <span className="sm:hidden">Sort</span>
                      <ChevronDown className="w-4 h-4 sm:ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px] sm:w-auto">
                    <DropdownMenuItem>Date: Newest First</DropdownMenuItem>
                    <DropdownMenuItem>Date: Oldest First</DropdownMenuItem>
                    <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                    <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Filter Tabs - Responsive */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 sm:p-3">
            {/* Mobile Dropdown */}
            <div className="block sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-emerald-200 text-gray-700 dark:text-gray-300"
                  >
                    <span className="flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      {filterOptions.find(
                        (option) => option.value === activeTab
                      )?.label || "All Bookings"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setActiveTab(option.value)}
                      className={`flex items-center justify-between ${
                        activeTab === option.value
                          ? "bg-emerald-50 dark:bg-emerald-900/20"
                          : ""
                      }`}
                    >
                      <span>{option.label}</span>
                      <Badge variant="secondary" className="ml-2">
                        {option.count}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden sm:block">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={activeTab === option.value ? "default" : "outline"}
                    onClick={() => setActiveTab(option.value)}
                    className={`${
                      activeTab === option.value
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "border-emerald-200 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    }`}
                  >
                    {option.label}
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-white/20 text-white"
                    >
                      {option.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <Card className="bg-white dark:bg-gray-800 border-0">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Loading bookings...
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="bg-white dark:bg-gray-800 border-0">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Failed to load bookings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {error}
                  </p>
                  <Button
                    onClick={fetchBookings}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking: Booking) => (
                <Card
                  key={booking._id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-0 w-full max-w-full"
                >
                  <div className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden space-y-4 w-full max-w-full">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {booking.provider?.businessName ||
                              booking.provider?.name ||
                              "Unknown Provider"}
                          </h3>
                          <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                            {booking.service?.title || "Unknown Service"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {booking.service?.category || ""}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              booking.status || "pending"
                            )}`}
                          >
                            {getStatusIcon(booking.status || "pending")}
                            <span className="ml-1 capitalize text-xs">
                              {booking.status || "pending"}
                            </span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`${getPaymentStatusColor(
                              booking.paymentStatus || "unpaid"
                            )}`}
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            <span className="text-xs">
                              {booking.paymentStatus}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {booking.startDate
                              ? new Date(booking.startDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {booking.service?.location || "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate font-semibold text-gray-900 dark:text-white">
                            KSh {(booking.totalPrice || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="bg-linear-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10 rounded-lg p-4 space-y-3 border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Booking ID:
                          </span>
                          <span className="text-xs font-mono font-medium text-gray-900 dark:text-white">
                            #{booking._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Booked On:
                          </span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {booking.notes && (
                          <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800">
                            <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                              Notes:
                            </span>
                            <span className="text-xs text-gray-900 dark:text-white">
                              {booking.notes}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-2">
                        <Button
                          disabled
                          size="sm"
                          className="w-full bg-gray-400 cursor-not-allowed opacity-60"
                          title="Payment functionality coming soon in Q1 2026"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Make Payment (Coming Soon)
                        </Button>
                        {booking.status !== "completed" &&
                          booking.status !== "cancelled" && (
                            <Button
                              onClick={() => handleCancelBooking(booking._id)}
                              variant="outline"
                              size="sm"
                              className="w-full border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel Booking
                            </Button>
                          )}
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex lg:items-start lg:justify-between gap-6">
                      {/* Main Content */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {booking.provider?.businessName ||
                                booking.provider?.name ||
                                "Unknown Provider"}
                            </h3>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                              {booking.service?.title || "Unknown Service"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                              {booking.service?.category || ""}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(
                                booking.status || "pending"
                              )}`}
                            >
                              {getStatusIcon(booking.status || "pending")}
                              <span className="ml-1 capitalize">
                                {booking.status}
                              </span>
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${getPaymentStatusColor(
                                booking.paymentStatus || "unpaid"
                              )}`}
                            >
                              <CreditCard className="w-3 h-3 mr-1" />
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span>
                              {booking.startDate
                                ? new Date(
                                    booking.startDate
                                  ).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span>{booking.service?.location || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <User className="w-4 h-4 text-emerald-600" />
                            <span>{booking.provider?.name || "—"}</span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-linear-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10 rounded-lg p-4 space-y-3 border border-emerald-100 dark:border-emerald-900/30">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Booking ID:
                            </span>
                            <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                              #{booking._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Booked On:
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(booking.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Last Updated:
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(booking.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          {booking.notes && (
                            <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800">
                              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                                Notes:
                              </span>
                              <span className="text-sm text-gray-900 dark:text-white">
                                {booking.notes}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="lg:w-72 space-y-4">
                        {/* Price Card */}
                        <Card className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
                          <CardContent className="p-6 text-center space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Total Amount
                            </p>
                            <p className="text-4xl font-bold text-transparent bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text">
                              KSh {(booking.totalPrice || 0).toLocaleString()}
                            </p>
                            <Badge
                              variant="outline"
                              className={`${getPaymentStatusColor(
                                booking.paymentStatus || "unpaid"
                              )} mt-2`}
                            >
                              {booking.paymentStatus?.toUpperCase()}
                            </Badge>
                          </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          <Button
                            disabled
                            size="lg"
                            className="w-full bg-gray-400 cursor-not-allowed opacity-60 relative group"
                            title="Payment functionality coming soon in Q1 2026"
                          >
                            <CreditCard className="w-5 h-5 mr-2" />
                            Make Payment
                            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                              Soon
                            </span>
                          </Button>

                          {booking.status !== "completed" &&
                            booking.status !== "cancelled" && (
                              <Button
                                onClick={() => handleCancelBooking(booking._id)}
                                variant="outline"
                                size="lg"
                                className="w-full border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <X className="w-5 h-5 mr-2" />
                                Cancel Booking
                              </Button>
                            )}

                          <Button
                            onClick={() =>
                              handleMessage(
                                booking.provider?.businessName || "Provider"
                              )
                            }
                            variant="outline"
                            size="lg"
                            className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          >
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Message Provider
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No bookings found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "You don't have any bookings in this category"}
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveTab("all");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
