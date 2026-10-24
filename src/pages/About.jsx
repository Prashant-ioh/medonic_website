import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import MediSlipLogo from '../components/MediSlipLogo';
import {
  Accessibility,
  ArrowRight,
  Award,
  HeartHandshake,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';

const highlights = [
  { icon: Stethoscope, value: 'Expert', label: 'Doctors across specialities', tone: 'bg-primary-50 text-primary-600' },
  { icon: HeartPulse, value: 'Patient-first', label: 'Care, every single visit', tone: 'bg-rose-50 text-rose-500' },
  { icon: Users, value: '150K+', label: 'Patients served', tone: 'bg-emerald-50 text-emerald-600' },
  { icon: Award, value: 'Certified', label: 'Quality & compliance', tone: 'bg-amber-50 text-amber-600' },
];

const values = [
  {
    icon: Accessibility,
    title: 'Radical accessibility',
    body: 'Every feature we ship is built to remove a barrier between a patient and the care they need — cost, distance, time, or language.',
  },
  {
    icon: ShieldCheck,
    title: 'Clinical trust first',
    body: 'Every doctor on MediSlip is credential-verified. We never trade trust for growth.',
  },
  {
    icon: HeartHandshake,
    title: 'Human, not transactional',
    body: 'Healthcare is personal. Our product decisions start with how a worried patient actually feels in the moment.',
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Intro */}
      <section className="relative -mt-18 overflow-hidden pt-18">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-40 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-mint" /> About us
            </span>
            <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink-900 sm:text-6xl">
              Care that feels <span className="text-brand-blue">human</span>, backed by real expertise.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-text-secondary">
              MediSlip is a team of experienced medical professionals. We combine clinical expertise
              with a genuinely human touch, so every patient feels heard, supported, and confident in
              their care plan from the very first visit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/consult"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition hover:bg-brand-blue"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#values"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-7 py-4 text-sm font-bold text-ink-900 transition hover:border-primary-300"
              >
                Our principles
              </a>
            </div>
          </div>

          {/* Photo collage */}
          <div className="relative grid grid-cols-[1.15fr_1fr] grid-rows-2 gap-4">
            <Reveal className="row-span-2">
              <Photo
                src="/images/about-team.jpg"
                alt="Surgical team in masks and caps looking down at the camera"
                priority
                className="h-full min-h-[420px] rounded-[32px] shadow-xl shadow-ink-900/10 ring-1 ring-border"
              />
            </Reveal>
            <Reveal delay={100}>
              <Photo
                src="/images/about-care.jpg"
                alt="Two people holding hands in a gesture of support"
                className="h-full rounded-[32px] ring-1 ring-border"
              />
            </Reveal>
            <Reveal delay={200}>
              <Photo
                src="/images/about-clinic.jpg"
                alt="Bright, modern clinic waiting area"
                className="h-full rounded-[32px] ring-1 ring-border"
              />
            </Reveal>

            <div className="animate-float absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink-900/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-900">150K+ patients served</p>
                <p className="text-xs text-text-secondary">and counting, across India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={i * 90} className="rounded-[28px] border border-border bg-white p-6 shadow-sm">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}>
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <p className="mt-6 text-2xl font-extrabold tracking-[-0.03em] text-ink-900">{item.value}</p>
                <p className="mt-1 text-sm text-text-secondary">{item.label}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section id="values" className="border-y border-border bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-mint" /> What we stand for
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">
              Principles behind every product decision
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal
                  key={value.title}
                  delay={i * 100}
                  className="group relative overflow-hidden rounded-[28px] border border-border bg-background/60 p-8 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-ink-900/[0.06]"
                >
                  <span className="absolute right-6 top-4 text-6xl font-extrabold tracking-[-0.04em] text-primary-100 transition group-hover:text-primary-200">
                    0{i + 1}
                  </span>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/25">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="relative mt-8 text-xl font-extrabold text-ink-900">{value.title}</h3>
                  <p className="relative mt-3 text-sm leading-6 text-text-secondary">{value.body}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[40px] bg-ink-900 px-6 py-16 text-center sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand-blue/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-mint/20 blur-3xl" />
          <MediSlipLogo className="relative mx-auto h-12 w-12" />
          <blockquote className="relative mx-auto mt-8 max-w-3xl text-2xl font-bold leading-snug tracking-[-0.02em] text-white sm:text-4xl">
            “We started MediSlip because good healthcare shouldn’t depend on your zip code, your
            schedule, or your bank balance.”
          </blockquote>
          <p className="relative mt-6 text-sm font-semibold text-brand-mint">— The MediSlip founding team</p>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
};

export default About;
