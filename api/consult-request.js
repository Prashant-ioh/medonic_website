// Vercel serverless function: receives a consultation request from /consult and
// emails it to the MediSlip team (see server/mail.js for the SMTP settings).
import { escapeHtml, isMailConfigured, parseBody, sendRows } from '../server/mail.js';

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

  const body = parseBody(req);

  // Honeypot: real visitors never see or fill this field; bots usually do.
  if (body.website) return res.status(200).json({ success: true });

  if (body.consent !== true) {
    return res.status(400).json({ success: false, message: 'Please agree to be contacted about your request.' });
  }

  const data = clean(body);
  const problem = validate(data);
  if (problem) return res.status(400).json({ success: false, message: problem });

  if (!isMailConfigured()) {
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

  try {
    await sendRows({
      subject: `New consult request: ${data.fullName} — ${data.concern || data.consultType}`,
      heading: 'New consultation request',
      rows,
      replyTo: data.email,
      footerHtml: `<p style="margin-top:16px"><a href="tel:+91${escapeHtml(data.phone)}" style="color:#1D63ED;font-weight:bold">Call +91 ${escapeHtml(data.phone)}</a></p>`,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('consult-request: sendMail failed', err);
    return res.status(502).json({ success: false, message: 'We could not send your request. Please try again in a minute.' });
  }
}
