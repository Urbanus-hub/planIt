"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      if (response.data.success) {
        const user = response.data.data;

        toast.success("Welcome back!", {
          description: `You're now logged in as ${user.name}`,
        });

        // Redirect based on user role
        switch (user.role) {
          case "admin":
            router.push("/admin");
            break;
          case "vendor":
            router.push("/vendor");
            break;
          case "client":
            router.push("/client");
            break;
          default:
            router.push("/");
        }
      }
    } catch (err: any) {
      toast.error("Login failed", {
        description:
          err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
