"use client";
import { Link } from "@tanstack/react-router";
import { cn } from "../../lib/index";

interface FooterLink {
  label: string;
  href: string;
}

interface SaaSFooterProps {
  appName?: string;
  themeColor?: string;
  showStripe?: boolean;
  className?: string;
  links?: FooterLink[];
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
}

export function SaaSFooter({
  appName = "App",
  themeColor = "#3b82f6",
  showStripe = true,
  className,
  links = [],
  showNewsletter = false,
  newsletterTitle = "Stay Updated",
  newsletterSubtitle = "Get tips and product updates.",
}: SaaSFooterProps) {
  const currentYear = new Date().getFullYear();

  const renderFooterLink = (link: FooterLink) => {
    if (link.href.startsWith("#") || link.href.startsWith("http")) {
      return (
        <a
          key={link.href}
          href={link.href}
          className="text-gray-400 no-underline transition-colors hover:text-white"
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link
        key={link.href}
        to={link.href}
        className="text-gray-400 no-underline transition-colors hover:text-white"
      >
        {link.label}
      </Link>
    );
  };

  return (
    <>
      {/* Newsletter Section (Optional) */}
      {showNewsletter && (
        <section
          className="px-4 py-20 sm:px-6 lg:px-8"
          style={{ backgroundColor: themeColor }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 font-bold text-4xl text-white">
              {newsletterTitle}
            </h2>
            <p className="mb-8 text-white/80 text-xl">{newsletterSubtitle}</p>
            <form className="mx-auto flex max-w-lg flex-col justify-center gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl px-5 py-3 text-gray-900"
              />
              <button
                type="submit"
                className="rounded-xl bg-white px-8 py-3 font-semibold"
                style={{ color: themeColor }}
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-sm text-white/60">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        className={cn(
          "bg-gray-900 px-4 py-12 text-gray-400 sm:px-6 lg:px-8",
          className,
        )}
      >
        <div className="mx-auto max-w-7xl">
          {links.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-6">
              {links.map((link) => renderFooterLink(link))}
            </div>
          )}
          <div className="text-center">
            <p className="text-sm">
              © {currentYear} {appName}. All rights reserved.
            </p>
            {showStripe && (
              <p className="mt-2 text-gray-500 text-xs">
                Powered by Stripe for secure payments
              </p>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
