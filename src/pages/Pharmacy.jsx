import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import { BillCard, ExpiryChip } from '../components/PharmacyMock';
import { sendLead } from '../lib/leads';
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  CalendarClock,
  CheckCircle2,
  CloudUpload,
  FileText,
  Headset,
  Hospital,
  Loader2,
  MessageCircle,
  Monitor,
  Pill,
  Plus,
  Receipt,
  ScanBarcode,
  Store,
  Truck,
  Warehouse,
} from 'lucide-react';

const inputCls =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-text-secondary/70 focus:border-primary-400 focus:ring-4 focus:ring-primary-100';

const features = [
  {
    icon: Receipt,
    title: 'Billing in seconds',
    body: 'Scan a barcode or type two letters of a medicine name. GST invoices print or go out on WhatsApp instantly.',
  },
  {
    icon: Boxes,
    title: 'Batch & expiry tracking',
    body: 'Every strip is tracked by batch. Get alerts 30, 60 and 90 days before expiry so nothing goes to waste.',
  },
  {
    icon: Truck,
    title: 'Purchases & suppliers',
    body: 'Record purchase bills, track credit with distributors and reorder low stock in one click.',
  },
  {
    icon: FileText,
    title: 'MediSlip prescriptions',
    body: 'Prescriptions from MediSlip doctors arrive in your queue, pre-filled. Dispense, bill, done.',
  },
  {
    icon: BarChart3,
    title: 'Reports & GST filing',
    body: 'Daily sales, margins, fast and slow movers, plus GSTR-ready reports your accountant will love.',
  },
  {
    icon: CloudUpload,
    title: 'Secure cloud backup',
    body: 'Your data is backed up automatically and encrypted. Change computers without losing a single bill.',
  },
];

const extras = [
  { icon: ScanBarcode, label: 'Barcode scanning' },
  { icon: MessageCircle, label: 'WhatsApp bills & refill reminders' },
  { icon: Store, label: 'Multi-counter & multi-store' },
  { icon: Monitor, label: 'Works on any Windows PC' },
  { icon: CalendarClock, label: 'Schedule H / H1 register' },
  { icon: Headset, label: 'Phone support, 7 days a week' },
];

const steps = [
  {
    title: 'Book a free demo',
    body: 'Tell us about your pharmacy. We show you the software on a call or at your counter.',
  },
  {
    title: 'We set everything up',
    body: 'Our team loads your stock, GST details and supplier list. Migration from your old software is included.',
  },
  {
    title: 'Start billing the same day',
    body: 'Your staff learn it in an hour. We stay on the phone until the first bills are out.',
  },
];

const audiences = [
  { icon: Store, title: 'Retail chemists', body: 'Single-counter medical stores that want faster billing and zero expiry losses.' },
  { icon: Hospital, title: 'Hospital pharmacies', body: 'In-house pharmacies that need ward indents, IPD billing and doctor-wise reports.' },
  { icon: Warehouse, title: 'Distributors', body: 'Wholesalers managing credit, schemes and hundreds of retailer accounts.' },
];

const faqs = [
  {
    q: 'Do I need the internet to bill?',
    a: 'No. Billing works offline on your PC and syncs to the cloud whenever you are back online.',
  },
  {
    q: 'Can I move my data from my current software?',
    a: 'Yes. We import your stock, customers and suppliers from Excel or from most popular pharmacy software as part of setup.',
  },
  {
    q: 'Is it GST compliant?',
    a: 'Yes. Invoices carry HSN codes and GST breakup, and the reports are ready for GSTR-1 and GSTR-3B filing.',
  },
  {
    q: 'How much does it cost?',
    a: 'Pricing depends on the number of counters and stores. Book a demo and we will share a plan that fits your pharmacy.',
  },
];

function validate(f) {
  if (f.name.trim().length < 2) return 'Please enter your name.';
  if (!/^[6-9]\d{9}$/.test(f.phone)) return 'Please enter a valid 10-digit mobile number.';
  if (f.email.trim() && !/^\S+@\S+\.\S{2,}$/.test(f.email.trim())) return 'Please enter a valid email address.';
  return '';
}

const Field = ({ label, required, className = '', children }) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-semibold text-ink-900">
      {label}
      {required && <span className="text-danger"> *</span>}
    </span>
    <div className="mt-1.5">{children}</div>
  </label>
);

