"use client";

import React, { useEffect, useMemo, useState } from "react";
import { bookingsAPI } from "@/lib/api";
import { toast } from "sonner";
import { Calendar, Package, User, Eye, X, RefreshCw } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type Booking = {
  _id: string;
  clientName?: string;
  vendorName?: string;
  serviceTitle?: string;
  date?: string;
  status?: string;
  amount?: number;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingsAPI.getAll();
      const data = res.data?.data || res.data || [];
      setBookings(data as Booking[]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const performCancelBooking = async (id: string) => {
    try {
      await bookingsAPI.cancel(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Booking cancelled");
    } catch (err: any) {
      toast.error("Failed to cancel booking", { description: err?.message });
    }
  };

  const requestCancelBooking = (id: string) => {
    setPendingCancelId(id);
    setCancelOpen(true);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = bookings;
    if (activeTab === "upcoming")
      list = bookings.filter(
        (b) => b.status === "upcoming" || b.status === "confirmed"
      );
    if (activeTab === "completed")
      list = bookings.filter((b) => b.status === "completed");
    if (activeTab === "cancelled")
      list = bookings.filter((b) => b.status === "cancelled");

    if (!q) return list;
    return list.filter((b) => {
      return (
        (b.clientName || "").toLowerCase().includes(q) ||
        (b.vendorName || "").toLowerCase().includes(q) ||
        (b.serviceTitle || "").toLowerCase().includes(q)
      );
    });
  }, [bookings, query, activeTab]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Bookings
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Manage bookings across the platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search bookings"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64"
            />
            <Button onClick={fetchBookings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Booking Directory</CardTitle>
            <CardDescription className="text-slate-500">
              List of all bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 pt-4">
                <TabsList className="grid w-full grid-cols-4 bg-slate-50 dark:bg-slate-800/20">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger
                    value="cancelled"
                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                  >
                    Cancelled
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
                  <div className="p-4 text-red-600">{error}</div>
                ) : filtered.length === 0 ? (
                  <div className="p-8 text-center text-slate-600 dark:text-slate-300">
                    No bookings found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-800/20">
                        <TableRow>
                          <TableHead className="text-slate-800 dark:text-slate-100">
                            Booking
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden md:table-cell">
                            Client
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden lg:table-cell">
                            Vendor
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100 hidden sm:table-cell">
                            Service
                          </TableHead>
                          <TableHead className="text-slate-800 dark:text-slate-100">
                            Date
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
                        {filtered.map((b) => (
                          <TableRow
                            key={b._id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/20"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={undefined}
                                    alt={b.clientName || "Client"}
                                  />
                                  <AvatarFallback>
                                    {(b.clientName || "")
                                      .slice(0, 2)
                                      .toUpperCase() || "B"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {b._id.slice?.(0, 8) || b._id}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-slate-700 dark:text-slate-300">
                              {b.clientName || "—"}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-slate-700 dark:text-slate-300">
                              {b.vendorName || "—"}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-slate-700 dark:text-slate-300">
                              {b.serviceTitle || "—"}
                            </TableCell>
                            <TableCell className="text-sm text-slate-700 dark:text-slate-300">
                              {b.date ? new Date(b.date).toLocaleString() : "—"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  b.status === "confirmed"
                                    ? "bg-emerald-600 text-white"
                                    : b.status === "completed"
                                    ? "bg-slate-700 text-white"
                                    : b.status === "cancelled"
                                    ? "bg-red-600 text-white"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {b.status || "unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  onClick={() => setSelected(b)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {b.status !== "cancelled" && (
                                  <Button
                                    variant="destructive"
                                    onClick={() => requestCancelBooking(b._id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
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

        {/* Details drawer/modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSelected(null)}
            />
            <div className="ml-auto w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-xl p-6 overflow-auto">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Booking {selected._id.slice?.(0, 8) || selected._id}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selected.serviceTitle}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelected(null)}
                  className="p-0"
                >
                  <span className="sr-only">Close</span>
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  <strong>Client:</strong> {selected.clientName}
                </div>
                <div>
                  <strong>Vendor:</strong> {selected.vendorName}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {selected.date
                    ? new Date(selected.date).toLocaleString()
                    : "—"}
                </div>
                <div>
                  <strong>Status:</strong> {selected.status}
                </div>
                <div>
                  <strong>Amount:</strong>{" "}
                  {selected.amount ? `$${selected.amount.toFixed(2)}` : "—"}
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  {selected.status !== "cancelled" && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        // open confirm modal for the selected booking
                        setPendingCancelId(selected._id);
                        setCancelOpen(true);
                        setSelected(null);
                      }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  <Button onClick={() => setSelected(null)}>Close</Button>
                </div>
              </div>
              {/* Confirm dialog for cancelling bookings */}
              <ConfirmDialog
                open={cancelOpen}
                onOpenChange={(o) => {
                  setCancelOpen(o);
                  if (!o) setPendingCancelId(null);
                }}
                title="Cancel booking"
                description="Are you sure you want to cancel this booking? This action can be reverted by the vendor or admin."
                confirmLabel="Yes, cancel"
                cancelLabel="No, keep"
                confirmVariant="destructive"
                onConfirm={async () => {
                  if (!pendingCancelId) return;
                  await performCancelBooking(pendingCancelId);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
