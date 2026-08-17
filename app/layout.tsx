import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "ROM Harbor",
  description: "ROM release management platform for Android maintainers."
};

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/devices", label: "Devices" },
  { href: "/releases", label: "Releases" },
  { href: "/reports", label: "Reports" },
  { href: "/ota", label: "OTA" },
  { href: "/admin", label: "Admin" }
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <div className="shell-bg" />
        <header className="site-header">
          <Link className="brand" href="/">
            <span className="brand-mark">RH</span>
            <span>
              <strong>ROM Harbor</strong>
              <small>Maintainer release platform</small>
            </span>
          </Link>
          <nav className="nav-links" aria-label="Main navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="session-pill">{session?.user ? "Maintainer signed in" : "Public mode"}</div>
        </header>
        <main className="page-wrap">{children}</main>
      </body>
    </html>
  );
}
