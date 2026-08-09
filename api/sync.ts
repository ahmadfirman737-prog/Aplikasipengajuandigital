export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const JSONBLOB_URL = "https://jsonblob.com/api/jsonBlob/019fe799-3aca-7d87-992f-a8a0b784dc16";

  if (req.method === 'GET') {
    try {
      const response = await fetch(JSONBLOB_URL, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.pengajuanList)) {
          return res.status(200).json(data);
        }
      }
    } catch (e) {
      console.error("Vercel API fetch error", e);
    }
    return res.status(200).json({ pengajuanList: [], loginHistory: [] });
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body) {
        const payload = {
          pengajuanList: body.pengajuanList || [],
          loginHistory: body.loginHistory || []
        };

        await fetch(JSONBLOB_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        return res.status(200).json({ success: true, data: payload });
      }
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
