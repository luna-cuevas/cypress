"use client";

import React, { useState } from "react";

type Props = {};

const NewsletterForm = (props: Props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/mailchimp/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Stay updated with our latest collections and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 min-w-0 px-4 py-2 text-sm text-gray-900 dark:text-white 
              bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
              rounded-md focus:outline-none focus:ring-2 focus:ring-cypress-green 
              dark:focus:ring-cypress-green-light focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-2 text-sm font-medium text-white bg-cypress-green 
              dark:bg-cypress-green-light hover:bg-cypress-green-dark rounded-md 
              transition-colors duration-200 focus:outline-none focus:ring-2 
              focus:ring-cypress-green dark:focus:ring-cypress-green-light 
              focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "success"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsletterForm;
