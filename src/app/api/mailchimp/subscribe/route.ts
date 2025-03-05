import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get Mailchimp configuration from environment variables
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

    if (!apiKey || !serverPrefix) {
      console.error("Mailchimp API key or server prefix not configured");
      return NextResponse.json(
        { error: "Newsletter service configuration error" },
        { status: 500 }
      );
    }

    // Create MD5 hash of lowercase email for Mailchimp
    const emailHash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");

    // Your audience/list ID - you'll need to add this to your .env file
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!audienceId) {
      console.error("Mailchimp audience ID not configured");
      return NextResponse.json(
        { error: "Newsletter service configuration error" },
        { status: 500 }
      );
    }

    // Prepare the data for the Mailchimp API
    const data = {
      email_address: email,
      status: "subscribed", // Use 'pending' if you want double opt-in
      merge_fields: {
        // You can add additional fields here if needed
      },
    };

    // Make request to Mailchimp API
    const response = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString(
            "base64"
          )}`,
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    // Handle different response scenarios
    if (response.ok) {
      return NextResponse.json({
        message: "Subscription successful!",
        status: "success",
      });
    } else if (responseData.title === "Member Exists") {
      return NextResponse.json({
        message: "You are already subscribed to our newsletter!",
        status: "success",
      });
    } else {
      console.error("Mailchimp API error:", responseData);
      return NextResponse.json(
        {
          error:
            responseData.detail || "Failed to subscribe. Please try again.",
          status: "error",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
        status: "error",
      },
      { status: 500 }
    );
  }
}
