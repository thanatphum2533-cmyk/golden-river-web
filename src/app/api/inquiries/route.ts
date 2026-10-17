import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendInquiryNotification, sendLineNotify } from '@/lib/mailer';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'siteData.json');

function readData() {
  const file = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(file);
}

function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.inquiries || []);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to read inquiries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentData = readData();
    
    const newInquiry = {
      id: 'inq-' + Date.now(),
      createdAt: new Date().toISOString(),
      name: body.name || 'ไม่ระบุชื่อ',
      phone: body.phone || '',
      email: body.email || '',
      service: body.service || 'ทั่วไป',
      projectName: body.projectName || '',
      message: body.message || '',
      images: Array.isArray(body.images) ? body.images.slice(0, 10) : [],
      status: 'pending'
    };

    if (!currentData.inquiries) {
      currentData.inquiries = [];
    }
    currentData.inquiries.unshift(newInquiry);
    writeData(currentData);

    // Trigger Email Notification (if configured & enabled)
    const emailConfig = currentData.notifications?.email;
    if (emailConfig && emailConfig.enabled) {
      sendInquiryNotification(newInquiry, emailConfig).catch((err) => {
        console.error('Email notification error:', err.message);
      });
    }

    // Trigger LINE Notification (if configured & enabled)
    const lineConfig = currentData.notifications?.line;
    if (lineConfig && lineConfig.enabled && lineConfig.notifyToken) {
      sendLineNotify(newInquiry, lineConfig.notifyToken).catch((err) => {
        console.error('LINE notification error:', err.message);
      });
    }

    return NextResponse.json({ success: true, inquiry: newInquiry });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to submit inquiry', details: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const currentData = readData();
    if (currentData.inquiries) {
      const idx = currentData.inquiries.findIndex((i: any) => i.id === id);
      if (idx !== -1) {
        currentData.inquiries[idx].status = status;
        writeData(currentData);
        return NextResponse.json({ success: true });
      }
    }
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update inquiry status' }, { status: 500 });
  }
}
