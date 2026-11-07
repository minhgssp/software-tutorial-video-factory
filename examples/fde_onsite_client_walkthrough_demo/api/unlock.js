// Vercel Serverless Gate reading process.env.WALKTHROUGH_PASSWORD (.env)
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  const expected = process.env.WALKTHROUGH_PASSWORD || '';
  const provided = (req.body && req.body.password) ? String(req.body.password).trim() : '';
  if (!expected || provided !== expected) {
    return res.status(401).json({ ok: false, error: 'Mật khẩu không chính xác. Từ chối tải trang.' });
  }
  return res.status(200).json({ ok: true, unlocked: true });
}
