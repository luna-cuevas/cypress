"use client";

import React from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const [state, setState] = useAtom(globalStateAtom);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setState({
          ...state,
          customer: null,
          cartOpen: false,
        });
        toast.success("Successfully logged out!");
      } else {
        toast.error("Failed to log out.");
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
      Logout
    </button>
  );
};

export default LogoutButton;
