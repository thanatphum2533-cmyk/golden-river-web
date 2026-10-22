const GITHUB_REPO = process.env.GITHUB_REPO || 'thanatphum2533-cmyk/golden-river-web';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function saveSiteDataToGithub(data: any): Promise<{ success: boolean; message?: string }> {
  const rawToken = process.env.GITHUB_TOKEN;
  if (!rawToken || !rawToken.trim()) {
    throw new Error('กรุณาตั้งค่า GITHUB_TOKEN ใน Vercel Environment Variables ก่อนใช้งาน');
  }
  const token = rawToken.trim();

  const filePath = 'src/data/siteData.json';
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

  // 1. Get current file to retrieve SHA
  const getRes = await fetch(`${url}?ref=${GITHUB_BRANCH}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GoldenRiver-Backoffice'
    },
    cache: 'no-store'
  });

  if (!getRes.ok) {
    const errText = await getRes.text();
    throw new Error(`ไม่สามารถอ่านข้อมูลจาก GitHub ได้: ${errText}`);
  }

  const fileData = await getRes.json();
  const sha = fileData.sha;

  // 2. Commit updated JSON
  const contentBase64 = Buffer.from(JSON.stringify(data, null, 2), 'utf8').toString('base64');
  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'GoldenRiver-Backoffice'
    },
    body: JSON.stringify({
      message: 'Update site content via Web Backoffice',
      content: contentBase64,
      sha: sha,
      branch: GITHUB_BRANCH,
      committer: {
        name: 'thanatphum2533-cmyk',
        email: 'goldenriverservice@gmail.com'
      },
      author: {
        name: 'thanatphum2533-cmyk',
        email: 'goldenriverservice@gmail.com'
      }
    })
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    if (putRes.status === 404 || errText.includes('Not Found')) {
      throw new Error('GitHub แจ้งเตือนสิทธิ์ไม่เพียงพอ (404 Not Found): กรุณาสร้าง Token ใหม่ใน GitHub โดยติ๊กเครื่องหมายถูกที่ช่อง [repo] เพื่อให้สิทธิ์แก้ไขไฟล์ในโปรเจกต์ครับ');
    }
    throw new Error(`ไม่สามารถบันทึกข้อมูลไปยัง GitHub ได้: ${errText}`);
  }

  return { success: true };
}

export async function uploadImageToGithub(filename: string, buffer: Buffer): Promise<string> {
  const rawToken = process.env.GITHUB_TOKEN;
  if (!rawToken || !rawToken.trim()) {
    throw new Error('กรุณาตั้งค่า GITHUB_TOKEN ใน Vercel Environment Variables เพื่ออัปโหลดรูป');
  }
  const token = rawToken.trim();

  const filePath = `public/uploads/${filename}`;
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const contentBase64 = buffer.toString('base64');

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'GoldenRiver-Backoffice'
    },
    body: JSON.stringify({
      message: `Upload image ${filename} via Web Backoffice`,
      content: contentBase64,
      branch: GITHUB_BRANCH,
      committer: {
        name: 'thanatphum2533-cmyk',
        email: 'goldenriverservice@gmail.com'
      },
      author: {
        name: 'thanatphum2533-cmyk',
        email: 'goldenriverservice@gmail.com'
      }
    })
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    if (putRes.status === 404 || errText.includes('Not Found')) {
      throw new Error('GitHub แจ้งเตือนสิทธิ์ไม่เพียงพอ (404 Not Found): กรุณาสร้าง Token ใหม่ใน GitHub โดยติ๊กเครื่องหมายถูกที่ช่อง [repo]');
    }
    throw new Error(`ไม่สามารถอัปโหลดรูปภาพไปยัง GitHub ได้: ${errText}`);
  }

  return `/uploads/${filename}`;
}
