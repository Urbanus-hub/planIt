"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Package,
  Users,
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  Trophy,
  Target,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Bell,
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

  const recentBookings = [
    {
      id: "1",
      client: "John Doe",
      service: "Wedding Photography",
      date: "Dec 15, 2025",
      amount: "KSh 35,000",
      status: "confirmed",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "2",
      client: "Sarah Johnson",
      service: "Corporate Event Catering",
      date: "Dec 20, 2025",
      amount: "KSh 50,000",
      status: "pending",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "3",
      client: "Mike Williams",
      service: "Birthday Party DJ",
      date: "Jan 5, 2026",
      amount: "KSh 15,000",
      status: "confirmed",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
  ];

  const topServices = [
    {
      id: "1",
      name: "Wedding Photography Package",
      bookings: 45,
      revenue: "KSh 180K",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&h=200&fit=crop",
    },
    {
      id: "2",
      name: "Corporate Event Catering",
      bookings: 32,
      revenue: "KSh 140K",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
    },
    {
      id: "3",
      name: "Sound & DJ Services",
      bookings: 28,
      revenue: "KSh 85K",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
    },
    {
      id: "4",
      name: "Event Decoration",
      bookings: 22,
      revenue: "KSh 70K",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=200&fit=crop",
    },
  ];

  const notifications = [
    {
      id: "1",
      title: "New booking request",
      description: "You have a new booking request for Dec 28",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "Payment received",
      description: "Payment of KSh 35,000 has been received",
      time: "5 hours ago",
      read: false,
    },
    {
      id: "3",
      title: "New review",
      description: "You received a 5-star review from a client",
      time: "1 day ago",
      read: true,
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-800",
          progress: "bg-emerald-500",
        };
      case "blue":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800",
          progress: "bg-blue-500",
        };
      case "amber":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-800",
          progress: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          text: "text-gray-600 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-800",
          progress: "bg-gray-500",
        };
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-emerald-100 dark:bg-emerald-900/20",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-800",
          icon: CheckCircle,
        };
      case "pending":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/20",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-800",
          icon: Clock,
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-900/20",
          text: "text-gray-700 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-800",
          icon: Clock,
        };
    }
  };

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/80 to-teal-900/90" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    Welcome back, {user?.name || "Vendor"}!
                  </h1>
                  <p className="text-emerald-100 text-sm sm:text-base md:text-lg max-w-2xl">
                    Your business is thriving! Here's an overview of your
                    performance and recent activities.
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm">
                    <Bell className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                  </Button>
                  <Button className="bg-white text-emerald-700 hover:bg-emerald-50 text-xs sm:text-sm">
                    <Trophy className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">View Reports</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = getColorClasses(stat.color);
              const maxChartValue = Math.max(...stat.chart);
              const currentChartValue = stat.chart[stat.chart.length - 1];

              return (
                <Card
                  key={index}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </CardDescription>
                      <div className={`p-2 rounded-full ${colorClasses.bg}`}>
                        <Icon className={`w-5 h-5 ${colorClasses.text}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <Badge
                        variant="outline"
                        className={`${colorClasses.bg} ${colorClasses.text} ${colorClasses.border} border`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.description}
                    </p>
                    {/* Mini Chart */}
                    <div className="h-12 flex items-end gap-1">
                      {stat.chart.map((value, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t ${colorClasses.progress}`}
                          style={{
                            height: `${(value / maxChartValue) * 100}%`,
                            opacity: i === stat.chart.length - 1 ? 1 : 0.6,
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
            <Card className="lg:col-span-2 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Bookings
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Latest client bookings and activities
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="w-4 h-4" />
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBookings.map((booking) => {
                  const statusClasses = getStatusClasses(booking.status);
                  const StatusIcon = statusClasses.icon;

                  return (
                    <div
                      key={booking.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all bg-white dark:bg-gray-800"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={booking.avatar}
                          alt={booking.client}
                        />
                        <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                          {booking.client.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                              {booking.client}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {booking.service}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${statusClasses.bg} ${statusClasses.text} ${statusClasses.border} border`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            {booking.amount}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Recent updates and alerts
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bell className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.read
                        ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.read ? "bg-gray-400" : "bg-emerald-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Top Services */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Top Services
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Best performing services this month
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Package className="w-4 h-4" />
                Manage Services
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-sm font-medium line-clamp-2">
                          {service.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.rating}
                      </span>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {service.bookings} bookings
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {service.revenue}
                        </span>
                      </div>
                      <Progress
                        value={(service.bookings / 50) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
