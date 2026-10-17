import { NextResponse } from 'next/server';
import { sendTestEmail, EmailConfig } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipient, config } = body as { recipient: string; config: EmailConfig };

    if (!recipient) {
      return NextResponse.json({ error: 'กรุณาระบุอีเมลผู้รับทดสอบ' }, { status: 400 });
    }

    if (!config || !config.smtpHost || !config.smtpUser || !config.smtpPass) {
      return NextResponse.json({
        error: 'กรุณากรอกข้อมูล SMTP (Host, Email ผู้ส่ง, Password) ให้ครบถ้วนก่อนทดสอบ',
      }, { status: 400 });
    }

    const result = await sendTestEmail(recipient, config);
    return NextResponse.json({
      success: true,
      message: `ส่งอีเมลทดสอบไปยัง ${recipient} สำเร็จเรียบร้อยแล้ว!`,
      messageId: result.messageId,
    });
  } catch (error: any) {
    let errorDetail = error.message || 'Unknown error';
    if (error.code === 'EAUTH') {
      errorDetail = 'การยืนยันตัวตนล้มเหลว (Invalid username or password). หากใช้ Gmail ให้ใช้ "App Password (รหัสผ่านสำหรับแอป)" 16 หลัก';
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      errorDetail = 'ไม่สามารถเชื่อมต่อไปยัง SMTP Server ได้ กรุณาตรวจสอบ SMTP Host และ Port';
    }

    return NextResponse.json(
      { error: `เกิดข้อผิดพลาดในการส่งอีเมล: ${errorDetail}`, originalError: error.message },
      { status: 500 }
    );
  }
}
