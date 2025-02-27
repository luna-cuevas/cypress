"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuthCarousel from "@/components/common/AuthCarousel";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  // Carousel images
  const carouselImages = [
    "/hero-images/hero-img-4.webp",
    "/hero-images/hero-img-3.webp",
    "/hero-images/hero-img-2.webp",
    "/hero-images/hero-img-1.webp",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/account");
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-67px)] flex flex-col md:flex-row bg-white dark:bg-black">
      {/* Left side - Image Carousel (only visible on medium screens and up) */}
      <div className="hidden md:block md:w-1/2">
        <div className="h-full w-full relative">
          <AuthCarousel
            images={carouselImages}
            title="Return to Elegance"
            subtitle="Your curated selection of iconic pieces awaits. Where luxury is personal, and style is eternal."
            animationType="crossfade"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full my-auto h-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-8 relative overflow-hidden">
        {/* Subtle background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/30 dark:to-black opacity-70 z-0"></div>

        {/* Form content with animation */}
        <motion.div
          className="max-w-md w-full space-y-0 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>
          {/* Logo */}
          <div className="flex justify-center mb-0 relative w-[200px] h-[120px] aspect-video mx-auto">
            <Image
              src="/cypress-logo.svg"
              alt="Cypress Logo"
              fill
              className="opacity-90 object-contain dark:opacity-100 invert-0 dark:invert"
            />
          </div>

          <div className="text-center pb-4">
            <h2 className="text-2xl font-extralight uppercase tracking-[0.25em] text-gray-900 dark:text-white">
              Sign In
            </h2>
            <div className="mt-3 mx-auto h-px w-12 bg-cypress-green/30"></div>
          </div>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                className="text-red-500 text-center text-sm px-4 py-3 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}>
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Email Field */}
              <div className="group relative">
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
              </div>

              {/* Password Field */}
              <div className="group relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full px-0 py-2 border-0 border-b focus:border-0 focus:border-b bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-0 focus:border-cypress-green placeholder-transparent text-base"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-400 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:dark:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:dark:text-gray-300 peer-focus:text-xs tracking-wide">
                  Password
                </label>
              </div>
            </div>

            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 border border-transparent text-sm font-medium tracking-widest uppercase text-white bg-cypress-green shadow-sm hover:bg-cypress-green-light focus:outline-none focus:ring-1 focus:ring-cypress-green dark:focus:ring-offset-gray-900 transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}>
                {loading ? (
                  <div className="flex items-center">
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
                    <span>Signing In</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </div>

            <div className="flex items-center justify-between text-xs mt-8 pt-2 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/reset-password"
                className="font-medium text-gray-500 hover:text-cypress-green dark:text-gray-400 dark:hover:text-cypress-green-light transition-colors">
                Forgot Password?
              </Link>
              <Link
                href="/signup"
                className="font-medium text-gray-500 hover:text-cypress-green dark:text-gray-400 dark:hover:text-cypress-green-light transition-colors">
                Create Account
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
