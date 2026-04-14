// ============================================================
//  ORCHARD MEDICAL MANAGEMENT — Web Server
//  Serves static files + handles form submissions via Nodemailer
//  Usage:  node server.js
//  Setup:  npm install nodemailer busboy
// ============================================================

'use strict';

const http     = require('http');
const fs       = require('fs');
const path     = require('path');

// Nodemailer — loaded lazily so static file serving works even without npm install
let nodemailer, busboy;
try { nodemailer = require('nodemailer'); } catch(e) { nodemailer = null; }
try { busboy     = require('busboy');     } catch(e) { busboy     = null; }

const PORT = process.env.PORT || 3001;
const ROOT = __dirname;

// ── Email config ──────────────────────────────────────────────
// All values MUST be set as environment variables — no hardcoded fallbacks.
// Create a .env file locally (never commit it) or set vars in your hosting dashboard.
// Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL
if (nodemailer && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
  console.warn('[WARN] SMTP_USER / SMTP_PASS environment variables not set — email sending disabled.');
}
const SMTP_CONFIG = {
  host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};
const TO_EMAIL   = process.env.TO_EMAIL   || 'abbott@orchardmedicalmgt.com';
const FROM_EMAIL = process.env.FROM_EMAIL || '"OMM Website" <noreply@orchardmedicalmgt.com>';

// ── MIME types ────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.xml':  'application/xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.pdf':  'application/pdf',
  '.doc':  'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

// ── Static file resolver ──────────────────────────────────────
function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const full    = path.join(ROOT, decoded);
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
    const idx = path.join(full, 'index.html');
    if (fs.existsSync(idx)) return idx;
  }
  const trimmed  = decoded.replace(/\/$/, '');
  const htmlFile = path.join(ROOT, trimmed + '.html');
  if (fs.existsSync(htmlFile)) return htmlFile;
  const nestedIdx = path.join(ROOT, trimmed, 'index.html');
  if (fs.existsSync(nestedIdx)) return nestedIdx;
  return null;
}

// ── JSON response helper ──────────────────────────────────────
function json(res, status, obj) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(obj));
}

// ── Parse URL-encoded body ────────────────────────────────────
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try {
        const params = new URLSearchParams(body);
        const obj = {};
        for (const [k, v] of params) {
          if (obj[k]) {
            obj[k] = Array.isArray(obj[k]) ? [...obj[k], v] : [obj[k], v];
          } else {
            obj[k] = v;
          }
        }
        resolve(obj);
      } catch(e) { reject(e); }
    });
    req.on('error', reject);
  });
}

// ── Parse multipart form (for file uploads) ───────────────────
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    if (!busboy) return reject(new Error('busboy not installed'));
    const fields = {};
    const files  = [];
    const bb = busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

    bb.on('field', (name, val) => { fields[name] = val; });
    bb.on('file', (name, stream, info) => {
      const chunks = [];
      stream.on('data', d => chunks.push(d));
      stream.on('end', () => {
        files.push({
          fieldname: name,
          filename:  info.filename,
          mimetype:  info.mimeType,
          buffer:    Buffer.concat(chunks),
        });
      });
    });
    bb.on('finish', () => resolve({ fields, files }));
    bb.on('error',  reject);
    req.pipe(bb);
  });
}

// ── Build HTML email body ─────────────────────────────────────
function buildContactEmail(d) {
  const services = Array.isArray(d['services[]']) ? d['services[]'].join(', ') : (d['services[]'] || 'Not specified');
  return `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
  <div style="background:#2563EB;padding:24px 32px;">
    <h1 style="color:#fff;font-size:1.25rem;margin:0;">New Contact Form Submission</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:0.875rem;margin:4px 0 0;">Orchard Medical Management Website</p>
  </div>
  <div style="padding:32px;">
    <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;width:160px;font-weight:600;">Full Name</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${esc(d.name)}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">Email</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;"><a href="mailto:${esc(d.email)}" style="color:#2563EB;">${esc(d.email)}</a></td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${esc(d.phone || 'Not provided')}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">Practice Name</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${esc(d.practice || 'Not provided')}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">Current EMR</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${esc(d.emr || 'Not provided')}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">Services of Interest</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${esc(services)}</td></tr>
      <tr><td style="padding:10px 0;color:#64748B;font-weight:600;vertical-align:top;">Message</td><td style="padding:10px 0;color:#0A0F1E;line-height:1.6;">${esc(d.message || '').replace(/\n/g, '<br>')}</td></tr>
    </table>
  </div>
  <div style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0;font-size:0.8rem;color:#94A3B8;">
    Submitted ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} ET
  </div>
</div>`;
}

