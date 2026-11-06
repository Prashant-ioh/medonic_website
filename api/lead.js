// Vercel serverless function: emails the smaller site forms (app download link by SMS,
// newsletter signup, pharmacy software demo) to the MediSlip team. See server/mail.js for the SMTP settings.
import { isMailConfigured, parseBody, sendRows } from '../server/mail.js';

const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^\S+@\S+\.\S{2,}$/;

const TYPES = {
  'app-link': {
    heading: 'App download link requested',
    subject: (d) => `App link request: +91 ${d.phone}`,
    validate: (d) => (PHONE.test(d.phone) ? '' : 'Please enter a valid 10-digit mobile number.'),
  },
  newsletter: {
    heading: 'Newsletter signup',
    subject: (d) => `Newsletter signup: ${d.email}`,
    validate: (d) => (EMAIL.test(d.email) ? '' : 'Please enter a valid email address.'),
  },
  'pharmacy-demo': {
    heading: 'Pharmacy software demo request',
    subject: (d) => `Pharmacy demo request: ${d.name}${d.business ? ` — ${d.business}` : ''}`,
    validate: (d) => {
      if (d.name.length < 2) return 'Please enter your name.';
      if (!PHONE.test(d.phone)) return 'Please enter a valid 10-digit mobile number.';
      if (d.email && !EMAIL.test(d.email)) return 'Please enter a valid email address.';
      return '';
    },
  },
};

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = parseBody(req);

  // Honeypot: real visitors never see or fill this field; bots usually do.
  if (body.website) return res.status(200).json({ success: true });

  const type = TYPES[body.type];
  if (!type) return res.status(400).json({ success: false, message: 'Unknown request type.' });

  const data = {
    name: text(body.name, 80),
    business: text(body.business, 120),
    phone: typeof body.phone === 'string' ? body.phone.replace(/\D/g, '').slice(0, 10) : '',
    email: text(body.email, 120),
    city: text(body.city, 80),
    message: text(body.message, 1000),
    page: text(body.page, 200),
  };

  const problem = type.validate(data);
  if (problem) return res.status(400).json({ success: false, message: problem });

  if (!isMailConfigured()) {
    console.error('lead: SMTP_USER / SMTP_PASS are not configured');
    return res.status(500).json({ success: false, message: 'This is temporarily unavailable. Please try again later.' });
  }

  const rows = [
    ['Request', type.heading],
    data.name && ['Name', data.name],
    data.business && ['Pharmacy', data.business],
    data.phone && ['Mobile', `+91 ${data.phone}`],
    data.email && ['Email', data.email],
    data.city && ['City', data.city],
    data.message && ['Message', data.message],
    ['Page', data.page || '—'],
  ].filter(Boolean);

  try {
    await sendRows({ subject: type.subject(data), heading: type.heading, rows, replyTo: data.email });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('lead: sendMail failed', err);
    return res.status(502).json({ success: false, message: 'We could not send this right now. Please try again in a minute.' });
  }
}
