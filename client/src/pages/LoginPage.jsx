import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowLeft,
  ShieldCheck,
  Building2,
  KeyRound,
} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const accessHighlights = [
  'Secure role-based access',
  'Manage website content',
  'Control products and services',
  'Publish updates with confidence',
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null');
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [form, setForm] = useState({
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem('rememberedEmail')));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const storedUser = getStoredUser();
  const token = localStorage.getItem('token');
  const userId = storedUser?._id || storedUser?.id;
  const userRole = storedUser?.role;

  useEffect(() => {
    if (!token || !userId) return;

    if (userRole === 'admin' || userRole === 'superadmin') {
      navigate(from, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [token, userId, userRole, from, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', form);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('authUser', JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', form.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      if (user?.role === 'admin' || user?.role === 'superadmin') {
        navigate(from, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
        <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="relative hidden lg:flex overflow-hidden bg-[#0F172A]">
          <div className="absolute inset-0">
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/95 via-[#0F172A]/90 to-[#0F172A]/70" />
          </div>

          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          
            <div className="max-w-xl px-2 py-6">
             
              <h1 className="max-w-lg font-['JetBrains_Mono'] text-4xl font-bold leading-tight text-white xl:text-5xl">
                Manage SriLin’s digital presence securely.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 xl:text-base">
                Access the administration portal to keep company content, capabilities, and customer resources accurate and up to date.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {accessHighlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 backdrop-blur-sm"
                  >
                    <CheckCircle2 size={18} className="shrink-0 text-[#c29f5d]" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#c29f5d]/10 text-[#c29f5d]">
                  <KeyRound size={20} />
                </div>
                <p className="text-sm font-medium text-white">Role-based access</p>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  Admin and superadmin workflows with controlled permissions.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#c29f5d]/10 text-[#c29f5d]">
                  <Building2 size={20} />
                </div>
                <p className="text-sm font-medium text-white">Company portal</p>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  Keep products, services, and updates aligned with the brand.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <Link
                to="/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm"
                aria-label="Back to home"
              >
                <ArrowLeft size={18} />
              </Link>
              <img src="/srilin-white.png" alt="SriLin" className="h-8 w-auto" />
            </div>

            <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#E2E8F0] bg-[#f8fafc] px-6 py-5 sm:px-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ecfeff] text-[#0F766E] shadow-sm">
                  <LockKeyhole size={22} />
                </div>
                <div className="mt-4">
                  <h2 className="font-['JetBrains_Mono'] text-2xl font-bold text-[#0F172A]">
                    Welcome Back
                  </h2>
                  <p className="mt-1 text-sm text-[#64748b]">
                    Sign in to continue to the admin portal
                  </p>
                </div>
              </div>

              <div className="px-6 py-6 sm:px-8">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-[#0F172A]">
                      Email address
                    </label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#f8fafc] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#c29f5d] focus:bg-white focus:ring-4 focus:ring-[#c29f5d]/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-[#0F172A]">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#f8fafc] px-4 pr-12 text-sm text-[#0F172A] outline-none transition focus:border-[#c29f5d] focus:bg-white focus:ring-4 focus:ring-[#c29f5d]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-[#64748b] transition hover:text-[#0F172A]"
                      >
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="inline-flex items-center gap-3 text-sm text-[#475569]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="h-4 w-4 rounded border-[#cbd5e1] text-[#c29f5d] focus:ring-[#c29f5d]"
                      />
                      <span>Remember me</span>
                    </label>

                    <Link to="/contact-us" className="text-sm font-medium text-[#9a7a3e] hover:text-[#0F172A]">
                      Need help signing in?
                    </Link>
                  </div>

                  {error ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#c29f5d] px-5 text-sm font-semibold text-[#0F172A] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-between border-t border-[#E2E8F0] pt-5">
                  <p className="text-xs text-[#64748b]">
                    Protected access for authorized SriLin team members only.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A] hover:text-[#9a7a3e]"
                  >
                    <ArrowLeft size={16} />
                    Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
    </>
  );
}