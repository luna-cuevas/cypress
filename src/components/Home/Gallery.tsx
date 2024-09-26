import { Motion } from "@/utils/Motion";
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
  return (
    <div className="grid sm:grid-cols-3 grid-cols-2  w-full px-2 sm:px-4 mx-auto h-full gap-2 sm:gap-4 ">
      {products &&
        products.map((product, index) => {
          const link = product.products[0]?.productType
            ? "shop/" + product.products[0]?.productType.toLowerCase()
            : "shop";
          return (
            <Motion
              type="div"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }} // Reverses the animation when scrolling up
              viewport={{ once: false, amount: 0.15 }} // Controls when the animation triggers
              transition={{
                duration: 1,
                delay: index * 0.08,
              }}
              key={product.handle}
              className={`row-span-1  !relative ${
                index % 3 === 2 ? "col-span-2 sm:col-span-1" : "col-span-1"
              }`}>
              <Link href={link}>
                <Image
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 640px) 50vw,(min-width: 1024px) 33vw, 33vw"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                  placeholder="blur"
                  className={`h-full w-full object-cover cursor-pointer`}
                  src={
                    product.image.src +
                    "?height=800&width=600&format=webp&quality=50&scale=1"
                  }
                  alt={"Product image"}
                />
              </Link>
              <div className="absolute bottom-0 w-full text-white font-bold backdrop-blur-sm left-0 px-6 pt-1 pb-3 ">
                <h3 className={` tracking-widest text-xl font-medium  `}>
                  {product.title}
                </h3>
                {/* <p className="text-white text-xs">{product.productType}</p> */}
              </div>
            </Motion>
          );
        })}
    </div>
  );
};

export default Gallery;
