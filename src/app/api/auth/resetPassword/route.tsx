import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email, otp, password } = await request.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Email, verification code, and new password are required" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Verify the OTP token
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery",
    });

    if (verifyError) {
      console.error("Error verifying reset code:", verifyError);
      return NextResponse.json(
        { error: verifyError.message },
        { status: verifyError.status || 400 }
      );
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        { error: "Failed to verify reset code" },
        { status: 400 }
      );
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      console.error("Error resetting password:", updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: updateError.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
      redirectUrl: "/login",
    });
  } catch (error: any) {
    console.error("Unexpected error in resetPassword:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
