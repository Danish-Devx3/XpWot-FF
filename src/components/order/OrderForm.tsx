"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Lock, AlertCircle, Zap, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { orderFormSchema, OrderFormSchemaType } from "@/lib/validation";
import { SENSI_PACKAGES, PackageId } from "@/config/packages";
import { Button } from "@/components/ui/Button";
import { PlayerDetails } from "./PlayerDetails";
import { DeviceDetails } from "./DeviceDetails";
import { PlayStyle } from "./PlayStyle";
import { PackageSelector } from "./PackageSelector";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface OrderFormProps {
  initialPackId?: PackageId;
}

export function OrderForm({ initialPackId = "pro" }: OrderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormSchemaType>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      packageId: initialPackId,
      ram: "8GB",
      refreshRate: "120Hz",
      playStyle: "RUSHER",
      fingerLayout: "4 Fingers",
      sensiPreference: "HIGH",
      termsAccepted: false,
    },
  });

  const selectedPackageId = watch("packageId");
  const currentPackage = SENSI_PACKAGES[selectedPackageId] || SENSI_PACKAGES.pro;
  const watchDeviceModel = watch("deviceModel");

  // Helper to load Razorpay checkout script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (data: OrderFormSchemaType) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      toast.loading("Initiating secure order...", { id: "order-tx" });

      // 1. Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        const msg = "Failed to load Razorpay secure checkout. Please check your internet connection.";
        setServerError(msg);
        toast.error(msg, { id: "order-tx" });
        setIsSubmitting(false);
        return;
      }

      // 2. Call server endpoint to create order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        const msg = orderData.error || "Unable to initiate order. Please try again.";
        setServerError(msg);
        toast.error(msg, { id: "order-tx" });
        setIsSubmitting(false);
        return;
      }

      const { orderId, amount, keyId } = orderData;
      toast.dismiss("order-tx");

      // 3. Configure Razorpay Checkout with explicit UPI & QR Prioritization
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        name: "XPWOT",
        description: `${currentPackage.name} - Free Fire Sensitivity`,
        order_id: orderId,
        prefill: {
          name: data.fullName,
          contact: data.whatsappNumber.startsWith("+91")
            ? data.whatsappNumber
            : `+91${data.whatsappNumber}`,
          email: `${data.whatsappNumber}@customer.xpwot.com`,
        },
        theme: {
          color: "#FF6B24",
          backdrop_color: "#08090B",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI / QR Code",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
              cards: {
                name: "Cards & NetBanking",
                instruments: [
                  {
                    method: "card",
                  },
                  {
                    method: "netbanking",
                  },
                ],
              },
            },
            sequence: ["block.upi", "block.cards"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          confirm_close: true,
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
        handler: async function (response: any) {
          try {
            // 4. Verify payment on server
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              toast.success("Payment verified! Redirecting to receipt...", { id: "order-tx" });
              router.push(
                `/success?order_id=${encodeURIComponent(response.razorpay_order_id)}&payment_id=${encodeURIComponent(response.razorpay_payment_id)}`
              );
            } else {
              const msg = verifyData.error || "Payment verification failed. Please contact support if your money was debited.";
              setServerError(msg);
              toast.error(msg, { id: "order-tx" });
              setIsSubmitting(false);
            }
          } catch (err: any) {
            const msg = "Network error during payment verification. Please check support.";
            setServerError(msg);
            toast.error(msg, { id: "order-tx" });
            setIsSubmitting(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (resp: any) {
        const msg = resp.error?.description || "Payment failed. Please try again with UPI or Card.";
        setServerError(msg);
        toast.error(msg, { id: "order-tx" });
        setIsSubmitting(false);
      });

      razorpay.open();
    } catch (err: any) {
      console.error("Order submission error:", err);
      setServerError(err?.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16 md:pb-0">
      {/* Visual Step Progress Header */}
      <div className="hidden sm:grid grid-cols-5 gap-2 pb-2 text-center text-xs font-heading font-semibold uppercase tracking-wider">
        <div className="p-2.5 rounded-xl bg-background-elevated border border-border text-foreground flex items-center justify-center gap-1.5 shadow-sm">
          <span className="text-accent font-mono">01</span> Player
        </div>
        <div className="p-2.5 rounded-xl bg-background-elevated border border-border text-foreground flex items-center justify-center gap-1.5 shadow-sm">
          <span className="text-accent font-mono">02</span> Device
        </div>
        <div className="p-2.5 rounded-xl bg-background-elevated border border-border text-foreground flex items-center justify-center gap-1.5 shadow-sm">
          <span className="text-accent font-mono">03</span> Controls
        </div>
        <div className="p-2.5 rounded-xl bg-background-elevated border border-border text-foreground flex items-center justify-center gap-1.5 shadow-sm">
          <span className="text-accent font-mono">04</span> Pack
        </div>
        <div className="p-2.5 rounded-xl bg-accent/15 border border-accent/40 text-accent font-bold flex items-center justify-center gap-1.5 shadow-glow-orange">
          <span className="font-mono">05</span> Pay
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-4 rounded-xl bg-error/15 border border-error/40 flex items-start gap-3 text-sm text-error">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Order Error:</span>
            <p>{serverError}</p>
          </div>
        </div>
      )}

      {/* Section A: Player Details */}
      <PlayerDetails register={register} errors={errors} />

      {/* Section B: Device Information */}
      <DeviceDetails
        register={register}
        errors={errors}
        setValue={setValue}
        watchDeviceModel={watchDeviceModel}
      />

      {/* Section C: Play Style & Layout */}
      <PlayStyle
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
      />

      {/* Section D: Select Sensi Pack */}
      <PackageSelector setValue={setValue} watch={watch} />

      {/* Section E: Terms and Payment Summary */}
      <div className="bg-background-card rounded-card border border-border p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-border/70 pb-4">
          <span className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 font-mono font-bold text-accent flex items-center justify-center text-sm">
            E
          </span>
          <div>
            <h2 className="font-heading font-bold text-lg md:text-xl text-foreground">
              CHECKOUT & PAYMENT
            </h2>
            <p className="text-xs text-foreground-muted">
              Secure 256-bit encrypted transaction processed by Razorpay.
            </p>
          </div>
        </div>

        {/* Selected Package Breakdown */}
        <div className="p-4 rounded-xl bg-background-elevated border border-border space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground-muted">Selected Tier:</span>
            <span className="font-heading font-bold text-foreground">
              {currentPackage.name}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground-muted">Estimated Delivery:</span>
            <span className="font-mono text-accent font-semibold">
              {currentPackage.deliveryEstimate}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground-muted">Payment Gateway:</span>
            <span className="text-foreground font-medium">Razorpay (UPI, GPay, PhonePe, Cards)</span>
          </div>
          <div className="pt-3 border-t border-border flex items-baseline justify-between">
            <span className="font-heading font-bold text-base text-foreground">
              Total Amount Payable:
            </span>
            <span className="font-heading font-black text-2xl text-accent">
              ₹{currentPackage.price}
            </span>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-1.5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("termsAccepted")}
              className="mt-1 w-4 h-4 rounded border-border accent-accent focus:ring-accent"
            />
            <span className="text-xs text-foreground-muted leading-relaxed select-none">
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="text-accent underline font-semibold">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/refund-policy" target="_blank" className="text-accent underline font-semibold">
                Refund Policy
              </Link>
              . I understand that XPWOT provides custom advisory settings and does not require game passwords.
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="text-xs text-error font-medium">{errors.termsAccepted.message}</p>
          )}
        </div>

        {/* Primary Payment CTA */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full text-base font-heading font-bold tracking-wider py-4 shadow-glow-orange-lg"
          rightIcon={<Lock className="w-4 h-4" />}
        >
          PAY SECURELY — ₹{currentPackage.price}
        </Button>

        {/* Below button trust statement */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-foreground-muted pt-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Secure payment powered by Razorpay</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div>Instant Order Confirmation</div>
        </div>
      </div>

      {/* Sticky Mobile Checkout Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-card/95 backdrop-blur-md border-t border-border p-3 flex items-center justify-between shadow-[0_-4px_25px_rgba(0,0,0,0.8)]">
        <div>
          <div className="text-[10px] text-foreground-muted font-mono uppercase tracking-wider">
            {currentPackage.name}
          </div>
          <div className="text-lg font-heading font-black text-accent leading-none">
            ₹{currentPackage.price}
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          className="px-5 py-2.5 text-xs font-heading font-bold shadow-glow-orange"
          rightIcon={<Lock className="w-3.5 h-3.5" />}
        >
          PAY SECURELY
        </Button>
      </div>
    </form>
  );
}

