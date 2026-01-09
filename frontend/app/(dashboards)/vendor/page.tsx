"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  Trophy,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Bell,
  Inbox,
  CalendarX,
  Image as ImageIcon,
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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function VendorDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Bookings",
      value: "156",
      change: "+23.5%",
      trend: "up",
      icon: Calendar,
      color: "emerald",
      description: "This month",
      chart: [65, 78, 90, 81, 95, 110, 125, 140, 156],
    },
    {
      title: "Active Services",
      value: "12",
      change: "+2 recently",
      trend: "up",
      icon: Package,
      color: "blue",
      description: "Listed services",
      chart: [10, 10, 10, 10, 10, 10, 10, 10, 12],
    },
    {
      title: "Revenue",
      value: "KSh 450K",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      color: "emerald",
      description: "This month",
      chart: [120, 150, 180, 210, 250, 300, 350, 400, 450],
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "245 reviews",
      trend: "up",
      icon: Star,
      color: "amber",
      description: "Customer satisfaction",
      chart: [4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.8, 4.8, 4.8],
    },
  ];

  // Set to empty arrays as requested to demonstrate empty states
  const recentBookings: any[] = [];
  const notifications: any[] = [];

  // Populating this with dummy data because [null] causes crashes, 
  // but the logic below handles empty arrays too.
  const topServices = [
    {
      id: "1",
      name: "Wedding Photography Full Package",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      rating: 4.9,
      bookings: 42,
      revenue: "KSh 1.2M",
    },
    {
      id: "2",
      name: "Corporate Event Catering",
      image:
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop",
      rating: 4.7,
      bookings: 28,
      revenue: "KSh 850K",
    },
    {
      id: "3",
      name: "Birthday Party DJ Services",
      image:
        "https://images.unsplash.com/photo-1571266028243-d220c6a8b0e5?w=400&h=300&fit=crop",
      rating: 4.8,
      bookings: 35,
      revenue: "KSh 525K",
    },
    {
      id: "4",
      name: "Event Decoration & Styling",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0202128?w=400&h=300&fit=crop",
      rating: 4.6,
      bookings: 19,
      revenue: "KSh 380K",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-800",
          progress: "bg-emerald-500",
        };
      case "blue":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-700 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800",
          progress: "bg-blue-500",
        };
      case "amber":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-800",
          progress: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-700",
          progress: "bg-gray-500",
        };
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-800",
          icon: CheckCircle,
        };
      case "pending":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-800",
          icon: Clock,
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-700",
          icon: Clock,
        };
    }
  };

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex-1 min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-emerald-800/90 to-teal-900/95" />
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>

          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                    Welcome back, {user?.name || "Vendor"}!
                  </h1>
                  <p className="text-emerald-100 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
                    Your business is thriving! Here's an overview of your
                    performance and recent activities.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/30 text-sm"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button className="bg-white text-emerald-700 hover:bg-emerald-50 text-sm shadow-lg">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 -mt-4 relative z-20">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = getColorClasses(stat.color);
              const maxChartValue = Math.max(...stat.chart);
              const currentChartValue = stat.chart[stat.chart.length - 1];

              return (
                <Card
                  key={index}
                  className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.title}
                      </CardDescription>
                      <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colorClasses.text}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <Badge
                        variant="outline"
                        className={`${colorClasses.bg} ${colorClasses.text} ${colorClasses.border} border text-xs`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {stat.description}
                    </p>
                    <div className="h-8 sm:h-12 flex items-end gap-1">
                      {stat.chart.map((value, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t-sm ${colorClasses.progress} transition-all duration-500`}
                          style={{
                            height: `${(value / maxChartValue) * 100}%`,
                            opacity: i === stat.chart.length - 1 ? 1 : 0.4,
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Bookings */}
            <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Recent Bookings
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Latest client bookings and activities
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1 h-8 text-xs sm:text-sm">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                      <CalendarX className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-1">No Recent Bookings</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-xs mx-auto">
                      You don't have any new bookings at the moment. Check back later!
                    </p>
                  </div>
                ) : (
                  recentBookings.map((booking) => {
                    const statusClasses = getStatusClasses(booking.status);
                    const StatusIcon = statusClasses.icon;

                    return (
                      <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all bg-gray-50/50 dark:bg-gray-800/50"
                      >
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage
                            src={booking.avatar}
                            alt={booking.client}
                          />
                          <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                            {booking.client.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                {booking.client}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {booking.service}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`${statusClasses.bg} ${statusClasses.text} ${statusClasses.border} border text-xs w-max`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm">
                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {booking.date}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                              {booking.amount}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 hover:opacity-100 transition-opacity hidden sm:flex">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Recent updates and alerts
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <Bell className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                      <Inbox className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-1">No Notifications</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      You're all caught up!
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read
                          ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800"
                          : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.read ? "bg-gray-300 dark:bg-gray-600" : "bg-emerald-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                            {notification.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification?.description}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {notifications.length > 0 && (
                  <Button variant="outline" className="w-full text-xs sm:text-sm mt-2">
                    View All Notifications
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Services */}
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Top Services
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Best performing services this month
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1 h-8 text-xs sm:text-sm">
                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                Manage Services
              </Button>
            </CardHeader>
            <CardContent>
              {topServices.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-1">No Services Listed</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      Add services to start tracking performance.
                    </p>
                  </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {topServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-col items-center text-center space-y-3 group"
                    >
                      <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-sm">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 leading-snug text-left">
                            {service.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 w-full justify-start px-1">
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {service.rating}
                        </span>
                      </div>
                      <div className="w-full space-y-2 px-1">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {service.bookings} bookings
                          </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                            {service.revenue}
                          </span>
                        </div>
                        <Progress
                          value={(service.bookings / 50) * 100}
                          className="h-1.5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}