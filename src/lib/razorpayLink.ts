/**
 * Razorpay personalised payment-page integration.
 *
 * We no longer create Razorpay orders on the server or open the Standard
 * Checkout modal. Instead we hand the user off to the Mesho Solution
 * personalised Razorpay link with the amount pre-filled in the URL:
 *
 *   https://razorpay.me/@meshosolution?amount=1000
 *
 * The `amount` query parameter is interpreted by Razorpay as rupees.
 *
 * Note on "make the amount non-editable":
 *   Whether the user can edit the prefilled amount on the Razorpay payment
 *   page is controlled by the page's "Amount type" setting in the Razorpay
 *   dashboard (Payments → Payment Pages → Edit → Amount = "Fixed"). The
 *   URL parameter only PREFILLS the value; the lock is configured on
 *   Razorpay's side, not via the link. See README/notes for the toggle.
 */

export const RAZORPAY_PAYMENT_PAGE = "https://razorpay.me/@meshosolution";

/**
 * Build the razorpay.me URL with the requested amount in rupees.
 * Rounds to the nearest rupee — Razorpay accepts decimals, but we keep it
 * tidy and avoid floating-point oddities.
 */
export function buildPaymentUrl(amountRupees: number): string {
  const safe = Math.max(1, Math.round(amountRupees));
  return `${RAZORPAY_PAYMENT_PAGE}?amount=${safe}`;
}

/**
 * Open the payment page in a new tab so the user keeps their place on the
 * Mesho Foundation site. Falls back to same-tab navigation if the popup
 * was blocked.
 */
export function openPaymentPage(amountRupees: number): void {
  const url = buildPaymentUrl(amountRupees);
  const w = typeof window !== "undefined"
    ? window.open(url, "_blank", "noopener,noreferrer")
    : null;
  if (!w && typeof window !== "undefined") {
    window.location.href = url;
  }
}