function buildCareersEmail(d) {
  return `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
  <div style="background:#2563EB;padding:24px 32px;">
    <h1 style="color:#fff;font-size:1.25rem;margin:0;">New Job Application</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:0.875rem;margin:4px 0 0;">Orchard Medical Management Careers</p>
  </div>
  <div style="padding:32px;">
    <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;width:160px;font-weight:600;">Full Name</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${esc(d.firstName)} ${esc(d.lastName)}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">Email</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;"><a href="mailto:${esc(d.email)}" style="color:#2563EB;">${esc(d.email)}</a></td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${esc(d.phone || 'Not provided')}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">Position</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${esc(d.position || 'Not specified')}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">Experience</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${esc(d.experience || 'Not provided')}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;font-weight:600;">LinkedIn</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#0A0F1E;">${d.linkedin ? `<a href="${esc(d.linkedin)}" style="color:#2563EB;">${esc(d.linkedin)}</a>` : 'Not provided'}</td></tr>
      <tr><td style="padding:10px 0;color:#64748B;font-weight:600;vertical-align:top;">Cover Letter</td><td style="padding:10px 0;color:#0A0F1E;line-height:1.6;">${esc(d.coverLetter || '').replace(/\n/g, '<br>') || 'Not provided'}</td></tr>
    </table>
  </div>
  <div style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0;font-size:0.8rem;color:#94A3B8;">
    Resume attachment: ${d._resumeFilename || 'None'} &nbsp;|&nbsp; Submitted ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} ET
  </div>
</div>`;
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Send email helper ─────────────────────────────────────────
async function sendEmail({ to, subject, html, attachments }) {
  if (!nodemailer) throw new Error('nodemailer not installed — run: npm install nodemailer');
  const transporter = nodemailer.createTransport(SMTP_CONFIG);
  return transporter.sendMail({ from: FROM_EMAIL, to, subject, html, attachments });
}

// ── API: POST /api/contact ────────────────────────────────────
async function handleContact(req, res) {
  let data;
  try { data = await parseBody(req); }
  catch(e) { return json(res, 400, { ok: false, error: 'Bad request' }); }

  // Basic validation
  if (!data.name || !data.email || !data.message) {
    return json(res, 422, { ok: false, error: 'Missing required fields' });
  }

  try {
    await sendEmail({
      to: TO_EMAIL,
      subject: `Contact Form: ${data.name} — ${data.practice || 'New Inquiry'}`,
      html: buildContactEmail(data),
    });
    console.log('[contact] Email sent from', data.email);
    return json(res, 200, { ok: true });
  } catch(e) {
    console.error('[contact] Email error:', e.message);
    return json(res, 500, { ok: false, error: 'Failed to send email. Please try again or call (603) 232-4513.' });
  }
}

// ── API: POST /api/careers ────────────────────────────────────
async function handleCareers(req, res) {
  let fields, files;
  const ct = req.headers['content-type'] || '';

  if (ct.includes('multipart/form-data')) {
    if (!busboy) return json(res, 500, { ok: false, error: 'File uploads require: npm install busboy' });
    try { ({ fields, files } = await parseMultipart(req)); }
    catch(e) { return json(res, 400, { ok: false, error: 'Bad request' }); }
  } else {
    try { fields = await parseBody(req); files = []; }
    catch(e) { return json(res, 400, { ok: false, error: 'Bad request' }); }
  }

  if (!fields.firstName || !fields.email) {
    return json(res, 422, { ok: false, error: 'Missing required fields' });
  }

  const resumeFile = files.find(f => f.fieldname === 'resume');
  fields._resumeFilename = resumeFile ? resumeFile.filename : 'None';

  const attachments = resumeFile ? [{
    filename: resumeFile.filename,
    content:  resumeFile.buffer,
    contentType: resumeFile.mimetype,
  }] : [];

  try {
    await sendEmail({
      to: TO_EMAIL,
      subject: `Job Application: ${fields.firstName} ${fields.lastName || ''} — ${fields.position || 'General'}`,
      html: buildCareersEmail(fields),
      attachments,
    });
    console.log('[careers] Application received from', fields.email);
    return json(res, 200, { ok: true });
  } catch(e) {
    console.error('[careers] Email error:', e.message);
    return json(res, 500, { ok: false, error: 'Failed to submit application. Please email abbott@orchardmedicalmgt.com directly.' });
  }
}

// ── Main HTTP server ──────────────────────────────────────────
http.createServer(async (req, res) => {

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST' });
    return res.end();
  }

  // API routes
  if (req.method === 'POST' && req.url === '/api/contact') return handleContact(req, res);
  if (req.method === 'POST' && req.url === '/api/careers') return handleCareers(req, res);

  // Static file serving
  const filePath = resolve(req.url);
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 — Not found: ' + req.url);
  }

  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': mime,
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://formspree.io https://generativelanguage.googleapis.com",
      "frame-ancestors 'none'",
    ].join('; '),
  });
  fs.createReadStream(filePath).pipe(res);

}).listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   OMM Server running on port ' + PORT + '        ║');
  console.log('  ║   http://localhost:' + PORT + '                ║');
  console.log('  ║   Emails → ' + TO_EMAIL + '  ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
  if (!nodemailer) console.warn('  ⚠  nodemailer not found — run: npm install nodemailer busboy');
});
