import NewsLetterSignUp from "@/components/NewsLetterSignUp";
import { shopifyClient } from "../../lib/shopify";
import { useEffect } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Home() {
  return (
    <main className="flex h-screen lg:h-[calc(100vh-80px)] justify-center relative">
      {/* <LoadingSkeleton /> */}
      <NewsLetterSignUp />
    </main>
  );
}
