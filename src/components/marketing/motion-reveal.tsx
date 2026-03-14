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
  stagger?: number;
  staggerChildren?: boolean;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  duration = 0.65,
  direction = "up",
  threshold = 0.15,
  once = true,
  stagger = 0.1,
  staggerChildren = false,
}: MotionRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const distance = 18;
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
      filter: prefersReducedMotion ? "none" : "blur(3px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: prefersReducedMotion ? 0.01 : duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren ? stagger : 0,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : offsets[direction].x,
      y: prefersReducedMotion ? 0 : offsets[direction].y,
      filter: prefersReducedMotion ? "none" : "blur(3px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: prefersReducedMotion ? 0.01 : duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  if (staggerChildren && Array.isArray(children)) {
    return (
      <motion.div
        className={cn(className)}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: threshold, once }}
        variants={containerVariants}
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            transition={{
              delay: delay + index * stagger,
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

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

// Stagger container for multiple children
export function StaggerContainer({
  children,
  className,
  delay = 0,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <MotionReveal
      className={className}
      delay={delay}
      stagger={stagger}
      staggerChildren
    >
      {children}
    </MotionReveal>
  );
}
