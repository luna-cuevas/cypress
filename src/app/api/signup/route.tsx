import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    // Basic validation (can be enhanced)
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const mutation = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        email,
        password,
        firstName,
        lastName,
      },
    };

    const response = await fetch(
      `${process.env.SHOPIFY_STOREFRONT_API_URL}/api/2024-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.SHOPIFY_STOREFRONT_API_TOKEN!,
        },
        body: JSON.stringify({ query: mutation, variables }),
      }
    );

    const responseData = await response.json();

    console.log("Signup response:", responseData);

    if (
      responseData.data &&
      responseData.data.customerCreate &&
      responseData.data.customerCreate.userErrors.length === 0
    ) {
      // Optionally, send a welcome email or perform additional actions here

      return NextResponse.json(
        {
          success: true,
          message: "Signup successful! Please verify your email.",
        },
        { status: 200 }
      );
    } else {
      const errors = responseData.data.customerCreate.userErrors;
      return NextResponse.json(
        { error: "Failed to create customer", userErrors: errors },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error during sign-up:", error);
    return NextResponse.json(
      { error: "Failed to create profile", details: error.message },
      { status: 500 }
    );
  }
}
