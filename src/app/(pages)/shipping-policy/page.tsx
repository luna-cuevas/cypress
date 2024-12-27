import { shopifyClient } from "@/lib/shopify";

async function getShippingPolicy() {
  try {
    const { data } = await shopifyClient.request(
      `query {
        shop {
          shippingPolicy {
            body
            title
          }
        }
      }`
    );
    return data.shop.shippingPolicy;
  } catch (error) {
    console.error("Error fetching shipping policy:", error);
    return null;
  }
}

export default async function ShippingPolicy() {
  const shipping = await getShippingPolicy();

  return (
    <div className="container min-h-[calc(100vh-200px)] mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">
        Shipping Policy
      </h1>

      {shipping?.body ? (
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: shipping.body }}
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Shipping policy is currently unavailable.
        </p>
      )}
    </div>
  );
}
