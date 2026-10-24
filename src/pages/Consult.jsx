import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BadgeCheck, CheckCircle2, Clock, Loader2, LockKeyhole, Send, Smartphone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Photo from '../components/Photo';
import { concerns, consultTypes, findConcern, specialities } from '../data/care';
import { useSession } from '../lib/session';

const PREFERRED_TIMES = ['As soon as possible', 'Morning (9am – 12pm)', 'Afternoon (12pm – 4pm)', 'Evening (4pm – 8pm)'];

const inputCls =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-text-secondary/70 focus:border-primary-400 focus:ring-4 focus:ring-primary-100';

// Same rules as api/consult-request.js, so patients see problems before submitting.
function validate(f) {
  if (!f.concern && !f.symptoms.trim()) return 'Please choose a concern or describe your symptoms.';
  if (!f.fullName.trim()) return 'Please enter your name.';
  if (!/^[6-9]\d{9}$/.test(f.phone)) return 'Please enter a valid 10-digit mobile number.';
  if (f.email && !/^\S+@\S+\.\S{2,}$/.test(f.email)) return 'Please enter a valid email address.';
  if (!/^\d{1,3}$/.test(f.age) || Number(f.age) < 1 || Number(f.age) > 120) return 'Please enter a valid age.';
  if (!f.gender) return 'Please select a gender.';
  if (!f.consent) return 'Please agree to be contacted about your request.';
  return '';
}

