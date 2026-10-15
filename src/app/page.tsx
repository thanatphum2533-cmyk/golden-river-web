import fs from 'fs';
import path from 'path';
import HomeClient from '@/components/HomeClient';
import defaultData from '@/data/siteData.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getFreshData() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'siteData.json');
    if (fs.existsSync(dataFilePath)) {
      const file = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(file);
    }
  } catch (err) {
    console.error('Error reading fresh data in page.tsx:', err);
  }
  return defaultData;
}

export default function HomePage() {
  const freshData = getFreshData();
  return <HomeClient initialData={freshData} />;
}
