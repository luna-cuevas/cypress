"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import NextJsImage from "./NextJsImage";
import "yet-another-react-lightbox/styles.css";
import { Motion } from "@/utils/Motion";

type ImageType = {
  src: string;
  altText: string;
};

type Props = {
  images: ImageType[];
};

export default function DesktopGalleryWithLightbox({ images }: Props) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const toggleOpen = (state: boolean) => () => setOpen(state);

  const handleImageClick = (imageIndex: number) => {
    setIndex(imageIndex);
    setOpen(true);
  };

  const updateIndex = ({ index: current }: { index: number }) =>
    setIndex(current);

  // Convert images to the format expected by the lightbox
  const slides = images.map((img) => ({
    src: img.src,
    alt: img.altText || "",
    width: 1200, // Default width for better sizing
    height: 800, // Default height for better sizing
  }));

  return (
    <div className="w-full h-full min-h-[80vh] flex">
      <Motion
        type="div"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
        }}
        className="w-[50px] pt-4 sticky top-0 h-fit gap-2 flex-col hidden lg:flex">
        {images.map((image, idx) => (
          <Link href={`#image-${idx}`} key={idx} className="w-full h-full">
            <div className="relative w-full h-[50px] cursor-pointer border border-gray-200 dark:border-gray-700">
              <Image
                fill
                priority
                quality={100}
                sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                placeholder="blur"
                src={image.src}
                alt={image.altText}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </Link>
        ))}
      </Motion>

      <Motion
        type="div"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{
          duration: 0.5,
          delay: 0.25,
        }}
        className={`
        ${images.length > 1 ? "grid lg:grid-cols-2 grid-cols-1" : "flex"}
        pt-4 w-full h-full min-h-[75vh] gap-4`}>
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative w-full h-full min-h-[300px] cursor-pointer"
            id={`image-${idx}`}
            onClick={() => handleImageClick(idx)}>
            <Image
              width={600}
              height={600}
              sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
              placeholder="blur"
              src={image.src}
              alt={image.altText}
              className="h-full w-full object-cover object-center"
              style={{ height: "100%", minHeight: "300px" }}
            />
          </div>
        ))}
      </Motion>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={toggleOpen(false)}
        index={index}
        slides={slides}
        on={{ view: updateIndex }}
        animation={{ fade: 0 }}
        render={{ slide: NextJsImage }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
      />
    </div>
  );
}
