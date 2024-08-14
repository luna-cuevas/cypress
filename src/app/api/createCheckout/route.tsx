import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lineItems, email, shippingAddress } = await req.json();

    // Build the checkout data payload
    const checkoutData = {
      checkout: {
        email,
        line_items: lineItems.map((item: any) => ({
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
        shipping_address: shippingAddress,
      },
    };

    // Send the request to Shopify's REST API
    const response = await fetch(
      `${process.env.SHOPIFY_STOREFRONT_API_URL}admin/api/2024-01/checkouts.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN!,
        },
        body: JSON.stringify(checkoutData),
      }
    );

    console.log(
      "process.env.SHOPIFY_STOREFRONT_API_URL",
      process.env.SHOPIFY_STOREFRONT_API_URL
    );

    const responseData = await response.json();

    console.log("responseData", responseData);

    if (response.ok && responseData.checkout) {
      return NextResponse.json({ checkoutUrl: responseData.checkout.web_url });
    } else {
      console.error("Failed to create checkout:", responseData);
      return NextResponse.json(
        { error: "Failed to create checkout", details: responseData },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Failed to create Shopify checkout:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
