"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShieldCheck, Flame, MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

export function MobileMenu({ isOpen, onClose, activePath, triggerRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (isOpen) triggerRef.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Sensi Packs", href: "/#packs" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact Support", href: "/contact" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            ref={panelRef}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-[85%] max-w-sm flex-col justify-between border-l border-border bg-background-card p-6 shadow-2xl md:hidden"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-accent-secondary flex items-center justify-center font-heading font-black text-white text-lg tracking-wider">
                    X
                  </div>
                  <span className="font-heading font-black text-xl tracking-wider text-foreground">
                    XP<span className="text-accent">WOT</span>
                  </span>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-lg bg-background-elevated border border-border flex items-center justify-center text-foreground-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="mt-6 flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = activePath === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl font-heading text-base font-medium transition-all ${
                        isActive
                          ? "bg-accent/15 text-accent border border-accent/30 font-semibold"
                          : "text-foreground-muted hover:text-foreground hover:bg-background-elevated"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-60" />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 p-4 rounded-xl bg-background-secondary/70 border border-border">
                <div className="flex items-center gap-2 text-xs font-heading font-semibold text-accent uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Anti-Ban & Safe
                </div>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  Pure in-game sensitivity calibration. We never ask for your game password or OTP.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border space-y-3">
              <Link href="/order?pack=premium" onClick={onClose} className="w-full block">
                <Button variant="primary" size="lg" className="w-full">
                  GET YOUR SENSI
                </Button>
              </Link>
              <div className="text-center">
                <span className="text-[11px] text-foreground-muted">
                  Instant WhatsApp & Telegram Delivery
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
