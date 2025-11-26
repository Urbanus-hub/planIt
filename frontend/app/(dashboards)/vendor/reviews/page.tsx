"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Search,
  RefreshCw,
  TrendingUp,
  MessageCircle,
  Award,
  AlertCircle,
  ThumbsUp,
  Flag,
  Eye,
  Sparkles,
  Trophy,
  Flame,
} from "lucide-react";
import AnimatedList from "@/components/ui/animated-list";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useAuth } from "@/contexts/AuthContext";

type Review = {
  _id: string;
  clientName?: string;
  clientImage?: string;
  rating?: number;
  title?: string;
  content?: string;
  serviceTitle?: string;
  date?: string;
  verified?: boolean;
  helpful?: number;
  unhelpful?: number;
  status?: "published" | "pending" | "flagged";
  sentiment?: "positive" | "neutral" | "negative";
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [flagOpen, setFlagOpen] = useState(false);
  const [pendingFlagId, setPendingFlagId] = useState<string | null>(null);

  const { user } = useAuth();

  const mockReviews: Review[] = [
   
  ];

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      setReviews(mockReviews);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch reviews");
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = useMemo(() => {
    let list = reviews;

    if (activeTab === "published") {
      list = reviews.filter((r) => r.status === "published");
    } else if (activeTab === "flagged") {
      list = reviews.filter((r) => r.status === "flagged");
    }

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        (r.clientName || "").toLowerCase().includes(q) ||
        (r.title || "").toLowerCase().includes(q) ||
        (r.content || "").toLowerCase().includes(q)
    );
  }, [reviews, query, activeTab]);

  const stats = useMemo(() => {
    if (reviews.length === 0)
      return {
        averageRating: 0,
        totalReviews: 0,
        fiveStarCount: 0,
        fourStarCount: 0,
        threeStarCount: 0,
        twoStarCount: 0,
        oneStarCount: 0,
        verifiedCount: 0,
      };

    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    const verifiedCount = reviews.filter((r) => r.verified).length;

    return {
      averageRating,
      totalReviews: reviews.length,
      fiveStarCount: reviews.filter((r) => r.rating === 5).length,
      fourStarCount: reviews.filter((r) => r.rating === 4).length,
      threeStarCount: reviews.filter((r) => r.rating === 3).length,
      twoStarCount: reviews.filter((r) => r.rating === 2).length,
      oneStarCount: reviews.filter((r) => r.rating === 1).length,
      verifiedCount,
    };
  }, [reviews]);

  const flagReview = (id: string) => {
    setPendingFlagId(id);
    setFlagOpen(true);
  };

  const performFlagReview = async () => {
    if (!pendingFlagId) return;
    try {
      setReviews((prev) =>
        prev.map((r) =>
          r._id === pendingFlagId ? { ...r, status: "flagged" } : r
        )
      );
      toast.success("Review reported successfully");
    } catch (err: any) {
      toast.error("Failed to report review");
    } finally {
      setFlagOpen(false);
      setPendingFlagId(null);
    }
  };

  const animatedListItems = filtered.map((review) => (
    <div className="w-full">
      <motion.div
        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-400 transition-all cursor-pointer shadow-sm hover:shadow-md"
        onClick={() => setSelectedReview(review)}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {review.clientName?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-gray-900 font-semibold text-sm">
                    {review.clientName || "Anonymous"}
                  </h4>
                  {review.verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs border-green-200">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-emerald-600 font-medium">
                  {review.serviceTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < (review.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-900">
                {review.rating}.0
              </span>
              <span className="text-xs text-gray-500">
                {new Date(review.date || "").toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-1">
              {review.title}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              "{review.content}"
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{review.helpful}</span>
              </div>
              <span>•</span>
              <span className="text-gray-400">
                {Math.floor(Math.random() * 500 + 100)} views
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReview(review);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                flagReview(review._id);
              }}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  ));

  const renderRatingBar = (count: number, total: number, stars: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div key={stars} className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 min-w-6 text-right">
          {count}
        </span>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
                Reviews & Ratings
              </h1>
              <p className="text-slate-600 text-lg">
                Build trust and credibility with client feedback
              </p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="hidden md:block p-4 bg-emerald-50 rounded-lg border border-emerald-200"
            >
              <Trophy className="h-8 w-8 text-emerald-600" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8"
        >
          {[
            {
              label: "Avg Rating",
              value: stats.averageRating.toFixed(1),
              icon: Star,
              color: "text-yellow-600",
              bg: "bg-yellow-50",
              suffix: "/5",
            },
            {
              label: "Total Reviews",
              value: stats.totalReviews,
              icon: MessageCircle,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Verified",
              value: stats.verifiedCount,
              icon: Award,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "5-Star Rating",
              value: stats.fiveStarCount,
              icon: Flame,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Trending Score",
              value: Math.round((stats.averageRating / 5) * 100),
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              suffix: "%",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="bg-white hover:shadow-md transition-all border border-gray-200">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-xs font-medium">
                          {stat.label}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                          {stat.value}
                          {stat.suffix}
                        </p>
                      </div>
                      <div className={`${stat.bg} p-2 rounded-lg`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-gray-900 text-lg">
                Rating Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const countMap: any = {
                    5: stats.fiveStarCount,
                    4: stats.fourStarCount,
                    3: stats.threeStarCount,
                    2: stats.twoStarCount,
                    1: stats.oneStarCount,
                  };
                  return renderRatingBar(
                    countMap[stars],
                    stats.totalReviews,
                    stars
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reviews by client name or content..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-emerald-500"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={fetchReviews}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-10"
        >
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    All Reviews
                  </CardTitle>
                  <CardDescription className="text-gray-500 mt-1">
                    {filtered.length} review{filtered.length !== 1 ? "s" : ""} •
                    Click to view details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 border border-gray-200 p-1">
                  {["all", "published"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm text-xs md:text-sm text-gray-600"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <div className="animate-spin h-10 w-10 border-4 border-gray-200 border-t-emerald-600 rounded-full mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        Loading reviews...
                      </p>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">{error}</p>
                      <Button
                        onClick={fetchReviews}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Try Again
                      </Button>
                    </motion.div>
                  ) : filtered.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        No reviews in this category
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Reviews will appear here as clients submit them
                      </p>
                    </motion.div>
                  ) : (
                    <AnimatedList
                      items={animatedListItems}
                      className="w-full"
                      itemClassName="w-full"
                      displayScrollbar={true}
                      enableArrowNavigation={true}
                      showGradients={true}
                   
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReview(null)}
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {selectedReview.clientName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedReview.clientName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          selectedReview.date || ""
                        ).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (selectedReview.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {selectedReview.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedReview(null)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {selectedReview.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedReview.content}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">Service</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {selectedReview.serviceTitle}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">
                      Helpful Votes
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {selectedReview.helpful} people found this helpful
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300"
                  onClick={() => setSelectedReview(null)}
                >
                  Close
                </Button>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Respond
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={flagOpen}
        onOpenChange={(open) => {
          setFlagOpen(open);
          if (!open) setPendingFlagId(null);
        }}
        title="Report This Review"
        description="Are you sure you want to report this review? Our team will review it."
        confirmLabel="Report"
        onConfirm={performFlagReview}
      />
    </div>
  );
}
