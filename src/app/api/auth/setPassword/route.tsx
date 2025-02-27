import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email, password, session_token } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string // Using service role key for server operations
    );

    let session;

    // If a session token was provided, use it directly
    if (session_token) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: session_token.access_token,
          refresh_token: session_token.refresh_token,
        });

      if (sessionError) {
        console.error("Error setting session:", sessionError);
        return NextResponse.json(
          { error: "Invalid session token" },
          { status: 401 }
        );
      }

      session = sessionData.session;
    } else {
      // Otherwise try to get the current session
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      session = currentSession;
    }

    if (!session) {
      return NextResponse.json(
        { error: "No valid session found. Please verify your email first." },
        { status: 401 }
      );
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      console.error("Error setting password:", updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: updateError.status || 500 }
      );
    }

    // Now sign in with the new credentials
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if (signInError) {
      console.error("Error signing in after password set:", signInError);
      return NextResponse.json(
        { error: signInError.message },
        { status: signInError.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      redirectUrl: `/account`, // Redirect to the account page after successful signup
    });
  } catch (error: any) {
    console.error("Unexpected error in setPassword:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
