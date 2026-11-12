import { PackageId } from "@/config/packages";

export type PlayStyleType = "RUSHER" | "SNIPER" | "BALANCED";
export type FingerLayoutType = "2 Fingers" | "3 Fingers" | "4 Fingers" | "5 Fingers";
export type SensiSpeedType = "HIGH" | "BALANCED" | "LOW";
export type RefreshRateType = "60Hz" | "90Hz" | "120Hz" | "144Hz";
export type RamType = "2GB" | "3GB" | "4GB" | "6GB" | "8GB" | "12GB+";

export interface OrderFormData {
  fullName: string;
  gameId: string;
  whatsappNumber: string;
  telegramUsername?: string;
  deviceModel: string;
  ram: RamType;
  chipset?: string;
  refreshRate: RefreshRateType;
  deviceDpi?: string;
  sensiPreference: SensiSpeedType;
  playStyle: PlayStyleType;
  fingerLayout: FingerLayoutType;
  packageId: PackageId;
  termsAccepted: boolean;
}

export type PaymentStatus = "CREATED" | "PAID" | "FAILED" | "VERIFIED";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED";

export interface OrderRecord {
  id: string;
  zap_order_id: string;
  zap_gateway_order_id?: string;
  zap_txn_id?: string;
  zap_utr?: string;
  customer_details: {
    fullName: string;
    gameId: string;
    whatsappNumber: string;
    telegramUsername?: string;
  };
  device_details: {
    deviceModel: string;
    ram: RamType;
    chipset?: string;
    refreshRate: RefreshRateType;
    deviceDpi?: string;
    sensiPreference: SensiSpeedType;
    playStyle: PlayStyleType;
    fingerLayout: FingerLayoutType;
  };
  package_id: PackageId;
  amount: number; // in INR
  payment_status: PaymentStatus;
  notification_status: NotificationStatus;
  created_at: string;
  updated_at: string;
}
