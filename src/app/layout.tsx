import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";

import { AppProviders } from "@/components/providers/app-providers";
import "@/app/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Native FP&A | Plan at Operating Speed",
    template: "%s | Native FP&A",
  },
  description:
    "A spreadsheet-native planning system for budgets, forecasts, approvals, and executive reporting. Where Spreadsheets Meet Strategy.",
  keywords: [
    "FP&A",
    "Financial Planning",
    "Budget Management",
    "Forecasting",
    "Spreadsheet",
    "Finance Software",
    "Business Planning",
  ],
  authors: [{ name: "Native FP&A" }],
  creator: "Native FP&A",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nativefpa.com",
    title: "Native FP&A | Plan at Operating Speed",
    description:
      "A spreadsheet-native planning system for budgets, forecasts, approvals, and executive reporting.",
    siteName: "Native FP&A",
  },
  twitter: {
    card: "summary_large_image",
    title: "Native FP&A | Plan at Operating Speed",
    description:
      "A spreadsheet-native planning system for budgets, forecasts, approvals, and executive reporting.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function() {
  "use strict";
  const storageKey = "native-fpa-theme";
  const stored = localStorage.getItem(storageKey);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (stored === "dark" || (!stored && prefersDark)) {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    document.documentElement.style.colorScheme = "dark";
  } else {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }
})();`,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
