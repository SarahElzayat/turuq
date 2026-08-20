import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Persistent sidebar for medium screens and up. Hidden on mobile in favor of MobileNav.
 */
export function SideNav() {
  return (
    <nav className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col justify-between self-start border-r bg-card px-3 py-6 md:flex">
      <div>
        <div className="mb-6 px-3 font-heading text-lg font-semibold tracking-tight text-primary">
          Warehouse
        </div>
        <NavLinks />
      </div>
      <div className="flex justify-end px-3">
        <ThemeToggle />
      </div>
    </nav>
  );
}
