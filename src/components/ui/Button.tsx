"use client";

import React, { ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-heading font-semibold tracking-wide transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed rounded-btn focus:outline-none focus:ring-2 focus:ring-accent/50";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-accent to-accent-secondary text-white shadow-glow-orange hover:shadow-glow-orange-lg hover:brightness-110 active:scale-[0.98]",
      secondary:
        "bg-background-elevated text-foreground hover:bg-background-elevated/80 border border-border hover:border-accent/40 active:scale-[0.98]",
      outline:
        "bg-transparent text-foreground hover:text-accent border border-border hover:border-accent/60 active:scale-[0.98]",
      ghost:
        "bg-transparent text-foreground-muted hover:text-foreground hover:bg-background-elevated/50 active:scale-[0.98]",
      danger:
        "bg-error text-white hover:bg-error/90 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-2 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-7 py-3.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

