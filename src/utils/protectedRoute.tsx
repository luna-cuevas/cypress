"use client";

import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!state.customer) {
        toast.error("You must be logged in to access this page.");
        router.push("/login"); // Redirect to login page
      }
    };

    checkAuth();
  }, [state.customer, router]);

  if (!state.customer) {
    return null; // Optionally, return a loader here
  }

  return <>{children}</>;
};

export default ProtectedRoute;
