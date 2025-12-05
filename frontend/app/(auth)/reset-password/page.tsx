"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Invalid reset link");
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword({ token, password });

      if (response.data.success) {
        toast.success("Password reset successful!");
        setResetSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                PlanIt
              </span>
            </Link>
          </div>

          {!resetSuccess ? (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Set New Password
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your new password below
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-green-500 dark:focus:border-green-400 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-green-500 dark:focus:border-green-400 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  {isLoading ? (
                    "Resetting Password..."
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Password Reset!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Your password has been successfully reset.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Redirecting to login page...
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background Image */}
        <img
          src="/hero.png"
          alt="Reset Password"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-black/70 to-black/80"></div>

        {/* Animated Accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-green-400/10"></div>

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center p-12 text-white">
          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-bold">Almost There!</h2>
            <p className="text-lg text-white/90">
              Create a strong password to keep your account secure and access
              all the amazing features PlanIt has to offer.
            </p>
            <div className="space-y-4 pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <p className="text-white/90">Use at least 6 characters</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <p className="text-white/90">Mix letters and numbers</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <p className="text-white/90">Keep it unique and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
