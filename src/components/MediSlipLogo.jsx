// MediSlip app icon: Electric Blue tile, white flowing "m", Mint Green dot.
export const LOGO_PATH =
  'M10.8 46.3 V34.1 A8.8 8.8 0 0 1 28.4 34.1 V42.3 A4.6 4.6 0 0 0 37.6 42.3 V38.3 A7.3 7.3 0 0 1 52.2 38.3 V50.3';

const MediSlipLogo = ({ className = 'h-8 w-8' }) => (
  <svg viewBox="0 0 64 64" className={`shrink-0 ${className}`} fill="none" role="img" aria-label="MediSlip">
    <rect width="64" height="64" rx="15" fill="#0048FC" />
    <path d={LOGO_PATH} stroke="#FFFFFF" strokeWidth="7.7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="49.5" cy="18.4" r="6.8" fill="#44E8BE" />
  </svg>
);

export default MediSlipLogo;
