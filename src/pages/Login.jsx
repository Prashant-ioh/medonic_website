import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import AuthForm from '../components/AuthForm';
import MediSlipLogo from '../components/MediSlipLogo';
import { clearSession, useSession } from '../lib/session';

const Login = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const session = useSession();
  // Only follow in-site redirects.
  const next = params.get('next')?.startsWith('/') ? params.get('next') : '/consult';

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative">
        <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
        <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-4 pb-24 pt-8 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:pt-16">
          <div className="hidden lg:block">
            <MediSlipLogo className="h-14 w-14" />
            <h1 className="mt-8 text-5xl font-extrabold leading-[1.05] tracking-[-0.035em] text-ink-900">
              Your health, <span className="text-brand-blue">one slip</span> away.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-text-secondary">
              Sign in to consult verified doctors and keep every prescription and report in one secure place.
            </p>
            <ul className="mt-8 space-y-3 text-ink-900">
              {['Consult by video, chat or in-clinic', 'Digital prescriptions you can share', 'Your records stay private'].map((t) => (
                <li key={t} className="flex items-center gap-3 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-success" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[32px] border border-border bg-white p-6 shadow-xl shadow-ink-900/[0.04] sm:p-10">
            {session ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-xl font-extrabold text-primary-600">
                  {(session.user?.fullName || 'P').charAt(0)}
                </div>
                <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-ink-900">
                  Signed in as {session.user?.fullName || 'Patient'}
                </h2>
                <p className="mt-1 text-text-secondary">{session.user?.email}</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link to="/consult" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-blue">
                    Start a consultation <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button type="button" onClick={clearSession} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold text-ink-900 hover:border-primary-300">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-3xl">Welcome to MediSlip</h2>
                <p className="mt-2 text-text-secondary">Sign in or create a free patient account.</p>
                <div className="mt-8">
                  <AuthForm initialMode={params.get('mode') === 'signup' ? 'signup' : 'signin'} onSuccess={() => navigate(next)} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
