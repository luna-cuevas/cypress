import { NextResponse } from "next/server";
import { getDefaultStore } from "jotai";
import { clearCartAction } from "@/context/atoms";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (data.type === "orders/paid") {
      const store = getDefaultStore();
      store.set(clearCartAction);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
