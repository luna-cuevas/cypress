import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  products?: {
    id: string;
    handle: string;
    productType: string;
    image: { src: string; altText: string };
    title: string;
    variants: any[];
    products: {
      id: string;
      title: string;
      description: string;
      handle: string;
      productType: string;
      tags: string[];
      variants: {
        edges: {
          node: {
            id: string;
            title: string;
            quantityAvailable: number;
            price: {
              amount: string;
              currencyCode: string;
            };
          };
        }[];
      };
      images: {
        edges: {
          node: {
            src: string;
            altText: string;
          };
        }[];
      };
    }[];
  }[];
};

const Gallery: React.FC<Props> = ({ products }) => {
  const classes = [
    "row-span-1 col-span-1",
    "row-span-1 col-span-1",
    "row-span-1 col-span-1",
    "row-span-1 col-span-1",
    "row-span-1 col-span-1",
    "row-span-1 col-span-1",
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 w-full px-2 sm:px-4 mx-auto h-full gap-2 sm:gap-4 ">
      {products &&
        products.map((product, index) => {
          const link = product.products[0]?.productType
            ? "shop/" + product.products[0]?.productType.toLowerCase()
            : "shop";
          return (
            <div
              key={product.handle}
              className={`${classes[index % classes.length]} relative`}>
              <Link href={link}>
                <Image
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                  placeholder="blur"
                  className={`h-full w-full object-cover cursor-pointer`}
                  src={product.image.src}
                  alt={"Product image"}
                />
              </Link>
              <div className="absolute bottom-6 left-6 ">
                <h3 className="text-gray-900  text-lg font-bold  ">
                  {product.title}
                </h3>
                <p className="text-white text-xs">{product.productType}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Gallery;
