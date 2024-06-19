import NewsLetterSignUp from "@/components/NewsLetterSignUp";
import { shopifyClient } from "../../lib/shopify";
import { useEffect } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Home() {
  return (
    <main className="flex  justify-center relative min-h-[calc(100vh-70px)]">
      {/* <LoadingSkeleton /> */}
      {/* <NewsLetterSignUp /> */}
    </main>
  );
}
