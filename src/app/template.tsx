"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          // y: 20,
          opacity: 0,
          scale: 0.99,
        }}
        animate={{
          // y: 0,
          opacity: 1,
          scale: 1,
        }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
