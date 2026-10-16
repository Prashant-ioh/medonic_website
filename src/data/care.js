import {
  Activity,
  Apple,
  Baby,
  Brain,
  ClipboardPlus,
  Heart,
  HeartPulse,
  MessageCircle,
  Sparkles,
  Stethoscope,
  Thermometer,
  Building2,
  Video,
  VenusAndMars,
} from 'lucide-react';

/* Soft tinted icon tiles — one family of tints so the site reads as one system */
export const tones = {
  blue: 'bg-primary-50 text-primary-600 ring-primary-100',
  mint: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  rose: 'bg-rose-50 text-rose-500 ring-rose-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
  sky: 'bg-sky-50 text-sky-600 ring-sky-100',
};

// Health concerns (online consult) and in-clinic specialities share one id space so
// any "Consult" link can deep-link into /consult?concern=<id>.
export const concerns = [
  { id: 'pregnancy', title: 'Period doubts or pregnancy', icon: Heart, tone: 'rose' },
  { id: 'skin', title: 'Acne, pimple or skin issues', icon: Sparkles, tone: 'violet' },
  { id: 'sexual-health', title: 'Performance issues in bed', icon: VenusAndMars, tone: 'blue' },
  { id: 'fever', title: 'Cold, cough or fever', icon: Thermometer, tone: 'sky' },
  { id: 'child', title: 'Child not feeling well', icon: Baby, tone: 'amber' },
  { id: 'mental-health', title: 'Depression or anxiety', icon: Brain, tone: 'mint' },
];

export const specialities = [
  {
    id: 'gynecology',
    title: 'Gynecologist / Obstetrician',
    subtitle: "Women's health, pregnancy and infertility treatments",
    icon: HeartPulse,
    tone: 'rose',
  },
  {
    id: 'nutrition',
    title: 'Dietitian / Nutrition',
    subtitle: 'Eating right, weight management and sports nutrition',
    icon: Apple,
    tone: 'mint',
  },
  {
    id: 'physiotherapy',
    title: 'Physiotherapist',
    subtitle: 'Pulled a muscle? Get it treated by a trained physiotherapist',
    icon: Activity,
    tone: 'blue',
  },
  {
    id: 'surgery',
    title: 'General Surgeon',
    subtitle: 'Need to get operated? Find the right surgeon',
    icon: Stethoscope,
    tone: 'violet',
  },
  {
    id: 'general',
    title: 'General Physician',
    subtitle: 'Everyday illnesses, check-ups and health referrals',
    icon: ClipboardPlus,
    tone: 'amber',
  },
];

export const consultTypes = [
  { id: 'video', title: 'Video consult', body: 'Face-to-face with a doctor from home. Usually connects in about 60 seconds.', icon: Video },
  { id: 'chat', title: 'Chat consult', body: 'Message a doctor privately — share photos and reports at your pace.', icon: MessageCircle },
  { id: 'clinic', title: 'Visit a clinic', body: 'Book a confirmed in-person appointment at a clinic near you.', icon: Building2 },
];

export const findConcern = (id) => [...concerns, ...specialities].find((c) => c.id === id);
