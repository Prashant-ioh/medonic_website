// Vercel serverless function: receives a consultation request from /consult and
// emails it to the MediSlip team via Gmail SMTP.
//
// Required environment variables (Vercel → Project → Settings → Environment Variables):
//   SMTP_USER  Gmail address that sends the email, e.g. prashantmishra4424@gmail.com
//   SMTP_PASS  16-character Gmail App Password (not the normal Gmail password)
// Optional:
//   MAIL_TO    Where requests are delivered (defaults to prashantmishra4424@gmail.com)
import nodemailer from 'nodemailer';

const MAIL_TO = process.env.MAIL_TO || 'prashantmishra4424@gmail.com';

const LIMITS = {
  fullName: 80,
  phone: 10,
  email: 120,
  age: 3,
  gender: 20,
  city: 80,
  preferredTime: 40,
  concern: 120,
  consultType: 40,
  symptoms: 2000,
};

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function clean(body) {
  const out = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    out[key] = typeof body?.[key] === 'string' ? body[key].trim().slice(0, max) : '';
  }
  return out;
}

function validate(d) {
  if (!d.fullName) return 'Please enter your name.';
  if (!/^[6-9]\d{9}$/.test(d.phone)) return 'Please enter a valid 10-digit mobile number.';
  if (d.email && !/^\S+@\S+\.\S{2,}$/.test(d.email)) return 'Please enter a valid email address.';
  if (!/^\d{1,3}$/.test(d.age) || Number(d.age) < 1 || Number(d.age) > 120) return 'Please enter a valid age.';
  if (!d.gender) return 'Please select a gender.';
  if (!d.concern && !d.symptoms) return 'Please tell us your concern.';
  if (!d.consultType) return 'Please choose a consult type.';
  return '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  // Honeypot: real visitors never see or fill this field; bots usually do.
  if (body.website) return res.status(200).json({ success: true });

  if (body.consent !== true) {
    return res.status(400).json({ success: false, message: 'Please agree to be contacted about your request.' });
  }

  const data = clean(body);
  const problem = validate(data);
  if (problem) return res.status(400).json({ success: false, message: problem });

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('consult-request: SMTP_USER / SMTP_PASS are not configured');
    return res.status(500).json({ success: false, message: 'Requests are temporarily unavailable. Please try again later.' });
  }

  const rows = [
    ['Name', data.fullName],
    ['Mobile', `+91 ${data.phone}`],
    ['Email', data.email || '—'],
    ['Age / Gender', `${data.age} / ${data.gender}`],
    ['City', data.city || '—'],
    ['Concern', data.concern || '—'],
    ['Consult type', data.consultType],
    ['Preferred time', data.preferredTime || 'As soon as possible'],
    ['Symptoms', data.symptoms || '—'],
  ];

  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#101828">
      <h2 style="color:#0048FC;margin:0 0 4px">New consultation request</h2>
      <p style="color:#667085;margin:0 0 16px">Submitted ${escapeHtml(submittedAt)} IST via medislip-website</p>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <td style="border:1px solid #D9DEE8;background:#F5F7FB;font-weight:bold;width:140px;vertical-align:top">${escapeHtml(k)}</td>
              <td style="border:1px solid #D9DEE8;white-space:pre-wrap">${escapeHtml(v)}</td>
            </tr>`
          )
          .join('')}
      </table>
      <p style="margin-top:16px"><a href="tel:+91${escapeHtml(data.phone)}" style="color:#1D63ED;font-weight:bold">Call +91 ${escapeHtml(data.phone)}</a></p>
    </div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"MediSlip Website" <${process.env.SMTP_USER}>`,
      to: MAIL_TO,
      replyTo: data.email || undefined,
      subject: `New consult request: ${data.fullName} — ${data.concern || data.consultType}`,
      text: `New consultation request (${submittedAt} IST)\n\n${text}`,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('consult-request: sendMail failed', err);
    return res.status(502).json({ success: false, message: 'We could not send your request. Please try again in a minute.' });
  }
}
