// components/LoginForm.tsx

"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [state, setState] = useAtom(globalStateAtom);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic client-side validation
    if (!form.email || !form.password) {
      toast.error("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        // Fetch customer data
        const customerResponse = await fetch("/api/getCustomer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const customerData = await customerResponse.json();

        if (customerData.customer) {
          setState({
            ...state,
            customer: customerData.customer,
            cartOpen: true, // Optionally open the cart
          });
        }

        toast.success("Successfully logged in!");
        router.push("/account"); // Redirect to profile or home
      } else {
        const errors = data.userErrors;
        errors.forEach((error: any) => {
          toast.error(error.message);
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={form.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={form.password}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300">
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
};

export default LoginForm;
