"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Star,
  Heart,
  MapPin,
  DollarSign,
  MessageSquare,
  Share2,
  Eye,
  Search,
  Filter,
  X,
  ChevronDown,
  Grid3X3,
  List,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { bookingsAPI } from "@/lib/api";

interface VendorType {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  description: string;
  isFavorite: boolean;
  availability: string;
  responseTime: string;
  email?: string;
  phone?: string;
}

export default function BrowseVendors() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorType | null>(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    location: "",
    guestCount: "",
    notes: "",
    eventType: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await authAPI.getVendors();

        console.log("Vendors response:", response);

        if (response.data && response.data.success) {
          // Transform API data to match component expectations
          const transformedVendors: VendorType[] = response.data.data.map(
            (vendor: any) => ({
              id: vendor._id || vendor.id,
              name: vendor.businessName || vendor.name || "Unknown Vendor",
              category:
                vendor.serviceCategory || vendor.category || "Service Provider",
              location:
                vendor.city || vendor.location || "Location not specified",
              rating: vendor.rating || 4.5,
              reviews: vendor.reviewsCount || 0,
              price: vendor.pricing || "Contact for pricing",
              image:
                vendor.profileImage ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
              description:
                vendor.businessDescription ||
                vendor.bio ||
                vendor.description ||
                "Professional service provider",
              isFavorite: false,
              availability: vendor.availability || "Available",
              responseTime: vendor.responseTime || "Contact for response time",
              email: vendor.email,
              phone: vendor.phone,
            })
          );
          setVendors(transformedVendors);
          console.log("Vendors loaded:", transformedVendors);
        } else {
          console.error("Invalid vendors response:", response);
          setError("Invalid response format");
        }
      } catch (err: any) {
        console.error("Error fetching vendors:", err);

        let errorMessage = "Failed to load vendors";
        if (err.response) {
          console.error(
            "Server error:",
            err.response.status,
            err.response.data
          );
          if (err.response.status === 401) {
            errorMessage = "Authentication required. Please log in again.";
          } else if (err.response.status === 403) {
            errorMessage =
              "Access denied. You don't have permission to view vendors.";
          } else {
            errorMessage = err.response.data?.message || errorMessage;
          }
        } else if (err.request) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        }

        setError(errorMessage);
        toast.error("Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVendors();
    }
  }, [user]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Catering", label: "Catering" },
    { value: "Photography", label: "Photography" },
    { value: "Sound & DJ", label: "Sound & DJ" },
    { value: "Decoration", label: "Decoration" },
    { value: "Planning", label: "Event Planning" },
    { value: "Venue", label: "Venue" },
  ];

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.success("Removed from favorites");
    } else {
      newFavorites.add(id);
      toast.success("Added to favorites");
    }
    setFavorites(newFavorites);
  };

  const handleBooking = (vendorName: string) => {
    const vendor = vendors.find((v) => v.name === vendorName);
    if (vendor) {
      // Navigate to vendor services page instead of opening dialog directly
      router.push(`/client/vendors/${vendor.id}/services`);
    }
  };

  const createBooking = async () => {
    if (!selectedVendor || !user?._id) return;

    setBookingLoading(true);
    try {
      const bookingPayload = {
        serviceId: selectedVendor.id,
        vendorId: selectedVendor.id, // In a real app, this would be separate
        serviceTitle: selectedVendor.category,
        vendorName: selectedVendor.name,
        vendorEmail: "vendor@example.com", // This would come from vendor data
        clientId: user._id,
        clientName: user.name,
        clientEmail: user.email,
        date: bookingData.date,
        time: bookingData.time,
        location: bookingData.location || selectedVendor.location,
        guestCount: parseInt(bookingData.guestCount) || 1,
        eventType: bookingData.eventType,
        notes: bookingData.notes,
        amount: parseInt(selectedVendor.price.replace(/[^0-9]/g, "")) || 0,
        status: "pending",
      };

      await bookingsAPI.create(bookingPayload);

      toast.success("Booking created successfully!");
      setBookingOpen(false);
      setBookingData({
        date: "",
        time: "",
        location: "",
        guestCount: "",
        notes: "",
        eventType: "",
      });

      // Redirect to bookings page
      router.push("/client/bookings");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleMessage = (vendorName: string) => {
    // Find the vendor object to get more details
    const vendor = vendors.find((v) => v.name === vendorName);

    if (!vendor) {
      toast.error("Vendor not found");
      return;
    }

    // Store vendor info in sessionStorage for the messages page to use
    // The messages page will check for existing conversations first
    sessionStorage.setItem(
      "newConversationVendor",
      JSON.stringify({
        id: vendor.id,
        name: vendor.name,
        image: vendor.image,
        category: vendor.category,
        email: vendor.email,
        checkExisting: true, // Flag to indicate we should check for existing conversations
      })
    );

    // Navigate to messages page
    router.push("/client/messages");

    toast.success(`Opening conversation with ${vendorName}`);
  };

  // Filter vendors based on search term and selected category
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || vendor.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="flex-1 min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-green-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
                Loading vendors...
              </p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="flex-1 min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-green-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="text-center py-20">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl max-w-md mx-auto">
                <h3 className="font-semibold text-lg mb-2">
                  Error loading vendors
                </h3>
                <p className="text-sm mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-green-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Browse Vendors
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover amazing service providers for your events
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid3X3 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search vendors by name, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
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

              {/* Category Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-48 justify-between border-emerald-200 text-gray-700 dark:text-gray-300"
                  >
                    {selectedCategory === "all"
                      ? "All Categories"
                      : selectedCategory}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={
                        selectedCategory === category.value
                          ? "bg-emerald-50 dark:bg-emerald-900/20"
                          : ""
                      }
                    >
                      {category.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategory !== "all") && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active filters:
                </span>
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                  >
                    Search: {searchTerm}
                    <button
                      title="btn"
                      onClick={() => setSearchTerm("")}
                      className="ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                  >
                    Category: {selectedCategory}
                    <button
                      title="btn"
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredVendors.length} of {vendors.length} vendors
            </div>
          </div>

          {/* Vendors Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <Card
                  key={vendor.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      title="btn"
                      onClick={() => toggleFavorite(vendor.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                        favorites.has(vendor.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/80 text-gray-600 hover:bg-white"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.has(vendor.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <Badge className="absolute bottom-3 left-3 bg-emerald-600 hover:bg-emerald-700">
                      {vendor.category}
                    </Badge>
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${
                        vendor.availability === "Available"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                      }`}
                    >
                      {vendor.availability}
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white truncate">
                          {vendor.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 text-sm">
                          <MapPin className="w-4 h-4" />
                          {vendor.location}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {vendor.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({vendor.reviews} reviews)
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {vendor.description}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        {vendor.price}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Response time: {vendor.responseTime}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleMessage(vendor.name)}
                        variant="outline"
                        size="sm"
                        className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button
                        onClick={() => handleBooking(vendor.name)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Book Now
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-gray-600 dark:text-gray-400"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <Card
                  key={vendor.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        title="btn"
                        onClick={() => toggleFavorite(vendor.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                          favorites.has(vendor.id)
                            ? "bg-red-500 text-white"
                            : "bg-white/80 text-gray-600 hover:bg-white"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(vendor.id) ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {vendor.name}
                            </h3>
                            <Badge className="bg-emerald-600 hover:bg-emerald-700">
                              {vendor.category}
                            </Badge>
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                vendor.availability === "Available"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                              }`}
                            >
                              {vendor.availability}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {vendor.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {vendor.rating}
                              </span>
                              <span>({vendor.reviews} reviews)</span>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {vendor.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                              <DollarSign className="w-4 h-4 text-emerald-600" />
                              {vendor.price}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <MessageSquare className="w-3 h-3" />
                              Response time: {vendor.responseTime}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:w-48">
                          <Button
                            onClick={() => handleMessage(vendor.name)}
                            variant="outline"
                            size="sm"
                            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button
                            onClick={() => handleBooking(vendor.name)}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Book Now
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 dark:text-gray-400"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {filteredVendors.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {vendors.length === 0
                  ? "No vendors available"
                  : "No vendors found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {vendors.length === 0
                  ? "There are currently no registered vendors. Check back later."
                  : "Try adjusting your search or filter criteria"}
              </p>
              {vendors.length > 0 && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              {selectedVendor &&
                `Book ${selectedVendor.category} with ${selectedVendor.name}`}
            </DialogDescription>
          </DialogHeader>

          {selectedVendor && (
            <div className="space-y-4">
              {/* Service Info */}
              <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedVendor.image} />
                    <AvatarFallback>
                      {selectedVendor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedVendor.name}
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      {selectedVendor.category}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedVendor.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingData.date}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={bookingData.time}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Input
                    id="eventType"
                    placeholder="Wedding, Birthday, Corporate Event, etc."
                    value={bookingData.eventType}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        eventType: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Event location (optional)"
                    value={bookingData.location}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="guestCount">Number of Guests</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    min="1"
                    placeholder="Expected number of guests"
                    value={bookingData.guestCount}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        guestCount: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Special Requirements</Label>
                  <textarea
                    id="notes"
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Any special requirements or notes..."
                    value={bookingData.notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setBookingData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setBookingOpen(false)}
                  className="flex-1"
                  disabled={bookingLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createBooking}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={
                    bookingLoading ||
                    !bookingData.date ||
                    !bookingData.time ||
                    !bookingData.eventType
                  }
                >
                  {bookingLoading ? "Creating..." : "Create Booking"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}