"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);

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
          Welcome Back
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to continue to PlanIt
        </p>
      </div>

      <form
        className={cn("flex flex-col gap-5", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <FieldGroup>
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
            <div className="flex items-center justify-between mb-2">
              <FieldLabel
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Password
              </FieldLabel>
              <Link
                href="/forgot-password"
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400"
                required
              />
            </div>
          </Field>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold text-base group"
          >
            {isLoading ? (
              "Logging in..."
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
