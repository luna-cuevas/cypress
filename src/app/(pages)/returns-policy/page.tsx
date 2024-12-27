import { shopifyClient } from "@/lib/shopify";

async function getReturnsPolicy() {
  try {
    const { data } = await shopifyClient.request(
      `query {
        shop {
          refundPolicy {
            body
            title
          }
        }
      }`
    );
    return data.shop.refundPolicy;
  } catch (error) {
    console.error("Error fetching returns policy:", error);
    return null;
  }
}

export default async function ReturnsPolicy() {
  const returns = await getReturnsPolicy();

  return (
    <div className="container min-h-[calc(100vh-200px)] mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">
        Returns Policy
      </h1>

      {returns?.body ? (
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: returns.body }}
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Returns policy is currently unavailable.
        </p>
      )}
    </div>
  );
}
