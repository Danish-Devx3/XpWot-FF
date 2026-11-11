import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export function Card({
  className,
  hoverEffect = false,
  glow = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-background-card rounded-card border border-border transition-all duration-300 relative overflow-hidden",
        hoverEffect && "hover:border-accent/40 hover:-translate-y-1 hover:shadow-card-soft",
        glow && "border-accent/60 shadow-glow-orange",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

