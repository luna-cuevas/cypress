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
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-0 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          More from {relatedProducts[0].vendor}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
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
                <h3 className="text-sm text-gray-700">
                  <Link href={`/shop/${product.productType}/${product.handle}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.title}
                  </Link>
                </h3>
                <p className="text-sm font-medium text-gray-900">
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
