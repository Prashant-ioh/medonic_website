import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { concerns, specialities as appointments, tones } from '../data/care';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import MediSlipLogo from '../components/MediSlipLogo';
import { useGeolocation } from '../hooks/useGeolocation';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  FlaskConical,
  IndianRupee,
  Loader2,
  LockKeyhole,
  MapPin,
  Mic,
  PhoneOff,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Stethoscope,
  Syringe,
  Video,
} from 'lucide-react';

const suggestions = ['Dermatologist', 'Pediatrician', 'Fever', 'Diabetes check-up', 'Dentist'];

const stats = [
  { value: '20+', label: 'Years of experience' },
  { value: '95%', label: 'Patient satisfaction' },
  { value: '5,000+', label: 'Patients served yearly' },
  { value: '10+', label: 'Healthcare providers' },
];

const steps = [
  {
    icon: Search,
    title: 'Tell us what’s wrong',
    body: 'Search a symptom or speciality, or pick a concern. We match you with the right verified doctor.',
  },
  {
    icon: Video,
    title: 'Consult in minutes',
    body: 'Talk on video or visit a clinic nearby — same-day slots, no booking fees.',
  },
  {
    icon: FileText,
    title: 'Get your MediSlip',
    body: 'Your digital prescription, lab orders and follow-ups land in one secure slip on your phone.',
  },
];

const reasons = [
  { icon: ShieldCheck, title: 'Credential-verified doctors', body: 'Every registration and qualification is checked before a doctor can consult.' },
  { icon: Clock, title: 'Here around the clock', body: 'Video consults connect in about a minute, day or night, including holidays.' },
  { icon: IndianRupee, title: 'Transparent pricing', body: 'See the fee before you book. No booking charges, no surprises.' },
  { icon: LockKeyhole, title: 'Private by design', body: 'Your records stay between you and your doctor. We never sell health data.' },
];

const testimonials = [
  {
    quote: 'Booked a video consult at 11pm and was speaking to a doctor in under a minute. Genuinely changed how my family handles late-night health worries.',
    name: 'Ananya Rao',
    role: 'Bangalore',
    tone: 'blue',
  },
  {
    quote: 'The lab test booking and home sample collection was seamless. Reports were ready and explained clearly by a doctor the same evening.',
    name: 'Vikram Shah',
    role: 'Mumbai',
    tone: 'mint',
  },
  {
    quote: 'As a first-time mother, having a trusted gynecologist a tap away gave me so much peace of mind through the pregnancy.',
    name: 'Priya Menon',
    role: 'Chennai',
    tone: 'rose',
  },
];

const faqs = [
  {
    q: 'Are the doctors on MediSlip verified?',
    a: 'Yes. Every doctor’s medical registration and qualifications are checked before they can consult on MediSlip.',
  },
  {
    q: 'How quickly can I talk to a doctor?',
    a: 'Most video consultations connect within 60 seconds. In-clinic appointments usually have same-day slots.',
  },
  {
    q: 'Is my prescription valid at any pharmacy?',
    a: 'Your MediSlip is a digitally signed prescription from a registered doctor, which you can show or share with any pharmacy.',
  },
  {
    q: 'Is my health information private?',
    a: 'Your consultations and records are private to you and your doctor. We never sell personal health data.',
  },
];

const initials = (name) => name.split(' ').map((n) => n[0]).join('');

/* ---------- Small building blocks ---------- */

const Eyebrow = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 ${className}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-brand-mint" />
    {children}
  </span>
);

