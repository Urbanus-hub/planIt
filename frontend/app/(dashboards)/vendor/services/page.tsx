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
  ArrowUpRight,
  MoreHorizontal,
  Check,
  X,
  Info,
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
};

export default function VendorServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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
    }

    if (!q) return filtered;
    return filtered.filter((s) => {
      return (
        (s.title || "").toLowerCase().includes(q) ||
        (s.category || "").toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q)
      );
    });
  }, [services, query, activeTab]);

  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.isActive).length;
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
    const avgPrice =
      services.length > 0
        ? (
            services.reduce((sum, s) => sum + (s.price || 0), 0) /
            services.length
          ).toFixed(2)
        : "—";

    return { total, active, avgRating, totalBookings, avgPrice };
  }, [services]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Services
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Manage and showcase your service offerings
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2">
              <Button
                onClick={() => handleOpenForm()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
              <Button variant="outline" onClick={fetchServices}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.total}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.active}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase">
                Avg Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.avgRating}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase">
                Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.totalBookings}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase">
                Avg Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.avgPrice}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, category, or description"
                className="pl-10 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/30">
            <CardTitle className="text-slate-900 dark:text-slate-100">
              Service Directory
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-300">
              Manage your service catalog
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 pt-4">
                <TabsList className="grid w-full grid-cols-3 bg-slate-50 dark:bg-slate-800/20">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="inactive"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
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
                ) : filtered.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800/30 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
                      No services found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {query
                        ? "Try adjusting your search"
                        : "Create your first service to get started"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-800/20">
                        <TableRow>
                          <TableHead className="text-slate-800 dark:text-slate-100">
                            Service
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden md:table-cell">
                            Category
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden lg:table-cell">
                            Rating
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100">
                            Price
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden sm:table-cell">
                            Bookings
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100">
                            Status
                          </TableHead>
                          <TableHead className="text-right text-slate-800 dark:text-slate-100">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((service) => (
                          <TableRow
                            key={service._id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                  {service.title?.[0]?.toUpperCase() || "S"}
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-slate-100">
                                    {service.title || "—"}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {service.description
                                      ? service.description.substring(0, 40) +
                                        (service.description.length > 40
                                          ? "..."
                                          : "")
                                      : "—"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-slate-700 dark:text-slate-300">
                              <Badge
                                variant="outline"
                                className="border-slate-300 dark:border-slate-600"
                              >
                                {service.category || "Uncategorized"}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-amber-400" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                  {(service.rating ?? 0).toFixed(1)}
                                </span>
                                <span className="text-xs text-slate-500">
                                  ({service.reviewsCount || 0})
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                              ${service.price?.toFixed(2) || "0.00"}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-blue-500" />
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
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                }
                              >
                                {service.isActive ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Published
                                  </>
                                ) : (
                                  <>
                                    <X className="h-3 w-3 mr-1" />
                                    Draft
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                                        Unpublish
                                      </>
                                    ) : (
                                      <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Publish
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
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category *
                  </label>
                  <select
                  title="select-category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-md text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="">Select category</option>
                    <option value="Photography">Photography</option>
                    <option value="Catering">Catering</option>
                    <option value="Decor">Decor</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Venue">Venue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your service in detail..."
                  className="w-full mt-1 p-3 border rounded-md text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  rows={4}
                />
              </div>

              {/* Location & Tags Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Pricing Type
                  </label>
                  <select
                    title='select-price'
                    value={formData.pricingType}
                    onChange={(e) =>
                      setFormData({ ...formData, pricingType: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-md text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  className="w-full mt-1 p-2 border rounded-md text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  rows={2}
                />
              </div>

              {/* Deposit Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-lg space-y-4">
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
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <label
                    htmlFor="depositRequired"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Require Deposit
                  </label>
                </div>

                {formData.depositRequired && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
            <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
              <Button
                variant="outline"
                onClick={handleCloseForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveService}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {editingService ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Drawer */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedService(null)}
          />
          <div className="ml-auto w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-xl p-6 overflow-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {selectedService.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedService.category}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedService(null)}
                className="p-0 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {selectedService.description || "No description"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Price
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${selectedService.price?.toFixed(2) || "0.00"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Rating
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {(selectedService.rating ?? 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Performance
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Bookings
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedService.bookingsCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Reviews
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedService.reviewsCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
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
