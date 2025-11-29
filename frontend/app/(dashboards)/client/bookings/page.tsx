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
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceTitle?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorPhone?: string;
  date?: string;
  time?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  amount?: number;
  location?: string;
  guestCount?: number;
  notes?: string;
  paymentStatus?: "paid" | "partial" | "unpaid";
  eventType?: string;
  duration?: string;
  specialRequests?: string;
  rating?: number | null;
  reviewed?: boolean;
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
      (booking.vendorName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (booking.serviceTitle || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (booking.location || "").toLowerCase().includes(searchTerm.toLowerCase());

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
          {booking.vendorName || "Unknown Vendor"}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {booking.serviceTitle || "Unknown Service"}
        </p>
      </div>

      <div className="space-y-2">
        <Button
          onClick={() => handleMessage(booking.vendorName || "Vendor")}
          variant="outline"
          size="sm"
          className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Message
        </Button>

        {booking.status === "completed" && !booking.reviewed && (
          <Button
            onClick={() => handleReview(booking._id)}
            variant="outline"
            size="sm"
            className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <Star className="w-4 h-4 mr-2" />
            Leave Review
          </Button>
        )}

        {booking.status !== "completed" && booking.status !== "cancelled" && (
          <>
            <Button
              onClick={() => handleReschedule(booking._id)}
              variant="outline"
              size="sm"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Edit className="w-4 h-4 mr-2" />
              Reschedule
            </Button>
            <Button
              onClick={() => handleCancelBooking(booking._id)}
              variant="outline"
              size="sm"
              className="w-full border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </>
        )}

        {booking.paymentStatus === "partial" && (
          <Button
            onClick={() => handleMakePayment(booking._id)}
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Payment
          </Button>
        )}

        {booking.status === "completed" && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen bg-linear-to-br from-emerald-50 via-green-50/30 to-teal-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
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
                        .reduce((sum, b: Booking) => sum + (b.amount || 0), 0)
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

          {/* Search and Filter Section */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 pr-4 py-2 w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm sm:text-base"
                  />
                  {searchTerm && (
                    <button
                      title="btn"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-emerald-200 text-gray-700 dark:text-gray-300 w-full sm:w-auto"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Filter</span>
                      <ChevronDown className="w-4 h-4 sm:ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
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
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-0"
                >
                  <div className="p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {booking.vendorName || "Unknown Vendor"}
                          </h3>
                          <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                            {booking.serviceTitle || "Unknown Service"}
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
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {booking.date
                              ? new Date(booking.date).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {booking.time || "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {booking.location || "—"}
                          </span>
                        </div>
                      </div>

                      {/* Additional Info - Collapsible on Mobile */}
                      <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 space-y-2">
                        {booking.eventType && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Event Type:
                            </span>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {booking.eventType}
                            </span>
                          </div>
                        )}
                        {booking.duration && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Duration:
                            </span>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {booking.duration}
                            </span>
                          </div>
                        )}
                        {booking.guestCount && booking.guestCount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Guests:
                            </span>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {booking.guestCount} attendees
                            </span>
                          </div>
                        )}
                        {(booking.vendorName ||
                          booking.vendorPhone ||
                          booking.vendorEmail) && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Contact:
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-900 dark:text-white">
                                {booking.vendorName || "Vendor"}
                              </span>
                              {booking.vendorPhone && (
                                <a
                                  href={`tel:${booking.vendorPhone}`}
                                  className="text-emerald-600 hover:text-emerald-700"
                                  title="Call vendor"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                              )}
                              {booking.vendorEmail && (
                                <a
                                  href={`mailto:${booking.vendorEmail}`}
                                  className="text-emerald-600 hover:text-emerald-700"
                                  title="Email vendor"
                                >
                                  <Mail className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            KSh {(booking.amount || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Total Cost
                          </p>
                        </div>

                        {/* Mobile Actions using Sheet */}
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            >
                              <Menu className="w-4 h-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="bottom" className="h-[60vh]">
                            <SheetHeader>
                              <SheetTitle>Booking Actions</SheetTitle>
                              <SheetDescription>
                                Manage your booking for{" "}
                                {booking.vendorName || "Unknown Vendor"}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                              <MobileActionSheet booking={booking} />
                            </div>
                          </SheetContent>
                        </Sheet>
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
                              {booking.vendorName || "Unknown Vendor"}
                            </h3>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                              {booking.serviceTitle || "Unknown Service"}
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
                              {booking.date
                                ? new Date(booking.date).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            <span>{booking.time || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span>{booking.location || "—"}</span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 space-y-2">
                          {booking.eventType && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Event Type:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.eventType}
                              </span>
                            </div>
                          )}
                          {booking.duration && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Duration:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.duration}
                              </span>
                            </div>
                          )}
                          {booking.guestCount && booking.guestCount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Guests:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.guestCount} attendees
                              </span>
                            </div>
                          )}
                          {(booking.vendorName ||
                            booking.vendorPhone ||
                            booking.vendorEmail) && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Contact:
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {booking.vendorName || "Vendor"}
                                </span>
                                {booking.vendorPhone && (
                                  <a
                                    href={`tel:${booking.vendorPhone}`}
                                    className="text-emerald-600 hover:text-emerald-700"
                                    title="Call vendor"
                                  >
                                    <Phone className="w-3 h-3" />
                                  </a>
                                )}
                                {booking.vendorEmail && (
                                  <a
                                    href={`mailto:${booking.vendorEmail}`}
                                    className="text-emerald-600 hover:text-emerald-700"
                                    title="Email vendor"
                                  >
                                    <Mail className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                          {booking.notes && (
                            <div className="flex items-start justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Notes:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-xs">
                                {booking.notes}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="lg:w-64 space-y-4">
                        {/* Price */}
                        <div className="text-center lg:text-right">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            KSh {(booking.amount || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Total Cost
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() =>
                              handleMessage(booking.vendorName || "Vendor")
                            }
                            variant="outline"
                            size="sm"
                            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 w-full"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>

                          {booking.status === "completed" &&
                            !booking.reviewed && (
                              <Button
                                onClick={() => handleReview(booking._id)}
                                variant="outline"
                                size="sm"
                                className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 w-full"
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Leave Review
                              </Button>
                            )}

                          {booking.status !== "completed" &&
                            booking.status !== "cancelled" && (
                              <>
                                <Button
                                  onClick={() => handleReschedule(booking._id)}
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 w-full"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Reschedule
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleCancelBooking(booking._id)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </>
                            )}

                          {booking.paymentStatus === "partial" && (
                            <Button
                              onClick={() => handleMakePayment(booking._id)}
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Complete Payment
                            </Button>
                          )}

                          {booking.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Invoice
                            </Button>
                          )}
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
