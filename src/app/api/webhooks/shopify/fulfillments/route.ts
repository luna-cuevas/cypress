import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";

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

    // Parse the fulfillment data
    const fulfillmentData = JSON.parse(body);

    // Get the order ID from the fulfillment
    const shopifyOrderId = fulfillmentData.order_id.toString();

    // Determine fulfillment status
    let fulfillmentStatus = "unfulfilled";
    if (fulfillmentData.status === "success") {
      fulfillmentStatus = "fulfilled";
    } else if (fulfillmentData.status === "cancelled") {
      fulfillmentStatus = "cancelled";
    } else if (fulfillmentData.status === "in_progress") {
      fulfillmentStatus = "in_progress";
    }

    // Update the order in Supabase
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        fulfillment_status: fulfillmentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("shopify_order_id", shopifyOrderId);

    if (updateError) {
      console.error("Error updating order:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
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
