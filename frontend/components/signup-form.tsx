"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Building2,
  ArrowRight,
  Sparkles,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type UserRole = "client" | "vendor";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your login logic here
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join PlanIt and start planning today
        </p>
      </div>

      <form
        className={cn("space-y-5", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <FieldGroup>
          {/* Role Selection */}
          <div className="mb-6">
            <FieldLabel className="text-gray-900 dark:text-white font-semibold mb-3">
              I want to...
            </FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("client")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  selectedRole === "client"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                )}
              >
                <User
                  className={cn(
                    "w-6 h-6 mx-auto mb-2",
                    selectedRole === "client"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                />
                <div
                  className={cn(
                    "font-semibold text-sm",
                    selectedRole === "client"
                      ? "text-green-700 dark:text-green-400"
                      : "text-gray-900 dark:text-white"
                  )}
                >
                  Plan Events
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("vendor")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  selectedRole === "vendor"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                )}
              >
                <Briefcase
                  className={cn(
                    "w-6 h-6 mx-auto mb-2",
                    selectedRole === "vendor"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                />
                <div
                  className={cn(
                    "font-semibold text-sm",
                    selectedRole === "vendor"
                      ? "text-green-700 dark:text-green-400"
                      : "text-gray-900 dark:text-white"
                  )}
                >
                  Offer Services
                </div>
              </button>
            </div>
          </div>

          {/* Name Field */}
          <Field>
            <FieldLabel
              htmlFor="name"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Full Name
            </FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400"
                required
              />
            </div>
          </Field>

          {/* Email Field */}
          <Field>
            <FieldLabel
              htmlFor="email"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Email Address
            </FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400"
                required
              />
            </div>
          </Field>

          {/* Password Field */}
          <Field>
            <FieldLabel
              htmlFor="password"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Password
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400"
                minLength={6}
                required
              />
            </div>
          </Field>

          {/* Vendor Business Name */}
          {selectedRole === "vendor" && (
            <Field>
              <FieldLabel
                htmlFor="businessName"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Business Name
              </FieldLabel>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your Company Name"
                  className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400"
                  required={selectedRole === "vendor"}
                />
              </div>
            </Field>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold text-base group"
          >
            {isLoading ? (
              "Creating Account..."
            ) : (
              <>
                Get Started
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
