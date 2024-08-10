"use client";

import { motion, MotionProps } from "framer-motion";
import React from "react";

interface CustomMotionProps<Tag extends keyof JSX.IntrinsicElements>
  extends MotionProps {
  type?: Tag;
  children: React.ReactNode;
  className?: string;
}

export const Motion = <Tag extends keyof JSX.IntrinsicElements>({
  type,
  children,
  className,
  ...props
}: CustomMotionProps<Tag>) => {
  // Use memoization to avoid unnecessary re-renders
  const Component = React.useMemo(
    () => (type ? (motion as any)[type] : motion.div),
    [type]
  );

  return (
    <Component
      className={className}
      style={{ willChange: "transform, opacity" }} // Hint to the browser to optimize these properties
      {...props}>
      {children}
    </Component>
  );
};