const Consult = () => {
  const [params] = useSearchParams();
  const session = useSession();

  const [form, setForm] = useState({
    concern: findConcern(params.get('concern'))?.id || '',
    consultType: consultTypes.find((t) => t.id === params.get('type'))?.id || 'video',
    symptoms: params.get('q') || '',
    fullName: session?.user?.fullName || '',
    phone: '',
    email: session?.user?.email || '',
    age: '',
    gender: '',
    city: '',
    preferredTime: PREFERRED_TIMES[0],
    consent: false,
    website: '', // honeypot
  });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const concernItem = findConcern(form.concern);
  const typeItem = consultTypes.find((t) => t.id === form.consultType);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };
  const set = (key) => (e) => {
    const { value, checked, type } = e.target;
    let v = type === 'checkbox' ? checked : value;
    if (key === 'phone') v = value.replace(/\D/g, '').slice(0, 10);
    if (key === 'age') v = value.replace(/\D/g, '').slice(0, 3);
    update(key, v);
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate(form);
    if (problem) {
      setError(problem);
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/consult-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          concern: concernItem?.title || '',
          consultType: typeItem?.title || '',
          symptoms: form.symptoms.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.message || 'We could not send your request. Please try again.');
      setSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Could not reach MediSlip. Check your connection and try again.' : err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="relative">
        <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8 lg:pt-12">
          <section className="animate-fade-in-up rounded-[32px] border border-border bg-white p-6 shadow-xl shadow-ink-900/[0.04] sm:p-10">
            {sent ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-success">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-3xl">
                  Request sent, {form.fullName.trim().split(' ')[0]}!
                </h1>
                <p className="mx-auto mt-3 max-w-md text-text-secondary">
                  Our care team will call you on <span className="font-semibold text-ink-900">+91 {form.phone}</span> to confirm your{' '}
                  {typeItem?.title.toLowerCase() || 'consultation'}.
                </p>

                <div className="mx-auto mt-8 max-w-md rounded-2xl bg-background p-5 text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-secondary">Your request</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-4"><dt className="text-text-secondary">Concern</dt><dd className="text-right font-semibold text-ink-900">{concernItem?.title || 'Described below'}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-text-secondary">Consult type</dt><dd className="font-semibold text-ink-900">{typeItem?.title}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-text-secondary">Preferred time</dt><dd className="font-semibold text-ink-900">{form.preferredTime}</dd></div>
                    {form.symptoms.trim() && <div className="border-t border-border pt-2 text-ink-600">“{form.symptoms.trim()}”</div>}
                  </dl>
                </div>

                <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600">
                  Back to home
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-3xl">Consult a doctor</h1>
                <p className="mt-2 text-text-secondary">Fill in the form and our care team will call you to confirm your consultation.</p>

                {/* Concern */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <Field label="What’s bothering you?" required className="sm:col-span-2">
                    <select value={form.concern} onChange={set('concern')} className={inputCls}>
                      <option value="">Select a concern or speciality</option>
                      <optgroup label="Common concerns">
                        {concerns.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Specialities">
                        {specialities.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </optgroup>
                    </select>
                  </Field>

                  <div className="sm:col-span-2">
                    <span className="text-sm font-semibold text-ink-900">
                      Consult type<span className="text-danger"> *</span>
                    </span>
                    <div role="radiogroup" aria-label="Consult type" className="mt-1.5 grid grid-cols-3 gap-2">
                      {consultTypes.map((t) => {
                        const Icon = t.icon;
                        const selected = form.consultType === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => update('consultType', t.id)}
                            className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-bold transition sm:flex-row sm:justify-center sm:text-sm ${
                              selected ? 'border-primary-600 bg-primary-50 text-primary-700 ring-4 ring-primary-100' : 'border-border text-ink-900 hover:border-primary-300'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {t.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Symptoms" hint="Optional" className="sm:col-span-2">
                    <textarea
                      value={form.symptoms}
                      onChange={set('symptoms')}
                      rows={3}
                      maxLength={2000}
                      placeholder="e.g. Fever since 2 days, mild headache"
                      className={`resize-none ${inputCls}`}
                    />
                  </Field>
                </div>

                <div className="my-8 border-t border-border" />

                {/* Contact details */}
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-secondary">Your details</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" required className="sm:col-span-2">
                    <input autoComplete="name" value={form.fullName} onChange={set('fullName')} maxLength={80} placeholder="Patient’s name" className={inputCls} />
                  </Field>
                  <Field label="Mobile number" required>
                    <div className="flex">
                      <span className="flex items-center rounded-l-xl border border-r-0 border-border bg-background px-3 text-sm font-semibold text-text-secondary">+91</span>
                      <input type="tel" inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" className={`${inputCls} rounded-l-none`} />
                    </div>
                  </Field>
                  <Field label="Email" hint="Optional">
                    <input type="email" autoComplete="email" value={form.email} onChange={set('email')} maxLength={120} placeholder="you@example.com" className={inputCls} />
                  </Field>
                  <Field label="Age" required>
                    <input inputMode="numeric" value={form.age} onChange={set('age')} placeholder="Years" className={inputCls} />
                  </Field>
                  <Field label="Gender" required>
                    <select value={form.gender} onChange={set('gender')} className={inputCls}>
                      <option value="" disabled>Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </Field>
                  <Field label="City" hint="Optional">
                    <input autoComplete="address-level2" value={form.city} onChange={set('city')} maxLength={80} placeholder="e.g. Lucknow" className={inputCls} />
                  </Field>
                  <Field label="Preferred time">
                    <select value={form.preferredTime} onChange={set('preferredTime')} className={inputCls}>
                      {PREFERRED_TIMES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Honeypot — hidden from people, tempting for bots */}
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} className="hidden" aria-hidden="true" />

                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-background p-4">
                  <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-0.5 h-4 w-4 accent-primary-600" />
                  <span className="text-sm leading-6 text-ink-600">
                    I agree to be contacted by MediSlip about this request by phone{form.email ? ' or email' : ''}.
                  </span>
                </label>

                {error && (
                  <p role="alert" className="mt-4 rounded-xl bg-danger-bg px-4 py-3 text-sm font-medium text-danger">
                    {error}
                  </p>
                )}

                <button
                  disabled={sending}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 py-4 text-sm font-bold text-white shadow-md shadow-primary-600/25 transition hover:bg-brand-blue disabled:cursor-wait disabled:opacity-70"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {sending ? 'Sending…' : 'Submit request'}
                </button>
              </form>
            )}
          </section>

          {/* Trust sidebar */}
          <aside>
            <div className="sticky top-24 space-y-4">
              <Photo
                src="/images/consult-doctor.jpg"
                alt="Smiling doctor with a stethoscope, seated"
                priority
                className="aspect-[4/5] rounded-[28px] ring-1 ring-border sm:aspect-[16/10] lg:aspect-[4/5]"
                imgClassName="object-top"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Doctors online now
                  </span>
                  <p className="mt-3 text-lg font-extrabold leading-tight tracking-[-0.02em]">Verified doctors, ready when you are</p>
                  <p className="mt-1 text-xs text-white/80">Most video consults connect in about 60 seconds.</p>
                </div>
              </Photo>

              <div className="rounded-[28px] border border-border bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-secondary">How it works</p>
                <ol className="mt-4 space-y-4">
                  {['Fill in this short form', 'Our care team calls you to confirm', 'Consult your doctor & get your MediSlip'].map((t, i) => (
                    <li key={t} className="flex items-start gap-3 text-sm font-semibold text-ink-900">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-mint text-xs font-extrabold text-brand-navy">{i + 1}</span>
                      {t}
                    </li>
                  ))}
                </ol>
              </div>

              <ul className="space-y-3 rounded-[28px] bg-ink-900 p-6 text-sm text-ink-100">
                <li className="flex gap-3"><BadgeCheck className="h-5 w-5 shrink-0 text-brand-mint" /> Verified, registered doctors only</li>
                <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-brand-mint" /> Same-day slots, no booking fees</li>
                <li className="flex gap-3"><LockKeyhole className="h-5 w-5 shrink-0 text-brand-mint" /> Private between you and your doctor</li>
                <li className="flex gap-3"><Smartphone className="h-5 w-5 shrink-0 text-brand-mint" /> Prescription delivered as a digital MediSlip</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const Field = ({ label, hint, required, className = '', children }) => (
  <label className={`block ${className}`}>
    <span className="flex items-baseline justify-between text-sm font-semibold text-ink-900">
      <span>
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      {hint && <span className="text-xs font-medium text-text-secondary">{hint}</span>}
    </span>
    <div className="mt-1.5">{children}</div>
  </label>
);

export default Consult;
