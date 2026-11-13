"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  Copy,
  Crosshair,
  Download,
  Info,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { POPULAR_DEVICES } from "@/config/devices";
import {
  sensitivityResultSchema,
  type SensitivityResult,
} from "@/lib/sensitivity-calculator";

const RAM_OPTIONS = ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "Other"];
const FINGER_OPTIONS = ["2 fingers", "3 fingers", "4 fingers", "5 fingers"] as const;
const PLAY_STYLES = ["Rusher", "Sniper", "Balanced"] as const;
const SENSITIVITY_NAMES = [
  ["general", "General", "Drag base"],
  ["redDot", "Red Dot", "Hipfire"],
  ["scope2x", "2X Scope", "Mid-range tracking"],
  ["scope4x", "4X Scope", "Long-range control"],
  ["sniperScope", "Sniper Scope", "AWM / Kar98"],
  ["freeLook", "Free Look", "Camera movement"],
] as const;

type FormState = {
  deviceName: string;
  ram: string;
  customRam: string;
  dpi: string;
  fingerStyle: (typeof FINGER_OPTIONS)[number];
  playStyle: (typeof PLAY_STYLES)[number];
};

const initialForm: FormState = {
  deviceName: "Samsung Galaxy A15 5G",
  ram: "8 GB",
  customRam: "",
  dpi: "",
  fingerStyle: "2 fingers",
  playStyle: "Balanced",
};

function progressPercent(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, (value / 200) * 100));
}

function formatValue(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "Unavailable";
}

function buildSettingsText(result: SensitivityResult): string {
  const { device, preferences, sensitivity } = result;
  return [
    "XPWOT - Free Fire Sensitivity Profile",
    `Device: ${device.name} (${device.brandName})`,
    `RAM: ${device.ram}`,
    `Game: ${preferences.game}`,
    `Playing style: ${preferences.playStyle}`,
    `Finger layout: ${preferences.fingerStyle}`,
    `Current DPI: ${device.dpi ?? "Not provided"}`,
    `Recommended DPI: ${sensitivity.recommendedDpi ?? "No verified recommendation"}`,
    "",
    `General: ${formatValue(sensitivity.general)}`,
    `Red Dot: ${sensitivity.redDot}`,
    `2X Scope: ${sensitivity.scope2x}`,
    `4X Scope: ${sensitivity.scope4x}`,
    `Sniper Scope: ${sensitivity.sniperScope}`,
    `Free Look: ${sensitivity.freeLook}`,
    `Fire Button: ${sensitivity.fireButtonSize}%`,
    `Fire Button Position: ${sensitivity.fireButtonPosition} (horizontal ${sensitivity.fireButtonHorizontal}%, vertical ${sensitivity.fireButtonVertical}%)`,
    "",
    result.matchNotice,
  ].join("\n");
}

