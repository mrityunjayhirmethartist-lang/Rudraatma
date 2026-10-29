import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Disc3, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  const { navigate, queryParam } = useRouter();
  const { login, selectedPlanId } = useAuth();

  const redirectTarget = queryParam('redirect') || (selectedPlanId ? `/checkout?planId=${selectedPlanId}` : '/dashboard');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [devResetToken, setDevResetToken] = useState<string | null>(null);

  // Quick reset password state (if user follows reset link)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Email address and password are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(data.token, data.user);
        // Safe redirect to relative internal route only
        const target = redirectTarget.startsWith('/') ? redirectTarget : '/dashboard';
        navigate(target);
      } else {
        if (data.needsVerification) {
          navigate(`/signup?verifyEmail=${encodeURIComponent(data.email)}`);
        } else {
          setError(data.error || 'Invalid email or password.');
        }
      }
    } catch {
      setError('Network communication failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });
      const data = await res.json();
      setForgotSubmitted(true);
      setForgotMessage(data.message);
      if (data.devResetToken) {
        setDevResetToken(data.devResetToken);
      }
    } catch {
      setForgotMessage('An error occurred. If your email is registered, instructions have been dispatched.');
      setForgotSubmitted(true);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devResetToken || !newPassword || !confirmPassword) return;

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: devResetToken, newPassword, confirmPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetSuccess(true);
        setTimeout(() => {
          setForgotModalOpen(false);
          setForgotSubmitted(false);
          setDevResetToken(null);
          setResetSuccess(false);
        }, 2000);
      } else {
        setError(data.error || 'Failed to update password.');
      }
    } catch {
      setError('Password reset failed.');
    }
  };

  // Preset demo accounts for instant evaluation
  const fillDemoArtist = () => {
    setEmail('demo@rudraatmamusic.com');
    setPassword('Password123!');
  };

  const fillAdmin = () => {
    setEmail('admin@rudraatmamusic.com');
    setPassword('AdminPass123!');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="p-7 sm:p-9 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-2xl">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <BrandLogo size="lg" variant="icon" />
              </div>
              <h1 className="text-2xl font-bold text-white font-display">
                Sign In to Rudraatma Music
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to access your artist catalog & reports
              </p>
            </div>

            {/* Quick Demo Pre-fill helpers */}
            <div className="mb-6 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-2">
              <div className="text-slate-400 font-mono flex items-center justify-between">
                <span>Quick Test Logins:</span>
                <span className="text-blue-400">Instant Demo</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fillDemoArtist}
                  className="flex-1 py-1.5 px-2 bg-blue-950/60 border border-blue-800/80 hover:bg-blue-900/60 text-blue-300 rounded font-medium transition-colors"
                >
                  Artist Demo Account
                </button>
                <button
                  type="button"
                  onClick={fillAdmin}
                  className="flex-1 py-1.5 px-2 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 text-emerald-300 rounded font-medium transition-colors"
                >
                  Admin Desk Account
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg text-xs text-rose-300 bg-rose-950/40 border border-rose-800/80 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="artist@rudraatmamusic.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotEmail(email);
                    }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember session securely</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Authenticating...' : 'Log In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Google OAuth Provider Option */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setError('Google OAuth provider is currently awaiting production credentials setup in this environment. Please log in using verified email and password.');
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.9 7C.7 9.4 0 12 0 14.7s.7 5.3 1.9 7.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Registration Link */}
            <div className="mt-6 text-center text-xs text-slate-400">
              Don't have an artist account yet?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:underline font-semibold"
              >
                Create an Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setForgotModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0b1120] border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white font-display mb-1">
              Reset Your Account Password
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered email address. We will generate secure reset instructions.
            </p>

            {forgotSubmitted && !devResetToken ? (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed text-center space-y-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p>{forgotMessage}</p>
                <button
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSubmitted(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Return to Login
                </button>
              </div>
            ) : devResetToken ? (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div className="p-3 bg-blue-950/40 border border-blue-800 text-xs text-blue-300 rounded-lg">
                  Testing Mode: Enter a new password for {forgotEmail}:
                </div>

                {resetSuccess ? (
                  <div className="p-3 text-xs text-emerald-300 bg-emerald-950/60 rounded-lg">
                    Password updated successfully! Closing...
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">New Password (Min 8 chars)</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setForgotModalOpen(false)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
                      >
                        Save New Password
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="artist@rudraatmamusic.com"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
};
