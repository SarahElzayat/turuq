"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle dark mode"
      className="relative"
      // Safe to read the theme here: event handlers only run after hydration,
      // so this never participates in the server/client render comparison.
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Both icons are always rendered and CSS picks the visible one, using
          the `dark` class next-themes writes onto <html> before first paint.
          Deciding this in CSS rather than from React state means there's no
          mount-gate re-render and no flash of the wrong icon on load. */}
      <Moon className="size-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute size-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
