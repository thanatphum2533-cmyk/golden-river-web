import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveSiteDataToGithub } from '@/lib/githubSync';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'siteData.json');

function readData() {
  const file = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(file);
}

function writeDataLocal(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to read data', details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentData = readData();
    const updatedData = { ...currentData, ...body };

    const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
    const hasGithubToken = Boolean(process.env.GITHUB_TOKEN);

    if (hasGithubToken) {
      // Save directly to GitHub repo so Vercel redeploys automatically
      await saveSiteDataToGithub(updatedData);

      // If local fs is writable (e.g. testing locally with token), also update local file
      try {
        writeDataLocal(updatedData);
      } catch (e) {
        // Ignored on read-only environments like Vercel
      }

      return NextResponse.json({
        success: true,
        message: 'บันทึกข้อมูลและส่งขึ้น GitHub สำเร็จแล้ว! หน้าเว็บจริงบน Vercel จะอัปเดตอัตโนมัติภายใน 1-2 นาที'
      });
    }

    if (isVercel && !hasGithubToken) {
      return NextResponse.json({
        error: 'ยังไม่ได้ตั้งค่า GITHUB_TOKEN ใน Vercel กรุณาเพิ่ม GITHUB_TOKEN ใน Vercel Environment Variables เพื่อเปิดให้บันทึกข้อมูลจากระยะไกลได้ครับ',
        details: 'Missing GITHUB_TOKEN on Vercel'
      }, { status: 400 });
    }

    // Default local behavior
    writeDataLocal(updatedData);
    return NextResponse.json({ success: true, message: 'บันทึกข้อมูลในเครื่องเรียบร้อยแล้ว' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update data', details: error.message }, { status: 500 });
  }
}
