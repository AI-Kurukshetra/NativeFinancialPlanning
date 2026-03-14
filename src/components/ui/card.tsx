"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

export function Card({
  className,
  hover = false,
  glass = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out",
        glass
          ? "border border-black/10 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-black/10 before:to-transparent before:content-[''] dark:border-white/12 dark:bg-black dark:shadow-[0_14px_40px_rgba(0,0,0,0.34)] dark:before:via-white/20"
          : "border border-black/10 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.04)] dark:border-white/12 dark:bg-black",
        hover && "hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] dark:hover:border-white/20 dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.42)]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-2 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-black dark:text-white",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm leading-6 text-neutral-600 dark:text-neutral-400",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}
