import PolicyLayout, { type PolicySection } from "@/components/PolicyLayout";

const sections: PolicySection[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <p>
          When you interact with Mesho Foundation — by creating an account,
          making a donation, applying for an internship, or contacting us — we
          collect information necessary to deliver the service you requested.
        </p>
        <ul>
          <li>
            <strong>Account information:</strong> your name, email address,
            password (stored only as an irreversible cryptographic hash), and a
            time-limited 6-digit verification code.
          </li>
          <li>
            <strong>Profile information:</strong> any details you choose to add
            to your profile, such as date of birth, phone number, address,
            education, professional experience, skills, volunteering interests,
            and links to your resume or social profiles.
          </li>
          <li>
            <strong>Payment information:</strong> for donations and application
            fees we capture the order ID, payment ID, amount, currency,
            timestamp, and status. We do <strong>not</strong> store card
            numbers, CVVs, UPI PINs, or net-banking credentials — those are
            handled exclusively by our payment processor.
          </li>
          <li>
            <strong>Technical information:</strong> standard server logs (IP
            address, browser, pages visited, timestamps) used to keep the site
            secure and reliable.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>create and secure your Mesho Foundation account;</li>
          <li>process donations and internship applications;</li>
          <li>
            send transactional emails (verification codes, payment receipts,
            application updates);
          </li>
          <li>match you to volunteering opportunities that fit your stated
            interests, location, and availability;</li>
          <li>respond to your queries and provide support;</li>
          <li>
            comply with our legal obligations, including financial record-keeping
            for charitable receipts;
          </li>
          <li>
            improve the website and our programmes through aggregated, anonymous
            analytics.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> sell your personal information to third
          parties, and we do not use your data for advertising profiling.
        </p>
      </>
    ),
  },
  {
    id: "payment-information",
    title: "Payment Information",
    content: (
      <>
        <p>
          All online payments to Mesho Foundation are processed by{" "}
          <strong>Razorpay</strong>, an RBI-regulated payment aggregator. When
          you pay through our website, your card or banking details are
          submitted directly to Razorpay over a secure connection — they never
          touch our servers.
        </p>
        <p>
          We retain only the metadata required to reconcile each transaction:
          order ID, payment ID, amount, currency, status, the purpose of the
          payment (donation or application fee), and the user account it was
          made from. This metadata is verified server-side via HMAC-SHA256
          signature comparison before any payment is recorded as successful.
        </p>
        <p>
          You can read Razorpay's own privacy policy at{" "}
          <a href="https://razorpay.com/privacy" target="_blank" rel="noreferrer">
            razorpay.com/privacy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "data-protection",
    title: "Data Protection",
    content: (
      <>
        <p>
          Protecting the data you trust us with is a priority. We apply
          industry-standard safeguards including:
        </p>
        <ul>
          <li>HTTPS / TLS encryption for all data in transit;</li>
          <li>
            bcrypt hashing for passwords and one-time verification codes — we
            cannot recover the plaintext, only verify it;
          </li>
          <li>
            JSON Web Tokens with short, configurable expiry to authenticate API
            requests;
          </li>
          <li>per-IP rate limiting on sensitive endpoints (signup, login, OTP
            verification, payment creation);</li>
          <li>
            principle of least privilege for staff and contractors who can
            access production systems;
          </li>
          <li>regular dependency updates and security reviews.</li>
        </ul>
        <p>
          No system is perfectly secure. If we ever become aware of a breach
          affecting your data, we will notify you and the appropriate
          authorities without undue delay.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Local Storage",
    content: (
      <>
        <p>
          We use a small number of cookies and browser local-storage entries to
          keep the site working:
        </p>
        <ul>
          <li>
            <strong>Session token:</strong> stored in your browser's
            local-storage to keep you signed in. It is sent to our backend only
            on requests you initiate — not to any third party.
          </li>
          <li>
            <strong>Preferences:</strong> any UI preferences you set (such as
            tab selections) may be cached locally for convenience.
          </li>
          <li>
            <strong>Razorpay cookies:</strong> Razorpay's checkout iframe sets
            its own cookies to detect fraud and complete payments. These are
            governed by Razorpay's privacy policy.
          </li>
        </ul>
        <p>
          You can clear cookies and local storage at any time from your
          browser's settings. Doing so will sign you out of your Mesho
          Foundation account.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    content: (
      <>
        <p>
          Mesho Foundation relies on a small set of trusted third-party services
          to operate. Each is contracted to process your data only on our
          instructions and only for the purpose listed:
        </p>
        <ul>
          <li>
            <strong>Razorpay</strong> — payment processing for donations and
            application fees.
          </li>
          <li>
            <strong>MongoDB Atlas</strong> — secure cloud database for account
            and profile information.
          </li>
          <li>
            <strong>Email delivery (SMTP)</strong> — sending transactional
            emails such as OTPs and receipts.
          </li>
          <li>
            <strong>Hosting / CDN</strong> — serving the website and its static
            assets.
          </li>
        </ul>
        <p>
          We do not embed third-party advertising trackers or social media
          pixels on this site.
        </p>
      </>
    ),
  },
  {
    id: "user-rights",
    title: "Your Rights",
    content: (
      <>
        <p>
          You retain control over the personal information we hold about you. At
          any time you may:
        </p>
        <ul>
          <li>
            <strong>Access</strong> the data on your profile by signing in and
            visiting your Profile page;
          </li>
          <li>
            <strong>Correct</strong> any inaccurate information by editing your
            profile and clicking Save;
          </li>
          <li>
            <strong>Delete</strong> your account by contacting us at the
            address below — we will erase or anonymise your records within 30
            days, retaining only what we are legally required to keep (such as
            donation receipts for tax compliance);
          </li>
          <li>
            <strong>Export</strong> a copy of your account data on request;
          </li>
          <li>
            <strong>Withdraw consent</strong> for non-essential communications
            at any time without affecting your account.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "changes-to-policy",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in the law, our services, or the technologies we rely on. When we
          make a material change we will update the "Last updated" date at the
          top of this page and, where appropriate, notify you by email or via a
          banner on the site.
        </p>
        <p>
          Continued use of the website after a change becomes effective
          indicates your acceptance of the revised policy.
        </p>
      </>
    ),
  },
  {
    id: "contact-information",
    title: "Contact Information",
    content: (
      <>
        <p>
          For any privacy-related question, request, or complaint, please reach
          out to us:
        </p>
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
          We aim to respond to all privacy enquiries within 7 working days.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      metaTitle="Privacy Policy — Mesho Foundation"
      title="Privacy Policy"
      subtitle="How Mesho Foundation collects, uses, and protects the personal information you share with us when you use our website, donate, or apply for opportunities."
      lastUpdated="May 2026"
      sections={sections}
    />
  );
}
