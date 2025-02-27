import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

// GET /api/shop/favorites?userId=xyz&productId=abc
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  if (!userId || !productId) {
    return NextResponse.json(
      { error: "userId and productId are required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      console.error("Error checking favorite status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ isFavorite: data && data.length > 0, data });
  } catch (err) {
    console.error("Error checking favorite status:", err);
    return NextResponse.json(
      { error: "Failed to check favorite status" },
      { status: 500 }
    );
  }
}

// POST /api/shop/favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      productId,
      productTitle,
      productImage,
      productPrice,
      productHandle,
    } = body;

    if (
      !userId ||
      !productId ||
      !productTitle ||
      !productImage ||
      productPrice === undefined ||
      !productHandle
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("favorites").insert({
      user_id: userId,
      product_id: productId,
      product_title: productTitle,
      product_image: productImage,
      product_price: productPrice,
      product_handle: productHandle,
    });

    if (error) {
      console.error("Error adding to favorites:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding to favorites:", err);
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

// DELETE /api/shop/favorites?userId=xyz&productId=abc
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  if (!userId || !productId) {
    return NextResponse.json(
      { error: "userId and productId are required" },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      console.error("Error removing from favorites:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error removing from favorites:", err);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
