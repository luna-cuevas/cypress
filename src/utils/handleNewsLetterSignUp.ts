import react, { useState } from "react";

export const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const email = (e.currentTarget.email as HTMLInputElement).value;

  try {
    const response = await fetch("/api/klaviyo/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const responseJson = await response.json();

    console.log("Response JSON:", responseJson);

    if (
      responseJson.error == "" ||
      responseJson.message == "Subscription successful!"
    ) {
      return {
        message: "Subscription successful! Thank you for signing up!",
        status: "success",
      };
    } else {
      return {
        message: responseJson.result[0].detail,
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
