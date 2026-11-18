import Link from "next/link";
import { HeartIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { Logo } from "@/components/layout/navbar";
import {
  FacebookLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  XLogoIcon,
} from "@/components/layout/social-icons";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
  { href: "/create-event", label: "Create Event" },
  { href: "/joined-events", label: "Joined Events" },
];

const RESOURCES = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
];

const SOCIALS = [
  { href: "https://x.com", label: "X (Twitter)", Icon: XLogoIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookLogoIcon },
  { href: "https://github.com", label: "GitHub", Icon: GitHubLogoIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedInLogoIcon },
];

export function Footer() {
  return (
    <footer className="mt-auto">
    
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-lime-500" />

      <div className="bg-muted/40">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
       
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Shohojog (সহযোগ) means “cooperation”. We help communities organize
              and join social development events — cleanups, plantations,
              donations and more — across Bangladesh.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-foreground/10 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

     
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

   
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {RESOURCES.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

     
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon className="size-4 shrink-0 text-primary" />
                <a href="mailto:hello@shohojog.org" className="hover:text-primary">
                  hello@shohojog.org
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="size-4 shrink-0 text-primary" />
                <a href="tel:+8801700000000" className="hover:text-primary">
                  +880 1700-000000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
            <p>© 2026 Shohojog. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Made with
              <HeartIcon className="size-3.5 fill-primary text-primary" />
              for community volunteers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
