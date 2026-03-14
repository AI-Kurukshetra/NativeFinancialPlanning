import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers/app-providers";
import "@/app/globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Excel-Native FP&A",
  description: "A spreadsheet-native FP&A workspace for centralized planning, reporting, and collaboration.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${headingFont.variable} ${bodyFont.variable}`} lang="en">
      <body className="font-[var(--font-body)] antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
