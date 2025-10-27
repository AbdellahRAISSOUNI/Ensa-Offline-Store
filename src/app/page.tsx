import { Hero } from "@/components/Hero";
import { ProductShowcase } from "@/components/ProductShowcase";
import { PageDescription } from "@/components/SEO/PageDescription";

export const metadata = {
  title: "ENSA Tetouan Merchandise | ENSA Maroc | ENSA OFFLINE Store",
  description: "ENSA Tetouan official merchandise store - ENSA Maroc | ENSA Morocco. Shop ENSA clothing, ENSA hoodies, ENSA t-shirts for ENSA students and ENSA alumni in Tetouan, Morocco.",
  keywords: "ENSA, ENSA Tetouan, ENSA Maroc, ENSA Morocco, ENSA merchandise, ENSA hoodies, ENSA t-shirts, ENSA clothing, ENSA students, ENSA alumni, ENSA campus, ENSA community"
};

export default function Home() {
  return (
    <div>
      <PageDescription />
      <Hero />
      <ProductShowcase />
    </div>
  );
}
