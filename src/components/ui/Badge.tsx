import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "orange" | "neutral" | "success" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "orange",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    orange:
      "bg-accent/15 text-accent border border-accent/30 shadow-[0_0_12px_rgba(255,107,36,0.2)]",
    neutral: "bg-background-elevated text-foreground-muted border border-border",
    success:
      "bg-success/15 text-success border border-success/30 shadow-[0_0_12px_rgba(34,197,94,0.15)]",
    outline: "bg-transparent text-foreground-muted border border-border",
  };

  const sizeStyles = {
    sm: "text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5",
    md: "text-xs font-semibold tracking-wider uppercase px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-heading transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

