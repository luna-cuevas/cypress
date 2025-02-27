"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  images: string[];
  title: string;
  subtitle: string;
  animationType?: "fade" | "slide" | "zoom" | "crossfade" | "3d";
};

const AuthCarousel: React.FC<Props> = ({
  images,
  title,
  subtitle,
  animationType = "fade",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [isPaused, setIsPaused] = useState(false);

  // Change image every 7 seconds (longer for better readability)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // Move forward consistently for smoother experience
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setDirection(1);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  // Clean, simple fade animation - used as base for all transitions
  const fadeVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      zIndex: 1,
      opacity: 1,
      transition: {
        opacity: { duration: 2.2, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      transition: {
        opacity: { duration: 2.2, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
  };

  // Smooth slide transition with fade
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "30%" : "-30%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: {
          type: "tween",
          duration: 1.4,
          ease: [0.25, 0.1, 0.25, 1],
        },
        opacity: { duration: 1.8, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-30%" : "30%",
      opacity: 0,
      transition: {
        x: {
          type: "tween",
          duration: 1.4,
          ease: [0.25, 0.1, 0.25, 1],
        },
        opacity: { duration: 1.8, ease: [0.25, 0.1, 0.25, 1] },
      },
    }),
  };

  // Gentle zoom with fade
  const zoomVariants = {
    enter: {
      scale: 1.06,
      opacity: 0,
    },
    center: {
      scale: 1,
      opacity: 1,
      transition: {
        scale: { duration: 2, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 2, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    exit: {
      scale: 0.97,
      opacity: 0,
      transition: {
        scale: { duration: 2, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 2, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
  };

  // Pure crossfade
  const crossfadeVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
      transition: {
        opacity: { duration: 1, ease: "easeOut" },
      },
    },
    exit: {
      opacity: 0,
      transition: {
        opacity: { duration: 1, ease: "easeOut" },
      },
    },
  };

  // 3D with fade
  const threeDVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 5 : -5,
      scale: 1.05,
      opacity: 0,
      z: -20,
    }),
    center: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
      z: 0,
      transition: {
        type: "tween",
        duration: 2,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 2.2, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -5 : 5,
      scale: 0.98,
      opacity: 0,
      z: -20,
      transition: {
        type: "tween",
        duration: 2,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 2.2, ease: [0.25, 0.1, 0.25, 1] },
      },
    }),
  };

  // Select animation variant based on type
  const getVariants = () => {
    switch (animationType) {
      case "fade":
        return fadeVariants;
      case "zoom":
        return zoomVariants;
      case "crossfade":
        return crossfadeVariants;
      case "3d":
        return threeDVariants;
      case "slide":
        return slideVariants;
      default:
        return fadeVariants;
    }
  };

  return (
    <div
      className="h-full w-full relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ perspective: "1200px" }}>
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent z-10"></div>

      {/* The carousel */}
      <div className="h-full w-full preserve-3d">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={getVariants()}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 h-full w-full"
            style={{
              transformStyle: "preserve-3d",
            }}>
            <Image
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              fill
              priority
              quality={95}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center",
                filter: "brightness(0.92) saturate(1.05)",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Indicators - more elegant style */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-[3px] rounded-sm transition-all duration-500 ${
              index === currentIndex
                ? "bg-white w-7"
                : "bg-white/30 w-4 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Text overlay - Improved animation and style */}
      <div className="absolute bottom-12 left-12 z-20 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          key={currentIndex + "title"}>
          <h2 className="text-3xl font-extralight tracking-wider mb-3">
            {title}
          </h2>
          <div className="h-px w-14 bg-white/70 mb-4"></div>
          <p className="text-sm text-gray-100 max-w-md font-light leading-relaxed">
            {subtitle}
          </p>

          {/* Optional CTA button - more elegant */}
          <motion.button
            className="mt-7 px-7 py-2 bg-white/15 backdrop-blur hover:bg-white/25 text-white border border-white/20 text-sm tracking-wide transition-all"
            whileHover={{
              scale: 1.03,
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.98 }}>
            Explore Collection
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthCarousel;
