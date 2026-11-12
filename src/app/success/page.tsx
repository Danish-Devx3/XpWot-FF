"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Send,
  Home,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";

interface VerifiedOrderData {
  paid: boolean;
  orderId: string;
  paymentId: string;
  amount: number;
  packageName: string;
  deliveryEstimate: string;
  customerName: string;
  whatsappNumber: string;
  createdAt: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("txn_id");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<VerifiedOrderData | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!orderId) {
      setError("No valid order identifier was provided. Access denied.");
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }
    const validOrderId = orderId;

    async function verifyOrderOnServer() {
      setIsLoading(true);
      setError(null);
      setGatewayStatus(null);

      try {
        let lastStatus: string | null = null;
        let lastMessage = "ZapUPI has not confirmed this payment yet.";

        for (let attempt = 0; attempt < 10; attempt += 1) {
          const res = await fetch(
            `/api/verify-status?order_id=${encodeURIComponent(validOrderId)}`,
            { cache: "no-store" }
          );
          const data = await res.json();

          if (cancelled) return;

          if (res.ok && data.paid) {
            setOrderData(data);
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#FF6B24", "#FF9B45", "#22C55E", "#FFFFFF"],
              });
            } catch {
              // Ignore if canvas confetti is not supported.
            }
            return;
          }

          lastStatus = typeof data.gatewayStatus === "string" ? data.gatewayStatus : null;
          lastMessage = data.gatewayMessage || data.message || data.error || lastMessage;
          if (lastStatus?.toLowerCase() === "error") {
            break;
          }
          if (attempt < 9) {
            await new Promise((resolve) => setTimeout(resolve, 2500));
          }
        }
        if (!cancelled) {
          setGatewayStatus(lastStatus);
          setError(
            `${lastMessage}. If your account was debited, do not pay again; contact support with your order ID.`
          );
        }
      } catch {
        if (!cancelled) {
          setError("Could not reach the payment verification service. Please retry or contact support.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    verifyOrderOnServer();
    return () => {
      cancelled = true;
    };
  }, [orderId, retryCount]);

  if (isLoading) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto" />
        <h2 className="font-heading font-bold text-xl text-foreground">
          Verifying Payment with ZapUPI...
        </h2>
        <p className="text-xs text-foreground-muted">
          Securing cryptographic receipt and updating order ledger.
        </p>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="py-16 max-w-lg mx-auto px-4">
        <Card className="p-8 border-error/50 bg-background-card text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-error/15 border border-error/30 flex items-center justify-center mx-auto text-error">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-black text-2xl text-foreground uppercase">
            Order Verification Incomplete
          </h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            {error || "Unable to confirm payment status for this transaction."}
          </p>
          {gatewayStatus && (
            <p className="text-xs text-foreground-muted">
              Current ZapUPI status: <strong>{gatewayStatus}</strong>
            </p>
          )}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {orderId && (
              <Button
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
                onClick={() => setRetryCount((count) => count + 1)}
              >
                Check Again
              </Button>
            )}
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="secondary" size="md" className="w-full">
                Back to Home
              </Button>
            </Link>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=Hi%2C%20I%20have%20an%20order%20verification%20issue%20with%20Order%20ID%3A%20${orderId || "unknown"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="primary" size="md" className="w-full" leftIcon={<MessageCircle className="w-4 h-4" />}>
                Contact Support
              </Button>
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 relative bg-grid-pattern min-h-screen">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-success/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Card className="p-8 sm:p-10 border-success/40 bg-background-card/95 shadow-2xl relative space-y-8">
          {/* Animated Success Icon */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-success/15 border-2 border-success flex items-center justify-center mx-auto text-success shadow-[0_0_30px_rgba(34,197,94,0.35)] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest text-success uppercase">
                TRANSACTION CONFIRMED
              </span>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                PAYMENT SUCCESSFUL
              </h1>
            </div>

            <p className="text-sm text-foreground-muted leading-relaxed max-w-md mx-auto">
              Thank you for choosing XPWOT, <strong className="text-foreground">{orderData.customerName}</strong>. Your customized sensitivity settings will be sent to your registered WhatsApp or Telegram contact within the stated delivery window.
            </p>
          </div>

          {/* Order Details Receipt Box */}
          <div className="p-5 rounded-2xl bg-background-elevated/80 border border-border space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-foreground-muted">Order ID:</span>
              <span className="text-accent font-bold">{orderData.orderId}</span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-foreground-muted">Payment ID:</span>
              <span className="text-foreground">{orderData.paymentId || paymentId || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-foreground-muted">Selected Package:</span>
              <span className="text-foreground font-bold">{orderData.packageName}</span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-foreground-muted">Amount Paid:</span>
              <span className="text-success font-bold text-sm">₹{orderData.amount}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-foreground-muted">Delivery Status:</span>
              <span className="flex items-center gap-1.5 text-accent font-bold bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/30">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                PROCESSING
              </span>
            </div>
          </div>

          {/* Delivery Window Highlight */}
          <div className="p-4 rounded-xl bg-background-secondary border border-accent/30 flex items-center gap-3">
            <Clock className="w-5 h-5 text-accent shrink-0" />
            <div className="text-xs">
              <span className="text-foreground font-bold">Estimated Delivery Window: </span>
              <span className="text-accent font-mono font-semibold">
                {orderData.deliveryEstimate}
              </span>
              <p className="text-foreground-muted mt-0.5">
                Delivering to WhatsApp (+91 {orderData.whatsappNumber})
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=Hi%2C%20I%20just%20completed%20payment%20for%20Order%20${orderData.orderId}.%20Name%3A%20${encodeURIComponent(orderData.customerName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full text-sm font-heading"
                leftIcon={<MessageCircle className="w-4 h-4" />}
              >
                CONFIRM ON WHATSAPP (+91 93419 23708)
              </Button>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={siteConfig.contact.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full text-xs font-heading"
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  JOIN TELEGRAM UPDATES
                </Button>
              </a>

              <Link href="/" className="w-full">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-xs font-heading"
                  leftIcon={<Home className="w-4 h-4" />}
                >
                  BACK TO HOME
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-foreground-muted">
          Loading order details...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
