"use client";

import React, { useEffect, useMemo, useState } from "react";
import { servicesAPI } from "@/lib/api";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Star,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  MoreHorizontal,
  Check,
  X,
  Filter,
  Grid3x3,
  List,
  Package,
  Clock,
  MapPin,
  Tag,
  BarChart3,
  Award,
  Copy,
  Share2,
  Download,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Zap,
  Camera,
  Video,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Service = {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  rating?: number;
  reviewsCount?: number;
  bookingsCount?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  tags?: string[];
  location?: string;
  duration?: number;
  capacity?: number;
  minAdvanceBooking?: number;
  maxAdvanceBooking?: number;
  cancellationPolicy?: string;
  depositRequired?: boolean;
  depositPercentage?: number;
  featured?: boolean;
  views?: number;
  inquiries?: number;
};

export default function VendorServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal/drawer state
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    pricingType: "fixed",
    location: "",
    duration: "",
    capacity: "",
    minAdvanceBooking: "1",
    maxAdvanceBooking: "365",
    cancellationPolicy: "",
    depositRequired: false,
    depositPercentage: "",
    tags: "",
  });

  // Confirm dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesAPI.getAll();
      const data = res.data?.data || res.data || [];
      setServices(data as Service[]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch services"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenForm = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title || "",
        description: service.description || "",
        category: service.category || "",
        price: service.price?.toString() || "",
        pricingType: "fixed",
        location: service.location || "",
        duration: service.duration?.toString() || "",
        capacity: service.capacity?.toString() || "",
        minAdvanceBooking: service.minAdvanceBooking?.toString() || "1",
        maxAdvanceBooking: service.maxAdvanceBooking?.toString() || "365",
        cancellationPolicy: service.cancellationPolicy || "",
        depositRequired: service.depositRequired || false,
        depositPercentage: service.depositPercentage?.toString() || "",
        tags: service.tags?.join(", ") || "",
      });
    } else {
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        pricingType: "fixed",
        location: "",
        duration: "",
        capacity: "",
        minAdvanceBooking: "1",
        maxAdvanceBooking: "365",
        cancellationPolicy: "",
        depositRequired: false,
        depositPercentage: "",
        tags: "",
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      price: "",
      pricingType: "fixed",
      location: "",
      duration: "",
      capacity: "",
      minAdvanceBooking: "1",
      maxAdvanceBooking: "365",
      cancellationPolicy: "",
      depositRequired: false,
      depositPercentage: "",
      tags: "",
    });
  };

  const handleSaveService = async () => {
    if (!formData.title.trim()) {
      toast.error("Validation error", { description: "Title is required" });
      return;
    }
    if (!formData.price) {
      toast.error("Validation error", { description: "Price is required" });
      return;
    }

    try {
      if (editingService) {
        await servicesAPI.update(editingService._id, formData);
        setServices((prev) =>
          prev.map((s) =>
            s._id === editingService._id
              ? {
                  ...s,
                  title: formData.title,
                  description: formData.description,
                  category: formData.category,
                  price: Number(formData.price),
                  location: formData.location,
                  duration: Number(formData.duration),
                  capacity: Number(formData.capacity),
                  minAdvanceBooking: Number(formData.minAdvanceBooking),
                  maxAdvanceBooking: Number(formData.maxAdvanceBooking),
                  cancellationPolicy: formData.cancellationPolicy,
                  depositRequired: formData.depositRequired,
                  depositPercentage: Number(formData.depositPercentage),
                  tags: formData.tags.split(",").map((tag) => tag.trim()),
                }
              : s
          )
        );
        toast.success("Service updated");
      } else {
        const res = await servicesAPI.create(formData);
        const newService = res.data?.data || res.data;
        setServices((prev) => [...prev, newService]);
        toast.success("Service created");
      }
      handleCloseForm();
    } catch (err: any) {
      toast.error("Failed to save service", { description: err?.message });
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await servicesAPI.update(id, { isActive: !current });
      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: !current } : s))
      );
      toast.success(current ? "Service deactivated" : "Service activated");
    } catch (err: any) {
      toast.error("Failed to update service", { description: err?.message });
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await servicesAPI.update(id, { featured: !current });
      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, featured: !current } : s))
      );
      toast.success(
        current ? "Service removed from featured" : "Service added to featured"
      );
    } catch (err: any) {
      toast.error("Failed to update service", { description: err?.message });
    }
  };

  const requestDeleteService = (id: string) => {
    setPendingDeleteId(id);
    setDeleteOpen(true);
  };

  const performDeleteService = async () => {
    if (!pendingDeleteId) return;
    try {
      await servicesAPI.delete(pendingDeleteId);
      setServices((prev) => prev.filter((s) => s._id !== pendingDeleteId));
      toast.success("Service deleted");
    } catch (err: any) {
      toast.error("Failed to delete service", { description: err?.message });
    } finally {
      setDeleteOpen(false);
      setPendingDeleteId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = services;

    if (activeTab === "active") {
      filtered = services.filter((s) => s.isActive);
    } else if (activeTab === "inactive") {
      filtered = services.filter((s) => !s.isActive);
    } else if (activeTab === "featured") {
      filtered = services.filter((s) => s.featured);
    }

    if (!q) return filtered;
    return filtered.filter((s) => {
      return (
        (s.title || "").toLowerCase().includes(q) ||
        (s.category || "").toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q) ||
        (s.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [services, query, activeTab]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aValue: any = a[sortBy as keyof Service];
      let bValue: any = b[sortBy as keyof Service];

      if (sortBy === "price") {
        aValue = a.price || 0;
        bValue = b.price || 0;
      } else if (sortBy === "rating") {
        aValue = a.rating || 0;
        bValue = b.rating || 0;
      } else if (sortBy === "bookingsCount") {
        aValue = a.bookingsCount || 0;
        bValue = b.bookingsCount || 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filtered, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.isActive).length;
    const featured = services.filter((s) => s.featured).length;
    const avgRating = services.length
      ? (
          services.reduce((sum, s) => sum + (s.rating || 0), 0) /
          services.length
        ).toFixed(1)
      : "—";
    const totalBookings = services.reduce(
      (sum, s) => sum + (s.bookingsCount || 0),
      0
    );
    const totalViews = services.reduce((sum, s) => sum + (s.views || 0), 0);
    const totalInquiries = services.reduce(
      (sum, s) => sum + (s.inquiries || 0),
      0
    );
    const avgPrice =
      services.length > 0
        ? (
            services.reduce((sum, s) => sum + (s.price || 0), 0) /
            services.length
          ).toFixed(2)
        : "—";

    return {
      total,
      active,
      featured,
      avgRating,
      totalBookings,
      totalViews,
      totalInquiries,
      avgPrice,
    };
  }, [services]);

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "photography":
        return <Camera className="h-4 w-4" />;
      case "videography":
        return <Video className="h-4 w-4" />;
      case "catering":
        return <Package className="h-4 w-4" />;
      case "decoration":
        return <Award className="h-4 w-4" />;
      case "entertainment":
        return <Zap className="h-4 w-4" />;
      case "venue":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "photography":
        return "bg-violet-100 text-violet-800 border-violet-200";
      case "videography":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "catering":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "decoration":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "entertainment":
        return "bg-green-100 text-green-800 border-green-200";
      case "venue":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className=" bg-transparent">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Services
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your service offerings
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchServices}
                className="border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => handleOpenForm()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Services
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.total}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {stats.active} active
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {stats.featured} featured
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Average Rating
                  </p>
                  <div className="flex items-center mt-2">
                    <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                    <p className="text-3xl font-bold text-gray-900 ml-2">
                      {stats.avgRating}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Customer satisfaction
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalBookings}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-medium">12% increase</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Views
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalViews}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-medium">18% increase</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services..."
                  className="pl-10 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Sort by: {sortBy}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
                      Created Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("title")}>
                      Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price")}>
                      Price
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("rating")}>
                      Rating
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("bookingsCount")}
                    >
                      Bookings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="border-gray-300 hover:bg-gray-50"
                >
                  {sortOrder === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setViewMode(viewMode === "table" ? "grid" : "table")
                  }
                  className="border-gray-300 hover:bg-gray-50"
                >
                  {viewMode === "table" ? (
                    <Grid3x3 className="h-4 w-4" />
                  ) : (
                    <List className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Table/Grid */}
        <Card className="border-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">
                  Service Directory
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {sorted.length} service{sorted.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={() => handleOpenForm()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 pt-4">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 border border-gray-200 p-1">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="featured"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600"
                  >
                    Featured
                  </TabsTrigger>
                  <TabsTrigger
                    value="inactive"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600"
                  >
                    Inactive
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-0">
                {loading ? (
                  <div className="p-8 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive" className="m-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : sorted.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      No services found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {query
                        ? "Try adjusting your search or filters"
                        : "Create your first service to get started"}
                    </p>
                    <Button
                      onClick={() => handleOpenForm()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                ) : viewMode === "table" ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-gray-700 font-medium">
                            Service
                          </TableHead>
                          <TableHead className="text-gray-700 font-medium hidden md:table-cell">
                            Category
                          </TableHead>
                          <TableHead className="text-gray-700 font-medium hidden lg:table-cell">
                            Rating
                          </TableHead>
                          <TableHead className="text-gray-700 font-medium">
                            Price
                          </TableHead>
                          <TableHead className="text-gray-700 font-medium hidden sm:table-cell">
                            Bookings
                          </TableHead>
                          <TableHead className="text-gray-700 font-medium">
                            Status
                          </TableHead>
                          <TableHead className="text-right text-gray-700 font-medium">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sorted.map((service) => (
                          <TableRow
                            key={service._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                  {service.title?.[0]?.toUpperCase() || "S"}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 flex items-center gap-2">
                                    {service.title}
                                    {service.featured && (
                                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                        <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                                        Featured
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 line-clamp-1">
                                    {service.description
                                      ?.substring(0, 30)
                                      .concat("...") || "No description"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "flex items-center gap-1",
                                  getCategoryColor(service.category)
                                )}
                              >
                                {getCategoryIcon(service.category)}
                                {service.category || "Uncategorized"}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                <span className="font-medium text-gray-900">
                                  {(service.rating ?? 0).toFixed(1)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({service.reviewsCount || 0})
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-green-600">
                              ${service.price?.toFixed(2) || "0.00"}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {service.bookingsCount || 0}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  service.isActive ? "default" : "secondary"
                                }
                                className={
                                  service.isActive
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-gray-100 text-gray-800 border-gray-200"
                                }
                              >
                                {service.isActive ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <X className="h-3 w-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => setSelectedService(service)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleOpenForm(service)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleToggleActive(
                                        service._id,
                                        service.isActive || false
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    {service.isActive ? (
                                      <>
                                        <X className="mr-2 h-4 w-4" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleToggleFeatured(
                                        service._id,
                                        service.featured || false
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    {service.featured ? (
                                      <>
                                        <X className="mr-2 h-4 w-4" />
                                        Remove from Featured
                                      </>
                                    ) : (
                                      <>
                                        <Star className="mr-2 h-4 w-4" />
                                        Add to Featured
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      requestDeleteService(service._id)
                                    }
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sorted.map((service) => (
                        <Card
                          key={service._id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                {service.title?.[0]?.toUpperCase() || "S"}
                              </div>
                              <div className="flex items-center gap-2">
                                {service.featured && (
                                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                    <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                                    Featured
                                  </Badge>
                                )}
                                <Badge
                                  variant={
                                    service.isActive ? "default" : "secondary"
                                  }
                                  className={
                                    service.isActive
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }
                                >
                                  {service.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                              {service.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600 line-clamp-2">
                              {service.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                  <span className="font-medium text-gray-900">
                                    {(service.rating ?? 0).toFixed(1)}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({service.reviewsCount || 0})
                                  </span>
                                </div>
                                <div className="text-lg font-bold text-green-600">
                                  ${service.price?.toFixed(2) || "0.00"}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "flex items-center gap-1",
                                    getCategoryColor(service.category)
                                  )}
                                >
                                  {getCategoryIcon(service.category)}
                                  {service.category || "Uncategorized"}
                                </Badge>
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  {service.bookingsCount || 0}
                                </div>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setSelectedService(service)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="p-0 h-8 w-8"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleOpenForm(service)}
                                      className="cursor-pointer"
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleActive(
                                          service._id,
                                          service.isActive || false
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      {service.isActive ? (
                                        <>
                                          <X className="mr-2 h-4 w-4" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <Check className="mr-2 h-4 w-4" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleFeatured(
                                          service._id,
                                          service.featured || false
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      {service.featured ? (
                                        <>
                                          <X className="mr-2 h-4 w-4" />
                                          Remove from Featured
                                        </>
                                      ) : (
                                        <>
                                          <Star className="mr-2 h-4 w-4" />
                                          Add to Featured
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        requestDeleteService(service._id)
                                      }
                                      className="cursor-pointer text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingService ? "Edit Service" : "Create Service"}
              </h2>
              <Button
                variant="ghost"
                onClick={handleCloseForm}
                className="p-0 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
              {/* Title & Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Professional Wedding Photography"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    title="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-md text-sm border-gray-200 bg-white text-gray-900"
                  >
                    <option value="">Select category</option>
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Catering">Catering</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Venue">Venue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your service in detail..."
                  className="w-full mt-1 p-3 border rounded-md text-sm border-gray-200 bg-white text-gray-900"
                  rows={4}
                />
              </div>

              {/* Location & Tags Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., New York, NY"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="e.g., wedding, outdoor, portrait"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Price & Pricing Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Price *
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="mt-1"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Pricing Type
                  </label>
                  <select
                    title="text"
                    value={formData.pricingType}
                    onChange={(e) =>
                      setFormData({ ...formData, pricingType: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-md text-sm border-gray-200 bg-white text-gray-900"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="per-hour">Per Hour</option>
                    <option value="per-person">Per Person</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              {/* Duration & Capacity Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="e.g., 120"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Capacity (max bookings)
                  </label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    placeholder="e.g., 50"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Advance Booking Window */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Min Advance Booking (days)
                  </label>
                  <Input
                    type="number"
                    value={formData.minAdvanceBooking}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minAdvanceBooking: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Max Advance Booking (days)
                  </label>
                  <Input
                    type="number"
                    value={formData.maxAdvanceBooking}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxAdvanceBooking: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Cancellation Policy */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Cancellation Policy
                </label>
                <textarea
                  value={formData.cancellationPolicy}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cancellationPolicy: e.target.value,
                    })
                  }
                  placeholder="Describe your cancellation policy..."
                  className="w-full mt-1 p-2 border rounded-md text-sm border-gray-200 bg-white text-gray-900"
                  rows={2}
                />
              </div>

              {/* Deposit Section */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="depositRequired"
                    checked={formData.depositRequired}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        depositRequired: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="depositRequired"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Require Deposit
                  </label>
                </div>

                {formData.depositRequired && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Deposit Percentage (%)
                    </label>
                    <Input
                      type="number"
                      value={formData.depositPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          depositPercentage: e.target.value,
                        })
                      }
                      placeholder="e.g., 50"
                      className="mt-1"
                      min="0"
                      max="100"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
              <Button
                variant="outline"
                onClick={handleCloseForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveService}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingService ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedService.title}
              </h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedService(null)}
                className="p-0 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {selectedService.description || "No description"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Price
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedService.price?.toFixed(2) || "0.00"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Rating
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-bold text-gray-900">
                      {(selectedService.rating ?? 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Performance
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bookings</span>
                    <span className="font-semibold text-gray-900">
                      {selectedService.bookingsCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-semibold text-gray-900">
                      {selectedService.reviewsCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Views</span>
                    <span className="font-semibold text-gray-900">
                      {selectedService.views || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    handleOpenForm(selectedService);
                    setSelectedService(null);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    requestDeleteService(selectedService._id);
                    setSelectedService(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(o) => {
          setDeleteOpen(o);
          if (!o) setPendingDeleteId(null);
        }}
        title="Delete service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onConfirm={performDeleteService}
      />
    </div>
  );
}
