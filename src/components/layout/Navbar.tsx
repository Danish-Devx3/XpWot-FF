"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Zap, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Sensi Packs", href: "/#packs" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border/80 shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
            : "bg-background/60 backdrop-blur-sm border-b border-border/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-accent-secondary flex items-center justify-center font-heading font-black text-white text-xl tracking-tighter shadow-glow-orange group-hover:scale-105 transition-transform duration-200">
              <Crosshair className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-2xl tracking-wider text-white">
                XP<span className="text-accent">WOT</span>
              </span>
              <span className="text-[10px] font-heading uppercase tracking-widest text-foreground-muted -mt-1 group-hover:text-accent transition-colors">
                Esports Precision
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg font-heading text-sm transition-all duration-200 ${
                    isActive
                      ? "text-accent font-semibold bg-accent/10"
                      : "text-foreground-muted hover:text-white hover:bg-background-elevated/40"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/order?pack=premium">
              <Button
                variant="primary"
                size="md"
                rightIcon={<Zap className="w-4 h-4 fill-white" />}
              >
                GET YOUR SENSI
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/order?pack=premium">
              <Button variant="primary" size="sm" className="px-3 py-1.5 text-xs">
                GET SENSI
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-lg bg-background-card border border-border text-foreground-muted hover:text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Mobile Navigation */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath={pathname}
      />
    </>
  );
}
