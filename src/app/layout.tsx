import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { GoogleAnalytics } from "@/components/SEO/GoogleAnalytics";
import { StructuredData } from "@/components/SEO/StructuredData";

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
  title: {
    default: "ENSA Tetouan Merchandise | ENSA OFFLINE - Official Store",
    template: "%s | ENSA OFFLINE"
  },
  description: "ENSA Tetouan official merchandise store - ENSA Maroc | ENSA Morocco. Shop premium ENSA clothing, ENSA hoodies, ENSA t-shirts, and custom ENSA apparel for ENSA students and ENSA alumni in Tetouan, Morocco. ENSA campus culture and ENSA community apparel.",
  metadataBase: new URL("https://ensaoffline.com"),
  icons: {
    icon: "/favicon.ico?v=3",
    shortcut: "/favicon.ico?v=3",
    apple: "/favicon.ico?v=3",
  },
  openGraph: {
    title: "ENSA OFFLINE - Official ENSA Tetouan Merchandise Store",
    description: "Official ENSA Tetouan merchandise store. Premium streetwear, custom apparel, and authentic ENSA OFFLINE collection. Shop hoodies, t-shirts, and accessories designed for ENSA students and alumni in Tetouan, Morocco.",
    type: "website",
    siteName: "ENSA OFFLINE",
    url: "https://www.ensa-offline.store",
    images: [
      {
        url: "https://www.ensa-offline.store/ensa-offline.png?v=2",
        width: 1200,
        height: 630,
        alt: "ENSA OFFLINE - Official ENSA Tetouan Store",
        type: "image/png",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENSA OFFLINE - Official ENSA Tetouan Merchandise Store",
    description: "Official ENSA Tetouan merchandise store. Premium streetwear, custom apparel, and authentic ENSA OFFLINE collection. Shop hoodies, t-shirts, and accessories designed for ENSA students and alumni in Tetouan, Morocco.",
    images: ["https://www.ensa-offline.store/ensa-offline.png?v=2"],
  },
  keywords: [
    "ENSA", "ENSA Tetouan", "ENSA Maroc", "ENSA Morocco", "ENSA Maroc", "ENSA OFFLINE",
    "ENSA merchandise", "ENSA store", "ENSA clothing", "ENSA hoodies", "ENSA t-shirts",
    "ENSA university", "ENSA campus", "ENSA Tetouan university", "ENSA Maroc university",
    "ENSA students", "ENSA alumni", "ENSA community", "ENSA culture", "ENSA apparel",
    "ENSA hoodie", "ENSA sweatshirt", "ENSA jersey", "ENSA merch", "ENSA Tetouan merch",
    "Tetouan university", "Morocco university", "university merchandise", "college apparel",
    "ENSA campus shop", "ENSA student store", "ENSA alumni shop", "ENSA clothing store",
    "streetwear Morocco", "Morocco fashion", "Tetouan fashion", "Tetouan clothing",
    "premium apparel", "custom clothing", "university streetwear", "Morocco streetwear",
    "ENSA Tetouan clothing", "ENSA Morocco merchandise", "ENSA Maroc clothing"
  ],
  authors: [{ name: "ENSA OFFLINE" }],
  creator: "ENSA OFFLINE",
  publisher: "ENSA OFFLINE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code-here',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        <GoogleAnalytics />
        
        {/* Additional meta tags for better WhatsApp/messaging app compatibility */}
        <meta property="og:image" content="https://www.ensa-offline.store/ensa-offline.png?v=2" />
        <meta property="og:image:secure_url" content="https://www.ensa-offline.store/ensa-offline.png?v=2" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="ENSA Tetouan Merchandise - ENSA OFFLINE Store" />
        
        <meta name="twitter:image" content="https://www.ensa-offline.store/ensa-offline.png?v=2" />
        <meta name="twitter:image:alt" content="ENSA Tetouan Merchandise - ENSA OFFLINE Store" />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />
        
        {/* Geographic and location meta tags */}
        <meta name="geo.region" content="MA" />
        <meta name="geo.placename" content="Tetouan" />
        <meta name="geo.position" content="35.5742;-5.3728" />
        <meta name="ICBM" content="35.5742, -5.3728" />
        
        {/* Additional SEO meta tags */}
        <meta name="audience" content="ENSA students, ENSA alumni, Tetouan university students" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        
        {/* ENSA-specific keywords */}
        <meta name="subject" content="ENSA Tetouan, ENSA Maroc, ENSA Morocco, university merchandise" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CurrencyProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </CurrencyProvider>
      </body>
    </html>
  );
}
