// components/SignUpForm.tsx

"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const SignUpForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setIsSignedUp(true);
        toast.success(data.message);
        // Optionally, reset the form
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
      } else {
        const errors = data.userErrors;
        errors.forEach((error: any) => {
          toast.error(error.message);
        });
      }
    } catch (error: any) {
      console.error("Sign-up error:", error);
      toast.error(error.message || "Sign-up failed");
    }
  };

  if (isSignedUp) {
    return (
      <div className="p-4 bg-green-100 text-green-700 rounded-md">
        <p>
          Thank you for signing up! Please check your email (
          <strong>{form.email}</strong>) and click the verification link to
          activate your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          required
          value={form.firstName}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          required
          value={form.lastName}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

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
          placeholder="Minimum 6 characters"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-cypress-green text-white py-2 rounded-md hover:bg-cypress-green-light">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
