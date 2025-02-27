import { Suspense } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import ProfileTabs from "@/components/user/ProfileTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Cypress",
  description: "Manage your Cypress account, orders, and favorites",
};

export default async function AccountPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          {/* Account Header */}
          <div className="mb-12 text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-gray-900 dark:text-white mb-3">
              My Account
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Manage your personal information, track orders, and view your
              saved items
            </p>
          </div>

          {/* Profile Content */}
          <div className="bg-white dark:bg-white/5 shadow-sm rounded-xl overflow-hidden">
            <ProfileTabs />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
