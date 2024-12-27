import { shopifyClient } from "@/lib/shopify";

async function getTerms() {
  try {
    const { data } = await shopifyClient.request(
      `query {
        shop {
          termsOfService {
            body
            title
          }
        }
      }`
    );
    return data.shop.termsOfService;
  } catch (error) {
    console.error("Error fetching terms:", error);
    return null;
  }
}

export default async function TermsOfService() {
  const terms = await getTerms();

  return (
    <div className="container min-h-[calc(100vh-200px)] mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">
        Terms of Service
      </h1>

      {terms?.body ? (
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: terms.body }}
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Terms of service are currently unavailable.
        </p>
      )}
    </div>
  );
}
