import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Disc3, Lock, Mail, User as UserIcon, Globe, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, KeyRound, ServerCrash } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

export const SignUpPage: React.FC = () => {
  const { navigate, queryParam } = useRouter();
  const { login, selectedPlanId, setSelectedPlanId } = useAuth();

  const planFromQuery = queryParam('plan');
  useEffect(() => {
    if (planFromQuery) setSelectedPlanId(planFromQuery);
  }, [planFromQuery]);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Verification Step
  const [otpStep, setOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [smtpNotice, setSmtpNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Cooldown countdown timer
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((c) => Math.max(0, c - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'United Arab Emirates', 'Singapore', 'Nepal', 'Bangladesh', 'Other'
  ];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !country || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: email.trim(),
          country,
          password,
          confirmPassword,
          termsAccepted,
          selectedPlanId: selectedPlanId || 'growth-monthly'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpStep(true);
        setSmtpNotice(null);
        setCooldown(60);
      } else {
        if (data.missingConfig) {
          setSmtpNotice(data.error);
        } else {
          setError(data.error || 'Registration failed.');
        }
      }
    } catch {
      setError('Network communication failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (val: string) => {
    if (!val || !val.includes('@')) return val;
    const [local, domain] = val.split('@');
    if (local.length <= 2) return `${local[0] || ''}***@${domain}`;
    return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
  };

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }

    const next = [...otpDigits];
    next[index] = val;
    setOtpDigits(next);

    // Auto focus next input
    if (val && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 4);
    if (paste) {
      const chars = paste.split('');
      const next = ['', '', '', ''];
      chars.forEach((c, i) => { if (i < 4) next[i] = c; });
      setOtpDigits(next);
      if (chars.length === 4) {
        inputRefs[3].current?.focus();
      } else {
        inputRefs[chars.length]?.current?.focus();
      }
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 4) {
      setOtpError('Please enter the complete 4-digit code.');
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        login(data.token, data.user);
        // If plan was selected, route to checkout preserving plan
        if (selectedPlanId) {
          navigate(`/checkout?planId=${selectedPlanId}`);
        } else {
          navigate('/dashboard');
        }
      } else {
        setOtpError(data.error || 'Invalid verification code.');
      }
    } catch {
      setOtpError('Verification failed due to a network error.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setOtpError(null);

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCooldown(60);
        setSmtpNotice(null);
      } else {
        if (data.missingConfig) {
          setSmtpNotice(data.error);
        } else {
          setOtpError(data.error || 'Failed to resend code.');
        }
      }
    } catch {
      setOtpError('Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="p-7 sm:p-9 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-2xl">
            {otpStep ? (
              /* Step 2: 4-Digit Email OTP Verification */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <BrandLogo size="lg" variant="icon" />
                  </div>
                  <h1 className="text-2xl font-bold text-white font-display">
                    Verify Your Email Address
                  </h1>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    We dispatched a secure 4-digit verification code to{' '}
                    <strong className="text-white font-mono px-1 py-0.5 bg-slate-900 border border-slate-700 rounded">
                      {maskEmail(email)}
                    </strong>.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Please check your inbox and spam folder. Code expires in 10 minutes.
                  </p>
                </div>

                {/* SMTP Notice if unconfigured on server */}
                {smtpNotice && (
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                      <ServerCrash className="w-4 h-4 shrink-0" />
                      <span>Email Delivery Configuration Required</span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      {smtpNotice}
                    </p>
                  </div>
                )}

                {otpError && (
                  <div className="p-3 rounded-lg text-xs text-rose-300 bg-rose-950/40 border border-rose-800/80 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* 4 Inputs with Paste Support */}
                  <div className="flex justify-center gap-3 sm:gap-4" onPaste={handlePaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={inputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                        className="w-14 h-16 sm:w-16 sm:h-18 text-center text-2xl font-mono font-bold text-white bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        placeholder="•"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || otpDigits.join('').length !== 4}
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {otpLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify Email & Activate Account</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={cooldown > 0}
                      onClick={handleResendOtp}
                      className={`flex items-center gap-1.5 transition-colors ${
                        cooldown > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-blue-400 hover:underline'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      Change Email / Details
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Step 1: Initial Registration Form */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <BrandLogo size="lg" variant="icon" />
                  </div>
                  <h1 className="text-2xl font-bold text-white font-display">
                    Create Artist Account
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Register with Rudraatma Music to distribute and manage your catalog
                  </p>
                </div>

                {/* SMTP Notice if unconfigured on server */}
                {smtpNotice && (
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                      <ServerCrash className="w-4 h-4 shrink-0" />
                      <span>SMTP Setup Required for Email Verification</span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      {smtpNotice}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-lg text-xs text-rose-300 bg-rose-950/40 border border-rose-800/80 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Legal / Professional Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="e.g. Aarav Mehta"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="artist@domain.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Country Selection */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Country of Residence *
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {countries.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Password (Min 8 chars) *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                      <span>
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/terms')}
                          className="text-blue-400 hover:underline"
                        >
                          Terms & Conditions
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/privacy')}
                          className="text-blue-400 hover:underline"
                        >
                          Privacy Policy
                        </button>
                        .
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-4"
                  >
                    <span>{loading ? 'Generating Verification Code...' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-blue-400 hover:underline font-semibold"
                  >
                    Log In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
