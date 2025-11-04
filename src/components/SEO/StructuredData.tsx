export function StructuredData() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.ensa-offline.store/#organization",
        name: "ENSA OFFLINE",
        url: "https://www.ensa-offline.store",
        logo: "https://www.ensa-offline.store/ensa-offline.png?v=2",
        description: "Official ENSA Tetouan merchandise store - ENSA Maroc. Premium streetwear, custom apparel, and authentic ENSA OFFLINE collection.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tetouan",
          addressCountry: "MA",
          addressRegion: "Tanger-Tetouan-Al Hoceima"
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          areaServed: "MA",
          availableLanguage: ["en", "fr", "ar"]
        },
        sameAs: [
          "https://www.instagram.com/ensaoffline",
          "https://www.facebook.com/ensaoffline",
          "https://twitter.com/ensaoffline"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.ensa-offline.store/#website",
        url: "https://www.ensa-offline.store",
        name: "ENSA OFFLINE",
        description: "Official ENSA Tetouan merchandise store - ENSA Tetouan, ENSA Maroc. Shop premium streetwear, hoodies, t-shirts, and custom apparel for ENSA students and alumni.",
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://www.ensa-offline.store/products?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.ensa-offline.store/#webpage",
        url: "https://www.ensa-offline.store",
        name: "ENSA OFFLINE Store - Official ENSA Tetouan Merchandise",
        description: "Official ENSA Tetouan merchandise store - ENSA Maroc. Shop premium streetwear, hoodies, t-shirts, and custom apparel designed for ENSA students and alumni in Tetouan, Morocco.",
        isPartOf: {
          "@id": "https://www.ensa-offline.store/#website"
        },
        about: {
          "@id": "https://www.ensa-offline.store/#organization"
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://www.ensa-offline.store/ensa-offline.png?v=2",
          width: 1200,
          height: 630
        }
      },
      {
        "@type": "Store",
        "@id": "https://www.ensa-offline.store/#store",
        name: "ENSA OFFLINE Store",
        description: "Official ENSA Tetouan merchandise store - ENSA Tetouan, ENSA Maroc, ENSA Morocco",
        url: "https://www.ensa-offline.store",
        image: "https://www.ensa-offline.store/ensa-offline.png?v=2",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Tetouan",
          addressLocality: "Tetouan",
          addressRegion: "Tanger-Tetouan-Al Hoceima",
          postalCode: "93000",
          addressCountry: "MA"
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "35.5742",
          longitude: "-5.3728"
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
          ],
          opens: "09:00",
          closes: "18:00"
        },
        priceRange: "$$",
        currenciesAccepted: "MAD, USD"
      },
      {
        "@type": "CollegeOrUniversity",
        "@id": "https://www.ensa-offline.store/#university",
        name: "ENSA Tetouan",
        alternateName: ["ENSA Maroc", "ENSA Morocco", "ENSA"],
        description: "École Nationale des Sciences Appliquées de Tétouan",
        url: "https://www.ensa-offline.store",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tetouan",
          addressRegion: "Tanger-Tetouan-Al Hoceima",
          addressCountry: "MA"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