export function DpiCalculator() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState<SensitivityResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState("");

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setCopyState("");

    const deviceName = form.deviceName.trim();
    const ram = form.ram === "Other" ? form.customRam.trim() : form.ram;
    if (deviceName.length < 2 || deviceName.length > 80) {
      setError("Enter a valid device name.");
      return;
    }
    if (form.ram === "Other" && !ram) {
      setError("Enter your device RAM.");
      return;
    }
    const dpi = form.dpi === "" ? null : Number(form.dpi);
    if (dpi !== null && (!Number.isInteger(dpi) || dpi < 50 || dpi > 2000)) {
      setError("Enter a whole-number DPI between 50 and 2000.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/sensitivity/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceName,
          ram,
          dpi,
          fingerStyle: form.fingerStyle,
          playStyle: form.playStyle,
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
            ? data.error
            : "Unable to generate a sensitivity profile.";
        throw new Error(message);
      }
      const parsedResult = sensitivityResultSchema.safeParse(data);
      if (!parsedResult.success) {
        throw new Error("The sensitivity API returned an invalid response.");
      }
      setResult(parsedResult.data);
      window.setTimeout(
        () => document.getElementById("sensi-result")?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate a sensitivity profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const copySettings = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(buildSettingsText(result));
      setCopyState("Copied to Clipboard!");
    } catch {
      setCopyState("Clipboard access failed. Please copy the settings manually.");
    }
  };

  const downloadSettings = () => {
    if (!result) return;
    const blob = new Blob([buildSettingsText(result)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result.device.slug || "device"}-free-sensi.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const premiumQuery = result
    ? new URLSearchParams({
        pack: "premium",
        deviceSlug: result.device.slug,
        brand: result.device.brandName,
        model: result.device.name,
        ram: result.device.ram,
        dpi: result.device.dpi === null ? "" : String(result.device.dpi),
        fingers: result.preferences.fingerStyle,
        playStyle: result.preferences.playStyle,
        game: result.preferences.game,
      }).toString()
    : "";

  return (
    <section id="finder" className="relative bg-grid-pattern py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-background-card px-4 py-1.5 text-xs font-bold tracking-wider text-accent">
            <Crosshair className="h-4 w-4" /> FREE SENSITIVITY FINDER
          </div>
          <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Find Your Sensitivity
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground-muted sm:text-base">
            Create a starting profile using your device, RAM, finger layout, play style, and current DPI.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 rounded-card border border-border bg-background-card p-5 shadow-card-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-foreground-muted">
              <span>Device name</span>
              <input
                list="known-device-names"
                value={form.deviceName}
                onChange={(event) => updateForm("deviceName", event.target.value)}
                maxLength={80}
                required
                className="w-full rounded-input border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none"
                placeholder="Enter your phone brand and model"
              />
              <datalist id="known-device-names">
                {POPULAR_DEVICES.map((device) => <option key={device} value={device} />)}
              </datalist>
            </label>

            <label className="space-y-2 text-sm font-semibold text-foreground-muted">
              <span>Device RAM</span>
              <select value={form.ram} onChange={(event) => updateForm("ram", event.target.value)} className="w-full rounded-input border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none">
                {RAM_OPTIONS.map((ram) => <option key={ram} value={ram}>{ram}</option>)}
              </select>
            </label>
            {form.ram === "Other" && (
              <label className="space-y-2 text-sm font-semibold text-foreground-muted">
                <span>RAM amount</span>
                <input value={form.customRam} onChange={(event) => updateForm("customRam", event.target.value)} maxLength={20} required placeholder="e.g. 10 GB" className="w-full rounded-input border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none" />
              </label>
            )}

            <label className="space-y-2 text-sm font-semibold text-foreground-muted">
              <span>Finger layout</span>
              <select value={form.fingerStyle} onChange={(event) => updateForm("fingerStyle", event.target.value as FormState["fingerStyle"])} className="w-full rounded-input border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none">
                {FINGER_OPTIONS.map((style) => <option key={style}>{style}</option>)}
              </select>
            </label>

            <label className="space-y-2 text-sm font-semibold text-foreground-muted">
              <span>How do you play?</span>
              <select value={form.playStyle} onChange={(event) => updateForm("playStyle", event.target.value as FormState["playStyle"])} className="w-full rounded-input border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none">
                {PLAY_STYLES.map((style) => <option key={style}>{style}</option>)}
              </select>
            </label>

            <label className="space-y-2 text-sm font-semibold text-foreground-muted">
              <span>Current device DPI (optional)</span>
              <input inputMode="numeric" type="number" min={50} max={2000} step={1} value={form.dpi} onChange={(event) => updateForm("dpi", event.target.value)} placeholder="Enter current DPI" className="w-full rounded-input border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none" />
              <span className="flex items-start gap-1.5 text-xs font-normal text-foreground-muted"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Changing Android display DPI can affect the device interface. Recommendations are only available for the supplied reference combinations.</span>
            </label>
          </div>

          {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-error/40 bg-error/10 p-3 text-sm text-red-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
          <button type="submit" disabled={isLoading} className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-gradient-to-r from-accent to-accent-secondary px-6 py-3.5 font-heading font-bold text-white shadow-glow-orange transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
            {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating profile...</> : <><Crosshair className="h-5 w-5" /> GET MY FREE SENSI</>}
          </button>
        </form>

        {result && (
          <div id="sensi-result" className="mt-8 scroll-mt-24 space-y-5 rounded-card border border-border bg-background-card p-5 shadow-card-soft sm:p-8">
            <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-widest text-accent">FREE SENSITIVITY PROFILE · {result.versionName}</p>
                <h3 className="mt-2 font-heading text-2xl font-black text-white">{result.device.name}</h3>
                <p className="mt-1 text-sm text-foreground-muted">{result.device.brandName} · {result.device.ram} · {result.preferences.fingerStyle} · {result.preferences.playStyle} · {result.preferences.game}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-300"><ShieldAlert className="h-4 w-4" /> Starting preset</span>
            </div>

            <div role="note" className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3 text-sm text-yellow-100">{result.matchNotice}</div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SENSITIVITY_NAMES.map(([key, title, description]) => {
                const rawValue = result.sensitivity[key];
                const value = typeof rawValue === "number" && Number.isFinite(rawValue) ? rawValue : null;
                const progress = progressPercent(value);
                return (
                  <div key={key} className="rounded-xl border border-border bg-background-elevated p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div><h4 className="font-heading font-bold text-foreground">{title}</h4><p className="text-xs text-foreground-muted">{description}</p></div>
                      <span className="font-mono text-2xl font-black text-accent">{value === null ? "—" : value}</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-background"><div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all" style={{ width: `${progress}%` }} /></div>
                    <p className="mt-1 text-right text-xs text-foreground-muted">{value === null ? "Unavailable" : `${progress.toFixed(1)}%`}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/5 p-5">
                <h4 className="font-heading font-bold text-yellow-200">Recommended New DPI</h4>
                <p className="mt-2 font-mono text-4xl font-black text-yellow-300">{result.sensitivity.recommendedDpi ?? "Unavailable"}</p>
                <p className="mt-2 text-sm text-foreground-muted">Current DPI: {result.device.dpi ?? "Not provided"} · RAM: {result.device.ram}</p>
                <p className="mt-1 text-xs text-foreground-muted">{result.dpiNotice}</p>
              </div>
              <div className="rounded-xl border border-border bg-background-elevated p-5">
                <h4 className="font-heading font-bold text-foreground">Fire Button Recommendation</h4>
                <p className="mt-2 font-mono text-3xl font-black text-accent">{formatValue(result.sensitivity.fireButtonSize)}{typeof result.sensitivity.fireButtonSize === "number" ? "%" : ""}</p>
                <p className="mt-2 text-sm text-foreground-muted">{result.sensitivity.fireButtonPosition || "Position unavailable"}</p>
                <p className="text-sm text-foreground-muted">Horizontal: {formatValue(result.sensitivity.fireButtonHorizontal)}% · Vertical: {formatValue(result.sensitivity.fireButtonVertical)}%</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={copySettings} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-btn border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:text-accent">{copyState.startsWith("Copied") ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy Settings</button>
              <button type="button" onClick={downloadSettings} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-btn border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:text-accent"><Download className="h-4 w-4" /> Download Free Sensi</button>
              <Link href={`/order?${premiumQuery}`} className="inline-flex min-h-11 items-center justify-center rounded-btn bg-accent px-4 py-2.5 text-center text-sm font-bold text-white transition hover:brightness-110">Try Premium Sensitivity for {result.device.name}</Link>
              {copyState && <p role="status" className="w-full text-sm text-foreground-muted">{copyState}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
