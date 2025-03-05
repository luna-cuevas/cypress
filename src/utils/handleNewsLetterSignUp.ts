import react, { useState } from "react";

export const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const email = (e.currentTarget.email as HTMLInputElement).value;

  try {
    const response = await fetch("/api/mailchimp/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const responseJson = await response.json();

    if (response.ok) {
      return {
        message:
          responseJson.message ||
          "Subscription successful! Thank you for signing up!",
        status: "success",
      };
    } else {
      return {
        message:
          responseJson.error || "Something went wrong. Please try again.",
        status: "error",
      };
    }
  } catch (error) {
    console.error("An error occurred. Please try again.");
    return {
      message: "An error occurred. Please try again.",
      status: "error",
    };
  }
};
