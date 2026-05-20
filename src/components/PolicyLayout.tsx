import { motion } from "framer-motion";
import { ChevronRight, Home, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export interface PolicySection {
  /** Stable id used for the in-page sidebar / table of contents anchors. */
  id: string;
  /** Heading shown above the section body. */
  title: string;
  /** Section content — paragraphs / lists / nested blocks. */
  content: React.ReactNode;
}

interface PolicyLayoutProps {
  /** Long-form page title shown in the hero. */
  title: string;
  /** One-sentence description shown under the title. */
  subtitle: string;
  /** Browser-tab title (used for SEO). */
  metaTitle: string;
  /** Last updated date — passed as already-formatted text, e.g. "May 2026". */
  lastUpdated: string;
  /** Section blocks to render. Each gets a TOC entry. */
  sections: PolicySection[];
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PolicyLayout({
  title,
  subtitle,
  metaTitle,
  lastUpdated,
  sections,
}: PolicyLayoutProps) {
  useDocumentTitle(metaTitle);

  return (
    <section className="section-padding pt-28 pb-20">
      <div className="container-narrow">
        {/* --- Breadcrumb --- */}
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.4 }}
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-6 flex-wrap"
        >
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home size={13} />
            Home
          </Link>
          <ChevronRight size={13} className="text-muted-foreground/60" />
          <span className="flex items-center gap-1 text-muted-foreground/80">
            <Scale size={13} />
            Legal
          </span>
          <ChevronRight size={13} className="text-muted-foreground/60" />
          <span className="text-foreground font-medium">{title}</span>
        </motion.nav>

        {/* --- Hero --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-10"
        >
          <span className="section-badge">Legal</span>
          <h1 className="section-title mt-4">{title}</h1>
          <p className="section-desc mt-4 max-w-3xl">{subtitle}</p>
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: <span className="text-foreground">{lastUpdated}</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
          {/* --- Sticky table of contents --- */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24 glass-strong rounded-2xl p-5">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                On this page
              </h2>
              <ul className="space-y-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>

          {/* --- Policy body --- */}
          <motion.article
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-elevated rounded-3xl p-6 sm:p-10 lg:p-12 backdrop-blur-md"
          >
            {sections.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="scroll-mt-28"
              >
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-4 mt-10 first:mt-0">
                  <span className="text-primary mr-2">{String(i + 1).padStart(2, "0")}.</span>
                  {s.title}
                </h2>
                <div className="text-[0.95rem] leading-7 text-muted-foreground space-y-4 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2">
                  {s.content}
                </div>
              </motion.section>
            ))}

            {/* Footer note */}
            <div className="mt-12 pt-6 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                If anything in this document is unclear, please reach out using
                the contact details above before proceeding.
              </p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
