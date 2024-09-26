import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const mutation = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
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
      },
    };

    const response = await fetch(
      `${process.env.SHOPIFY_STOREFRONT_API_URL}/api/2023-07/graphql.json`,
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

    console.log("Login response:", responseData);

    if (
      responseData.data &&
      responseData.data.customerAccessTokenCreate &&
      responseData.data.customerAccessTokenCreate.userErrors.length === 0
    ) {
      const accessToken =
        responseData.data.customerAccessTokenCreate.customerAccessToken
          .accessToken;

      // Set access token in a secure HTTP-only cookie
      return NextResponse.json(
        { success: true },
        {
          status: 200,
          headers: {
            "Set-Cookie": `shopifyAccessToken=${accessToken}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Lax`,
          },
        }
      );
    } else {
      const errors = responseData.data.customerAccessTokenCreate.userErrors;
      return NextResponse.json(
        { error: "Failed to log in", userErrors: errors },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
