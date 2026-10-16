import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { saveSession } from '../lib/session';

const inputCls =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-text-secondary/70 focus:border-primary-400 focus:ring-4 focus:ring-primary-100';

const Field = ({ label, hint, className = '', children }) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-semibold text-ink-900">{label}</span>
    <div className="mt-1.5">{children}</div>
    {hint && <span className="mt-1 block text-xs text-text-secondary">{hint}</span>}
  </label>
);

const PasswordInput = (props) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? 'text' : 'password'} className={`${inputCls} pr-11`} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-secondary hover:text-ink-900"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

const emptySignup = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  dob: '',
  gender: '',
  address: '',
  emergencyPhone: '',
};

// Mirrors the backend's Joi rules so patients see problems before submitting.
function validateSignup(f) {
  if (!/^\S+@\S+\.\S{2,}$/.test(f.email)) return 'Please enter a valid email address.';
  if (!/^\d{10}$/.test(f.phone)) return 'Mobile number must be exactly 10 digits.';
  if (f.password.length < 8 || !/[A-Z]/.test(f.password) || !/\d/.test(f.password))
    return 'Password needs at least 8 characters, one capital letter and one number.';
  if (f.password !== f.confirmPassword) return 'Passwords do not match.';
  if (!/^\d{10}$/.test(f.emergencyPhone)) return 'Emergency contact must be exactly 10 digits.';
  return '';
}

const AuthForm = ({ onSuccess, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode);
  const [signin, setSignin] = useState({ email: '', password: '' });
  const [signup, setSignup] = useState(emptySignup);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const digits = (v) => v.replace(/\D/g, '').slice(0, 10);
  const setUp = (key) => (e) =>
    setSignup((s) => ({ ...s, [key]: key.toLowerCase().includes('phone') ? digits(e.target.value) : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      const problem = validateSignup(signup);
      if (problem) {
        setError(problem);
        return;
      }
    }

    setLoading(true);
    try {
      const res =
        mode === 'signin'
          ? await apiRequest('/auth/patient/login', { method: 'POST', body: signin })
          : await apiRequest('/auth/patient/register', { method: 'POST', body: signup });
      onSuccess?.(saveSession(res));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 rounded-full bg-background p-1 text-sm font-bold">
        {[
          ['signin', 'Sign in'],
          ['signup', 'Create account'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id);
              setError('');
            }}
            className={`rounded-full py-2.5 transition ${mode === id ? 'bg-white text-ink-900 shadow-sm' : 'text-text-secondary hover:text-ink-900'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {mode === 'signin' ? (
          <>
            <Field label="Email">
              <input
                type="email"
                autoComplete="email"
                required
                value={signin.email}
                onChange={(e) => setSignin((s) => ({ ...s, email: e.target.value }))}
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>
            <Field label="Password">
              <PasswordInput
                autoComplete="current-password"
                required
                value={signin.password}
                onChange={(e) => setSignin((s) => ({ ...s, password: e.target.value }))}
                placeholder="Your password"
              />
            </Field>
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" className="sm:col-span-2">
              <input autoComplete="name" required value={signup.fullName} onChange={setUp('fullName')} placeholder="As on your ID" className={inputCls} />
            </Field>
            <Field label="Email">
              <input type="email" autoComplete="email" required value={signup.email} onChange={setUp('email')} placeholder="you@example.com" className={inputCls} />
            </Field>
            <Field label="Mobile number">
              <input type="tel" inputMode="numeric" autoComplete="tel-national" required value={signup.phone} onChange={setUp('phone')} placeholder="10-digit mobile" className={inputCls} />
            </Field>
            <Field label="Date of birth">
              <input type="date" required value={signup.dob} max={new Date().toISOString().slice(0, 10)} onChange={setUp('dob')} className={inputCls} />
            </Field>
            <Field label="Gender">
              <select required value={signup.gender} onChange={setUp('gender')} className={inputCls}>
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <input autoComplete="street-address" required value={signup.address} onChange={setUp('address')} placeholder="House, street, city" className={inputCls} />
            </Field>
            <Field label="Emergency contact" hint="Someone we can call in an emergency." className="sm:col-span-2">
              <input type="tel" inputMode="numeric" required value={signup.emergencyPhone} onChange={setUp('emergencyPhone')} placeholder="10-digit mobile" className={inputCls} />
            </Field>
            <Field label="Password" hint="8+ characters, one capital letter and one number.">
              <PasswordInput autoComplete="new-password" required value={signup.password} onChange={setUp('password')} placeholder="Create a password" />
            </Field>
            <Field label="Confirm password">
              <PasswordInput autoComplete="new-password" required value={signup.confirmPassword} onChange={setUp('confirmPassword')} placeholder="Repeat password" />
            </Field>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-bold text-white shadow-md shadow-primary-600/25 transition hover:bg-brand-blue disabled:cursor-wait disabled:opacity-70"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        <p className="text-center text-xs leading-5 text-text-secondary">
          {mode === 'signin' ? 'New to MediSlip? ' : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError('');
            }}
            className="font-bold text-primary-600 hover:underline"
          >
            {mode === 'signin' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