const SectionHeading = ({ eyebrow, title, body, align = 'left', action }) => (
  <div className={`flex flex-col gap-5 ${align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}>
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">{title}</h2>
      {body && <p className="mt-3 text-base leading-7 text-text-secondary">{body}</p>}
    </div>
    {action}
  </div>
);

const LiveDot = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-mint opacity-75" />
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
  </span>
);

const LocationChip = () => {
  const { city, status, detect } = useGeolocation();

  return (
    <button
      type="button"
      onClick={detect}
      title="Click to re-detect your location"
      className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-3 transition hover:bg-background sm:rounded-none sm:border-r sm:border-border"
    >
      {status === 'loading' ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary-600" />
      ) : (
        <MapPin className="h-4 w-4 shrink-0 text-primary-600" />
      )}
      <span className="max-w-[8rem] truncate text-sm font-semibold text-ink-900">
        {status === 'success' && city}
        {(status === 'loading' || status === 'idle') && 'Detecting…'}
        {status === 'error' && 'Set location'}
      </span>
    </button>
  );
};

/* ---------- Hero visual: doctor photo + booking card + prescription slip ---------- */

const slots = ['6:30 PM', '7:00 PM', '7:30 PM'];

const HeroVisual = () => {
  const [slot, setSlot] = useState(slots[0]);

  return (
    <div className="relative mx-auto h-[580px] w-full max-w-[520px]">
      {/* Photo frame */}
      <Photo
        src="/images/hero-doctor.jpg"
        alt="Doctor in a white coat with a stethoscope, arms folded"
        priority
        className="absolute inset-x-8 inset-y-0 rounded-[44px] shadow-2xl shadow-primary-600/25 ring-1 ring-white/70"
        imgClassName="object-top"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/75 via-ink-900/5 to-transparent" />
        <span className="absolute bottom-6 right-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
          <BadgeCheck className="h-3.5 w-3.5 text-brand-mint" /> Verified doctor
        </span>
      </Photo>

      {/* Prescription slip */}
      <div className="absolute right-0 top-[270px] w-52 rotate-[4deg] rounded-3xl bg-white p-4 shadow-xl shadow-ink-900/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MediSlipLogo className="h-5 w-5" />
            <span className="text-[11px] font-bold text-ink-900">e-Prescription</span>
          </div>
          <span className="rounded-full bg-success-bg px-2 py-0.5 text-[10px] font-bold text-success">Signed</span>
        </div>
        <p className="mt-3 text-2xl font-extrabold italic text-primary-600">℞</p>
        <div className="mt-1.5 space-y-2">
          {[
            ['Paracetamol 650', '1-0-1 · 3d'],
            ['Cetirizine 10', '0-0-1 · 5d'],
          ].map(([name, dose]) => (
            <div key={name} className="flex items-center justify-between rounded-xl bg-background px-3 py-2">
              <span className="text-[11px] font-bold text-ink-900">{name}</span>
              <span className="text-[10px] font-semibold text-text-secondary">{dose}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-dashed border-border pt-3">
          <span className="text-[10px] text-text-secondary">Dr. Rhea Kapoor</span>
          <span className="font-serif text-sm italic text-ink-600">R. Kapoor</span>
        </div>
      </div>

      {/* Booking card */}
      <div className="absolute bottom-6 left-0 w-[300px] rounded-3xl bg-white p-5 shadow-2xl shadow-ink-900/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-brand-blue text-base font-bold text-white">
              RK
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-mint" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-sm font-bold text-ink-900">
              Dr. Rhea Kapoor <BadgeCheck className="h-4 w-4 text-primary-600" />
            </p>
            <p className="text-xs text-text-secondary">Cardiologist · 12 yrs exp.</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
            <Star className="h-3 w-3 fill-current" /> 4.9
          </div>
        </div>

        <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-text-secondary">Today’s slots</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {slots.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSlot(s)}
              className={`rounded-xl border py-2 text-xs font-bold transition ${
                slot === s
                  ? 'border-primary-600 bg-primary-600 text-white shadow-md shadow-primary-600/25'
                  : 'border-border text-ink-900 hover:border-primary-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <a
          href="/consult?type=video"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-ink-900 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
        >
          <CalendarCheck className="h-4 w-4" /> Book for {slot}
        </a>
      </div>

      {/* Floating chips */}
      <div className="animate-float absolute left-0 top-8 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink-900/10">
        <LiveDot />
        <div>
          <p className="text-xs font-bold text-ink-900">Doctors online now</p>
          <p className="text-[11px] text-text-secondary">Connect in ~60 secs</p>
        </div>
      </div>

      <div className="animate-float absolute right-0 top-10 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink-900/10 [animation-delay:1.5s]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-bg text-success">
          <FlaskConical className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-ink-900">Lab report ready</p>
          <p className="text-[11px] text-text-secondary">Reviewed by your doctor</p>
        </div>
      </div>
    </div>
  );
};

/* ---------- Page ---------- */

const Home = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const scrollAppointments = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/consult?q=${encodeURIComponent(query.trim())}` : '/consult');
  };

  const submitPhone = (e) => {
    e.preventDefault();
    setPhoneError(/^[6-9]\d{9}$/.test(phone) ? '' : 'Enter a valid 10-digit mobile number');
    // TODO: call the SMS-link API once it is available.
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section id="home" className="relative -mt-18 overflow-hidden pt-18">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-brand-mint/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 py-1.5 pl-1.5 pr-4 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
              Registered doctors, available 24/7
            </span>

            <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink-900 sm:text-6xl lg:text-[4.2rem]">
              Healthcare that meets you{' '}
              <span className="relative whitespace-nowrap text-brand-blue">
                where you are
                <svg className="absolute -bottom-2 left-0 h-3 w-full text-brand-mint" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 9 C 50 2, 150 2, 198 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-text-secondary">
              Private online consultations with verified doctors across every speciality, plus
              trusted lab tests and surgeries — all in one place.
            </p>

            <form
              onSubmit={searchSubmit}
              className="mt-8 flex max-w-xl flex-col gap-1 rounded-2xl border border-border bg-white p-2 shadow-xl shadow-ink-900/[0.06] transition focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-100 sm:flex-row sm:items-center"
            >
              <LocationChip />
              <label className="flex flex-1 items-center gap-2 px-3 py-3">
                <Search className="h-4 w-4 shrink-0 text-text-secondary" />
                <span className="sr-only">Search</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search doctors, clinics, symptoms…"
                  className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-text-secondary"
                />
              </label>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary-600/25 transition hover:bg-brand-blue">
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-text-secondary">Popular:</span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-ink-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex -space-x-2.5">
                {['AR', 'VS', 'PM', 'KD'].map((n, i) => (
                  <span
                    key={n}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold ring-1 ${Object.values(tones)[i]}`}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  <span className="ml-1 text-sm font-bold text-ink-900">4.9</span>
                </div>
                <p className="text-sm text-text-secondary">Trusted by 5,000+ patients every year</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <HeroVisual />
          </div>

          {/* Compact photo for phones */}
          <Photo
            src="/images/hero-doctor.jpg"
            alt="Doctor in a white coat with a stethoscope, arms folded"
            priority
            className="aspect-[4/3] rounded-[32px] shadow-xl shadow-primary-600/15 md:hidden"
            imgClassName="object-[50%_20%]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-5 text-white">
              <LiveDot />
              <div>
                <p className="text-sm font-bold">Doctors online now</p>
                <p className="text-xs text-white/80">Connect on video in about 60 seconds</p>
              </div>
            </div>
          </Photo>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid grid-cols-2 overflow-hidden rounded-3xl border border-border bg-white sm:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 py-7 sm:px-8 ${i % 2 ? 'border-l border-border' : ''} ${i > 1 ? 'border-t border-border sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''}`}
            >
              <p className="text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Services — bento */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our services"
            title="Everything your health needs, in one app"
            body="From a quick video consult to a planned surgery — pick what you need and we’ll handle the rest."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* Video consult — photo card */}
          <Reveal className="md:col-span-2 lg:row-span-2">
            <a
              href="/consult?type=video"
              className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-[32px] bg-ink-900 p-8 text-white shadow-xl shadow-primary-600/20"
            >
              <img
                src="/images/service-video.jpg"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-900/60 to-brand-blue/20" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <Video className="h-7 w-7" />
              </div>
              <h3 className="relative mt-6 text-3xl font-extrabold tracking-[-0.03em]">Instant video consultation</h3>
              <p className="relative mt-3 max-w-sm text-primary-100">
                Connect with a verified doctor within 60 seconds — day or night, from wherever you are.
              </p>
              <ul className="relative mb-8 mt-5 space-y-2.5 text-sm font-medium">
                {['Private & secure video call', 'Digital prescription after every consult', 'No booking fees'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-mint" /> {t}
                  </li>
                ))}
              </ul>
              <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-blue transition group-hover:gap-3">
                Start a consultation <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </Reveal>

          {/* Find doctors — split card */}
          <Reveal delay={80} className="md:col-span-2">
            <a
              href="/consult?type=clinic"
              className="group grid h-full overflow-hidden rounded-[32px] border border-border bg-white transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-ink-900/[0.06] sm:grid-cols-[1.1fr_1fr]"
            >
              <div className="flex flex-col justify-between gap-8 p-7">
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${tones.blue}`}>
                    <Stethoscope className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-900 transition group-hover:border-primary-600 group-hover:bg-primary-600 group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold tracking-[-0.02em] text-ink-900">Find doctors near you</h3>
                  <p className="mt-1 text-sm text-text-secondary">Confirmed in-clinic appointments, same day.</p>
                </div>
              </div>
              <Photo
                src="/images/service-clinic.jpg"
                alt="Doctor explaining a scan to a patient at a clinic"
                className="min-h-[200px] sm:min-h-0"
                imgClassName="transition-transform duration-700 group-hover:scale-105"
              />
            </a>
          </Reveal>

          {[
            { title: 'Lab tests', body: 'Home sample collection', icon: FlaskConical, tone: 'mint', href: '/consult', image: '/images/service-lab.jpg', alt: 'Labelled blood sample tubes in a rack' },
            { title: 'Surgeries', body: 'Safe & trusted centres', icon: Syringe, tone: 'amber', href: '/consult?concern=surgery', image: '/images/service-surgery.jpg', alt: 'Surgical team at work in an operating theatre' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={160 + i * 80}>
                <a
                  href={s.href}
                  className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-border bg-white transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-ink-900/[0.06]"
                >
                  <Photo src={s.image} alt={s.alt} className="aspect-[16/10]" imgClassName="transition-transform duration-700 group-hover:scale-105">
                    <div className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${tones[s.tone]}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                  </Photo>
                  <div className="flex flex-1 items-end justify-between gap-3 p-6">
                    <div>
                      <h3 className="text-xl font-extrabold tracking-[-0.02em] text-ink-900">{s.title}</h3>
                      <p className="mt-1 text-sm text-text-secondary">{s.body}</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-ink-900 transition group-hover:border-primary-600 group-hover:bg-primary-600 group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Health concerns */}
      <section id="specialities" className="border-y border-border bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Consult online"
              title="Top doctors for any health concern"
              body="Private online consultations with verified specialists — pick what’s bothering you."
              action={
                <a
                  href="/consult"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-bold text-ink-900 transition hover:border-primary-300 hover:text-primary-700"
                >
                  All specialities <ArrowRight className="h-4 w-4" />
                </a>
              }
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {concerns.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.title} delay={i * 60}>
                  <a
                    href={`/consult?concern=${c.id}`}
                    className="group flex h-full flex-col items-center rounded-3xl border border-border bg-background/60 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:bg-white hover:shadow-xl hover:shadow-ink-900/[0.06]"
                  >
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full ring-8 ring-white transition-transform duration-300 group-hover:scale-105 ${tones[c.tone]}`}>
                      <Icon className="h-9 w-9" strokeWidth={1.5} />
                    </div>
                    <p className="mt-4 flex-1 text-sm font-bold leading-snug text-ink-900">{c.title}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-600">
                      Consult now <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Reveal className="relative">
            <Photo
              src="/images/doctor-laptop.jpg"
              alt="Doctor typing on a laptop with a stethoscope on the desk"
              className="aspect-[4/3] rounded-[40px] shadow-2xl shadow-ink-900/10 ring-1 ring-border"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 to-transparent" />
            </Photo>

            <div className="animate-float absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink-900/10 sm:left-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-900">MediSlip sent</p>
                <p className="text-xs text-text-secondary">Prescription · 2 min after consult</p>
              </div>
            </div>
            <div className="animate-float absolute -top-5 right-5 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink-900/10 [animation-delay:2s] sm:right-8">
              <LiveDot />
              <p className="text-sm font-bold text-ink-900">Doctor connected</p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">
                From symptom to prescription in three steps
              </h2>
            </Reveal>
            <ol className="relative mt-10 space-y-8">
              <div className="pointer-events-none absolute bottom-10 left-7 top-10 border-l-2 border-dashed border-primary-200" />
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal as="li" key={step.title} delay={i * 120} className="relative flex gap-5">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-lg shadow-ink-900/[0.06] ring-1 ring-border">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-mint text-[11px] font-extrabold text-brand-navy ring-4 ring-background">
                        {i + 1}
                      </span>
                    </div>
                    <div className="pt-1">
                      <h3 className="text-lg font-extrabold text-ink-900">{step.title}</h3>
                      <p className="mt-1.5 max-w-md text-sm leading-6 text-text-secondary">{step.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
            <Reveal delay={360} className="mt-10">
              <a
                href="/consult"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition hover:bg-brand-blue"
              >
                Start a consultation <ArrowRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* In-clinic appointments */}
      <section className="overflow-hidden border-y border-border bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Visit a clinic"
              title="Book an in-clinic appointment"
              body="Find experienced doctors across all specialities, near you."
              action={
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Scroll left"
                    onClick={() => scrollAppointments(-1)}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-ink-900 transition hover:border-primary-600 hover:bg-primary-600 hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Scroll right"
                    onClick={() => scrollAppointments(1)}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-ink-900 transition hover:border-primary-600 hover:bg-primary-600 hover:text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              }
            />
          </Reveal>

          <div ref={scrollRef} className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {appointments.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.title}
                  href={`/consult?concern=${item.id}&type=clinic`}
                  className="group w-[280px] shrink-0 snap-start rounded-[28px] border border-border bg-background/60 p-3 transition duration-300 hover:border-primary-200 hover:bg-white hover:shadow-xl hover:shadow-ink-900/[0.06] sm:w-[300px]"
                >
                  <Photo src={item.image} alt={item.alt} className="aspect-[4/3] rounded-[22px]" imgClassName="transition-transform duration-700 group-hover:scale-105">
                    <div className={`absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${tones[item.tone]}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                  </Photo>
                  <div className="p-3 pt-5">
                    <h3 className="text-base font-extrabold text-ink-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{item.subtitle}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-600">
                      Book a visit <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why MediSlip */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>Why MediSlip</Eyebrow>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">
                Care your whole family can rely on
              </h2>
              <p className="mt-3 max-w-lg text-base leading-7 text-text-secondary">
                From a child’s midnight fever to a parent’s routine check-up, the same trusted doctors are a tap away.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {reasons.map((r, i) => {
                const Icon = r.icon;
                return (
                  <Reveal key={r.title} delay={i * 90}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/25">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-ink-900">{r.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-text-secondary">{r.body}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal className="relative lg:order-first">
            <Photo
              src="/images/family.jpg"
              alt="Smiling father carrying two young children outdoors"
              className="aspect-[4/5] rounded-[40px] shadow-2xl shadow-ink-900/10 ring-1 ring-border sm:aspect-[5/4] lg:aspect-[4/5]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
                <div>
                  <p className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900">95%</p>
                  <p className="text-xs font-semibold text-text-secondary">Patient satisfaction</p>
                </div>
                <div className="h-10 border-l border-border" />
                <div>
                  <p className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900">24/7</p>
                  <p className="text-xs font-semibold text-text-secondary">Doctors available</p>
                </div>
                <div className="h-10 border-l border-border" />
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-lg font-extrabold text-ink-900">4.9</span>
                </div>
              </div>
            </Photo>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className="border-y border-border bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading align="center" eyebrow="Real stories" title="Loved by patients across India" />
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <figure className="flex h-full flex-col rounded-[28px] border border-border bg-background/60 p-7 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-ink-900/[0.06]">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, s) => <Star key={s} className="h-4 w-4 fill-current" />)}
                  </div>
                  <blockquote className="mt-5 flex-1 text-[15px] leading-7 text-ink-600">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-1 ${tones[t.tone]}`}>
                      {initials(t.name)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{t.name}</p>
                      <p className="text-xs text-text-secondary">Patient · {t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* App download */}
      <section id="app" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[40px] bg-ink-900 px-6 py-14 sm:px-12 lg:px-16 lg:py-0">
          <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-brand-blue/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand-mint/20 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div className="lg:py-16">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-mint">
                <Smartphone className="h-4 w-4" /> MediSlip app
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
                Your doctor, in your pocket.
              </h2>
              <p className="mt-4 max-w-md leading-7 text-ink-200">
                Video consultations, prescriptions and lab reports — all synced to one app, available 24/7.
              </p>

              <form onSubmit={submitPhone} noValidate className="mt-8 max-w-md">
                <label htmlFor="app-phone" className="text-sm font-semibold text-white">Get the download link by SMS</label>
                <div className={`mt-3 flex items-center gap-2 rounded-2xl border bg-white/[0.06] p-1.5 transition focus-within:border-brand-mint ${phoneError ? 'border-danger' : 'border-white/15'}`}>
                  <span className="pl-3 text-sm font-semibold text-ink-200">+91</span>
                  <input
                    id="app-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      setPhoneError('');
                    }}
                    placeholder="Mobile number"
                    aria-invalid={!!phoneError}
                    className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-ink-200/60"
                  />
                  <button className="shrink-0 rounded-xl bg-brand-mint px-5 py-2.5 text-sm font-bold text-brand-navy transition hover:bg-white">
                    Send link
                  </button>
                </div>
                {phoneError && <p className="mt-2 text-sm text-red-300">{phoneError}</p>}
              </form>

              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  ['GET IT ON', 'Google Play'],
                  ['Download on the', 'App Store'],
                ].map(([top, name]) => (
                  <a key={name} href="#" className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/30 px-5 py-2.5 text-white transition hover:border-white/40">
                    <Smartphone className="h-6 w-6" />
                    <span className="leading-tight">
                      <span className="block text-[10px] uppercase tracking-wide text-ink-200">{top}</span>
                      <span className="block text-sm font-bold">{name}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Phone mockup with a live video consult */}
            <div className="relative flex justify-center lg:justify-end lg:pt-16">
              <div className="w-64 rounded-t-[44px] border-[10px] border-b-0 border-ink-700 bg-ink-800 p-2 pb-0 shadow-2xl lg:w-72">
                <div className="mx-auto mb-2 h-5 w-24 rounded-full bg-ink-950" />
                <Photo
                  src="/images/app-doctor.jpg"
                  alt="Doctor in scrubs smiling on a video call"
                  className="h-[380px] rounded-t-[30px]"
                  imgClassName="object-top"
                >
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-950/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-950/80 to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-white">
                    <div className="flex items-center gap-2">
                      <MediSlipLogo className="h-6 w-6" />
                      <div className="leading-tight">
                        <p className="text-xs font-bold">Dr. Rhea Kapoor</p>
                        <p className="text-[10px] text-white/80">Cardiologist</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> 04:12
                    </span>
                  </div>
                  <div className="absolute right-4 top-16 h-24 w-[72px] overflow-hidden rounded-2xl border-2 border-white/70 bg-gradient-to-b from-brand-mint/80 to-emerald-500/80 shadow-lg" />
                  <div className="absolute inset-x-0 bottom-6 flex justify-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"><Mic className="h-5 w-5" /></span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-danger text-white shadow-lg"><PhoneOff className="h-5 w-5" /></span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"><Video className="h-5 w-5" /></span>
                  </div>
                </Photo>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">Questions, answered</h2>
          <p className="mt-3 max-w-sm leading-7 text-text-secondary">
            Can’t find what you’re looking for? Our care team is happy to help.
          </p>
        </Reveal>
        <Reveal className="divide-y divide-border rounded-[28px] border border-border bg-white px-6">
          {faqs.map((f, i) => (
            <details key={f.q} className="group py-5" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-primary-600 transition group-open:rotate-45 group-open:bg-primary-600 group-open:text-white">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-3 pr-12 text-sm leading-6 text-text-secondary">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-brand-blue to-primary-500 px-6 py-16 text-center sm:px-12">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 invert" />
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-brand-mint/40 blur-3xl" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Your health can’t wait. Neither should you.
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-primary-100">
            Talk to a verified doctor in minutes — no queues, no booking fees.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/consult"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand-blue shadow-xl transition hover:bg-brand-mint hover:text-brand-navy"
            >
              Talk to a doctor now <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#specialities"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Browse specialities
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
