"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  threshold?: number;
  once?: boolean;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  duration = 0.65,
  direction = "up",
  threshold = 0.15,
  once = true,
}: MotionRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const distance = 14;
  const offsets = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const baseVariants: Variants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : offsets[direction].x,
      y: prefersReducedMotion ? 0 : offsets[direction].y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: threshold, once }}
      variants={baseVariants}
      transition={{
        delay,
        duration: prefersReducedMotion ? 0.01 : duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Preset configurations for common use cases
export const MotionPresets = {
  fadeUp: {
    direction: "up" as const,
    duration: 0.55,
    threshold: 0.1,
  },
  fadeDown: {
    direction: "down" as const,
    duration: 0.5,
    threshold: 0.1,
  },
  fadeIn: {
    direction: "none" as const,
    duration: 0.45,
    threshold: 0.1,
  },
  scaleIn: {
    direction: "up" as const,
    duration: 0.5,
    threshold: 0.2,
  },
  slideLeft: {
    direction: "left" as const,
    duration: 0.65,
    threshold: 0.15,
  },
  slideRight: {
    direction: "right" as const,
    duration: 0.65,
    threshold: 0.15,
  },
};
