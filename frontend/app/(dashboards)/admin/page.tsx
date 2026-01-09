"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  AlertCircle,
  Sparkles,
  Zap,
  Rocket,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authAPI } from "@/lib/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await authAPI.getAllUser();
        if (response.data.success) {
          console.log(response.data);
          setUsers(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    })();
  }, []);

  console.log("users", users);

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "green",
      description: "Active platform users",
    },
    {
      title: "Total Vendors",
      value: users.filter((u: any) => u.role === "vendor").length.toString(),
      change: "+8.2%",
      trend: "up",
      icon: Briefcase,
      color: "blue",
      description: "Registered service providers",
    },
    {
      title: "Total Bookings",
      value: "1,284",
      change: "+18.7%",
      trend: "up",
      icon: Calendar,
      color: "purple",
      description: "This month",
    },
    {
      title: "Revenue",
      value: "KSh 2.4M",
      change: "+23.1%",
      trend: "up",
      icon: DollarSign,
      color: "green",
      description: "Total earnings",
    },
  ];

  const recentActivity = [
    {
      action: "New vendor registration",
      user: "Sarah's Catering",
      time: "5 min ago",
      type: "vendor",
    },
    {
      action: "Booking completed",
      user: "John Doe",
      time: "12 min ago",
      type: "booking",
    },
    {
      action: "New client signup",
      user: "Mary Johnson",
      time: "1 hour ago",
      type: "client",
    },
    {
      action: "Payment received",
      user: "Elite Photographers",
      time: "2 hours ago",
      type: "payment",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex-1 min-h-screen w-full max-w-full overflow-x-hidden bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
          {/* Welcome Banner with background image and overlay */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            {/* Background image (remote Unsplash) */}
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80&auto=format&fit=crop')",
                filter: "saturate(0.75) contrast(0.9) blur(0px)",
              }}
            />

            {/* Softer overlay to avoid very-deep blacks in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-slate-800/18 to-transparent dark:from-slate-900/45 dark:via-slate-800/28" />

            <div className="relative z-10 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1 text-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                  Hey{" "}
                  <span className="underline decoration-emerald-300/60 decoration-2 rounded-sm">
                    {user?.name || "Admin"}
                  </span>
                  , welcome back!
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/85 max-w-3xl">
                  Quick snapshot: your platform activity, trending vendors, and
                  the controls you need. Everything's responsive and a little
                  more delightful today ✨
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/90 hover:bg-emerald-500 text-white rounded-lg shadow-sm transform transition hover:-translate-y-0.5">
                    <Sparkles className="w-4 h-4" />
                    Boost Engagement
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg shadow-sm">
                    View Analytics
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 self-stretch md:self-auto">
                <div className="rounded-lg bg-white/8 dark:bg-white/6 p-2 backdrop-blur-sm">
                  <ThemeToggle />
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-white/85">
                  <Rocket className="w-5 h-5 animate-bounce text-amber-200/90" />
                  <span className="opacity-95">
                    Make today count — try a quick report
                  </span>
                </div>
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
                  className="group relative overflow-hidden border bg-white dark:bg-gray-800 transition-shadow duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                    <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </CardDescription>
                    <div
                      className={`p-3 rounded-xl transition-transform duration-300 will-change-transform group-hover:scale-105 flex items-center justify-center ${
                        stat.color === "green"
                          ? "bg-green-50 dark:bg-green-900/20"
                          : stat.color === "blue"
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : stat.color === "purple"
                          ? "bg-purple-50 dark:bg-purple-900/20"
                          : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          stat.color === "green"
                            ? "text-green-600 dark:text-green-400"
                            : stat.color === "blue"
                            ? "text-blue-600 dark:text-blue-400"
                            : stat.color === "purple"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
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
            {/* Recent Activity */}
            <Card className="xl:col-span-2 border-2 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Latest platform events and updates
                    </CardDescription>
                  </div>
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === "vendor"
                            ? "bg-blue-100 dark:bg-blue-900/20"
                            : activity.type === "booking"
                            ? "bg-green-100 dark:bg-green-900/20"
                            : activity.type === "client"
                            ? "bg-purple-100 dark:bg-purple-900/20"
                            : "bg-yellow-100 dark:bg-yellow-900/20"
                        }`}
                      >
                        {activity.type === "vendor" && (
                          <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                        {activity.type === "booking" && (
                          <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                        {activity.type === "client" && (
                          <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        )}
                        {activity.type === "payment" && (
                          <DollarSign className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.user}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  System Status
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Platform health overview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        All Systems Operational
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Server Uptime
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        99.9%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Response Time
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        45ms
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Active Sessions
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        1,234
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                      View All Users
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                      Manage Vendors
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
                      View Reports
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
