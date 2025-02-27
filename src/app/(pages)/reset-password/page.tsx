"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthCarousel from "@/components/common/AuthCarousel";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();

  // Form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"email" | "verification">(
    "email"
  );
  const [successMessage, setSuccessMessage] = useState("");

  // Auth methods
  const { sendResetOtp, verifyResetOtpAndSetPassword } = useAuth();

  // Carousel images
  const carouselImages = [
    "/hero-images/hero-img-1.webp",
    "/hero-images/hero-img-2.webp",
    "/hero-images/hero-img-3.webp",
    "/hero-images/hero-img-4.webp",
  ];

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (!email) {
      setError("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const result = await sendResetOtp(email);
      if (result.success) {
        setCurrentStep("verification");
        setSuccessMessage(
          result.message || "Verification code sent successfully"
        );
      } else {
        setError(result.error || "Failed to send verification code");
      }
    } catch (error: any) {
      setError(error.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation
    if (!otp) {
      setError("Please enter the verification code");
      return;
    }

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyResetOtpAndSetPassword(email, otp, password);
      if (result.success) {
        setSuccessMessage(result.message || "Password reset successfully");
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push(result.redirectUrl || "/login");
        }, 2000);
      } else {
        setError(result.error || "Failed to reset password");
      }
    } catch (error: any) {
      setError(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const result = await sendResetOtp(email);
      if (result.success) {
        setSuccessMessage(
          result.message || "Verification code resent successfully"
        );
      } else {
        setError(result.error || "Failed to resend verification code");
      }
    } catch (error: any) {
      setError(error.message || "Failed to resend verification code");
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setCurrentStep("email");
    setError("");
    setSuccessMessage("");
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <div className="min-h-[calc(100vh-67px)] flex flex-col md:flex-row bg-white dark:bg-black">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-8 lg:px-8 relative">
        {/* Subtle background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/30 dark:to-black opacity-70 z-0"></div>

        {/* Form content with animation */}
        <motion.div
          className="max-w-md w-full relative z-10"
          initial="hidden"
          animate="visible"
          variants={formVariants}>
          {/* Logo */}
          <div className="flex justify-center mb-0 relative w-[200px] h-[120px] aspect-video mx-auto">
            <Image
              src="/cypress-logo.svg"
              alt="Cypress Logo"
              fill
              className="opacity-90 object-contain dark:invert"
            />
          </div>

          <div className="text-center mb-8">
            <motion.h2
              className="text-2xl font-extralight uppercase tracking-[0.25em] text-gray-900 dark:text-white"
              variants={itemVariants}>
              {currentStep === "email" ? "Reset Password" : "Verify Your Email"}
            </motion.h2>
            <div className="mt-3 mx-auto h-px w-12 bg-cypress-green/30"></div>
            <motion.p
              className="mt-4 text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed"
              variants={itemVariants}>
              {currentStep === "email"
                ? "Enter your email address and we'll send you a verification code to reset your password"
                : `We've sent a verification code to ${email}. Please check your inbox for the code.`}
            </motion.p>
          </div>

          {successMessage && (
            <motion.div
              className="mb-6 text-green-600 text-center text-sm px-4 py-3 border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 rounded-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}>
              {successMessage}
            </motion.div>
          )}

          {currentStep === "email" ? (
            // Step 1: Enter email form
            <form className="space-y-7" onSubmit={handleSendResetOtp}>
              {error && (
                <motion.div
                  className="text-red-500 text-center text-sm px-4 py-3 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}>
                  {error}
                </motion.div>
              )}

              {/* Email Field */}
              <motion.div className="group relative" variants={itemVariants}>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full px-0 py-2 border-0 border-b focus:border-0 focus:border-b bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-0 focus:border-cypress-green placeholder-transparent text-base"
                  placeholder="Email address"
                />
                <label
                  htmlFor="email-address"
                  className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-400 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:dark:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:dark:text-gray-300 peer-focus:text-xs tracking-wide">
                  Email Address
                </label>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 border border-transparent text-sm font-medium tracking-widest uppercase text-white bg-cypress-green shadow-sm hover:bg-cypress-green-light focus:outline-none focus:ring-1 focus:ring-cypress-green dark:focus:ring-offset-gray-900 transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing</span>
                    </div>
                  ) : (
                    "Send Verification Code"
                  )}
                </motion.button>
              </motion.div>

              <motion.div
                className="text-xs text-center pt-6 border-t border-gray-200 dark:border-gray-800"
                variants={itemVariants}>
                <Link
                  href="/login"
                  className="font-light text-gray-500 hover:text-cypress-green dark:text-gray-400 dark:hover:text-cypress-green-light transition-colors">
                  Remember your password? Sign in
                </Link>
              </motion.div>
            </form>
          ) : (
            // Step 2: Verification and password reset form
            <form className="space-y-7" onSubmit={handleResetPassword}>
              {error && (
                <motion.div
                  className="text-red-500 text-center text-sm px-4 py-3 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}>
                  {error}
                </motion.div>
              )}

              <div className="space-y-5">
                {/* OTP Field */}
                <motion.div className="group relative" variants={itemVariants}>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="peer w-full px-0 py-2 border-0 border-b focus:border-0 focus:border-b bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-0 focus:border-cypress-green placeholder-transparent text-base tracking-wider"
                    placeholder="Verification Code"
                  />
                  <label
                    htmlFor="otp"
                    className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-400 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:dark:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:dark:text-gray-300 peer-focus:text-xs tracking-wide">
                    Verification Code
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-cypress-green hover:text-cypress-green-light transition-colors">
                      Resend code
                    </button>
                  </p>
                </motion.div>

                {/* New Password Field */}
                <motion.div className="group relative" variants={itemVariants}>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full px-0 py-2 border-0 border-b focus:border-0 focus:border-b bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-0 focus:border-cypress-green placeholder-transparent text-base"
                    placeholder="New Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-400 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:dark:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:dark:text-gray-300 peer-focus:text-xs tracking-wide">
                    New Password
                  </label>
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div className="group relative" variants={itemVariants}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="peer w-full px-0 py-2 border-0 border-b focus:border-0 focus:border-b bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-0 focus:border-cypress-green placeholder-transparent text-base"
                    placeholder="Confirm New Password"
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-400 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:dark:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:dark:text-gray-300 peer-focus:text-xs tracking-wide">
                    Confirm New Password
                  </label>
                </motion.div>
              </div>

              <div className="flex flex-col space-y-5 pt-3">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 border border-transparent text-sm font-medium tracking-widest uppercase text-white bg-cypress-green shadow-sm hover:bg-cypress-green-light focus:outline-none focus:ring-1 focus:ring-cypress-green dark:focus:ring-offset-gray-900 transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Resetting Password</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={goBackToEmail}
                  className="text-xs text-gray-500 hover:text-cypress-green dark:text-gray-400 dark:hover:text-cypress-green-light transition-colors py-1"
                  variants={itemVariants}>
                  Use a different email address
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      {/* Right side - Image Carousel */}
      <div className="hidden md:block md:w-1/2">
        <div className="h-full w-full relative">
          <AuthCarousel
            images={carouselImages}
            title="Welcome Back"
            subtitle="Reset your password to regain access to your account and continue your journey with us."
            animationType="crossfade"
          />
        </div>
      </div>
    </div>
  );
}
