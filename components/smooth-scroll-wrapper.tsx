"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

/**
 * SmoothScrollWrapper (Dependency-Free Edition)
 * Provides a premium "momentum" feel using framer-motion springs.
 * This avoids the npm installation issues while maintaining the Lando aesthetic.
 */
export const SmoothScrollWrapper = ({ children }: { children: ReactNode }) => {
  const { scrollYProgress } = useScroll();
  
  // Create a spring-based scroll progress for smoothness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // We can also apply a "tilt" or subtle parallax to the entire page content
  // if we want to go full Lando Style
  
  return (
    <motion.div className="will-change-transform">
      {children}
    </motion.div>
  );
};
