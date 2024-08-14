"use client";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

type ParallaxProps = {
  products: {
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
  distance?: number;
};

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance], {});
}

const ParallaxSection: React.FC<ParallaxProps> = ({
  products,
  distance = 30,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });
  const y = useParallax(scrollYProgress, distance);

  return (
    <motion.div className="relative flex w-2/3 mx-auto gap-4   h-[40vmax]">
      <div ref={ref} className="relative w-1/2 z-10">
        <img
          src={products[0].image.src}
          alt={products[0].image.altText}
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-6 left-6 ">
          <h3 className="text-gray-900  text-lg font-bold  ">
            {products[0].title}
          </h3>
          <p className="text-white text-xs">{products[0].productType}</p>
        </div>
      </div>
      <motion.div className="relative w-1/2 right-0  z-0 top-0" style={{ y }}>
        <img
          src={products[1].image.src}
          alt={products[1].image.altText}
          className="object-cover w-full h-full opacity-100"
        />
        <div className="absolute bottom-6 left-6 ">
          <h3 className="text-gray-900  text-lg font-bold  ">
            {products[1].title}
          </h3>
          <p className="text-white text-xs">{products[1].productType}</p>
        </div>
      </motion.div>
      <motion.div className="relative w-1/2 right-0  z-0 top-0" style={{ y }}>
        <img
          src={products[2].image.src}
          alt={products[2].image.altText}
          className="object-cover w-full h-full opacity-100"
        />
        <div className="absolute bottom-6 left-6 ">
          <h3 className="text-gray-900  text-lg font-bold  ">
            {products[2].title}
          </h3>
          <p className="text-white text-xs">{products[2].productType}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ParallaxSection;
