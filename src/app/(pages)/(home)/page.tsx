"use client";
import NavList from "@/components/Navigation/NavList";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const heroImages = [
  "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/IMG_4501.jpg?v=1734678057",
  "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/IMG_4500.jpg?v=1734678057",
  "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/IMG_4515.jpg?v=1734678057",
  "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/IMG_4488.jpg?v=1734678057",
  "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/IMG_4490.jpg?v=1734678057",
  "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/IMG_4503.jpg?v=1734678057",
];

const heroTitles = [
  "Look 1: Bold Beginnings",
  "Look 2: Subtle Elegance",
  "Look 3: Modern Aesthetics",
  "Look 4: Refined Classics",
  "Look 5: Urban Statement",
  "Look 6: Timeless Allure",
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState(0);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);

  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning) return;

      if (e.deltaY < 0) {
        goPrev();
      } else {
        goNext();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isTransitioning]);

  function goNext() {
    const newIndex = (currentIndex + 1) % heroImages.length;
    setPrevSlideIndex(currentIndex);
    setCurrentIndex(newIndex);
    setDirection("down");
    triggerTransition();
  }

  function goPrev() {
    const newIndex = (currentIndex - 1 + heroImages.length) % heroImages.length;
    setPrevSlideIndex(currentIndex);
    setCurrentIndex(newIndex);
    setDirection("up");
    triggerTransition();
  }

  function triggerTransition() {
    setTransitionKey((prev) => prev + 1);
    setIsTransitioning(true);
  }

  const oldImage = heroImages[prevSlideIndex];
  const newImage = heroImages[currentIndex];

  const isReverse = direction === "up";
  const oldClass = isReverse ? "home-banner-old-reverse" : "home-banner-old";
  const newClass = isReverse ? "home-banner-new-reverse" : "home-banner-new";

  // More dramatic "rolodex" style variants
  // Down: old flips from 0 to -180, new from +180 to 0
  // Up: old flips from 0 to +180, new from -180 to 0
  const variants = {
    initial: (dir: "down" | "up") => ({
      rotateX: dir === "down" ? 180 : -180,
      opacity: 0,
    }),
    enter: {
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    exit: (dir: "down" | "up") => ({
      rotateX: dir === "down" ? -180 : 180,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1],
      },
    }),
  };

  useEffect(() => {
    const bannerEl = bannerRef.current;
    if (!bannerEl) return;

    // Re-trigger image transitions by toggling class
    bannerEl.classList.remove("home-banner-slide");
    void bannerEl.offsetWidth; // Trigger reflow
    bannerEl.classList.add("home-banner-slide");
  }, [transitionKey]);

  useEffect(() => {
    const bannerEl = bannerRef.current;
    if (!bannerEl) return;

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (
        e.target instanceof Element &&
        e.target.id === "t-01-banner-new" &&
        e.propertyName === "transform"
      ) {
        setIsTransitioning(false);
      }
    };

    bannerEl.addEventListener("transitionend", handleTransitionEnd);
    return () => {
      bannerEl.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, []);

  return (
    <main className="w-screen justify-start flex h-screen overflow-hidden relative bg-black">
      <div className=" right-[4%] bottom-[10%] my-auto hidden w-fit h-fit absolute lg:flex items-center justify-between text-blue-gray-900">
        <NavList />
      </div>

      <div
        className="relative w-full text-left z-20 ml-[4%]  my-auto flex justify-start items-center h-[10%] "
        style={{ perspective: "1000px" }}>
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            className="absolute text-white text-6xl font-bold flex items-center justify-center w-fit"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="enter"
            exit="exit">
            {heroTitles[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        id="home-banner"
        ref={bannerRef}
        className="banner-v w-3/4 max-w-[1000px] opacity-70 m-auto h-[80%] overflow-hidden"
        style={{ display: "block" }}>
        <div className="t-box t-01">
          <div
            id="t-01-banner-old"
            className={`home-banner-img ${oldClass}`}
            style={{ backgroundImage: `url(${oldImage})` }}></div>
          <div
            id="t-01-banner-new"
            className={`home-banner-img ${newClass}`}
            style={{ backgroundImage: `url(${newImage})` }}></div>
        </div>

        <div className="t-box t-02">
          <div
            id="t-02-banner-old"
            className={`home-banner-img ${oldClass}`}
            style={{ backgroundImage: `url(${oldImage})` }}></div>
          <div
            id="t-02-banner-new"
            className={`home-banner-img ${newClass}`}
            style={{ backgroundImage: `url(${newImage})` }}></div>
        </div>
      </div>
    </main>
  );
}
