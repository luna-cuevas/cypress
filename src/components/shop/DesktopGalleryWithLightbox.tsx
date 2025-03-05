"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import NextJsImage from "./NextJsImage";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
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
  const [activeThumb, setActiveThumb] = React.useState(0);

  const toggleOpen = (state: boolean) => () => setOpen(state);

  const handleImageClick = (imageIndex: number) => {
    setIndex(imageIndex);
    setOpen(true);
  };

  const updateIndex = ({ index: current }: { index: number }) => {
    setIndex(current);
    setActiveThumb(current);
  };

  // Handle thumbnail hover
  const handleThumbHover = (idx: number) => {
    setActiveThumb(idx);
  };

  // Convert images to the format expected by the lightbox
  const slides = images.map((img) => ({
    src: img.src,
    alt: img.altText || "",
    width: 1200, // Default width for better sizing
    height: 800, // Default height for better sizing
  }));

  return (
    <div className="w-full h-full min-h-[80vh] flex">
      <div className="w-[70px] pt-4 sticky top-0 h-fit gap-3 flex-col hidden lg:flex">
        {images.map((image, idx) => (
          <Link href={`#image-${idx}`} key={idx} className="w-full h-full">
            <div
              className={`
                relative w-full h-[70px] cursor-pointer 
                border transition-all duration-300 ease-in-out
                ${
                  activeThumb === idx
                    ? "border-black dark:border-white scale-105"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                }
              `}
              onMouseEnter={() => handleThumbHover(idx)}>
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
      </div>

      <div
        className={`
        ${images.length > 1 ? "grid lg:grid-cols-2 grid-cols-1" : "flex"}
        pt-4 w-full h-[calc(100vh-120px)] gap-4 pl-4`}>
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative w-full h-full cursor-pointer group overflow-hidden"
            id={`image-${idx}`}
            onClick={() => handleImageClick(idx)}>
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <Image
              fill
              sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
              placeholder="blur"
              src={image.src}
              alt={image.altText}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out "
              style={{ height: "100%" }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
              <span className="text-white text-sm font-light pb-2">
                Click to zoom
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox with enhanced zoom and transitions */}
      <Lightbox
        open={open}
        close={toggleOpen(false)}
        index={index}
        slides={slides}
        on={{ view: updateIndex }}
        animation={{ fade: 300, swipe: 500 }}
        render={{ slide: NextJsImage }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
        }}
        carousel={{
          padding: "16px",
          spacing: "16px",
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        }}
      />
    </div>
  );
}