const Eyebrow = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 ${className}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-brand-mint" />
    {children}
  </span>
);

const LivePill = ({ dark = false }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
      dark ? 'bg-brand-mint/15 text-brand-mint ring-1 ring-brand-mint/40' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    }`}
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
    Live now
  </span>
);

const empty = { name: '', business: '', phone: '', email: '', city: '', message: '', website: '' };

const DemoForm = () => {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: key === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value }));
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate(form);
    if (problem) {
      setError(problem);
      return;
    }
    setStatus('sending');
    try {
      await sendLead({
        type: 'pharmacy-demo',
        name: form.name.trim(),
        business: form.business.trim(),
        phone: form.phone,
        email: form.email.trim(),
        city: form.city.trim(),
        message: form.message.trim(),
        website: form.website,
      });
      setStatus('sent');
    } catch (err) {
      setStatus('idle');
      setError(err.message);
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="flex h-full flex-col items-center justify-center rounded-[28px] border border-border bg-white p-10 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.03em] text-ink-900">Demo request received</h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-text-secondary">
          Thanks, {form.name.trim().split(' ')[0]}. Our pharmacy team will call you on{' '}
          <span className="font-bold text-ink-900">+91 {form.phone}</span> within one working day to fix a time.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-[28px] border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required>
          <input className={inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Rahul Verma" autoComplete="name" />
        </Field>
        <Field label="Pharmacy / business name">
          <input className={inputCls} value={form.business} onChange={set('business')} placeholder="e.g. Verma Medicos" autoComplete="organization" />
        </Field>
        <Field label="Mobile number" required>
          <div className="flex items-center rounded-xl border border-border bg-white transition focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100">
            <span className="pl-4 text-sm font-semibold text-text-secondary">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-ink-900 outline-none placeholder:text-text-secondary/70"
              value={form.phone}
              onChange={set('phone')}
              placeholder="10-digit number"
              autoComplete="tel-national"
            />
          </div>
        </Field>
        <Field label="Email">
          <input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label="City">
          <input className={inputCls} value={form.city} onChange={set('city')} placeholder="e.g. Ghaziabad" autoComplete="address-level2" />
        </Field>
        <Field label="Anything we should know?" className="sm:col-span-2">
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={form.message}
            onChange={set('message')}
            placeholder="Number of counters, current software, best time to call…"
          />
        </Field>
        {/* Honeypot: hidden from people, usually filled by bots. */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
          </label>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <button
        disabled={status === 'sending'}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition hover:bg-brand-blue disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {status === 'sending' ? 'Sending…' : 'Book my free demo'}
      </button>
      <p className="mt-3 text-center text-xs text-text-secondary">No payment, no commitment. We only use your details to arrange the demo.</p>
    </form>
  );
};

const Pharmacy = () => {
  useEffect(() => {
    const previous = document.title;
    document.title = 'MediSlip Pharmacy Software — Billing, inventory & GST for chemists';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative -mt-18 overflow-hidden pt-18">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-brand-mint/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-28 lg:pt-20">
          <div className="animate-fade-in-up">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-bold text-ink-900 shadow-sm">
                <span aria-hidden="true">💊</span> MediSlip <span className="text-text-secondary">|</span> Pharmacy Software
              </span>
              <LivePill />
            </div>
            <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink-900 sm:text-6xl">
              Run your pharmacy from <span className="text-brand-blue">one screen</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-text-secondary">
              Billing, stock, expiry alerts, suppliers and GST reports, built for Indian chemists. Now live, with
              prescriptions from MediSlip doctors flowing straight to your counter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition hover:bg-brand-blue"
              >
                Book a free demo <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-7 py-4 text-sm font-bold text-ink-900 transition hover:border-primary-300"
              >
                See what it does
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink-600">
              {['Free setup & data migration', 'Works offline', 'GST-ready'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative pb-24 sm:pb-28">
            <Reveal>
              <Photo
                src="/images/pharmacy-store.jpg"
                alt="Bright modern pharmacy with white shelves of medicines"
                priority
                className="aspect-[4/3] rounded-[40px] shadow-2xl shadow-ink-900/10 ring-1 ring-border"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
                <ExpiryChip className="animate-float absolute right-5 top-5" />
              </Photo>
            </Reveal>
            <Reveal delay={150} className="absolute bottom-0 left-4 sm:left-8">
              <BillCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-border bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>Everything a counter needs</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">
              Less time on the keyboard, more time with customers
            </h2>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              We built MediSlip Pharmacy with working chemists, so every screen is designed around how a busy counter actually runs.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal
                  key={f.title}
                  delay={i * 80}
                  className="group rounded-[28px] border border-border bg-background/60 p-7 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-ink-900/[0.06]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/25">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 text-lg font-extrabold text-ink-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{f.body}</p>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-8 grid gap-3 rounded-[28px] border border-border bg-background/60 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((x) => {
              const Icon = x.icon;
              return (
                <div key={x.label} className="flex items-center gap-3 text-sm font-semibold text-ink-900">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 ring-1 ring-border">
                    <Icon className="h-4 w-4" />
                  </span>
                  {x.label}
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Audiences + photo */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Photo
              src="/images/pharmacy-pills.jpg"
              alt="Assorted blister packs of tablets and capsules"
              className="aspect-[4/5] rounded-[40px] shadow-2xl shadow-ink-900/10 ring-1 ring-border sm:aspect-[5/4] lg:aspect-[4/5]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 grid grid-cols-3 gap-2 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
                {[
                  ['0', 'Expired stock'],
                  ['3 sec', 'Average bill'],
                  ['100%', 'GST-ready'],
                ].map(([v, l]) => (
                  <div key={l}>
                    <p className="text-xl font-extrabold tracking-[-0.03em] text-ink-900">{v}</p>
                    <p className="text-[11px] font-semibold text-text-secondary">{l}</p>
                  </div>
                ))}
              </div>
            </Photo>
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>Built for</Eyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">
                From a single counter to a chain of stores
              </h2>
            </Reveal>
            <div className="mt-10 space-y-6">
              {audiences.map((a, i) => {
                const Icon = a.icon;
                return (
                  <Reveal key={a.title} delay={i * 90} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-ink-900">{a.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-text-secondary">{a.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>Getting started</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">Live at your counter in a day</h2>
          </Reveal>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 100} className="relative rounded-[28px] border border-border bg-background/60 p-7">
                <span className="text-5xl font-extrabold tracking-[-0.04em] text-primary-200">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-extrabold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Demo form */}
      <section id="demo" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Free demo</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">See it running on your own stock</h2>
            <p className="mt-3 max-w-md leading-7 text-text-secondary">
              Leave your details and our pharmacy team will call you within one working day. The demo takes 20 minutes, on a
              call or at your store.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                [Building2, 'Setup and data migration included'],
                [Headset, 'Phone support, 7 days a week'],
                [Pill, 'Prescriptions from MediSlip doctors, built in'],
              ].map(([Icon, t]) => (
                <li key={t} className="flex items-center gap-3 text-sm font-semibold text-ink-900">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <DemoForm />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">Questions chemists ask us</h2>
            <p className="mt-3 max-w-sm leading-7 text-text-secondary">
              Something else on your mind? Ask on the demo call, or{' '}
              <Link to="/consult" className="font-semibold text-primary-600 hover:underline">talk to our team</Link>.
            </p>
          </Reveal>
          <Reveal className="divide-y divide-border rounded-[28px] border border-border bg-background/60 px-6">
            {faqs.map((f, i) => (
              <details key={f.q} className="group py-5" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-primary-600 ring-1 ring-border transition group-open:rotate-45 group-open:bg-primary-600 group-open:text-white">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 pr-12 text-sm leading-6 text-text-secondary">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[40px] bg-ink-900 px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand-blue/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-mint/20 blur-3xl" />
          <div className="relative flex justify-center"><LivePill dark /></div>
          <h2 className="relative mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Ready to bill faster and waste nothing?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-ink-200">
            Join the pharmacies already running on MediSlip. Setup is free and your data moves with you.
          </p>
          <div className="relative mt-8 flex justify-center">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full bg-brand-mint px-8 py-4 text-sm font-bold text-brand-navy shadow-xl transition hover:bg-white"
            >
              Book a free demo <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
};

export default Pharmacy;
