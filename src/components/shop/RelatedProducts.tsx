import Link from "next/link";

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
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-light tracking-tight text-gray-900 dark:text-gray-200">
          More from {relatedProducts[0].vendor}
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
          {relatedProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  alt={product.images[0].altText}
                  src={product.images[0].src}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <h3 className="text-sm text-gray-700 dark:text-gray-300">
                  <Link href={`/shop/${product.productType}/${product.handle}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.title}
                  </Link>
                </h3>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-400">
                  ${product.variants[0].variantPrice}0
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
