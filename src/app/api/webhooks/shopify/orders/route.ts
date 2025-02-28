import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDefaultStore } from "jotai";

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: Request) {
  try {
    // Verify Shopify webhook signature
    const hmac = req.headers.get("x-shopify-hmac-sha256");
    const topic = req.headers.get("x-shopify-topic");
    const shop = req.headers.get("x-shopify-shop-domain");

    if (!hmac || !SHOPIFY_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Missing signature or secret" },
        { status: 401 }
      );
    }

    const body = await req.text();
    const hash = crypto
      .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
      .update(body)
      .digest("base64");

    if (hash !== hmac) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the order data
    const orderData = JSON.parse(body);

    // Check if order already exists in the database
    const { data: existingOrder, error: checkError } = await supabase
      .from("orders")
      .select("id")
      .eq("shopify_order_id", orderData.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing order:", checkError);
      return NextResponse.json(
        { error: "Failed to check for existing order" },
        { status: 500 }
      );
    }

    // If order already exists, return early
    if (existingOrder) {
      return NextResponse.json({ message: "order already in table" });
    }

    // Get user_id from customer email using Supabase auth
    const { data: userData, error: userError } = await supabase
      .from("profiles") // Make sure this matches your table name
      .select("user_id")
      .eq("email", orderData.email)
      .maybeSingle();

    if (userError) {
      console.error("Error finding user:", userError);
      // Continue processing even if user not found
    }

    // Insert order into Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userData?.user_id,
        shopify_order_id: orderData.id,
        order_number: orderData.order_number,
        email: orderData.email, // Store email even if user not found
        processed_at: orderData.processed_at,
        financial_status: orderData.financial_status,
        fulfillment_status: orderData.fulfillment_status || "unfulfilled",
        total_price: orderData.total_price,
        currency_code: orderData.currency,
        shipping_address: orderData.shipping_address,
        status_url: orderData.order_status_url,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Insert order items
    const orderItems = orderData.line_items.map((item: any) => ({
      order_id: order.id,
      title: item.title,
      variant_title: item.variant_title,
      quantity: item.quantity,
      price: item.price,
      currency_code: orderData.currency,
      image_url: item.image?.src,
      image_alt: item.image?.alt,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Shopify sends a GET request to verify the webhook endpoint
export async function GET() {
  return NextResponse.json({ message: "Webhook endpoint is active" });
}
