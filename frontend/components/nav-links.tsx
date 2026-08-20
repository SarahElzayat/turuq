"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
];

// Not built yet, shown so the moderator knows more sections are coming,
// but they're not clickable so there's nothing dead to click into.
const comingSoon = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Settings", icon: Settings },
];

/**
 * The nav item list, shared between the persistent desktop sidebar and the
 * mobile drawer so both stay in sync with a single source of truth.
 */
export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          </li>
        );
      })}
      {comingSoon.map(({ label, icon: Icon }) => (
        <li key={label}>
          <div className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground/60">
            <Icon className="size-4" />
            {label}
            <span className="ml-auto text-xs">Soon</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
