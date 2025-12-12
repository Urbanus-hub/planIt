"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  TrendingUp,
  Shield,
  CreditCard,
  Smartphone,
  DollarSign,
  Sparkles,
  Lock,
  Zap,
} from "lucide-react";

export default function PaymentsPage() {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen w-full bg-linear-to-br from-slate-50 via-emerald-50/20 to-slate-100 dark:from-gray-950 dark:via-emerald-950/10 dark:to-gray-900 p-6 md:p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Page Header */}
          <div className="text-center space-y-4 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm mb-4">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Premium Payment Solutions
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 dark:from-white dark:via-emerald-300 dark:to-white bg-clip-text text-transparent leading-tight">
              Payment Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Experience seamless, secure, and instant payment processing
            </p>
          </div>

          {/* Premium Payment Coming Soon Section */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-gray-900/90 dark:via-emerald-950/20 dark:to-gray-900/80 border-0 shadow-2xl backdrop-blur-xl">
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5" />

            {/* Animated mesh gradient */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptLTQgMTJ2MmgtMnYtMmgyek0yOCAzNHYyaC0ydi0yaDF6bTAtNHYyaC0ydi0yaDJ6bTAtNHYyaC0ydi0yaDJ6bTAtNHYyaC0ydi0yaDJ6bS00IDEydjJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] animate-[scroll_30s_linear_infinite]" />
            </div>

            <CardContent className="relative p-10 md:p-20">
              <div className="flex flex-col items-center text-center space-y-10">
                {/* Premium Icon with glassmorphism */}
                <div className="relative group">
                  {/* Outer glow */}
                  <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 dark:from-emerald-400/10 dark:via-teal-400/10 dark:to-emerald-400/10 blur-3xl group-hover:blur-4xl transition-all duration-700 animate-pulse" />

                  {/* Glass card */}
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 group-hover:scale-105 transition-transform duration-500">
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/40 to-white/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Inner gradient ring */}
                    <div className="absolute inset-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-400/10 dark:to-teal-400/10 blur-xl" />

                    {/* Icon container */}
                    <div className="relative h-28 w-28 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/50 dark:shadow-emerald-400/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/60 transition-all duration-500">
                      <DollarSign className="h-14 w-14 text-white drop-shadow-lg animate-[pulse_3s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>

                {/* Premium Coming Soon Badge */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-emerald-600/10 dark:from-emerald-400/10 dark:via-teal-400/10 dark:to-emerald-400/10 backdrop-blur-sm px-8 py-4 rounded-full border border-emerald-300/30 dark:border-emerald-700/30 shadow-lg">
                  <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-[spin_4s_linear_infinite]" />
                  <span className="text-base font-bold text-transparent bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text uppercase tracking-[0.2em]">
                    Coming Soon
                  </span>
                </div>

                {/* Premium Main Content */}
                <div className="max-w-4xl space-y-8">
                  <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 dark:from-white dark:via-emerald-300 dark:to-white bg-clip-text text-transparent leading-tight">
                    Enterprise-Grade Payment Integration
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                    Experience the future of payments with our revolutionary
                    platform. Process transactions seamlessly with
                    <span className="font-semibold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text">
                      {" "}
                      M-Pesa, Credit Cards, and Digital Wallets
                    </span>
                    .
                  </p>

                  {/* Premium Timeline */}
                  <div className="pt-6 pb-4">
                    <div className="inline-flex flex-col items-center gap-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm px-12 py-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                        Expected Launch
                      </p>
                      <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text">
                        Q1 2026
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Feature Badges */}
                <div className="flex flex-wrap gap-4 justify-center pt-8">
                  <Badge className="group bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 px-6 py-3.5 text-base border border-emerald-200/50 dark:border-emerald-700/50 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                    <Smartphone className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    M-Pesa Integration
                  </Badge>
                  <Badge className="group bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 px-6 py-3.5 text-base border border-emerald-200/50 dark:border-emerald-700/50 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                    <CreditCard className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Card Payments
                  </Badge>
                  <Badge className="group bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 px-6 py-3.5 text-base border border-emerald-200/50 dark:border-emerald-700/50 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                    <Lock className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Bank-Level Security
                  </Badge>
                  <Badge className="group bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 px-6 py-3.5 text-base border border-emerald-200/50 dark:border-emerald-700/50 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                    <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Instant Confirmation
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <Card className="group relative overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-px rounded-lg bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40" />
              <CardContent className="relative p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 backdrop-blur-sm flex items-center justify-center mx-auto border border-emerald-200/30 dark:border-emerald-700/30 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bank-Level Security
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your payment information is encrypted with military-grade
                  security protocols and protected with industry-leading
                  measures.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-px rounded-lg bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40" />
              <CardContent className="relative p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 backdrop-blur-sm flex items-center justify-center mx-auto border border-emerald-200/30 dark:border-emerald-700/30 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Multiple Payment Options
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Choose from M-Pesa, credit cards, debit cards, and digital
                  wallets for maximum convenience and flexibility.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-px rounded-lg bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40" />
              <CardContent className="relative p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 backdrop-blur-sm flex items-center justify-center mx-auto border border-emerald-200/30 dark:border-emerald-700/30 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Zap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Instant Processing
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Lightning-fast payment processing with automatic confirmations
                  sent to both parties in real-time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
