"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Star,
  Heart,
  MapPin,
  DollarSign,
  MessageSquare,
  ArrowLeft,
  Clock,
  Users,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Package,
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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { bookingsAPI, servicesAPI, authAPI } from "@/lib/api";

interface ServiceType {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration?: number;
  category: string;
  pricingType: string;
  location: string;
  images: string[];
  capacity?: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isActive: boolean;
}

interface VendorType {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  businessDescription?: string;
  category?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  profileImage?: string;
}

export default function VendorServicesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const vendorId = params.vendorId as string;

  const [vendor, setVendor] = useState<VendorType | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    location: "",
    guestCount: "",
    notes: "",
    eventType: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchVendorAndServices = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch vendor details first
        let vendorData = null;
        try {
          const vendorResponse = await authAPI.getVendorById(vendorId);
          if (vendorResponse.data.success) {
            vendorData = vendorResponse.data.data;
            setVendor(vendorData);
          }
        } catch (vendorError: any) {
          console.error("Error fetching vendor:", vendorError);
          // If vendor not found in vendors endpoint, try general user endpoint as fallback
          if (vendorError?.response?.status === 404) {
            try {
              // Try to get from general vendors list
              const vendorsResponse = await authAPI.getVendors({
                isActive: true,
              });
              if (vendorsResponse.data.success) {
                const foundVendor = vendorsResponse.data.data.find(
                  (v: any) => v._id === vendorId
                );
                if (foundVendor) {
                  vendorData = foundVendor;
                  setVendor(vendorData);
                } else {
                  setError("Vendor not found");
                  return;
                }
              } else {
                setError("Vendor not found");
                return;
              }
            } catch (fallbackError) {
              setError("Vendor not found");
              return;
            }
          } else {
            throw vendorError;
          }
        }
        console.log("Fetched vendor data:", vendorData);

        // Fetch services for any found vendor (remove role check as it may not be in the data)
        if (vendorData) {
          try {
            const servicesResponse = await servicesAPI.getByProvider(vendorData._id);
            if (servicesResponse.data.success) {
              setServices(servicesResponse.data.data || []);
              console.log("vendor services:", servicesResponse.data.data);
            }
          } catch (servicesError: any) {
            console.error("Error fetching services:", servicesError);
            // Services error is not critical - vendor might have no services
            setServices([]);
          }
        }
      } catch (error: any) {
        console.error("Error fetching vendor data:", error);
        const statusCode = error?.response?.status;
        if (statusCode === 403) {
          setError(
            "Access denied. You don't have permission to view this vendor."
          );
        } else if (statusCode === 404) {
          setError("Vendor not found");
        } else {
          setError(
            error?.response?.data?.message ||
              "Failed to load vendor information"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorAndServices();
    }
  }, [vendorId]);

  const handleServiceBooking = (service: ServiceType) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  const createBooking = async () => {
    if (!selectedService || !vendor || !user?._id) return;

    setBookingLoading(true);
    try {
      const guestCount = parseInt(bookingData.guestCount) || 1;
      const calculatedAmount =
        selectedService.pricingType === "per-person"
          ? selectedService.price * guestCount
          : selectedService.price;

      const bookingPayload = {
        serviceId: selectedService._id,
        vendorId: vendor._id,
        serviceTitle: selectedService.title,
        serviceCategory: selectedService.category,
        servicePricingType: selectedService.pricingType,
        serviceLocation: selectedService.location,
        vendorName: vendor.businessName || vendor.name,
        vendorEmail: vendor.email,
        vendorPhone: vendor.phone || "",
        clientId: user._id,
        clientName: user.name,
        clientEmail: user.email,
        date: bookingData.date,
        time: bookingData.time,
        location:
          bookingData.location || selectedService.location || vendor.location,
        guestCount: guestCount,
        eventType: bookingData.eventType,
        notes: bookingData.notes,
        basePrice: selectedService.price,
        amount: calculatedAmount,
        status: "pending",
        duration: selectedService.duration,
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

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50/30 to-green-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-4 border-emerald-200 dark:border-emerald-800 mx-auto"></div>
              <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-emerald-600 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Loading vendor services...
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Please wait while we fetch the latest information
              </p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !vendor) {
    return (
      <ProtectedRoute allowedRoles={["client"]}>
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50/30 to-green-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {error || "Vendor not found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              The vendor you're looking for doesn't exist, has been removed, or
              you don't have permission to view their services.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.back()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/client/vendors")}
              >
                Browse Vendors
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50/30 to-green-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {vendor.businessName || vendor.name} - Services
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from our available services and packages
              </p>
            </div>
          </div>

          {/* Vendor Info Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="h-20 w-20 shrink-0">
                  <AvatarImage src={vendor.profileImage} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {(vendor.businessName || vendor.name)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {vendor.businessName || vendor.name}
                      </h2>
                      <div className="flex items-center gap-4 mb-3">
                        {vendor.category && (
                          <Badge variant="secondary">{vendor.category}</Badge>
                        )}
                        {(vendor.rating || vendor.reviewCount) && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">
                              {vendor.rating || 0}
                            </span>
                            <span className="text-gray-500">
                              ({vendor.reviewCount || 0} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {vendor.businessDescription ||
                          `Professional services by ${vendor.name}`}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {vendor.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {vendor.location}
                          </div>
                        )}
                        {vendor.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {vendor.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {services
                .filter((service) => service.isActive)
                .map((service) => (
                  <Card
                    key={service._id}
                    className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-gray-900 dark:text-white mb-2">
                            {service.title}
                          </CardTitle>
                          <Badge className="mb-3">{service.category}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">
                            KSh {service.price.toLocaleString()}
                          </div>
                          {service.pricingType && (
                            <div className="text-sm text-gray-500">
                              {service.pricingType === "per-hour"
                                ? "per hour"
                                : service.pricingType === "per-person"
                                ? "per person"
                                : service.pricingType === "fixed"
                                ? "fixed price"
                                : service.pricingType}
                            </div>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Service Details */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {service.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.floor(service.duration / 60)}h{" "}
                            {service.duration % 60}m
                          </div>
                        )}
                        {service.capacity && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Up to {service.capacity} people
                          </div>
                        )}
                        {service.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {service.rating} ({service.reviewCount || 0})
                          </div>
                        )}
                      </div>

                      {/* Tags/Features */}
                      {service.tags && service.tags.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                            Tags:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {service.tags.slice(0, 4).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {service.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{service.tags.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Location */}
                      {service.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{service.location}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleServiceBooking(service)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book This Service
                        </Button>
                        <Button variant="outline" size="icon">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Services Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This vendor hasn't added any services yet. Please check back
                  later or contact them directly.
                </p>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Vendor
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact Section */}
          <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Need a custom package?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Contact {vendor.businessName || vendor.name} directly to
                  discuss custom requirements and pricing
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Dialog */}
        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book Service</DialogTitle>
              <DialogDescription>
                {selectedService &&
                  `Book ${selectedService.title} with ${
                    vendor.businessName || vendor.name
                  }`}
              </DialogDescription>
            </DialogHeader>

            {selectedService && (
              <div className="space-y-4">
                {/* Service Info */}
                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {selectedService.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedService.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-2xl font-bold text-emerald-600">
                      KSh {selectedService.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedService.pricingType === "per-hour"
                        ? "per hour"
                        : selectedService.pricingType === "per-person"
                        ? "per person"
                        : selectedService.pricingType === "fixed"
                        ? "fixed price"
                        : selectedService.pricingType}
                    </span>
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
                      placeholder={`${selectedService.category} Event, Corporate Meeting, etc.`}
                      value={bookingData.eventType}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          eventType: e.target.value,
                        }))
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Suggested: {selectedService.category} related events
                    </p>
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
                      max={selectedService.capacity}
                      placeholder="Expected number of guests"
                      value={bookingData.guestCount}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          guestCount: e.target.value,
                        }))
                      }
                    />
                    {selectedService.capacity && (
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum {selectedService.capacity} people for this
                        service
                      </p>
                    )}
                  </div>

                  {/* Price Calculation */}
                  {bookingData.guestCount &&
                    selectedService.pricingType === "per-person" && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Total Cost Estimate:
                          </span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            KSh{" "}
                            {(
                              selectedService.price *
                              parseInt(bookingData.guestCount)
                            ).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          KSh {selectedService.price.toLocaleString()} ×{" "}
                          {bookingData.guestCount} guests
                        </p>
                      </div>
                    )}

                  {/* Service Tags */}
                  {selectedService.tags && selectedService.tags.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">
                        Service Features
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedService.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

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

                {/* Booking Summary */}
                {bookingData.date &&
                  bookingData.time &&
                  bookingData.eventType && (
                    <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Booking Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Service:
                          </span>
                          <span className="font-medium">
                            {selectedService.title}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Date & Time:
                          </span>
                          <span className="font-medium">
                            {new Date(bookingData.date).toLocaleDateString()} at{" "}
                            {bookingData.time}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Event Type:
                          </span>
                          <span className="font-medium">
                            {bookingData.eventType}
                          </span>
                        </div>
                        {bookingData.guestCount && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Guests:
                            </span>
                            <span className="font-medium">
                              {bookingData.guestCount}
                            </span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Total Amount:
                          </span>
                          <span className="font-bold text-emerald-600">
                            KSh{" "}
                            {(selectedService.pricingType === "per-person" &&
                            bookingData.guestCount
                              ? selectedService.price *
                                parseInt(bookingData.guestCount)
                              : selectedService.price
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => setBookingOpen(false)}
                    className="flex-1 rounded-xl hover:bg-gray-50 transition-colors py-3"
                    disabled={bookingLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createBooking}
                    className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3"
                    disabled={
                      bookingLoading ||
                      !bookingData.date ||
                      !bookingData.time ||
                      !bookingData.eventType
                    }
                  >
                    {bookingLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Confirm Booking
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
