"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api, { authAPI } from "@/lib/api";
import { toast } from "sonner";
import {
  Search,
  Star,
  Eye,
  CheckCircle,
  UserX,
  Package,
  RefreshCw,
  Filter,
  MoreHorizontal,
  Building,
  Mail,
  Calendar,
  Shield,
  UserPlus,
  ChevronDown,
  X,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type Vendor = {
  _id: string;
  name?: string;
  email?: string;
  businessName?: string;
  rating?: number;
  totalBookings?: number;
  joinedDate?: string;
  isActive?: boolean;
  isVerified?: boolean;
  profileImage?: string;
  servicesCount?: number;
  lastLoginAt?: string;
};

const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  // Drawer state for vendor details
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDetails = (v: Vendor) => {
    setSelectedVendor(v);
    setDrawerOpen(true);
  };

  const closeDetails = () => {
    setSelectedVendor(null);
    setDrawerOpen(false);
  };

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.getAllUser();
      const all = res.data?.data || [];
      const vendorsOnly = (all as any[]).filter((u) => u.role === "vendor");
      setVendors(vendorsOnly as Vendor[]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch vendors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchVendors();
    })();
  }, []);

  const verifyVendorUser = async (id: string, isVerified: boolean) => {
    // open verify confirm dialog
    setPendingVerifyId(id);
    setPendingVerifyValue(isVerified);
    setVerifyOpen(true);
  };

  // Confirm dialog state for verify
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [pendingVerifyId, setPendingVerifyId] = useState<string | null>(null);
  const [pendingVerifyValue, setPendingVerifyValue] = useState<boolean>(true);

  const performVerifyVendor = async () => {
    if (!pendingVerifyId) return;
    try {
      const verifyStatus = await authAPI.verifyVendor(pendingVerifyId, { verify: pendingVerifyValue });
      if (!(verifyStatus?.data?.success)) {
        toast.error("Failed to verify vendor", { description: verifyStatus?.data?.message });
        return;
      }
      setVendors((prev) => prev.map((v) => (v._id === pendingVerifyId ? { ...v, isVerified: true } : v)));
      toast.success("Vendor verified");
    } catch (err: any) {
      toast.error("Failed to verify vendor", { description: err?.message });
    } finally {
      setVerifyOpen(false);
      setPendingVerifyId(null);
    }
  };

  const toggleActive = async (id: string, current = false) => {
    try {
      await authAPI.toggleUserActiveness(id as string, { active: !current });
      console.log("Toggled active status for user", id, !current);
      setVendors((prev) =>
        prev.map((v) => (v._id === id ? { ...v, isActive: !current } : v))
      );
      toast.success(current ? "Vendor deactivated" : "Vendor activated");
    } catch (err: any) {
      toast.error("Failed to update vendor", { description: err?.message });
    }
  };

  const removeVendor = async (id: string) => {
    setPendingRemoveId(id);
    setRemoveOpen(true);
  };

  const [removeOpen, setRemoveOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const performRemoveVendor = async () => {
    if (!pendingRemoveId) return;
    try {
      await authAPI.deleteUser(pendingRemoveId as string);
      setVendors((prev) => prev.filter((v) => v._id !== pendingRemoveId));
      toast.success("Vendor removed");
    } catch (err: any) {
      toast.error("Failed to remove vendor", { description: err?.message });
    } finally {
      setRemoveOpen(false);
      setPendingRemoveId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filteredVendors = vendors;

    // Filter by tab
    if (activeTab === "verified") {
      filteredVendors = vendors.filter((v) => v.isVerified);
    } else if (activeTab === "unverified") {
      filteredVendors = vendors.filter((v) => !v.isVerified);
    } else if (activeTab === "active") {
      filteredVendors = vendors.filter((v) => v.isActive);
    } else if (activeTab === "inactive") {
      filteredVendors = vendors.filter((v) => !v.isActive);
    }

    // Filter by search query and verified status
    return filteredVendors.filter((v) => {
      if (onlyVerified && !v.isVerified) return false;
      if (!q) return true;
      return (
        (v.name || "").toLowerCase().includes(q) ||
        (v.businessName || "").toLowerCase().includes(q) ||
        (v.email || "").toLowerCase().includes(q)
      );
    });
  }, [vendors, query, onlyVerified, activeTab]);

  const stats = useMemo(() => {
    const total = vendors.length;
    const verified = vendors.filter((v) => v.isVerified).length;
    const active = vendors.filter((v) => v.isActive).length;
    const avgRating = vendors.length
      ? (
          vendors.reduce((s, a) => s + (a.rating || 0), 0) / vendors.length
        ).toFixed(1)
      : "—";

    return { total, verified, active, avgRating };
  }, [vendors]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Vendors
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Manage providers, verify quality, and keep the marketplace healthy
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2">
              <Button onClick={fetchVendors}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Link href="/admin/vendors/new">
                <Button
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Vendor
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.total}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Registered providers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.verified}
              </div>
              <Progress
                value={(stats.verified / (stats.total || 1)) * 100}
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.active}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Currently active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Avg Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-amber-400" />
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.avgRating}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, business or email"
                  className="pl-10 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={onlyVerified}
                    onCheckedChange={(checked) =>
                      setOnlyVerified(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="verified"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Verified only
                  </label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery("")}
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/30">
            <CardTitle className="text-slate-900 dark:text-slate-100">
              Vendor Directory
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-300">
              Manage all vendors on the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="px-4 pt-4">
                <TabsList className="grid w-full grid-cols-5 bg-slate-50 dark:bg-slate-800/20">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="verified"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                  >
                    Verified
                  </TabsTrigger>
                  <TabsTrigger
                    value="unverified"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                  >
                    Unverified
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
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive" className="m-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : filtered.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800/30 rounded-full flex items-center justify-center mb-4">
                      <Package className="h-12 w-12 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
                      No vendors found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {query
                        ? "Try adjusting your search or filter criteria"
                        : "There are no vendors to display"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-800/20">
                        <TableRow>
                          <TableHead className="text-slate-800 dark:text-slate-100">
                            Vendor
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden md:table-cell">
                            Business
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden lg:table-cell">
                            Performance
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden sm:table-cell">
                            Bookings
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden md:table-cell">
                            Joined
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
                        {filtered.map((v) => (
                          <TableRow
                            key={v._id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                  <AvatarImage
                                    src={v.profileImage}
                                    alt={v.name}
                                  />
                                  <AvatarFallback className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                                    {(v.name || "")
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                      .slice(0, 2) || "V"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div
                                    className="font-medium text-slate-900 dark:text-slate-100 cursor-pointer"
                                    onClick={() => openDetails(v)}
                                  >
                                    {v.name || "—"}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300 md:hidden">
                                    <Mail className="h-3 w-3" />
                                    {v.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                                <Building className="h-4 w-4" />
                                {v.businessName || "—"}
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-amber-400" />
                                  <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {(v.rating ?? 0).toFixed(1)}
                                  </span>
                                </div>
                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        ((v.rating || 0) / 5) * 100
                                      )}%`,
                                    }}
                                    className="h-full bg-slate-700"
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-slate-700 dark:text-slate-300">
                              {v.totalBookings ?? 0}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                                <Calendar className="h-4 w-4" />
                                {v.joinedDate
                                  ? new Date(v.joinedDate).toLocaleDateString()
                                  : "—"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge
                                  variant={v.isActive ? "default" : "secondary"}
                                  className={
                                    v.isActive
                                      ? "bg-slate-800 text-white w-fit"
                                      : "bg-gray-100 text-gray-600 w-fit"
                                  }
                                >
                                  {v.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge
                                  variant={
                                    v.isVerified ? "default" : "secondary"
                                  }
                                  className={
                                    v.isVerified
                                      ? "bg-emerald-600 text-white w-fit"
                                      : "bg-yellow-100 text-yellow-800 w-fit"
                                  }
                                >
                                  <Shield className="mr-1 h-3 w-3" />
                                  {v.isVerified ? "Verified" : "Unverified"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800/20"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => openDetails(v)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {!v.isVerified && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() =>
                                          verifyVendorUser(v._id, !v.isVerified)
                                        }
                                        className="cursor-pointer"
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Verify Vendor
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toggleActive(v._id, v.isActive)
                                    }
                                    className="cursor-pointer"
                                  >
                                    {v.isActive ? (
                                      <>
                                        <UserX className="mr-2 h-4 w-4" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => removeVendor(v._id)}
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                  >
                                    <Package className="mr-2 h-4 w-4" />
                                    Remove
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
      {/* Details Drawer */}
      {drawerOpen && selectedVendor && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeDetails}
          />
          <div className="ml-auto w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-xl p-6 overflow-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {selectedVendor.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedVendor.businessName}
                </p>
              </div>
              <Button variant="ghost" onClick={closeDetails} className="p-0">
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <strong>Email:</strong> {selectedVendor.email || "—"}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <strong>Joined:</strong>{" "}
                {selectedVendor.joinedDate
                  ? new Date(selectedVendor.joinedDate).toLocaleString()
                  : "—"}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <strong>Bookings:</strong> {selectedVendor.totalBookings ?? 0}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <strong>Rating:</strong>{" "}
                {(selectedVendor.rating ?? 0).toFixed(1)}
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-2">
                  {!selectedVendor.isVerified && (
                    <Button
                      onClick={() =>
                        selectedVendor &&
                        verifyVendorUser(
                          selectedVendor._id,
                          !selectedVendor.isVerified
                        )
                      }
                    >
                      Verify
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      selectedVendor &&
                      toggleActive(selectedVendor._id, selectedVendor.isActive)
                    }
                  >
                    {selectedVendor.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      selectedVendor && removeVendor(selectedVendor._id)
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
      <ConfirmDialog
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        title="Verify vendor"
        description="Are you sure you want to verify this vendor?"
        confirmLabel="Verify"
        cancelLabel="Cancel"
        confirmVariant="default"
        onConfirm={performVerifyVendor}
      />

      <ConfirmDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title="Remove vendor"
        description="Remove this vendor (soft-delete)?"
        confirmLabel="Remove"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onConfirm={performRemoveVendor}
      />
  );
};

export default VendorsPage;
