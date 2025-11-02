"use client";

import { LoginForm } from "@/components/login-form";
import { Sparkles, TrendingUp, Users, Shield } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
          alt="Beautiful wedding venue"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-black/70 to-black/80"></div>

        {/* Animated Accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-green-400/10"></div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          

          {/* Main Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  50,000+ Events Planned
                </span>
              </div>

              <h1 className="text-5xl xl:text-6xl font-serif font-bold leading-tight">
                Welcome Back to
                <br />
                Your Event
                <br />
                <span className="text-green-400">Journey</span>
              </h1>

              <p className="text-xl text-white/90 max-w-md leading-relaxed">
                Continue creating unforgettable moments with the best vendors in
                the industry.
              </p>
            </div>

            {/* Feature Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-white/70">Vendors</div>
              </div>
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-sm text-white/70">Satisfaction</div>
              </div>
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/70">Support</div>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="mt-auto">
            <div className="border-l-4 border-green-400 pl-4 py-2">
              <p className="text-white/90 italic text-lg mb-2">
                "PlanIt transformed how we manage our events. Simply amazing!"
              </p>
              <p className="text-white/60 text-sm">
                — Sarah Johnson, Event Planner
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          <LoginForm />

          {/* Sign up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
