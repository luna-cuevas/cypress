import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  products?: {
    id: string;
    handle: string;
    productType: string;
    images: { src: string; altText: string }[];
    title: string;
    variants: any[];
  }[];
};

const Gallery: React.FC<Props> = ({ products }) => {
  console.log("products", products);
  const classes = [
    "md:row-span-1 row-span-2 col-span-2",
    "row-span-1 col-span-2",
    "md:row-span-2 row-span-1 col-span-2",
    "row-span-1 col-span-2 md:col-span-1",
    "md:row-span-1 row-span-2 col-span-2 md:col-span-1",
    "row-span-1 col-span-2 md:col-span-1",
    "row-span-1 hidden md:block col-span-2 md:col-span-1",
  ];

  return (
    <div className="grid grid-cols-4 w-full max-w-[1400px] mx-auto h-full grid-rows-4 md:grid-rows-3 gap-[10px] 2xl:px-0">
      {products &&
        products.slice(0, 7).map((product, index) => (
          <div
            key={product.handle}
            className={`${classes[index % classes.length]} relative`}>
            <Link href={`/shop/${product.productType}/${product.handle}`}>
              <Image
                fill
                priority
                quality={100}
                sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                placeholder="blur"
                className={`h-full w-full object-cover cursor-pointer`}
                src={product.images[0]?.src || "/placeholder.jpg"}
                alt={product.images[0]?.altText || "Product image"}
              />
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Gallery;
