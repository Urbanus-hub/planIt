"use client";

import { Sparkles, Check, Star, Zap, Heart } from "lucide-react";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          <SignupForm />
          
          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
          alt="Beautiful outdoor wedding celebration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-bl from-green-900/90 via-black/70 to-black/80"></div>
        
        {/* Animated Accent */}
        <div className="absolute inset-0 bg-gradient-to-tl from-green-500/20 via-transparent to-green-400/10"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
        
         
          {/* Main Content */}
          <div className="space-y-8 animate-slide-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Join 50,000+ Happy Users</span>
              </div>

              <h1 className="text-5xl xl:text-6xl font-serif font-bold leading-tight">
                Start Your
                <br />
                Event Planning
                <br />
                <span className="text-green-400">Adventure</span>
              </h1>

              <p className="text-xl text-white/90 max-w-md leading-relaxed">
                Create an account and unlock access to thousands of verified vendors and seamless event management.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 flex-shrink-0 mt-1">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Free to Join</h3>
                  <p className="text-sm text-white/70">No credit card required. Start planning immediately.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 flex-shrink-0 mt-1">
                  <Star className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Verified Vendors</h3>
                  <p className="text-sm text-white/70">Connect with trusted professionals in your area.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 flex-shrink-0 mt-1">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Instant Booking</h3>
                  <p className="text-sm text-white/70">Book services with just a few clicks.</p>
                </div>
              </div>
            </div>
          </div>

          
          
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
