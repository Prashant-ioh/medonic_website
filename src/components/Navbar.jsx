import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import MediSlipLogo from './MediSlipLogo';
import { useSession } from '../lib/session';

const links = [
  { label: 'Services', to: '/#services' },
  { label: 'Specialities', to: '/#specialities' },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Stories', to: '/#stories' },
  { label: 'About', to: '/about' },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const session = useSession();
  const firstName = session?.user?.fullName?.split(' ')[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (to) => to === pathname;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-border/70 bg-white/85 shadow-[0_1px_20px_-12px_rgba(5,26,64,0.25)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <MediSlipLogo className="h-9 w-9" />
          <span className="wordmark text-[22px] text-brand-navy">MediSlip</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-white/70 p-1 text-sm font-semibold text-text-secondary lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`rounded-full px-4 py-2 transition ${
                isActive(link.to) ? 'bg-primary-50 text-primary-700' : 'hover:bg-background hover:text-ink-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden items-center gap-2 px-4 py-2.5 text-sm font-semibold text-ink-900 transition hover:text-primary-700 sm:inline-flex"
          >
            {session ? (
              <>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-xs font-extrabold text-primary-600">
                  {(firstName || 'P').charAt(0)}
                </span>
                {firstName || 'Account'}
              </>
            ) : (
              'Log in'
            )}
          </Link>
          <Link
            to="/consult"
            className="hidden items-center gap-1.5 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ink-900/15 transition hover:bg-primary-600 sm:inline-flex"
          >
            Consult now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-ink-900 transition hover:border-primary-300 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pb-6 pt-2 sm:px-6">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold text-ink-900 transition hover:bg-primary-50"
            >
              {link.label}
              <ArrowRight className="h-4 w-4 text-text-secondary" />
            </Link>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-border bg-white py-3 text-center text-sm font-semibold text-ink-900"
            >
              {session ? firstName || 'Account' : 'Log in'}
            </Link>
            <Link
              to="/consult"
              onClick={() => setOpen(false)}
              className="rounded-full bg-primary-600 py-3 text-center text-sm font-semibold text-white"
            >
              Consult now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
