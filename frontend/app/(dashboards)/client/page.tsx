"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ClientDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "My Bookings",
      value: "8",
      change: "+2 this month",
      icon: Calendar,
      color: "green",
      description: "Active bookings",
    },
    {
      title: "Upcoming Events",
      value: "3",
      change: "Next: Dec 15",
      icon: Clock,
      color: "blue",
      description: "Scheduled events",
    },
    {
      title: "Saved Vendors",
      value: "24",
      change: "+5 recently",
      icon: Heart,
      color: "red",
      description: "Favorited",
    },
    {
      title: "Total Spent",
      value: "KSh 180K",
      change: "+15% this year",
      icon: TrendingUp,
      color: "purple",
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

  const favoriteVendors = [
    {
      name: "Sarah's Catering",
      category: "Catering",
      rating: 4.9,
      reviews: 234,
    },
    {
      name: "Elite Photographers",
      category: "Photography",
      rating: 4.8,
      reviews: 189,
    },
    {
      name: "Sound Masters Pro",
      category: "Sound & DJ",
      rating: 4.7,
      reviews: 156,
    },
    {
      name: "Floral Dreams",
      category: "Decoration",
      rating: 4.9,
      reviews: 201,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
          {/* Fun Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 shadow-xl">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <PartyPopper className="w-24 h-24 text-white/20 animate-bounce" />
            </div>
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Let's Plan Something Amazing! 🎉
                </h2>
                <p className="text-blue-50 text-lg">
                  Welcome back, {user?.name || "Guest"}! Your dream event is
                  just a click away.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </CardDescription>
                    <div
                      className={`p-2 rounded-full ${
                        stat.color === "green"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : stat.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900/20"
                          : stat.color === "red"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : "bg-purple-100 dark:bg-purple-900/20"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          stat.color === "green"
                            ? "text-green-600 dark:text-green-400"
                            : stat.color === "blue"
                            ? "text-blue-600 dark:text-blue-400"
                            : stat.color === "red"
                            ? "text-red-600 dark:text-red-400"
                            : "text-purple-600 dark:text-purple-400"
                        }`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.change}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Upcoming Events */}
            <Card className="xl:col-span-2 border-2 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Upcoming Events
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Your scheduled bookings
                    </CardDescription>
                  </div>
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all bg-white dark:bg-gray-800"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex flex-col items-center justify-center text-white">
                          <span className="text-xs font-medium">
                            {event.date.split(" ")[0]}
                          </span>
                          <span className="text-2xl font-bold">
                            {event.date.split(" ")[1].replace(",", "")}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {event.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {event.vendor}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${
                              event.status === "confirmed"
                                ? "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                                : "border-yellow-500 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                            }`}
                          >
                            {event.status === "confirmed" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                  View All Bookings
                </button>
              </CardContent>
            </Card>

            {/* Favorite Vendors */}
            <Card className="border-2 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Favorite Vendors
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Your saved vendors
                    </CardDescription>
                  </div>
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {favoriteVendors.map((vendor, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {vendor.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {vendor.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {vendor.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {vendor.rating}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                  Browse Vendors
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
