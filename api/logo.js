// Logo de la empresa de una acción (EE. UU. o Bolsa Mexicana .MX), para el apartado Inversiones.
// Pasa por aquí para que el proveedor de logos no vea qué acciones consulta cada persona,
// y la CDN lo guarda una semana. Si no hay logo responde 404 y la app muestra las letras.

const SYM = /^[A-Z][A-Z0-9.&-]{0,15}$/;

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') return res.status(405).end();
  const sym = String(req.query.s || '').toUpperCase();
  if (!SYM.test(sym)) return res.status(400).end();
  try {
    const r = await fetch(`https://financialmodelingprep.com/image-stock/${encodeURIComponent(sym)}.png`);
    const type = r.headers.get('content-type') || '';
    if (r.ok && /^image\/(png|jpeg|webp)$/.test(type)) {
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length > 0 && buf.length < 300000) {
        res.setHeader('Content-Type', type);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800');
        return res.status(200).send(buf);
      }
    }
  } catch {}
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return res.status(404).end();
}
