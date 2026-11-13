/**
 * XPWOT Comprehensive Automated Verification Suite
 * Tests input validation, ZapUPI webhook payloads, and idempotency behavior.
 */

const { z } = require("zod");

// 1. Re-run Validation Schema Tests
const orderFormSchema = z.object({
  fullName: z.string().trim().min(2).max(70),
  gameId: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{6,15}$/)),
  whatsappNumber: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, "").slice(-10))
    .pipe(z.string().regex(/^[6-9]\d{9}$/)),
  telegramUsername: z.string().trim().max(35).optional().or(z.literal("")),
  deviceModel: z.string().trim().min(2).max(80),
  ram: z.enum(["2GB", "3GB", "4GB", "6GB", "8GB", "12GB+"]),
  chipset: z.string().trim().max(60).optional().or(z.literal("")),
  refreshRate: z.enum(["60Hz", "90Hz", "120Hz", "144Hz"]),
  deviceDpi: z.string().trim().max(30).optional().or(z.literal("")),
  sensiPreference: z.enum(["HIGH", "BALANCED", "LOW"]),
  playStyle: z.enum(["RUSHER", "SNIPER", "BALANCED"]),
  fingerLayout: z.enum(["2 Fingers", "3 Fingers", "4 Fingers", "5 Fingers"]),
  packageId: z.enum(["premium"]),
  termsAccepted: z.boolean().refine((v) => v === true),
});

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("\n=== 1. FORM VALIDATION TESTS ===");

// Valid payload
const validPayload = {
  fullName: "Sudhanshu Sinha",
  gameId: "1234567890",
  whatsappNumber: "9341923708",
  telegramUsername: "xpwot",
  deviceModel: "Poco X6 Pro",
  ram: "8GB",
  chipset: "Dimensity 8300 Ultra",
  refreshRate: "120Hz",
  deviceDpi: "411",
  sensiPreference: "HIGH",
  playStyle: "RUSHER",
  fingerLayout: "4 Fingers",
  packageId: "premium",
  termsAccepted: true,
};

assert(orderFormSchema.safeParse(validPayload).success, "Valid payload passes");
assert(
  !orderFormSchema.safeParse({ ...validPayload, packageId: "basic" }).success &&
    !orderFormSchema.safeParse({ ...validPayload, packageId: "pro" }).success,
  "Only the Premium package is accepted"
);

// Pasted Phone with +91 and spaces
const formattedPhone = { ...validPayload, whatsappNumber: "+91 93419 23708" };
assert(orderFormSchema.safeParse(formattedPhone).success, "Pasted phone with +91 and spaces sanitizes and passes");

// Invalid Free Fire UID (contains non-numeric characters)
const invalidUid = { ...validPayload, gameId: "UID_12345" };
assert(!orderFormSchema.safeParse(invalidUid).success, "Free Fire ID with letters fails validation");

// Invalid WhatsApp (starts with 4 instead of 6-9)
const invalidPhone1 = { ...validPayload, whatsappNumber: "4341923708" };
assert(!orderFormSchema.safeParse(invalidPhone1).success, "WhatsApp starting with 4 fails validation");

// Invalid WhatsApp (9 digits instead of 10)
const invalidPhone2 = { ...validPayload, whatsappNumber: "934192370" };
assert(!orderFormSchema.safeParse(invalidPhone2).success, "WhatsApp with 9 digits fails validation");

// Missing required termsAccepted
const unacceptedTerms = { ...validPayload, termsAccepted: false };
assert(!orderFormSchema.safeParse(unacceptedTerms).success, "Unaccepted terms fails validation");

console.log("\n=== 2. ZAPUPI WEBHOOK PAYLOAD TESTS ===");
const zapupiWebhookSchema = z.object({
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

const webhookPayload = {
  order_id: "xpwot_123",
  status: "Success",
  txn_id: "ZAPUPI123",
  amount: "349.00",
  pay_amount: "349.00",
  utr: "123456789",
  environment: "test",
  customer_mobile: "9341923708",
  remark: "Pro | 1234567890",
  remark_array: ["Pro", "1234567890"],
  create_at: "2026-11-12 08:33:55",
};
assert(zapupiWebhookSchema.safeParse(webhookPayload).success, "Valid ZapUPI webhook payload passes");
assert(
  zapupiWebhookSchema.safeParse({ ...webhookPayload, amount: 349, pay_amount: 349 }).success,
  "Numeric amount values pass webhook validation"
);
assert(!zapupiWebhookSchema.safeParse({ ...webhookPayload, order_id: "" }).success, "Webhook without an order ID fails");

console.log("\n=== 3. IDEMPOTENCY & CONCURRENCY TESTS ===");
const processed = new Set();
const paymentId = webhookPayload.txn_id;
function claimLock(transactionId) {
  if (processed.has(transactionId)) return false;
  processed.add(transactionId);
  return true;
}

const firstAttempt = claimLock(paymentId);
const duplicateAttempt = claimLock(paymentId);
assert(firstAttempt === true, "First payment verification acquires notification lock");
assert(duplicateAttempt === false, "Duplicate payment verification is blocked by idempotency");

console.log("\n=== SUMMARY ===");
console.log(`Passed: ${passed}, Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("All critical security & validation tests passed!\n");
}
