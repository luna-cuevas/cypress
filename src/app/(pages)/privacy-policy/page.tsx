import { shopifyClient } from "@/lib/shopify";

async function getPrivacyPolicy() {
  try {
    const { data } = await shopifyClient.request(
      `query {
        shop {
          privacyPolicy {
            body
            title
          }
        }
      }`
    );
    return data.shop.privacyPolicy;
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return null;
  }
}

export default async function PrivacyPolicy() {
  const privacy = await getPrivacyPolicy();

  return (
    <div className="container min-h-[calc(100vh-200px)] mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">
        Privacy Policy
      </h1>

      {privacy?.body ? (
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: privacy.body }}
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Privacy policy is currently unavailable.
        </p>
      )}
    </div>
  );
}
