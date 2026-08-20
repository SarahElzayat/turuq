import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SideNav } from "@/components/side-nav";
import { MobileNav } from "@/components/mobile-nav";

// Inter for body/UI, a humanist sans that stays legible at the small sizes
// used for labels and table-like rows.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Plus Jakarta Sans for headings, softer, slightly rounded letterforms that
// keep headings friendly rather than sharp.
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warehouse Moderator",
  description: "Manage and view warehouse product details.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col md:flex-row">
            <SideNav />
            <div className="flex flex-1 flex-col">
              <MobileNav />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
