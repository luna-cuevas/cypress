import LoadingScreen from "@/components/common/LoadingScreen";
import ProfileTabs from "@/components/user/ProfileTabs";
import { Suspense } from "react";

export default async function AccountPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-8 py-12">
          <ProfileTabs />
        </div>
      </div>
    </Suspense>
  );
}
