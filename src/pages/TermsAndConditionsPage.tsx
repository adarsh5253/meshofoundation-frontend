import PolicyLayout, { type PolicySection } from "@/components/PolicyLayout";

const sections: PolicySection[] = [
  {
    id: "website-usage",
    title: "Website Usage",
    content: (
      <>
        <p>
          By accessing or using the Mesho Foundation website (the "Site") you
          agree to be bound by these Terms &amp; Conditions, our Privacy
          Policy, and our Refund Policy. If you do not agree with any part of
          these documents, please do not use the Site.
        </p>
        <p>You agree to use the Site only for lawful purposes and not to:</p>
        <ul>
          <li>attempt to gain unauthorised access to our systems, accounts, or
            data;</li>
          <li>interfere with or disrupt the Site, servers, or networks;</li>
          <li>scrape, copy, or republish content from the Site without
            permission;</li>
          <li>transmit any virus, malware, or other harmful code;</li>
          <li>impersonate another person or organisation.</li>
        </ul>
      </>
    ),
  },
  {
    id: "user-accounts",
    title: "User Accounts",
    content: (
      <>
        <p>
          To donate, apply for opportunities, or access certain features you
          must create an account using a valid email address and a password of
          at least 8 characters. By creating an account you confirm that:
        </p>
        <ul>
          <li>the information you provide is accurate, current, and
            complete;</li>
          <li>you are responsible for maintaining the confidentiality of your
            password and the security of your account;</li>
          <li>you will notify us immediately of any unauthorised access or
            suspected breach;</li>
          <li>you are at least 18 years old, or have the consent of a parent
            or legal guardian.</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these Terms, are used fraudulently, or remain unverified for an
          extended period.
        </p>
      </>
    ),
  },
  {
    id: "donations",
    title: "Donations",
    content: (
      <>
        <p>
          Donations made through the Site are voluntary contributions to Mesho
          Foundation's charitable activities. By donating you confirm that:
        </p>
        <ul>
          <li>the funds being donated are lawfully owned by you;</li>
          <li>the donation is made of your own free will, without
            expectation of any goods, services, or commercial benefit in
            return;</li>
          <li>you understand that donations once allocated to a programme are
            generally non-refundable, except as set out in our Refund Policy;
          </li>
          <li>tax-exemption receipts (where available) will be issued
            according to applicable Indian charitable-trust regulations.</li>
        </ul>
        <p>
          Mesho Foundation reserves the right to decline or refund any donation
          that we believe has been made fraudulently or in violation of
          applicable law.
        </p>
      </>
    ),
  },
  {
    id: "internship-applications",
    title: "Internship Applications",
    content: (
      <>
        <p>
          Internship and career opportunities listed on the Site are subject to
          a non-refundable application fee unless otherwise stated. By
          submitting an application you agree that:
        </p>
        <ul>
          <li>the information and documents you upload are truthful and your
            own;</li>
          <li>payment of the fee does <strong>not</strong> guarantee
            selection — applications are evaluated on merit;</li>
          <li>Mesho Foundation may modify, postpone, or cancel any role at
            its discretion (in which case the Refund Policy applies);</li>
          <li>any internship offered is subject to a separate written offer
            letter and applicable Indian labour-law standards.</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          All content on the Site — including the Mesho Foundation name and
          logo, text, photographs, illustrations, videos, audio, code, and
          design — is owned by or licensed to Mesho Foundation and is protected
          by copyright, trade-mark, and other intellectual-property laws of
          India and international treaties.
        </p>
        <p>You may:</p>
        <ul>
          <li>view, download, and print Site content for personal,
            non-commercial use;</li>
          <li>share links to public Site pages on social media or in
            educational contexts.</li>
        </ul>
        <p>You may <strong>not</strong>:</p>
        <ul>
          <li>reproduce, modify, or distribute Site content for commercial
            purposes;</li>
          <li>remove or alter any copyright, trade-mark, or other proprietary
            notice;</li>
          <li>use the Mesho Foundation name or logo in any manner that
            implies endorsement or partnership without our prior written
            consent.</li>
        </ul>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    content: (
      <>
        <p>
          The Site may contain links to third-party websites, social-media
          pages, or services (for example, Razorpay's checkout, our Instagram
          and Facebook pages). These links are provided for your convenience —
          Mesho Foundation does not control these third parties and is not
          responsible for their content, policies, or practices.
        </p>
        <p>
          We encourage you to review the terms and privacy policies of any
          third-party site you visit. Following an external link is at your
          own risk.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by law, Mesho Foundation, its
          trustees, employees, and volunteers shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages
          arising out of or in connection with:
        </p>
        <ul>
          <li>your use of, or inability to use, the Site;</li>
          <li>any unauthorised access to or alteration of your data;</li>
          <li>statements or conduct of any third party on the Site;</li>
          <li>delays, errors, or interruptions in our services beyond our
            reasonable control.</li>
        </ul>
        <p>
          The Site is provided on an "as is" and "as available" basis. We
          strive to keep it secure and up-to-date, but make no warranty that it
          will be error-free, uninterrupted, or free of harmful components.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "Changes to These Terms",
    content: (
      <>
        <p>
          We may revise these Terms &amp; Conditions from time to time as our
          services or applicable law evolve. The updated version will always be
          posted on this page with a fresh "Last updated" date.
        </p>
        <p>
          For material changes we will, where appropriate, notify you via email
          or by displaying a notice on the Site. Your continued use of the Site
          after changes take effect constitutes acceptance of the revised
          Terms.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law & Jurisdiction",
    content: (
      <>
        <p>
          These Terms are governed by and construed in accordance with the laws
          of the Republic of India. Any dispute arising out of or in connection
          with these Terms or your use of the Site will be subject to the
          exclusive jurisdiction of the competent courts located in India.
        </p>
        <p>
          Before resorting to legal action, we encourage you to contact us
          directly so we can attempt to resolve the matter amicably and
          quickly.
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
          If you have any questions about these Terms &amp; Conditions, please
          get in touch:
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
      </>
    ),
  },
];

export default function TermsAndConditionsPage() {
  return (
    <PolicyLayout
      metaTitle="Terms & Conditions — Mesho Foundation"
      title="Terms & Conditions"
      subtitle="The agreement between you and Mesho Foundation that governs your use of this website, your account, donations, and internship applications."
      lastUpdated="May 2026"
      sections={sections}
    />
  );
}
