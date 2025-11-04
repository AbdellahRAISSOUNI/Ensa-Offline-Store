/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  titleTemplate: '%s | ENSA OFFLINE',
  defaultTitle: 'ENSA Tetouan Merchandise | ENSA OFFLINE - Official Store',
  
  description: 'ENSA Tetouan official merchandise store - ENSA Maroc | ENSA Morocco. Shop ENSA clothing, ENSA hoodies, ENSA t-shirts for ENSA students and ENSA alumni in Tetouan, Morocco.',
  
  canonical: 'https://www.ensa-offline.store',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ensa-offline.store',
    siteName: 'ENSA OFFLINE',
    title: 'ENSA Tetouan Merchandise | ENSA OFFLINE',
    description: 'ENSA Tetouan official merchandise store - ENSA Maroc. Shop ENSA clothing for ENSA students and ENSA alumni in Tetouan, Morocco.',
    images: [
      {
        url: 'https://www.ensa-offline.store/ensa-offline.png?v=2',
        width: 1200,
        height: 630,
        alt: 'ENSA Tetouan Merchandise - ENSA OFFLINE Store',
      },
    ],
  },
  
  twitter: {
    handle: '@ensaoffline',
    site: '@ensaoffline',
    cardType: 'summary_large_image',
  },
  
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'ENSA, ENSA Tetouan, ENSA Maroc, ENSA Morocco, ENSA OFFLINE, ENSA merchandise, ENSA store, ENSA clothing, ENSA hoodies, ENSA t-shirts, ENSA university, ENSA campus, ENSA students, ENSA alumni'
    },
    {
      property: 'article:author',
      content: 'ENSA OFFLINE'
    },
    {
      name: 'geo.region',
      content: 'MA'
    },
    {
      name: 'geo.placename',
      content: 'Tetouan'
    },
    {
      name: 'geo.position',
      content: '35.5742;-5.3728'
    },
    {
      name: 'ICBM',
      content: '35.5742, -5.3728'
    }
  ],
};

module.exports = defaultSEOConfig;

