import PolicyLayout, { type PolicySection } from "@/components/PolicyLayout";

const sections: PolicySection[] = [
  {
    id: "donation-refund-rules",
    title: "Donation Refund Rules",
    content: (
      <>
        <p>
          Donations made to Mesho Foundation are voluntary contributions toward
          our environmental, education, and community-empowerment programmes.
          Once a donation is received, the funds are typically allocated to
          on-ground initiatives within a short window, which makes refunds
          difficult to honour as a default.
        </p>
        <p>
          We will, however, refund a donation in the following situations:
        </p>
        <ul>
          <li>
            <strong>Duplicate or accidental payment:</strong> if the same
            donation is captured more than once due to a technical glitch, or
            you can demonstrate that the payment was made in error, please
            contact us within <strong>7 days</strong> of the transaction.
          </li>
          <li>
            <strong>Unauthorised payment:</strong> if you suspect fraud or that
            a payment was made from your account without your consent, contact
            us immediately so we can coordinate with Razorpay and the relevant
            bank.
          </li>
          <li>
            <strong>Wrong amount entered:</strong> if you entered an incorrect
            amount and notify us within <strong>48 hours</strong>, we will
            refund the difference where reasonably possible.
          </li>
        </ul>
        <p>
          Refunds will <strong>not</strong> be issued for change of mind once
          the donation has been processed and the funds have been allocated to
          a programme.
        </p>
      </>
    ),
  },
  {
    id: "internship-refund-rules",
    title: "Internship & Application Fee Refund Rules",
    content: (
      <>
        <p>
          The application fee charged for internships and select career roles
          covers the cost of administering the application process — reviewing
          submissions, conducting initial interviews, and providing feedback.
          The fee is therefore generally non-refundable.
        </p>
        <p>
          Exceptions where the fee may be refunded:
        </p>
        <ul>
          <li>
            <strong>Position withdrawn by Mesho Foundation:</strong> if we
            cancel an internship cohort before your application is reviewed, the
            full fee will be refunded.
          </li>
          <li>
            <strong>Duplicate payment:</strong> if you accidentally pay the fee
            more than once for the same role, the duplicate amount will be
            refunded in full.
          </li>
          <li>
            <strong>Failed payment incorrectly captured:</strong> if Razorpay
            captures the fee but our system fails to record your application,
            we will either complete your application manually or refund the
            fee, at your choice.
          </li>
        </ul>
        <p>
          Requests for refunds based on rejection, change of plans, or
          withdrawal of the application after submission will <strong>not</strong>{" "}
          be entertained.
        </p>
      </>
    ),
  },
  {
    id: "refund-processing-timeline",
    title: "Refund Processing Timeline",
    content: (
      <>
        <p>
          Once a refund request is approved, the timeline is typically:
        </p>
        <ul>
          <li>
            <strong>0 – 2 working days:</strong> Mesho Foundation reviews and
            initiates the refund through Razorpay.
          </li>
          <li>
            <strong>3 – 7 working days:</strong> Razorpay processes the refund
            and remits the amount to your original payment method (card, UPI,
            net banking, or wallet).
          </li>
          <li>
            <strong>5 – 10 working days:</strong> your bank or card issuer
            reflects the credit on your statement. International cards or
            certain wallets may take a little longer.
          </li>
        </ul>
        <p>
          Refunds are always issued back to the original payment instrument used
          for the transaction. We cannot transfer the amount to a different
          card, account, or person.
        </p>
        <p>
          If 10 working days have passed since approval and you still don't see
          the credit, please write to us with your order ID and we'll
          investigate with Razorpay.
        </p>
      </>
    ),
  },
  {
    id: "refund-contact-information",
    title: "Refund Contact Information",
    content: (
      <>
        <p>
          To request a refund, please contact us with the following details so
          we can locate your transaction quickly:
        </p>
        <ul>
          <li>full name and email registered on your Mesho Foundation account;</li>
          <li>
            Razorpay <strong>order ID</strong> or <strong>payment ID</strong>{" "}
            (visible on your receipt email);
          </li>
          <li>amount and date of the transaction;</li>
          <li>reason for the refund request.</li>
        </ul>
        <p>Reach out to us at:</p>
        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:meshofoundation@gmail.com">meshofoundation@gmail.com</a>
          </li>
          <li>
            <strong>Phone:</strong>{" "}
            <a href="tel:+917275565700">+91 72755 65700</a>
          </li>
          <li>
            <strong>Address:</strong> Mesho Foundation HQ, India
          </li>
        </ul>
        <p>
          We will acknowledge every refund request within <strong>2 working
          days</strong> and provide a final decision within <strong>7 working
          days</strong>.
        </p>
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      metaTitle="Refund Policy — Mesho Foundation"
      title="Refund Policy"
      subtitle="Our approach to refunds for donations and internship application fees, including the situations where refunds are honoured and how long they take."
      lastUpdated="May 2026"
      sections={sections}
    />
  );
}
