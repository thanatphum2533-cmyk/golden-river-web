import nodemailer from 'nodemailer';

export interface EmailConfig {
  enabled: boolean;
  recipientEmails: string;
  senderName?: string;
  subject?: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure?: boolean;
  smtpUser: string;
  smtpPass: string;
}

export interface LineConfig {
  enabled: boolean;
  notifyToken?: string;
}

export interface InquiryData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  projectName?: string;
  message?: string;
  images?: string[];
  createdAt?: string;
}

/**
 * Creates Nodemailer transporter based on SMTP configuration
 */
export function createTransporter(config: EmailConfig) {
  const port = Number(config.smtpPort) || 587;
  const secure = config.smtpSecure ?? (port === 465);

  return nodemailer.createTransport({
    host: config.smtpHost || 'smtp.gmail.com',
    port,
    secure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Generates clean HTML template for inquiry notification
 */
export function generateInquiryHtml(inquiry: InquiryData, baseUrl: string = 'https://goldenriverservice.com') {
  const formattedDate = inquiry.createdAt
    ? new Date(inquiry.createdAt).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    : new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

  const imagesHtml = inquiry.images && inquiry.images.length > 0
    ? `
      <div style="margin-top: 20px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px;">รูปภาพหน้างานที่แนบมา (${inquiry.images.length} รูป):</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${inquiry.images
            .map((img, idx) => {
              const fullUrl = img.startsWith('http') ? img : `${baseUrl}${img}`;
              return `<a href="${fullUrl}" target="_blank" style="display: inline-block; padding: 6px 12px; background: #0053b5; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 12px; margin-right: 6px; margin-bottom: 6px;">ดูรูปที่ ${idx + 1}</a>`;
            })
            .join('')}
        </div>
      </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>คำขอใบเสนอราคาใหม่ - Golden River</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background-color: #0f172a; padding: 24px 30px; text-align: left; border-bottom: 3px solid #0053b5;">
          <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
            Golden River Service
          </h1>
          <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px;">
            ระบบแจ้งเตือนคำขอใบเสนอราคาใหม่จากเว็บไซต์
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <div style="display: inline-block; padding: 4px 10px; background-color: #eff6ff; color: #0053b5; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; border: 1px solid #bfdbfe;">
            คำขอใบเสนอราคาใหม่ (New Quotation Request)
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px; font-weight: 500;">ชื่อผู้ติดต่อ:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 700;">${inquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;">เบอร์โทรศัพท์:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0053b5; font-weight: 700;">
                <a href="tel:${inquiry.phone}" style="color: #0053b5; text-decoration: none;">${inquiry.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;">อีเมลลูกค้า:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">
                ${inquiry.email ? `<a href="mailto:${inquiry.email}" style="color: #0053b5; text-decoration: none;">${inquiry.email}</a>` : '<span style="color: #94a3b8;">- ไม่ได้ระบุ -</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;">บริการที่สนใจ:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
                <span style="background-color: #f8fafc; padding: 2px 8px; border-radius: 4px; border: 1px solid #e2e8f0;">${inquiry.service}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;">ชื่อโครงการ / สถานที่:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
                ${inquiry.projectName || '<span style="color: #94a3b8;">- ไม่ได้ระบุ -</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;">เวลาที่ส่งข้อมูล:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #64748b; font-weight: 500; vertical-align: top;">รายละเอียดเพิ่มเติม:</td>
              <td style="padding: 12px 0; color: #334155; line-height: 1.6;">
                ${inquiry.message ? inquiry.message.replace(/\n/g, '<br/>') : '<span style="color: #94a3b8;">- ไม่มีข้อความเพิ่มเติม -</span>'}
              </td>
            </tr>
          </table>

          ${imagesHtml}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <a href="${baseUrl}/admin" target="_blank" style="display: inline-block; padding: 10px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
              เข้าสู่ระบบหลังบ้านเพื่อตรวจสอบคำขอ
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
          อีเมลนี้ถูกส่งโดยอัตโนมัติจากระบบแบบฟอร์มเว็บไซต์ Golden River Service
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Sends inquiry email notification
 */
export async function sendInquiryNotification(inquiry: InquiryData, config: EmailConfig) {
  if (!config.enabled || !config.recipientEmails || !config.smtpUser || !config.smtpPass) {
    return { success: false, skipped: true, reason: 'Notification is disabled or SMTP not configured' };
  }

  const transporter = createTransporter(config);
  const senderName = config.senderName || 'Golden River Service';
  const senderEmail = config.smtpUser;

  let subject = config.subject || '[คำขอใบเสนอราคาใหม่] คุณ {name} - โครงการ {projectName}';
  subject = subject
    .replace('{name}', inquiry.name || 'ลูกค้า')
    .replace('{service}', inquiry.service || 'บริการ')
    .replace('{projectName}', inquiry.projectName || 'ทั่วไป')
    .replace('{phone}', inquiry.phone || '');

  const mailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: config.recipientEmails,
    subject,
    html: generateInquiryHtml(inquiry),
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
}

/**
 * Sends a test email to verify SMTP configuration
 */
export async function sendTestEmail(recipient: string, config: EmailConfig) {
  const transporter = createTransporter(config);
  
  // 1. Verify connection configuration
  await transporter.verify();

  const senderName = config.senderName || 'Golden River Service';
  const senderEmail = config.smtpUser;

  const mailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: recipient,
    subject: 'ทดสอบระบบแจ้งเตือนอีเมล - Golden River Service',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0053b5; margin-top: 0;">ทดสอบการตั้งค่าอีเมลสำเร็จ!</h2>
        <p style="color: #334155; font-size: 14px; line-height: 1.5;">
          ระบบสามารถเชื่อมต่อกับเซิร์ฟเวอร์ SMTP (${config.smtpHost}:${config.smtpPort}) และส่งอีเมลแจ้งเตือนได้อย่างถูกต้องเรียบร้อยแล้ว
        </p>
        <p style="color: #64748b; font-size: 12px;">
          ส่งเมื่อ: ${new Date().toLocaleString('th-TH')}
        </p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
}

/**
 * Sends notification via LINE Notify API (if token provided)
 */
export async function sendLineNotify(inquiry: InquiryData, token?: string) {
  if (!token) return { success: false, skipped: true, reason: 'No LINE token' };

  try {
    const message = `
📢 มีคำขอใบเสนอราคาใหม่!
👤 ชื่อ: ${inquiry.name}
📞 เบอร์โทร: ${inquiry.phone}
🏢 โครงการ: ${inquiry.projectName || '-'}
🛠️ บริการ: ${inquiry.service}
💬 ข้อความ: ${inquiry.message || '-'}
📸 รูปภาพแนบ: ${inquiry.images ? inquiry.images.length : 0} รูป
    `.trim();

    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams({ message }),
    });

    const data = await response.json();
    return { success: data.status === 200, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
