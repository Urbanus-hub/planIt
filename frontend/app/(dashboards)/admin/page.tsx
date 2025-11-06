"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Activity,
  UserCheck,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Users",
      value: "2,450",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "green",
      description: "Active platform users"
    },
    {
      title: "Total Vendors",
      value: "856",
      change: "+8.2%",
      trend: "up",
      icon: Briefcase,
      color: "blue",
      description: "Registered service providers"
    },
    {
      title: "Total Bookings",
      value: "1,284",
      change: "+18.7%",
      trend: "up",
      icon: Calendar,
      color: "purple",
      description: "This month"
    },
    {
      title: "Revenue",
      value: "KSh 2.4M",
      change: "+23.1%",
      trend: "up",
      icon: DollarSign,
      color: "green",
      description: "Total earnings"
    },
  ];

  const recentActivity = [
    { action: "New vendor registration", user: "Sarah's Catering", time: "5 min ago", type: "vendor" },
    { action: "Booking completed", user: "John Doe", time: "12 min ago", type: "booking" },
    { action: "New client signup", user: "Mary Johnson", time: "1 hour ago", type: "client" },
    { action: "Payment received", user: "Elite Photographers", time: "2 hours ago", type: "payment" },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-serif">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name || "Admin"}! Here's what's happening with PlanIt today.
            </p>
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
                    <div className={`p-2 rounded-full ${
                      stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                      stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`${
                            stat.trend === 'up' 
                              ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                              : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                          }`}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.change}
                        </Badge>
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
            {/* Recent Activity */}
            <Card className="xl:col-span-2 border-2 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
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
                      <div className={`p-2 rounded-full ${
                        activity.type === 'vendor' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        activity.type === 'booking' ? 'bg-green-100 dark:bg-green-900/20' :
                        activity.type === 'client' ? 'bg-purple-100 dark:bg-purple-900/20' :
                        'bg-yellow-100 dark:bg-yellow-900/20'
                      }`}>
                        {activity.type === 'vendor' && <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {activity.type === 'booking' && <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />}
                        {activity.type === 'client' && <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                        {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.user}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
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
                <CardDescription className="text-gray-600 dark:text-gray-400">
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
                      <span className="text-gray-600 dark:text-gray-400">Server Uptime</span>
                      <span className="font-medium text-gray-900 dark:text-white">99.9%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                      <span className="font-medium text-gray-900 dark:text-white">45ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Active Sessions</span>
                      <span className="font-medium text-gray-900 dark:text-white">1,234</span>
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
