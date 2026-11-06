// Posts the small site forms (app link by SMS, newsletter) to our own Vercel function,
// which emails them to the MediSlip team. Throws an Error with a user-facing message.
export async function sendLead(payload) {
  let res;
  try {
    res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, page: window.location.pathname }),
    });
  } catch {
    throw new Error('Could not reach MediSlip. Check your connection and try again.');
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) throw new Error(data?.message || 'Something went wrong. Please try again.');
  return data;
}
