"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  defaultOpenId?: string;
}

export function Accordion({ items, className, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn("space-y-3.5", className)}>
      {items.map((item, idx) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "rounded-card border transition-all duration-200 overflow-hidden",
              isOpen
                ? "bg-background-elevated/70 border-accent/40 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                : "bg-background-card/90 border-border hover:border-border/80"
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left p-5 md:p-6 transition-colors group"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3.5 pr-4">
                <span className="text-xs font-heading font-bold text-accent/80 font-mono tracking-wider">
                  0{idx + 1}
                </span>
                <span className="text-base md:text-lg font-heading font-medium text-foreground group-hover:text-accent transition-colors">
                  {item.question}
                </span>
              </div>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-border transition-all duration-300",
                  isOpen
                    ? "bg-accent/20 border-accent/50 text-accent rotate-180"
                    : "bg-background-secondary text-foreground-muted group-hover:text-foreground"
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 md:px-6 pb-6 text-foreground-muted text-sm md:text-base leading-relaxed border-t border-border/40 pt-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

