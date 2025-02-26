import Link from "next/link";
import { Motion } from "@/utils/Motion";

type RelatedProducts = {
  relatedProducts: {
    id: string;
    description: string;
    productType: string;
    handle: string;
    title: string;
    vendor: string;
    variants: {
      variantPrice: string;
    }[];
    images: {
      src: string;
      altText: string;
    }[];
  }[];
};

export default function RelatedProducts({ relatedProducts }: RelatedProducts) {
  if (!relatedProducts?.length) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Motion
          type="div"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-12 text-center">
          <h2 className="text-3xl font-light tracking-tight text-gray-900 dark:text-gray-100 mb-2">
            Complete Your Style
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Curated suggestions from the {relatedProducts[0].vendor} collection
          </p>
        </Motion>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.slice(0, 4).map((product) => (
            <Motion
              key={product.id}
              type="div"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative">
              <Link
                href={`/shop/${product.productType}/${product.handle}`}
                className="block relative">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-900 transition-all duration-300">
                  <img
                    alt={product.images[0].altText}
                    src={product.images[0].src}
                    className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none md:pointer-events-auto">
                    <span className="block w-full py-3 px-4 text-center text-sm bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
                      View Product
                    </span>
                  </div>
                </div>
              </Link>
              <div className="mt-6 flex flex-col items-start">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {product.vendor}
                </p>
                <h3 className="text-sm text-gray-900 dark:text-gray-100 font-light">
                  <Link
                    href={`/shop/${product.productType}/${product.handle}`}
                    className="hover:underline">
                    {product.title}
                  </Link>
                </h3>
                <p className="mt-2 text-base font-light text-gray-900 dark:text-gray-300">
                  ${parseFloat(product.variants[0].variantPrice).toFixed(2)}
                </p>
              </div>
            </Motion>
          ))}
        </div>

        {relatedProducts.length > 4 && (
          <Motion
            type="div"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-16">
            <Link
              href={`/shop/${relatedProducts[0].productType}`}
              className="inline-block border border-gray-300 dark:border-gray-700 py-3 px-8 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
              View Collection
            </Link>
          </Motion>
        )}
      </div>
    </div>
  );
}
