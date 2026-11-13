import { z } from "zod";

export const orderFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(70, "Full name cannot exceed 70 characters"),
  
  gameId: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{6,15}$/, "Free Fire ID must be between 6 and 15 digits (numbers only)")
    ),

  whatsappNumber: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, "").slice(-10))
    .pipe(
      z
        .string()
        .regex(
          /^[6-9]\d{9}$/,
          "Enter a valid 10-digit Indian WhatsApp number (starts with 6, 7, 8, or 9)"
        )
    ),

  telegramUsername: z
    .string()
    .trim()
    .max(35, "Telegram username cannot exceed 35 characters")
    .optional()
    .or(z.literal("")),

  deviceModel: z
    .string()
    .trim()
    .min(2, "Please enter your smartphone brand & model (e.g., Poco X6 Pro, Realme 12)")
    .max(80, "Device model is too long"),

  ram: z.enum(["2GB", "3GB", "4GB", "6GB", "8GB", "12GB+"], {
    errorMap: () => ({ message: "Please select your phone's RAM" }),
  }),

  chipset: z
    .string()
    .trim()
    .max(60, "Chipset name is too long")
    .optional()
    .or(z.literal("")),

  refreshRate: z.enum(["60Hz", "90Hz", "120Hz", "144Hz"], {
    errorMap: () => ({ message: "Please select your screen refresh rate" }),
  }),

  deviceDpi: z
    .string()
    .trim()
    .max(30, "DPI value is too long")
    .optional()
    .or(z.literal("")),

  sensiPreference: z.enum(["HIGH", "BALANCED", "LOW"], {
    errorMap: () => ({ message: "Please select your sensitivity preference" }),
  }),

  playStyle: z.enum(["RUSHER", "SNIPER", "BALANCED"], {
    errorMap: () => ({ message: "Please select your primary play style" }),
  }),

  fingerLayout: z.enum(
    ["2 Fingers", "3 Fingers", "4 Fingers", "5 Fingers"],
    {
      errorMap: () => ({ message: "Please select your finger layout" }),
    }
  ),

  packageId: z.enum(["premium"], {
    errorMap: () => ({ message: "Please select a valid sensi pack" }),
  }),

  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms & Conditions and Refund Policy to proceed",
  }),
});

export type OrderFormSchemaType = z.infer<typeof orderFormSchema>;

export const zapupiWebhookSchema = z.object({
  order_id: z.string().min(1),
  status: z.string().min(1),
  txn_id: z.string().optional(),
  amount: z.union([z.string(), z.number()]).optional(),
  pay_amount: z.union([z.string(), z.number()]).optional(),
  utr: z.string().optional(),
  customer_mobile: z.string().optional(),
  remark: z.string().optional(),
  remark_array: z.array(z.string()).optional(),
  create_at: z.string().optional(),
  environment: z.string().optional(),
});
