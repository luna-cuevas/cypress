import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  // Initialize Supabase clients - one with service role for admin operations
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  // Regular client for user operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  try {
    const { email, password, session, user, firstName, lastName } =
      await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // set session using session object with the regular client
    const { data: sessionData, error: sessionError } =
      await supabase.auth.setSession(session);

    if (sessionError) {
      console.error("Error setting session:", sessionError);
      return NextResponse.json(
        { error: sessionError.message },
        { status: 400 }
      );
    }

    // Update the user's password with the regular client
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

    if (session) {
      // Create a profile record for the user
      const profileData = {
        user_id: user.id,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add first and last name to metadata if provided
      if (firstName && lastName) {
        // Update user metadata to include first and last name - use admin client
        await supabaseAdmin.auth.admin.updateUserById(session.id, {
          user_metadata: { first_name: firstName, last_name: lastName },
        });
      }

      // Create the profile record using the admin client to bypass RLS
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert(profileData);

      if (profileError) {
        console.error("Error creating profile:", profileError);
        return NextResponse.json(
          { error: profileError.message },
          { status: 400 }
        );
      }
      console.log("Profile created successfully");
      return NextResponse.json({
        success: true,
        redirectUrl: `/account`, // Redirect to the account page after successful signup
      });
    } else {
      console.error("User ID not found");
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Unexpected error in setPassword:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
