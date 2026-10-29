import React, { useState } from 'react';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Mail, Clock, ShieldCheck, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ticketNumber: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ ticketNumber: data.ticketNumber, message: data.message });
      } else {
        setError(data.error || 'Failed to submit inquiry.');
      }
    } catch {
      setError('Network communication failure. Please verify connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Verified Artist Support
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mt-1">
              Contact Rudraatma Music Desk
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              Have questions regarding release delivery timelines, metadata compliance, ISRC assignments, or artist payouts? Our operations desk is available to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-xl">
                {result ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">Inquiry Received</h3>
                    <div className="p-3 bg-slate-900 rounded-lg inline-block text-xs font-mono text-blue-400 border border-slate-800">
                      Tracking Reference: {result.ticketNumber}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      {result.message}
                    </p>
                    <button
                      onClick={() => {
                        setResult(null);
                        setName('');
                        setEmail('');
                        setSubject('');
                        setMessage('');
                      }}
                      className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors mt-4"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-base font-bold text-white font-display pb-3 border-b border-slate-800">
                      Submit Your Inquiry
                    </h2>

                    {error && (
                      <div className="p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/80 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="e.g. Aarav Mehta"
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="name@domain.com"
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Inquiry Subject *
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        placeholder="e.g. Ingestion timeline for upcoming EP"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Detailed Message *
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        placeholder="Please include release titles or UPC barcodes if applicable to expedite review..."
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{loading ? 'Submitting Message...' : 'Send Message to Desk'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar with Verified Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
                  Verified Contact Information
                </h3>

                <div className="space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-400">Official Artist Desk Email:</div>
                      <a href="mailto:support@rudraatmamusic.com" className="text-white font-medium hover:text-blue-400">
                        support@rudraatmamusic.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-400">Operating Schedule:</div>
                      <div className="text-slate-200">Monday – Friday: 10:00 AM to 6:00 PM IST</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Average initial response time: 24 to 48 business hours.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-400">Existing Artists:</div>
                      <div className="text-slate-200">
                        For specific release revisions or takedowns, log in and use the authenticated Support Ticket portal for faster queue priority.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
