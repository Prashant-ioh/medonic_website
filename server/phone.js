// Shared mobile-number rules for the site forms and the API functions.
// Accepts what people actually type: "+91 92058 70544", "0920-5870544", "9205870544".
export function normalisePhone(raw) {
  let digits = String(raw ?? '').replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2); // +91 country code
  digits = digits.replace(/^0+/, ''); // leading trunk zero
  return digits.slice(0, 10);
}

export const isMobile = (digits) => /^[6-9]\d{9}$/.test(digits);

export const MOBILE_ERROR = 'Please enter a valid 10-digit mobile number. It should start with 6, 7, 8 or 9.';
