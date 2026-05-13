/**
 * Help-centre article registry. Keyed by URL slug — the `/help/:slug`
 * route renders the matching entry. The Help index page also reads
 * from here to populate its categories and FAQ rail, so adding an
 * article in one place automatically shows it everywhere.
 *
 * Each section.body string supports plain paragraph breaks via "\n\n".
 * Inline links are written as Markdown-ish "[label](path)" tokens and
 * rendered by the HelpArticle screen.
 */

export type HelpCategory =
  | "legal"
  | "listings"
  | "applications"
  | "payments"
  | "safety"
  | "account";

export interface HelpArticle {
  slug: string;
  title: string;
  category: HelpCategory;
  /** Short one-liner shown under the title in lists. */
  summary: string;
  /** ISO date when the article was last reviewed. */
  updatedAt: string;
  sections: { heading: string; body: string }[];
}

export const CATEGORY_LABELS: Record<HelpCategory, string> = {
  legal: "Legal & policies",
  listings: "Listings",
  applications: "Applications",
  payments: "Payments & payouts",
  safety: "Safety & disputes",
  account: "Account & profile",
};

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "terms-of-service",
    title: "Terms of service",
    category: "legal",
    summary:
      "The legal agreement between you and Habitat that governs your use of the platform, account, listings, and payments.",
    updatedAt: "2026-05-13",
    sections: [
      {
        heading: "1. Who we are",
        body:
          "Habitat is a rental-marketplace platform operated by Habitat SA (Pty) Ltd, a company registered in the Republic of South Africa. References to \"Habitat\", \"we\", \"us\", and \"our\" mean Habitat SA (Pty) Ltd.\n\nYou can reach us at noreply@habitat.co.za or via the in-app support channels at [Help](/help).",
      },
      {
        heading: "2. Your account",
        body:
          "You must be at least 18 years old and able to enter into a binding contract under South African law to create an account. You're responsible for keeping your credentials confidential and for everything that happens under your account.\n\nWe may suspend or close any account that violates these terms or that we reasonably believe is being used to defraud or harm other users.",
      },
      {
        heading: "3. Listings, applications, and leases",
        body:
          "Habitat is a venue: we connect tenants, landlords, and agents. We don't own the properties listed, and the lease, once signed, is between the tenant and the landlord (or their authorised agent).\n\nYou must list a property only if you have the legal right to do so. Misrepresentation — about a property, your identity, or your finances — is a breach of these terms and may also be a criminal offence under South African law.",
      },
      {
        heading: "4. Payments and trust accounts",
        body:
          "Rent, deposits, and platform fees flow through a regulated trust account. Funds are held in line with the Estate Agency Affairs Act and the trust-account requirements of the Property Practitioners Regulatory Authority (PPRA).\n\nDisbursements happen on the schedule set out in your active mandate or lease. Failed or reversed payments may incur a recovery fee, disclosed in your statement.",
      },
      {
        heading: "5. Acceptable use",
        body:
          "You may not use Habitat to discriminate against prospective tenants on any ground prohibited by the Constitution of the Republic of South Africa, the Rental Housing Act, or PEPUDA. You may not harass other users, post illegal content, scrape the platform, or attempt to access another user's account.",
      },
      {
        heading: "6. Liability",
        body:
          "To the extent permitted by law, Habitat is not liable for the conduct of landlords, tenants, or agents on the platform, or for the condition of any property listed. We provide identity-verification and dispute-resolution tools on a best-effort basis.",
      },
      {
        heading: "7. Changes to these terms",
        body:
          "We may update these terms from time to time. Material changes will be announced via email and an in-app banner at least 14 days before they take effect. Continuing to use Habitat after the effective date constitutes acceptance.",
      },
      {
        heading: "8. Governing law",
        body:
          "These terms are governed by the laws of the Republic of South Africa. Disputes will be resolved by the courts of the Western Cape, save for small-value matters which may be referred to the Rental Housing Tribunal.",
      },
    ],
  },
  {
    slug: "popia-notice",
    title: "POPIA notice",
    category: "legal",
    summary:
      "How Habitat collects, uses, shares, and protects your personal information under the Protection of Personal Information Act, 2013.",
    updatedAt: "2026-05-13",
    sections: [
      {
        heading: "1. Responsible party",
        body:
          "Habitat SA (Pty) Ltd is the responsible party for the personal information you provide on this platform, as defined by the Protection of Personal Information Act, 2013 (POPIA).\n\nOur Information Officer can be reached at noreply@habitat.co.za.",
      },
      {
        heading: "2. What we collect",
        body:
          "When you register and use Habitat we collect: contact details (name, email, phone), proof-of-identity documents you upload to satisfy FICA, employment and affordability documents you submit with rental applications, property details for landlords, and platform-usage information (device, IP, page views).",
      },
      {
        heading: "3. Why we collect it",
        body:
          "We process your personal information to operate the rental marketplace, verify identity (FICA), assess affordability, support payments via our trust accounts, and improve the product. Processing is lawful under POPIA section 11 — performance of a contract, legal obligation, or your explicit consent for marketing.",
      },
      {
        heading: "4. Who we share it with",
        body:
          "We share your information only when necessary to operate the platform: with landlords when you apply for a property (your application package), with our payment partners for trust-account processing, with credit bureaus when you opt in to a credit check, and with the South African Revenue Service or law-enforcement bodies where we are legally required to do so.\n\nWe never sell your personal information.",
      },
      {
        heading: "5. How long we keep it",
        body:
          "Identity-verification documents are retained for five years after your last platform activity, as required by FICA. Other personal information is retained for the duration of your account and for a further three years to support post-contract dispute resolution, after which it is securely deleted or anonymised.",
      },
      {
        heading: "6. Your rights",
        body:
          "Under POPIA you have the right to: access the personal information we hold about you, correct or update it, object to specific kinds of processing (including direct marketing), and request deletion subject to our legal retention obligations.\n\nTo exercise any of these, contact noreply@habitat.co.za. You also have the right to lodge a complaint with the Information Regulator at inforeg@justice.gov.za.",
      },
      {
        heading: "7. Security",
        body:
          "We use industry-standard technical and organisational measures — encryption at rest and in transit, hashed passwords, role-based access, and continuous monitoring — to protect your information against unauthorised access, alteration, disclosure, or destruction.",
      },
      {
        heading: "8. Updates to this notice",
        body:
          "We may update this notice as the product evolves or the law changes. The \"Last reviewed\" date at the top of the article reflects the most recent revision. Material changes are announced via email at least 14 days before they take effect.",
      },
    ],
  },
];

export function findArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.slug === slug);
}
