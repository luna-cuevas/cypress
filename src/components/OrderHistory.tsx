"use client";
import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useSupabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type OrderItem = {
  id: string;
  title: string;
  variant_title: string;
  quantity: number;
  price: number;
  currency_code: string;
  image_url: string;
  image_alt: string;
};

type Order = {
  id: string;
  shopify_order_id: string;
  order_number: string;
  processed_at: string;
  financial_status: string;
  fulfillment_status: string;
  total_price: number;
  currency_code: string;
  shipping_address: {
    address1: string;
    address2?: string;
    city: string;
    province_code: string;
    zip: string;
    country: string;
  };
  status_url: string;
  order_items: OrderItem[];
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabase();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        // Fetch orders with their items
        const { data, error: ordersError } = await supabase
          .from("orders")
          .select(
            `
            *,
            order_items (*)
          `
          )
          .eq("user_id", user.id)
          .order("processed_at", { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cypress-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Typography className="text-red-500">{error}</Typography>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Typography className="text-gray-600 dark:text-gray-400">
          No orders found.
        </Typography>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "fulfilled":
        return "text-green-500";
      case "unfulfilled":
        return "text-yellow-500";
      case "refunded":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Typography className="text-lg font-medium text-gray-900 dark:text-white">
                Order #{order.order_number}
              </Typography>
              <Typography className="text-sm text-gray-600 dark:text-gray-400">
                Placed on {format(new Date(order.processed_at), "MMMM d, yyyy")}
              </Typography>
            </div>
            <div className="text-right">
              <Typography
                className={`text-sm font-medium ${getStatusColor(
                  order.financial_status
                )}`}>
                {order.financial_status}
              </Typography>
              <Typography
                className={`text-sm font-medium ${getStatusColor(
                  order.fulfillment_status
                )}`}>
                {order.fulfillment_status}
              </Typography>
            </div>
          </div>

          <div className="space-y-4">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image_url}
                    alt={item.image_alt || item.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <Typography className="font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </Typography>
                  {item.variant_title && (
                    <Typography className="text-sm text-gray-600 dark:text-gray-400">
                      {item.variant_title}
                    </Typography>
                  )}
                  <Typography className="text-sm text-gray-600 dark:text-gray-400">
                    Quantity: {item.quantity}
                  </Typography>
                </div>
                <Typography className="font-medium text-gray-900 dark:text-white">
                  {item.currency_code} {item.price.toFixed(2)}
                </Typography>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Typography className="font-medium text-gray-900 dark:text-white">
                Total
              </Typography>
              <Typography className="font-medium text-gray-900 dark:text-white">
                {order.currency_code} {order.total_price.toFixed(2)}
              </Typography>
            </div>
            <div className="mt-4">
              <Link
                href={order.status_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cypress-green hover:text-cypress-green-light">
                View Order Status →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
