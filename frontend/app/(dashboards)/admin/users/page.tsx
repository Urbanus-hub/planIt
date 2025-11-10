"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api, { authAPI } from "@/lib/api";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  Building,
  Filter,
  Download,
  UserPlus,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type UserItem = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  businessName?: string;
  joinedDate?: string;
  lastLoginAt?: string;
  profileImage?: string;
  servicesCount?: number;
  bookingsCount?: number;
  rating?: number;
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.getAllUser();
      if (response.data?.success) {
        setUsers(response.data.data || []);
      } else {
        setError("Failed to load users");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    let filteredUsers = users;

    // Filter by tab
    if (activeTab === "active") {
      filteredUsers = users.filter((u) => u.isActive);
    } else if (activeTab === "inactive") {
      filteredUsers = users.filter((u) => !u.isActive);
    } else if (activeTab === "vendors") {
      filteredUsers = users.filter((u) => u.role === "vendor");
    } else if (activeTab === "customers") {
      filteredUsers = users.filter((u) => u.role === "client");
    }

    // Filter by search query
    if (!query) return filteredUsers;
    const q = query.toLowerCase();
    return filteredUsers.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q) ||
        (u.businessName || "").toLowerCase().includes(q)
    );
  }, [users, query, activeTab]);

  const toggleActive = async (id: string, current: boolean | undefined) => {
    const next = !current;
    // optimistic update

    try {
      const toggledUser = await authAPI.toggleUserActiveness(id, {
        active: next,
      });
      if (!toggledUser.data?.success) {
        toast.error("Failed to change user status", {
          description: "Server did not confirm the change.",
        });
        return;
      }
      if (toggledUser.data?.success) {
        toast.success(next ? "User activated" : "User deactivated");
      }
    } catch (err: any) {
      // rollback on error
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: current } : u))
      );
      toast.error("Failed to change user status", {
        description: err?.message,
      });
    }
  };

  const removeUser = async (id: string) => {
    // open confirm dialog instead
    setPendingRemoveId(id);
    setRemoveOpen(true);
  };

  // Confirm dialog state for removal
  const [removeOpen, setRemoveOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const performRemoveUser = async () => {
    if (!pendingRemoveId) return;
    try {
      await api.delete(`/users/${pendingRemoveId}`);
      setUsers((prev) => prev.filter((u) => u._id !== pendingRemoveId));
      toast.success("User removed");
    } catch (err: any) {
      toast.error("Failed to remove user", { description: err?.message });
    } finally {
      setRemoveOpen(false);
      setPendingRemoveId(null);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const vendors = users.filter((u) => u.role === "vendor").length;
    const customers = users.filter((u) => u.role === "client").length;

    return { total, active, vendors, customers };
  }, [users]);

  return (
    <div className="min-h-screen  dark:from-green-950 dark:to-emerald-950">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <ConfirmDialog
              open={removeOpen}
              onOpenChange={setRemoveOpen}
              title="Delete user"
              description="Delete (deactivate) this user? This is a soft-delete."
              confirmLabel="Delete"
              cancelLabel="Cancel"
              confirmVariant="destructive"
              onConfirm={performRemoveUser}
            />
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-100">
              User Management
            </h1>
            <p className="text-green-600 dark:text-green-300 mt-1">
              Manage platIt users and Vendors
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-100">
                {stats.total}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Registered accounts
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-100">
                {stats.active}
              </div>
              <Progress
                value={(stats.active / stats.total) * 100}
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-100">
                {stats.vendors}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Vendors on platIt
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-100">
                {stats.customers}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Service seekers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email, role..."
                  className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <Button
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={() => fetchUsers()}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-green-200 dark:border-green-800 overflow-hidden">
          <CardHeader className=" dark:bg-green-900/30">
            <CardTitle className="text-green-800 dark:text-green-100">
              Users
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-300">
              Manage all users on the PlanIt platform
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
                <TabsList className="grid w-full grid-cols-5 bg-green-100 dark:bg-green-900/30">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="inactive"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    Inactive
                  </TabsTrigger>
                  <TabsTrigger
                    value="vendors"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    Vendors
                  </TabsTrigger>
                  <TabsTrigger
                    value="customers"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    Customers
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
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : filtered.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-green-800 dark:text-green-100 mb-2">
                      No users found
                    </h3>
                    <p className="text-green-600 dark:text-green-300">
                      {query
                        ? "Try adjusting your search or filter criteria"
                        : "There are no users to display"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-green-50 dark:bg-green-900/20">
                        <TableRow>
                          <TableHead className="text-green-800 dark:text-green-100">
                            User
                          </TableHead>
                          <TableHead className="text-green-800 dark:text-green-100">
                            Contact
                          </TableHead>
                          <TableHead className="text-green-800 dark:text-green-100">
                            Role
                          </TableHead>
                          <TableHead className="text-green-800 dark:text-green-100">
                            Joined
                          </TableHead>
                          <TableHead className="text-green-800 dark:text-green-100">
                            Status
                          </TableHead>
                          <TableHead className="text-green-800 dark:text-green-100">
                            Performance
                          </TableHead>
                          <TableHead className="text-right text-green-800 dark:text-green-100">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((u) => (
                          <TableRow
                            key={u._id}
                            className="hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-green-200">
                                  <AvatarImage
                                    src={u.profileImage}
                                    alt={u.name}
                                  />
                                  <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                    {u.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                      .slice(0, 2) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-green-800 dark:text-green-100">
                                    {u.name || "—"}
                                  </div>
                                  {u.businessName && (
                                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-300">
                                      <Building className="h-3 w-3" />
                                      {u.businessName}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-green-700 dark:text-green-300">
                                <Mail className="h-4 w-4" />
                                {u.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  u.role === "vendor" ? "default" : "secondary"
                                }
                                className={
                                  u.role === "vendor"
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : u.role == "admin"
                                    ? "bg-orange-600 text-white hover:bg-orange-700"
                                    : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
                                }
                              >
                                <Shield className="mr-1 h-3 w-3" />
                                {u.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-green-700 dark:text-green-300">
                                <Calendar className="h-4 w-4" />
                                {u.joinedDate
                                  ? new Date(u.joinedDate).toLocaleDateString()
                                  : "—"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={u.isActive ? "default" : "secondary"}
                                className={
                                  u.isActive
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                                }
                              >
                                {u.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {u.servicesCount !== undefined && (
                                  <div className="text-xs text-green-700 dark:text-green-300">
                                    Services:{" "}
                                    <span className="font-medium">
                                      {u.servicesCount}
                                    </span>
                                  </div>
                                )}
                                {u.bookingsCount !== undefined && (
                                  <div className="text-xs text-green-700 dark:text-green-300">
                                    Bookings:{" "}
                                    <span className="font-medium">
                                      {u.bookingsCount}
                                    </span>
                                  </div>
                                )}
                                {u.rating !== undefined && (
                                  <div className="flex items-center gap-1">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <svg
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < Math.floor(u.rating || 0)
                                              ? "text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                    <span className="text-xs text-green-700 dark:text-green-300">
                                      ({u.rating?.toFixed(1)})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="border-green-200 dark:border-green-800"
                                >
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/admin/users/${u._id}`}
                                      className="flex items-center cursor-pointer"
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toggleActive(u._id, u.isActive)
                                    }
                                    className="cursor-pointer"
                                  >
                                    {u.isActive ? (
                                      <>
                                        <UserX className="mr-2 h-4 w-4" />
                                        Deactivate User
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Activate User
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => removeUser(u._id)}
                                    className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove User
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
    </div>
  );
};

export default UsersPage;
