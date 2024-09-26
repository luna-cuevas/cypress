// /app/api/logout/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // To invalidate the access token, you can optionally call Shopify's `customerAccessTokenDelete` mutation.
    // However, the Storefront API does not provide a direct way to invalidate tokens. Tokens expire based on `expiresAt`.
    // Therefore, for simplicity, we'll just clear the cookie.

    return NextResponse.json(
      { success: true, message: "Logged out successfully." },
      {
        status: 200,
        headers: {
          "Set-Cookie": `shopifyAccessToken=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict`,
        },
      }
    );
  } catch (error: any) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "Failed to log out.", details: error.message },
      { status: 500 }
    );
  }
}
