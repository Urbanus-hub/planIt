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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

export default function ClientDashboard() {
  const { user } = useAuth();
  const [galleryFilter, setGalleryFilter] = useState("all");

  const stats = [
    {
      title: "My Bookings",
      value: "8",
      change: "+2 this month",
      icon: Calendar,
      colorClass: "text-green-500",
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

  // Featured vendors with their recent work
  const featuredVendors = [
    {
      id: 1,
      name: "Sarah's Catering",
      category: "Catering",
      rating: 4.9,
      reviews: 234,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561522?w=400&h=300&fit=crop",
      recentWork: {
        title: "Elegant Wedding Reception",
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561522?w=400&h=300&fit=crop",
        date: "Nov 28, 2025",
      },
      icon: Utensils,
    },
    {
      id: 2,
      name: "Elite Photographers",
      category: "Photography",
      rating: 4.8,
      reviews: 189,
      image:
        "https://images.unsplash.com/photo-1606011334315-76b8191da5f3?w=400&h=300&fit=crop",
      recentWork: {
        title: "Corporate Gala",
        image:
          "https://images.unsplash.com/photo-1606011334315-76b8191da5f3?w=400&h=300&fit=crop",
        date: "Nov 15, 2025",
      },
      icon: Camera,
    },
    {
      id: 3,
      name: "Sound Masters Pro",
      category: "Sound & DJ",
      rating: 4.7,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
      recentWork: {
        title: "Birthday Celebration",
        image:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
        date: "Nov 5, 2025",
      },
      icon: Music,
    },
    {
      id: 4,
      name: "Floral Dreams",
      category: "Decoration",
      rating: 4.9,
      reviews: 201,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      recentWork: {
        title: "Garden Party Setup",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        date: "Oct 20, 2025",
      },
      icon: Palette,
    },
  ];

  // Gallery items for successful events
  const galleryItems = [
    {
      id: 1,
      title: "Luxury Wedding at Serena Hotel",
      category: "wedding",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
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
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop",
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
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop",
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
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      vendor: "Sound Masters Pro",
      date: "Jul 15, 2025",
      description:
        "A memorable Sweet 16 party with DJ, dancing, and entertainment.",
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

  const filteredGalleryItems = galleryItems.filter(
    (item) => galleryFilter === "all" || item.category === galleryFilter
  );

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen w-full">
        {/* Hero Section with Professional Emerald Overlay */}
        <div className="relative h-[60vh] w-full overflow-hidden rounded-lg">
          <Image
            src="/herobg.png"
            alt="Hero Background"
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-linear-to-r from-emerald-900/85 to-teal-800/75" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Welcome back, {user?.name || "Guest"}!
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              Your dream event is just a click away. Let's create something
              memorable together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 py-3 shadow-lg font-semibold transition-all"
              >
                Explore Vendors
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white hover:text-emerald-900 rounded-full px-8 py-3 font-semibold transition-all"
              >
                Plan My Event
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="shadow-md hover:shadow-xl transition-all border-l-4 border-emerald-500 hover:border-emerald-600 bg-linear-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/20"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.colorClass}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stat.value}
                  </div>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium mt-1">
                    {stat.change}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Vendors Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Featured Vendors
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Discover amazing services for your event
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  View All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVendors.map((vendor) => (
                <Card
                  key={vendor.id}
                  className="overflow-hidden shadow-md hover:shadow-xl transition-all border-0 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={vendor.recentWork.image}
                      alt={vendor.recentWork.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      {getCategoryIcon(vendor.category)}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs"
                      >
                        {vendor.category}
                      </Badge>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {vendor.rating}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {vendor.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                      {vendor.recentWork.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{vendor.recentWork.date}</span>
                      <span>{vendor.reviews} reviews</span>
                    </div>
                    <Link href={`/vendors/${vendor.id}`}>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Event Gallery
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Get inspired by our successful events
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </div>

            {/* Gallery Filter Tabs */}
            <Tabs
              value={galleryFilter}
              onValueChange={setGalleryFilter}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md"
                >
                  All Events
                </TabsTrigger>
                <TabsTrigger
                  value="wedding"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md"
                >
                  Weddings
                </TabsTrigger>
                <TabsTrigger
                  value="corporate"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md"
                >
                  Corporate
                </TabsTrigger>
                <TabsTrigger
                  value="birthday"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md"
                >
                  Birthdays
                </TabsTrigger>
              </TabsList>

              <TabsContent value={galleryFilter} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGalleryItems.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden shadow-md hover:shadow-xl transition-all group bg-white dark:bg-gray-800"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Overlay for media type indicator */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Media type indicator */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          {item.type === "video" ? (
                            <Film className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>

                        {/* Play button for videos */}
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-emerald-600/90 backdrop-blur-sm rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Play className="h-8 w-8 text-white ml-1" />
                            </div>
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs capitalize"
                          >
                            {item.category}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.date}
                          </span>
                        </div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          {item.vendor}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Upcoming Events Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Your Upcoming Events
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Stay on top of your upcoming bookings
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card
                  key={index}
                  className="shadow-md hover:shadow-xl transition-all bg-white dark:bg-gray-800 border-l-4 border-emerald-500 hover:border-emerald-600"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          event.status === "confirmed" ? "default" : "outline"
                        }
                        className={`${
                          event.status === "confirmed"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "border-amber-500 text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {event.status === "confirmed" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" /> Confirmed
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" /> Pending
                          </>
                        )}
                      </Badge>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {event.time}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {event.name}
                    </CardTitle>
                    <CardDescription className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {event.vendor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 mb-3">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
