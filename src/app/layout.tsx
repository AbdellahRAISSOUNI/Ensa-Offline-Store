import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ENSA OFFLINE STORE",
  description: "Where street culture meets premium apparel. Laugh, grow, and express your authentic self with our exclusive ENSA OFFLINE collection.",
  metadataBase: new URL("https://ensaoffline.com"),
  icons: {
    icon: "/favicon.ico?v=3",
    shortcut: "/favicon.ico?v=3",
    apple: "/favicon.ico?v=3",
  },
  openGraph: {
    title: "ENSA OFFLINE STORE",
    description: "Where street culture meets premium apparel. Laugh, grow, and express your authentic self with our exclusive ENSA OFFLINE collection.",
    type: "website",
    siteName: "ENSA OFFLINE",
    images: [
      {
        url: "/ensa-offline.png",
        width: 1200,
        height: 630,
        alt: "ENSA OFFLINE - Laugh and Grow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ENSA OFFLINE STORE",
    description: "Where street culture meets premium apparel. Laugh, grow, and express your authentic self with our exclusive ENSA OFFLINE collection.",
    images: ["/ensa-offline.png"],
  },
  keywords: ["ENSA OFFLINE", "streetwear", "premium apparel", "authentic style", "urban fashion", "limited edition"],
  authors: [{ name: "ENSA OFFLINE" }],
  creator: "ENSA OFFLINE",
  publisher: "ENSA OFFLINE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CurrencyProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </CurrencyProvider>
      </body>
    </html>
  );
}
