import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs';
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const AppFont = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-app',
})

export const metadata: Metadata = {
  title: "SiteTrack",
  description: "Clean charts, widgets, and IP intelligence in a single dashboard. No clutter just the correct amount of data you need.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={AppFont.className}
        >
          <Script
            src="http://localhost:3000/analytics.js"
            strategy="afterInteractive"
            data-website-id="7d8ee682-3711-4649-b186-101ad971ad95"
            data-domain="https://localhost:3000"
          />
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
