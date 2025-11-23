"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Heart,
  Star,
  MapPin,
  DollarSign,
  Trash2,
  MessageSquare,
  Eye,
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
import { useState } from "react";
import { toast } from "sonner";

export default function ClientFavorites() {
  const [favorites, setFavorites] = useState([
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
        "Premium catering services for weddings and corporate events",
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
      description: "Professional photography for all occasions",
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
      description: "Professional DJ and sound equipment rental",
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
      description: "Beautiful floral arrangements and decorations",
    },
  ]);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((f) => f.id !== id));
    toast.success("Removed from favorites");
  };

  const handleBooking = (vendor: string) => {
    toast.info(`Starting booking process for ${vendor}`);
  };

  const handleMessage = (vendor: string) => {
    toast.info(`Opening conversation with ${vendor}`);
  };

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen bg-linear-to-br from-emerald-50 via-teal-50/30 to-green-50/20 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Heart className="w-8 h-8 text-emerald-600 fill-emerald-600" />
              My Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {favorites.length} vendors saved to your favorites
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900">
              <CardContent className="pt-6">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    Total Favorites
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {favorites.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900">
              <CardContent className="pt-6">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    Avg. Rating
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 flex items-center gap-2">
                    {(
                      favorites.reduce((sum, f) => sum + f.rating, 0) /
                      favorites.length
                    ).toFixed(1)}
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Favorites Grid */}
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((vendor) => (
                <Card
                  key={vendor.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-2 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute bottom-3 left-3 bg-emerald-600">
                      {vendor.category}
                    </Badge>
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
                      <button
                        onClick={() => removeFavorite(vendor.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                        <DollarSign className="w-4 h-4 text-green-600" />
                        {vendor.price}
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
                      className="w-full text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-900">
              <CardContent className="py-12 text-center">
                <Heart className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No favorites yet
                </p>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Browse Vendors
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
