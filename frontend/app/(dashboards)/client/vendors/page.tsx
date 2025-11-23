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
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BrowseVendors() {
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  
  const [vendors] = useState([
    {
      id: "1",
      name: "Elite Catering Co.",
      category: "Catering",
      location: "Nairobi",
      rating: 4.9,
      reviews: 234,
      price: "KSh 5K-20K per plate",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561522?w=400&h=300&fit=crop",
      description:
        "Premium catering services for weddings and corporate events with over 10 years of experience.",
      isFavorite: false,
      availability: "Available",
      responseTime: "Within 2 hours",
    },
    {
      id: "2",
      name: "Pro Photographers",
      category: "Photography",
      location: "Mombasa",
      rating: 4.8,
      reviews: 189,
      price: "KSh 3K-10K per hour",
      image:
        "https://images.unsplash.com/photo-1606011334315-76b8191da5f3?w=400&h=300&fit=crop",
      description: "Professional photography for all occasions with state-of-the-art equipment.",
      isFavorite: false,
      availability: "Available",
      responseTime: "Within 4 hours",
    },
    {
      id: "3",
      name: "Sound Masters Pro",
      category: "Sound & DJ",
      location: "Kisumu",
      rating: 4.7,
      reviews: 156,
      price: "KSh 2K-8K per event",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
      description: "Professional DJ and sound equipment rental for memorable events.",
      isFavorite: false,
      availability: "Limited",
      responseTime: "Within 6 hours",
    },
    {
      id: "4",
      name: "Floral Dreams",
      category: "Decoration",
      location: "Nairobi",
      rating: 4.9,
      reviews: 201,
      price: "KSh 3K-15K per arrangement",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      description: "Beautiful floral arrangements and decorations for any event theme.",
      isFavorite: false,
      availability: "Available",
      responseTime: "Within 3 hours",
    },
    {
      id: "5",
      name: "Event Planners Plus",
      category: "Planning",
      location: "Nairobi",
      rating: 4.8,
      reviews: 167,
      price: "KSh 10K-50K per event",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
      description: "Full-service event planning from concept to execution.",
      isFavorite: false,
      availability: "Available",
      responseTime: "Within 1 hour",
    },
    {
      id: "6",
      name: "Luxury Venue Rentals",
      category: "Venue",
      location: "Mombasa",
      rating: 4.7,
      reviews: 143,
      price: "KSh 20K-100K per day",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550649ee4?w=400&h=300&fit=crop",
      description: "Premium venues for weddings, corporate events, and special occasions.",
      isFavorite: false,
      availability: "Limited",
      responseTime: "Within 12 hours",
    },
  ]);

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

  const handleBooking = (vendor: string) => {
    toast.info(`Starting booking process for ${vendor}`);
  };

  const handleMessage = (vendor: string) => {
    toast.info(`Opening conversation with ${vendor}`);
  };

  // Filter vendors based on search term and selected category
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="border-emerald-600 text-emerald-600"
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-emerald-600 text-emerald-600"
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
                    {selectedCategory === "all" ? "All Categories" : selectedCategory}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={selectedCategory === category.value ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}
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
                <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Search: {searchTerm}
                    <button title="btn" onClick={() => setSearchTerm("")} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Category: {selectedCategory}
                    <button title="btn" onClick={() => setSelectedCategory("all")} className="ml-1">
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
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-0 group"
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
                      <Heart className={`w-5 h-5 ${favorites.has(vendor.id) ? "fill-current" : ""}`} />
                    </button>
                    <Badge className="absolute bottom-3 left-3 bg-emerald-600 hover:bg-emerald-700">
                      {vendor.category}
                    </Badge>
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${
                      vendor.availability === "Available" 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" 
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    }`}>
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
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-0"
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
                        <Heart className={`w-5 h-5 ${favorites.has(vendor.id) ? "fill-current" : ""}`} />
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
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              vendor.availability === "Available" 
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" 
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            }`}>
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
          {filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No vendors found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}