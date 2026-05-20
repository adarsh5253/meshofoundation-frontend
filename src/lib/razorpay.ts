/**
 * Razorpay Standard Checkout helper.
 *
 * Loads the Razorpay script on demand (so users who never click "Donate"
 * never download it), opens the modal, and resolves with a clean result
 * shape — success | dismissed | failed — that callers can switch on.
 */

import { apiRequest } from "./api";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailedPayload {
  error: {
    code?: string;
    description?: string;
    reason?: string;
    source?: string;
    step?: string;
    metadata?: { order_id?: string; payment_id?: string };
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: {
    ondismiss?: () => void;
    confirm_close?: boolean;
    escape?: boolean;
  };
  handler: (res: RazorpayPaymentResponse) => void;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", cb: (res: RazorpayFailedPayload) => void) => void;
}

let scriptPromise: Promise<void> | null = null;

/** Inject the Razorpay checkout script once and cache the promise. */
export function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Razorpay checkout"))
      );
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Razorpay checkout"));
    };
    document.body.appendChild(s);
  });

  return scriptPromise;
}

// --- API calls (mirror the backend routes) ---

export interface CreateOrderRequest {
  amount: number; // paise
  currency?: string;
  purpose: "donation" | "career-application";
  note?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  receipt: string;
  key_id: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  payment: {
    id: string;
    purpose: string;
    amount: number;
    currency: string;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    createdAt: string;
  };
}

export const paymentsApi = {
  createOrder: (body: CreateOrderRequest) =>
    apiRequest<CreateOrderResponse>("/api/payments/create-order", {
      method: "POST",
      auth: true,
      body: JSON.stringify(body),
    }),
  verifyPayment: (body: VerifyPaymentRequest) =>
    apiRequest<VerifyPaymentResponse>("/api/payments/verify-payment", {
      method: "POST",
      auth: true,
      body: JSON.stringify(body),
    }),
  reportFailed: (razorpay_order_id: string) =>
    apiRequest<{ ok: boolean }>("/api/payments/payment-failed", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ razorpay_order_id }),
    }),
};

// --- High-level "open the modal and wait for the user" wrapper ---

export type CheckoutResult =
  | { kind: "success"; verified: VerifyPaymentResponse }
  | { kind: "dismissed" }
  | { kind: "failed"; message: string };

export interface OpenCheckoutArgs {
  order: CreateOrderResponse;
  /** Display name in the modal header (e.g. "Mesho Foundation"). */
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  themeColor?: string;
  notes?: Record<string, string>;
}

/**
 * Opens the Razorpay modal for a previously created order, then verifies the
 * signature server-side. Resolves once the user reaches a terminal state —
 * success, dismissed, or failed.
 */
export async function openCheckout(args: OpenCheckoutArgs): Promise<CheckoutResult> {
  await loadRazorpay();
  if (!window.Razorpay) {
    return {
      kind: "failed",
      message: "Could not initialise Razorpay. Please refresh and try again.",
    };
  }

  return new Promise<CheckoutResult>((resolve) => {
    let settled = false;
    const settle = (r: CheckoutResult) => {
      if (settled) return;
      settled = true;
      resolve(r);
    };

    const rzp = new window.Razorpay!({
      key: args.order.key_id,
      amount: args.order.amount,
      currency: args.order.currency,
      name: args.name,
      description: args.description,
      order_id: args.order.order_id,
      prefill: args.prefill,
      notes: args.notes,
      theme: { color: args.themeColor || "#5fb4a2" },
      modal: {
        ondismiss: () => settle({ kind: "dismissed" }),
        confirm_close: true,
        escape: true,
      },
      handler: async (res) => {
        try {
          const verified = await paymentsApi.verifyPayment({
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
          });
          settle({ kind: "success", verified });
        } catch (err) {
          settle({
            kind: "failed",
            message:
              err instanceof Error
                ? err.message
                : "Payment received but verification failed. Please contact support.",
          });
        }
      },
    });

    rzp.on("payment.failed", (resp) => {
      const orderId = resp?.error?.metadata?.order_id;
      if (orderId) paymentsApi.reportFailed(orderId).catch(() => {});
      settle({
        kind: "failed",
        message:
          resp?.error?.description ||
          "Payment failed. Please try again or use a different method.",
      });
    });

    rzp.open();
  });
}
