import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = path.basename(params.filename);
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    const ext = path.extname(filename).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';

    // 1. If file exists locally on disk, serve it
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. If not on local disk (uploaded on Vercel before redeploy finishes), fetch immediately from GitHub
    const githubRawUrl = `https://raw.githubusercontent.com/thanatphum2533-cmyk/golden-river-web/main/public/uploads/${filename}`;
    const ghRes = await fetch(githubRawUrl, { cache: 'no-store' });
    if (ghRes.ok) {
      const arrayBuffer = await ghRes.arrayBuffer();
      return new NextResponse(Buffer.from(arrayBuffer), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return new NextResponse('File not found', { status: 404 });
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}
