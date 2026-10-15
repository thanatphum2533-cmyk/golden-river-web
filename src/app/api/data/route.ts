import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'siteData.json');

function readData() {
  const file = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(file);
}

function writeData(data: any) {
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
    writeData(updatedData);
    return NextResponse.json({ success: true, message: 'Data updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update data', details: error.message }, { status: 500 });
  }
}
