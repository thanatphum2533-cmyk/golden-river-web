import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Support multiple files under 'files' or single file under 'file'
    const filesList = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;
    
    const filesToProcess: File[] = [];
    if (filesList && filesList.length > 0) {
      filesToProcess.push(...filesList);
    } else if (singleFile) {
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ error: 'ไม่พบไฟล์รูปภาพที่อัปโหลด' }, { status: 400 });
    }

    // Limit to max 10 files per upload batch
    const limitedFiles = filesToProcess.slice(0, 10);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const savedUrls: string[] = [];

    for (const file of limitedFiles) {
      if (!file || typeof file.arrayBuffer !== 'function') continue;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const filename = `img-${timestamp}-${randomSuffix}${ext}`;
      const targetFilePath = path.join(uploadsDir, filename);

      fs.writeFileSync(targetFilePath, buffer);
      savedUrls.push(`/uploads/${filename}`);
    }

    if (savedUrls.length === 0) {
      return NextResponse.json({ error: 'ไม่สามารถบันทึกไฟล์ได้' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: savedUrls[0],
      urls: savedUrls,
      count: savedUrls.length,
    });
  } catch (error: any) {
    const isReadOnly = error.code === 'EROFS' || (error.message && error.message.includes('read-only'));
    const message = isReadOnly
      ? 'ระบบ Vercel เป็นแบบอ่านอย่างเดียว (ไม่มีฮาร์ดดิสก์เขียนไฟล์ถาวร) กรุณาอัปโหลดรูปผ่านเครื่องคอมพิวเตอร์นี้ (localhost:3000/admin) หรือผ่านลิงก์ Cloudflare Tunnel แล้วกด push_to_github.bat ครับ'
      : 'เกิดข้อผิดพลาดในการบันทึกรูปภาพ: ' + (error.message || '');
    return NextResponse.json(
      { error: message, details: error.message },
      { status: 500 }
    );
  }
}
