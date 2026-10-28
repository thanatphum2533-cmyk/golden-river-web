import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.grgroupth.com'),
  title: 'GR Group | บริการแม่บ้านทำความสะอาด และดูแลภูมิทัศน์สวนครบวงจร',
  description: 'GR Group (โกลเด้นริเวอร์ เซอร์วิส) ผู้เชี่ยวชาญด้านบริการแม่บ้านประจำโครงการ คอนโดมิเนียม หมู่บ้านจัดสรร บริการดูแลสวนและภูมิทัศน์ และดูแลรักษาสระว่ายน้ำครบวงจร ได้รับความไว้วางใจกว่า 30+ โครงการชั้นนำ',
  keywords: [
    'GR Group',
    'โกลเด้นริเวอร์ เซอร์วิส',
    'Golden River Service',
    'goldenriverservicecenter',
    'บริการแม่บ้าน',
    'แม่บ้านคอนโด',
    'แม่บ้านประจำโครงการ',
    'บริการทำความสะอาดครบวงจร',
    'บริการดูแลสวน',
    'ดูแลสวนคอนโด',
    'ตัดแต่งต้นไม้ใหญ่',
    'ดูแลสระว่ายน้ำ',
    'ล้างสระว่ายน้ำคอนโด',
    'เช็ดกระจกอาคารสูง',
    'Big Cleaning คอนโด',
  ],
  alternates: {
    canonical: 'https://www.grgroupth.com',
  },
  openGraph: {
    title: 'GR Group | บริการแม่บ้านทำความสะอาด และดูแลภูมิทัศน์สวนครบวงจร',
    description: 'ยกระดับมาตรฐานความสะอาดและภูมิทัศน์สีเขียวสำหรับโครงการชั้นนำ คอนโดมิเนียม และหมู่บ้านจัดสรร ด้วยบริการมืออาชีพจาก GR Group',
    url: 'https://www.grgroupth.com',
    siteName: 'GR Group - Golden River Service',
    locale: 'th_TH',
    type: 'website',
    images: [
      {
        url: 'https://www.grgroupth.com/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'GR Group บริการแม่บ้านและดูแลสวนครบวงจร',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GR Group | บริการแม่บ้านทำความสะอาด และดูแลภูมิทัศน์สวนครบวงจร',
    description: 'ผู้เชี่ยวชาญด้านบริการแม่บ้านทำความสะอาด และดูแลภูมิทัศน์สวนสำหรับคอนโดมิเนียมและโครงการชั้นนำ',
    images: ['https://www.grgroupth.com/images/og-cover.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'GR Group (โกลเด้นริเวอร์ เซอร์วิส)',
  alternateName: ['Golden River Service', 'Golden River Service Center', 'GR Group'],
  url: 'https://www.grgroupth.com',
  logo: 'https://www.grgroupth.com/GR.svg',
  image: 'https://www.grgroupth.com/images/og-cover.jpg',
  description: 'GR Group ผู้เชี่ยวชาญด้านบริการแม่บ้านประจำโครงการ คอนโดมิเนียม อาคารสำนักงาน บริการดูแลสวนและภูมิทัศน์ และบำรุงรักษาสระว่ายน้ำครบวงจร ได้รับความไว้วางใจกว่า 30+ โครงการชั้นนำ',
  telephone: '02-096-3579',
  email: 'goldenriverservice@gmail.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '677/1 ถนนพระราม 4 แขวงรองเมือง',
    addressLocality: 'เขตปทุมวัน',
    addressRegion: 'กรุงเทพมหานคร',
    postalCode: '10330',
    addressCountry: 'TH',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:30',
      closes: '17:30',
    },
  ],
  sameAs: [
    'https://line.me/R/ti/p/@goldenriver',
    'https://goldenriverservicecenter.com',
  ],
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'กรุงเทพมหานคร' },
    { '@type': 'AdministrativeArea', name: 'นนทบุรี' },
    { '@type': 'AdministrativeArea', name: 'สมุทรปราการ' },
    { '@type': 'AdministrativeArea', name: 'ปทุมธานี' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'บริการของ GR Group',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'บริการแม่บ้านทำความสะอาดประจำโครงการ (Maid & Cleaning Service)',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'บริการดูแลสวนและภูมิทัศน์ (Landscape & Garden Maintenance)',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'บริการดูแลและบำรุงรักษาสระว่ายน้ำ (Swimming Pool Maintenance)',
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
