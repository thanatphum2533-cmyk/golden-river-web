import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GR Group | บริการแม่บ้านทำความสะอาด และดูแลภูมิทัศน์สวนครบวงจร',
  description: 'GR Group ผู้เชี่ยวชาญด้านบริการแม่บ้านทำความสะอาด และดูแลรักษาภูมิทัศน์สวนสำหรับคอนโดมิเนียมและโครงการชั้นนำ',
  keywords: 'GR Group, บริการแม่บ้าน, แม่บ้านคอนโด, บริการดูแลสวน, ตัดแต่งต้นไม้, รักษาความสะอาด, เช็ดกระจกอาคารสูง, บริษัท โกลเด้นริเวอร์ เซอร์วิส, Golden River Service',
  openGraph: {
    title: 'GR Group - บริการแม่บ้านทำความสะอาด และดูแลภูมิทัศน์สวนครบวงจร',
    description: 'ยกระดับมาตรฐานความสะอาดและภูมิทัศน์สีเขียวสำหรับโครงการชั้นนำด้วยบริการมืออาชีพจาก GR Group',
    url: 'https://goldenriverservicecenter.com',
    siteName: 'GR Group',
    locale: 'th_TH',
    type: 'website',
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
        <link rel="icon" href="/GR.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
