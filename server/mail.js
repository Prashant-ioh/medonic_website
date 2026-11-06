// Shared helper for the Vercel functions in api/. Every form on the site is emailed to MAIL_TO.
//
// Required environment variables (Vercel → Project → Settings → Environment Variables):
//   SMTP_USER  Gmail address that sends the email, e.g. prashantmishra4424@gmail.com
//   SMTP_PASS  16-character Gmail App Password (not the normal Gmail password)
// Optional:
//   MAIL_TO        Where submissions are delivered (defaults to prashantmishra4424@gmail.com)
//   MAIL_DRY_RUN   Set to "1" to log the email instead of sending it (local testing)
import nodemailer from 'nodemailer';

export const MAIL_TO = process.env.MAIL_TO || 'prashantmishra4424@gmail.com';

const dryRun = () => process.env.MAIL_DRY_RUN === '1';

export const isMailConfigured = () => dryRun() || !!(process.env.SMTP_USER && process.env.SMTP_PASS);

export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const parseBody = (req) => (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {});

const istNow = () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

function createTransport() {
  if (dryRun()) return nodemailer.createTransport({ jsonTransport: true });
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// Emails a simple key/value table. `rows` is an array of [label, value].
export async function sendRows({ subject, heading, rows, replyTo, footerHtml = '' }) {
  const submittedAt = istNow();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#101828">
      <h2 style="color:#0048FC;margin:0 0 4px">${escapeHtml(heading)}</h2>
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
      ${footerHtml}
    </div>`;

  const text = `${heading} (${submittedAt} IST)\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}`;

  const info = await createTransport().sendMail({
    from: `"MediSlip Website" <${process.env.SMTP_USER || 'no-reply@medislip.local'}>`,
    to: MAIL_TO,
    replyTo: replyTo || undefined,
    subject,
    text,
    html,
  });

  if (dryRun()) console.log('[mail dry-run]', info.message);
  return info;
}
