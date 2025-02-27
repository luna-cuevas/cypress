import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Parse the URL to get the userId query parameter
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

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
    // Get user details
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError || !userData) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    // Get profile details from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is ok - might be a new user
      console.error("Error fetching profile:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch profile data" },
        { status: 500 }
      );
    }

    // Combine user and profile data
    const combinedData = {
      user: userData.user,
      profile: profileData || {
        id: userId,
        gender: "",
        birth_date: null,
        location: {
          address1: "",
          address2: "",
          city: "",
          state: "",
          zip_code: "",
        },
        phone_number: "",
      },
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
