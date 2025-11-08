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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VendorDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Bookings",
      value: "156",
      change: "+23.5%",
      trend: "up",
      icon: Calendar,
      color: "green",
      description: "This month",
    },
    {
      title: "Active Services",
      value: "12",
      change: "+2 recently",
      trend: "up",
      icon: Package,
      color: "blue",
      description: "Listed services",
    },
    {
      title: "Revenue",
      value: "KSh 450K",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      color: "green",
      description: "This month",
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "245 reviews",
      trend: "up",
      icon: Star,
      color: "yellow",
      description: "Customer satisfaction",
    },
  ];

  const recentBookings = [
    {
      client: "John Doe",
      service: "Wedding Photography",
      date: "Dec 15, 2025",
      amount: "KSh 35,000",
      status: "confirmed",
    },
    {
      client: "Sarah Johnson",
      service: "Corporate Event Catering",
      date: "Dec 20, 2025",
      amount: "KSh 50,000",
      status: "pending",
    },
    {
      client: "Mike Williams",
      service: "Birthday Party DJ",
      date: "Jan 5, 2026",
      amount: "KSh 15,000",
      status: "confirmed",
    },
  ];

  const topServices = [
    {
      name: "Wedding Photography Package",
      bookings: 45,
      revenue: "KSh 180K",
      rating: 4.9,
    },
    {
      name: "Corporate Event Catering",
      bookings: 32,
      revenue: "KSh 140K",
      rating: 4.8,
    },
    {
      name: "Sound & DJ Services",
      bookings: 28,
      revenue: "KSh 85K",
      rating: 4.7,
    },
    { name: "Event Decoration", bookings: 22, revenue: "KSh 70K", rating: 4.9 },
  ];

  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex-1 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-orange-50/20 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
          {/* Motivational Business Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-8 shadow-xl">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
            <div className="absolute bottom-0 right-0 -mb-8 -mr-8">
              <Trophy className="w-32 h-32 text-white/10 rotate-12" />
            </div>
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Your Business is Thriving! 💼
                </h2>
                <p className="text-purple-50 text-lg">
                  Welcome back, {user?.name || "Vendor"}! Keep up the amazing work.
                </p>
              </div>
              <div className="hidden lg:block">
                <Award className="w-12 h-12 text-yellow-300 animate-bounce" />
              </div>
            </div>
          </div>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || "Vendor"}! Here's your business
                performance.
              </p>

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
                            : stat.color === "yellow"
                            ? "bg-yellow-100 dark:bg-yellow-900/20"
                            : "bg-purple-100 dark:bg-purple-900/20"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            stat.color === "green"
                              ? "text-green-600 dark:text-green-400"
                              : stat.color === "blue"
                              ? "text-blue-600 dark:text-blue-400"
                              : stat.color === "yellow"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-purple-600 dark:text-purple-400"
                          }`}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </p>
                          {stat.trend && (
                            <Badge
                              variant="outline"
                              className="border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                            >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {stat.change}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
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
              {/* Recent Bookings */}
              <Card className="xl:col-span-2 border-2 bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Bookings
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Latest client bookings
                      </CardDescription>
                    </div>
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all bg-white dark:bg-gray-800"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {booking.client.charAt(0)}
                          </div>
                        </div>
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
                              className={`${
                                booking.status === "confirmed"
                                  ? "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                                  : "border-yellow-500 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                              }`}
                            >
                              {booking.status === "confirmed" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {booking.date}
                            </span>
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                              <DollarSign className="w-4 h-4" />
                              {booking.amount}
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

              {/* Top Services */}
              <Card className="border-2 bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        Top Services
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Best performing
                      </CardDescription>
                    </div>
                    <Award className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topServices.map((service, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {service.name}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {service.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          {service.bookings} bookings
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {service.revenue}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${(service.bookings / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                    Manage Services
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

    </ProtectedRoute>
  );
}
