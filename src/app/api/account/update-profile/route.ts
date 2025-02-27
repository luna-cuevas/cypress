import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Create a Supabase client with admin privileges for the server
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string, // Use service role key for admin operations
    {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    }
  );

  try {
    const {
      userId,
      firstName,
      lastName,
      gender,
      birthDate,
      location: { address1, address2, city, state, zipCode },
      phoneNumber,
    } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // Update user metadata
    const { error: userError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      }
    );

    if (userError) {
      console.error("Error updating user metadata:", userError);
      return NextResponse.json(
        { error: "Failed to update user metadata" },
        { status: 500 }
      );
    }

    // Update profile in profiles table
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      gender,
      birth_date: birthDate || null,
      location: {
        address1,
        address2,
        city,
        state,
        zip_code: zipCode,
      },
      phone_number: phoneNumber,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return NextResponse.json(
        { error: "Failed to update profile data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
