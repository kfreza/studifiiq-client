import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import Cs_Logo from "@/components/shared/Logo";
import Cs_NewsletterForm from "@/components/layout/NewsletterForm";
import { CS_CATEGORIES, CS_NAV_LINKS, cs_categoryHref } from "@/lib/constants";

const CS_SOCIALS = [
  { label: "StudioSpace on X", href: "https://x.com", icon: FaXTwitter },
  { label: "StudioSpace on Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "StudioSpace on YouTube", href: "https://youtube.com", icon: FaYoutube },
  { label: "StudioSpace on LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
];

export default function Cs_Footer() {
  const cs_year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="cs_container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        {/* brand */}
        <div className="space-y-4">
          <Cs_Logo />
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            StudioSpace connects creators with independent studio owners, so every shoot, session and class
            finds the right room at a fair hourly rate.
          </p>
          <ul className="flex gap-2">
            {CS_SOCIALS.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* quick links */}
        <div>
          <h2 className="mb-4 text-sm font-semibold">Quick links</h2>
          <ul className="space-y-2.5 text-sm">
            {CS_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/add-studio" className="text-muted-foreground hover:text-foreground">
                Host your space
              </Link>
            </li>
          </ul>
        </div>

        {/* categories */}
        <div>
          <h2 className="mb-4 text-sm font-semibold">Popular categories</h2>
          <ul className="space-y-2.5 text-sm">
            {CS_CATEGORIES.map((category) => (
              <li key={category}>
                <Link href={cs_categoryHref(category)} className="text-muted-foreground hover:text-foreground">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* newsletter */}
        <div>
          <h2 className="mb-2 text-sm font-semibold">New studios every Friday</h2>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            One short email with the week&apos;s newly listed spaces near you.
          </p>
          <Cs_NewsletterForm />
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-border">
        <div className="cs_container flex flex-col gap-2 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {cs_year} StudioSpace. All rights reserved.</p>
          <p>
            By booking or listing a space you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms &amp; Privacy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
