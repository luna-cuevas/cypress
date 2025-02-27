import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string // Using service role key for server operations
    );

    // Verify the OTP token
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        { error: "Failed to verify OTP" },
        { status: 400 }
      );
    }

    // Return the complete session object including access and refresh tokens
    return NextResponse.json({
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        user: data.user,
      },
    });
  } catch (error: any) {
    console.error("Error in verifyOTP:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
