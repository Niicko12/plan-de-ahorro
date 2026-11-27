// Precios de acciones de EE. UU. para el apartado Inversiones.
// Solo lectura de información pública del mercado: no recibe datos del usuario ni se conecta a ninguna cuenta.
// Si existe la variable FINNHUB_KEY usa Finnhub; si no, usa el precio público de Yahoo Finance.
// La respuesta se guarda 60 s en la CDN para no repetir consultas.

const ORIGINS = new Set([
  'https://mi-ahorro-j3s3f.web.app',
  'https://mi-ahorro-j3s3f.firebaseapp.com',
  'https://plan-de-ahorro-gules.vercel.app',
]);
const SYM = /^[A-Z][A-Z0-9.-]{0,9}$/;

async function fromFinnhub(sym, key) {
  const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${encodeURIComponent(key)}`);
  if (!r.ok) return null;
  const j = await r.json();
  if (!(j && j.c > 0)) return null;
  return { p: j.c, dp: Number.isFinite(j.dp) ? j.dp : 0, t: j.t ? j.t * 1000 : Date.now() };
}

async function fromYahoo(sym) {
  const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1d&interval=1d`, {
    headers: { 'User-Agent': 'plan-de-ahorro/1.0', Accept: 'application/json' },
  });
  if (!r.ok) return null;
  const j = await r.json();
  const m = j && j.chart && j.chart.result && j.chart.result[0] && j.chart.result[0].meta;
  if (!(m && m.regularMarketPrice > 0)) return null;
  const prev = m.chartPreviousClose || m.previousClose || 0;
  return {
    p: m.regularMarketPrice,
    dp: prev > 0 ? ((m.regularMarketPrice - prev) / prev) * 100 : 0,
    t: m.regularMarketTime ? m.regularMarketTime * 1000 : Date.now(),
    n: m.longName || m.shortName || undefined,
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ORIGINS.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'method' });

  const list = [...new Set(String(req.query.s || '').toUpperCase().split(',').map(s => s.trim()).filter(s => SYM.test(s)))].slice(0, 40);
  if (!list.length) return res.status(400).json({ error: 'symbols' });

  const key = process.env.FINNHUB_KEY;
  const q = {};
  await Promise.all(list.map(async sym => {
    try { q[sym] = (key ? await fromFinnhub(sym, key) : null) || await fromYahoo(sym); } catch { q[sym] = null; }
  }));

  const ok = Object.values(q).some(Boolean);
  res.setHeader('Cache-Control', ok ? 'public, s-maxage=60, stale-while-revalidate=300' : 'no-store');
  return res.status(ok ? 200 : 502).json({ at: Date.now(), q });
}
