"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Top bar + drawer nav for small screens. The persistent SideNav takes over at md and up. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
      <span className="font-heading text-lg font-semibold tracking-tight text-primary">
        Warehouse
      </span>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="px-3 py-6">
            <SheetHeader className="px-0">
              <SheetTitle>Warehouse</SheetTitle>
            </SheetHeader>
            <NavLinks onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
