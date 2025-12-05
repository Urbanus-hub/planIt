"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword({ email });

      if (response.data.success) {
        toast.success("Email sent!", {
          description: response.data.message,
        });
        setEmailSent(true);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
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

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  No worries, we'll send you reset instructions
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-green-500 dark:focus:border-green-400 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
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
                  Check Your Email
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent password reset instructions to
                </p>
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  {email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
                  Didn't receive the email? Check your spam folder or try again
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Try Different Email
                </Button>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
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
          alt="Forgot Password"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-black/70 to-black/80"></div>

        {/* Animated Accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-green-400/10"></div>

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center p-12 text-white">
          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-bold">Don't Worry!</h2>
            <p className="text-lg text-white/90">
              Password resets happen to the best of us. We'll help you get back
              into your account in no time.
            </p>
            <div className="space-y-4 pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <p className="text-white/90">Secure password reset process</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <p className="text-white/90">Link expires in 1 hour</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <p className="text-white/90">Your data stays protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
