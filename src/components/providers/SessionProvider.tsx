"use client";
import { useCustomerSession } from "@/hooks/useCustomerSession";
import { ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  // Initialize customer session
  useCustomerSession();

  return <>{children}</>;
}
