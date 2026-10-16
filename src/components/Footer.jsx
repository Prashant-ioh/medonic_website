import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MediSlipLogo from './MediSlipLogo';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog' },
      { label: 'Careers' },
      { label: 'Press' },
      { label: 'Contact us' },
    ],
  },
  {
    title: 'For patients',
    links: [
      { label: 'Search doctors', to: '/#services' },
      { label: 'Video consult', to: '/#services' },
      { label: 'Book lab tests', to: '/#services' },
      { label: 'Health articles' },
      { label: 'MediSlip app', to: '/#app' },
    ],
  },
  {
    title: 'For providers',
    links: [
      { label: 'Doctor profile' },
      { label: 'Practice growth' },
      { label: 'Hospital onboarding' },
      { label: 'Wellness plans' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help centre' },
      { label: 'Privacy policy' },
      { label: 'Terms & conditions' },
      { label: 'Healthcare directory' },
    ],
  },
];

const socials = ['Facebook', 'X', 'LinkedIn', 'YouTube'];

const FooterLink = ({ label, to }) => {
  const cls = 'text-sm text-ink-200 transition hover:text-white';
  return to ? (
    <Link to={to} className={cls}>{label}</Link>
  ) : (
    <a href="#" className={cls}>{label}</a>
  );
};

const Footer = () => (
  <footer className="relative overflow-hidden bg-ink-950 text-ink-200">
    <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <MediSlipLogo className="h-10 w-10" />
            <span className="wordmark text-2xl text-white">MediSlip</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-ink-200">
            Verified doctors, digital prescriptions and trusted lab tests — healthcare that fits
            around your life, not the other way round.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">{col.title}</h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}><FooterLink {...link} /></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-white">Get health tips in your inbox</p>
          <p className="mt-1 text-sm text-ink-200">One short email a month. No spam, ever.</p>
        </div>
        <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="newsletter" className="sr-only">Email address</label>
          <input
            id="newsletter"
            type="email"
            required
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white outline-none transition placeholder:text-ink-200/70 focus:border-brand-mint"
          />
          <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-mint px-5 py-3 text-sm font-bold text-brand-navy transition hover:bg-white">
            Subscribe
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row">
        <p>&copy; {new Date().getFullYear()} MediSlip. All rights reserved.</p>
        <div className="flex gap-5">
          {socials.map((s) => (
            <a key={s} href="#" className="transition hover:text-white">{s}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
