import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { FeedbackModal } from '../components/common/FeedbackModal';
import { PRICING_PLANS } from '../data/pricingData';
import { PLATFORMS_DIRECTORY } from '../data/platformsData';
import { FAQS_DATA } from '../data/faqsData';
import { BLOGS_DATA } from '../data/blogsData';
import heroVisualPath from '../assets/images/hero_rudraatma_soundscape_1791846331016.jpg';
import studioVisualPath from '../assets/images/mastering_acoustic_studio_1791846330250.jpg';
import labVisualPath from '../assets/images/modern_artist_audio_lab_1791846330662.jpg';
import {
  ArrowRight,
  Disc3,
  CheckCircle2,
  Sliders,
  FolderKanban,
  UserCheck,
  FileCode2,
  Image as ImageIcon,
  CalendarClock,
  FileText,
  TrendingUp,
  Headphones,
  ShieldAlert,
  ChevronDown,
  Layers,
  Sparkles,
  DollarSign,
  AlertCircle,
  MessageSquareQuote,
  Clock,
  Globe2,
  ExternalLink
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { setSelectedPlanId } = useAuth();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    navigate(`/checkout?planId=${planId}`);
  };

  const valueProps = [
    { title: 'Music Distribution', desc: 'Deliver your original masters to major streaming networks, download stores, and regional digital platforms.', icon: Disc3 },
    { title: 'Release Management', desc: 'Centralized submission workflows with real status tracking from internal review to ingestion status.', icon: Sliders },
    { title: 'Catalog Organization', desc: 'Archive singles, EPs, and multi-disc albums with full track sequencing, UPC codes, and artwork assets.', icon: FolderKanban },
    { title: 'Artist Profiles', desc: 'Organize and link individual artist identities with DSP profile identifiers for clean mapping.', icon: UserCheck },
    { title: 'Metadata Management', desc: 'Standardized entry for song titles, primary artists, featured guests, lyricists, composers, and producers.', icon: FileCode2 },
    { title: 'Artwork Validation', desc: 'Automated dimension, RGB color space, and resolution checks against digital streaming store specifications.', icon: ImageIcon },
    { title: 'Scheduled Releases', desc: 'Submit and lock future drop dates with adequate lead time for internal quality checks and playlist windows.', icon: CalendarClock },
    { title: 'Royalty Reports', desc: 'Transparent digital streaming reports processed into verifiable ledger balances without hidden deductions.', icon: FileText },
    { title: 'Revenue Analytics', desc: 'Track performance by platform, artist, track, and territory once streaming statements are imported.', icon: TrendingUp },
    { title: 'Customer Support', desc: 'Dedicated ticketing desk assisting independent creators with metadata edits, takedowns, and inquiries.', icon: Headphones },
  ];

  const howItWorksSteps = [
    { number: '01', title: 'Create Your Account', desc: 'Register with your name, country, and email. Complete our 4-digit verification code to activate your artist workspace.' },
    { number: '02', title: 'Upload Your Music', desc: 'Upload lossless uncompressed WAV or FLAC audio files and your high-resolution 3000×3000px square cover artwork.' },
    { number: '03', title: 'Review & Submit Release', desc: 'Input comprehensive metadata, artist credits, and confirm ownership declarations before submitting for quality inspection.' },
    { number: '04', title: 'Track Delivery & Earnings', desc: 'Monitor review status in your dashboard. After approval and DSP ingestion, view verified royalty reports and request payouts.' },
  ];

  const releaseGuidePoints = [
    { title: 'Audio File Quality', spec: 'WAV or FLAC · 16-bit or 24-bit · 44.1kHz or 48kHz stereo uncompressed. No lossy MP3 transcode.' },
    { title: 'Artwork Specifications', spec: 'Exact 1:1 square · Minimum 3000 × 3000 px · RGB mode · JPG or PNG · No barcodes, store logos, or URLs.' },
    { title: 'Accurate Metadata', spec: 'Titles, featured artist credits, and language must match the audio and artwork exactly.' },
    { title: 'Artist & Contributor Credits', spec: 'Mandatory composer and lyricist credits for publishing identification. Producer credits supported.' },
    { title: 'Rights & Sample Clearances', spec: '100% exclusive master ownership or written clearance. Non-exclusive loops not eligible for Content ID.' },
    { title: 'Explicit-Content Declarations', spec: 'Accurate explicit flags are required for language and mature themes per platform rules.' },
    { title: 'Release Scheduling', spec: 'Recommend submitting at least 14 days prior to target release date to ensure review buffer.' }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <PublicHeader />

      {/* SECTION 2: HERO */}
      <section className="relative pt-12 pb-20 md:py-24 border-b border-slate-900 overflow-hidden">
        {/* Ambient subtle lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/80 text-blue-400 text-xs font-mono font-medium">
                <Disc3 className="w-3.5 h-3.5 animate-[spin_8s_linear_infinite]" />
                <span>Professional Music Distribution Infrastructure</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white font-display leading-[1.15] text-balance">
                Your Music. Every Platform. One Powerful Dashboard.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Distribute your music, manage releases, organize your artists, and track your royalty reports from one place.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Distribute Your Music</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/pricing')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
                >
                  <span>View Pricing</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>100% Artist Copyright Retention</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Free ISRC & UPC Barcodes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Transparent INR Pricing</span>
                </div>
              </div>
            </div>

            {/* Right Column: Original Music-Themed Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
                <img
                  src={heroVisualPath}
                  alt="Rudraatma Music Master Audio Visualizer and Studio Console"
                  className="w-full h-auto aspect-video lg:aspect-4/3 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-white font-medium">
                    <span>Lossless Master Pipeline</span>
                    <span className="text-blue-400 font-mono">24-Bit / 48 kHz</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Internal technical review for compliance before store ingestion.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PLATFORM DIRECTORY */}
      <section className="py-16 border-b border-slate-900 bg-[#060912]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Delivery Channels
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Digital Music Streaming & Store Directory
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Representative examples of candidate digital streaming platforms and regional distribution destinations. Platform delivery is dispatched after technical quality review.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {PLATFORMS_DIRECTORY.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-white font-display">{p.name}</div>
                  <div className="text-[11px] text-blue-400 mt-0.5">{p.type}</div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                  {p.region}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: VALUE PROPOSITION */}
      <section className="py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display mt-1">
              Everything Needed to Release and Administer Music
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              Engineered with precision for independent musicians, vocalists, audio engineers, and indie labels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {valueProps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#090e1a] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white font-display">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                    Capability {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="py-20 border-b border-slate-900 bg-[#060912]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Simple Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              How Distribution Works on Rudraatma Music
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              From audio mastering export to final store ingestion. Delivery timing depends on technical review and receiving platform ingestion schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step) => (
              <div
                key={step.number}
                className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-bold font-mono text-blue-400 mb-3">{step.number}.</div>
                  <h3 className="text-base font-bold text-white font-display">{step.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  Stage {step.number}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-300 max-w-3xl mx-auto text-center">
            Notice: Digital streaming services require between 5 to 14 days to process and index new music releases. Always submit releases with at least 14 days lead time.
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY RUDRAATMA MUSIC */}
      <section className="py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                Ethos & Distinction
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display">
                Built for Independent Artists Who Value Clarity
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Rudraatma Music was founded to eliminate deceptive pricing, unverified promises, and hidden royalty cuts. We provide straightforward technology and honest service parameters.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  { title: 'Transparent Pricing', desc: 'Exact one-time rates and clear monthly/annual allowances. Zero surprise fees.' },
                  { title: 'Centralized Artist Dashboard', desc: 'Unified portal to manage labels, releases, smart links, and team members.' },
                  { title: 'Release Status Tracking', desc: 'Live visibility into every step: Draft, Submitted, Under Review, and Approved.' },
                  { title: 'Organized Catalog Management', desc: 'Full preservation of track ISRC codes, UPC packages, and contributor credits.' },
                  { title: 'Clear Account Records & Payouts', desc: 'Direct ledger accounting with verified withdrawal requests to Indian bank accounts.' },
                  { title: 'Helpful Human Support Desk', desc: 'Ticketing assistance with real responses from trained music operations staff.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                <img
                  src={studioVisualPath}
                  alt="Acoustic Studio Mastering Console with Hardware Faders"
                  className="w-full h-auto aspect-4/3 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 bg-[#090e1a] border-t border-slate-800">
                  <div className="text-xs font-bold text-white font-display">Dedicated Technical Review Desk</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Every sound recording undergoes technical compliance verification before delivery to candidate platform endpoints.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PRICING PREVIEW */}
      <section className="py-20 border-b border-slate-900 bg-[#060912]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                Transparent Plans
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
                Pricing Preview
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Choose between one-time standalone releases or recurring subscriptions with monthly allowances.
              </p>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View Full Pricing Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_PLANS.slice(0, 4).map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl bg-[#090e1a] border transition-all flex flex-col justify-between ${
                  plan.popular ? 'border-blue-500/60 shadow-lg shadow-blue-500/10' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">{plan.type}</span>
                    {plan.badge && (
                      <span className="text-[10px] font-semibold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/80">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white font-display mt-2">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono text-white tabular-nums">
                      ₹{plan.priceINR}
                    </span>
                    <span className="text-xs text-slate-400">{plan.billingText}</span>
                  </div>
                  <p className="text-xs text-blue-300 mt-2 font-medium">{plan.allowance}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{plan.description}</p>

                  <ul className="mt-5 space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                    {plan.features.slice(0, 4).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    Get Started with {plan.name}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-300 text-center sm:text-left">
              Looking for Annual Plans with ₹100 direct savings? Starter Annual (₹1,688/yr), Growth Annual (₹2,300/yr), or Unlimited Annual (₹3,500/yr).
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600/30 rounded-lg font-semibold whitespace-nowrap transition-colors"
            >
              View All 8 Plans
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: RELEASE PREPARATION GUIDE */}
      <section className="py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Technical Readiness
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Release Preparation & Compliance Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Avoid metadata holds and rejection delays. Digital store requirements differ by platform; adhering to standard master guidelines ensures rapid verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {releaseGuidePoints.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
                    Requirement {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-sm font-bold text-white font-display">{item.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: ARTIST DASHBOARD PREVIEW */}
      <section className="py-20 border-b border-slate-900 bg-[#060912]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Interface Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Artist & Label Dashboard Preview
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Illustrative layout preview. Real account information, zero balance states, and verified releases are shown once signed in.
            </p>
          </div>

          {/* Sample Dashboard Mock UI Frame */}
          <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 sm:p-7 shadow-2xl max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="ml-2 font-mono text-slate-300">Rudraatma Music Dashboard v2.6 · Preview Mode</span>
              </div>
              <span className="text-[11px] font-mono text-blue-400">Illustrative Layout</span>
            </div>

            {/* Dashboard 5 KPI summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
              {[
                { title: 'Approved Labels', val: '2 Labels', sub: 'Verified Catalog Records' },
                { title: 'Approved Catalog', val: '1 Release', sub: 'Active Master Titles' },
                { title: 'Account Balance', val: '₹0.00', sub: 'Available Cleared INR' },
                { title: 'Last Payout', val: '₹480.00', sub: 'Completed IMPS Transfer' },
                { title: 'Current Plan', val: 'Growth Monthly', sub: '5 Releases / Month' },
              ].map((kpi, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400">{kpi.title}</div>
                  <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">{kpi.val}</div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Sample Table Preview */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-white">Latest Releases (Sample Overview)</span>
                <span className="text-[11px] text-slate-400">Status Verified by Desk</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <th className="pb-2">Title</th>
                      <th className="pb-2">Artist</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">UPC Barcode</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 font-semibold text-white">Midnight Ragas in Blue</td>
                      <td className="py-2.5">Aarav Mehta</td>
                      <td className="py-2.5">Single</td>
                      <td className="py-2.5 font-mono text-[11px]">8901234567891</td>
                      <td className="py-2.5"><span className="text-emerald-400 font-medium">Approved</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-white">Urban Monsoon EP</td>
                      <td className="py-2.5">Aarav Mehta ft. Neha</td>
                      <td className="py-2.5">EP</td>
                      <td className="py-2.5 font-mono text-[11px]">8901234567892</td>
                      <td className="py-2.5"><span className="text-amber-400 font-medium">In Review</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Log In to Access Your Real Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: REPORTING AND ANALYTICS */}
      <section className="py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Financial Rigor
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Reporting, Royalties, and Analytics Breakdown
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Filter earnings and stream logs across platform, artist, song, label, country, and time period once confirmed distribution reports are imported.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-display">Supported Reporting Dimensions</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Breakdown by digital store / streaming platform</li>
                <li>• Breakdown by primary artist and singer profiles</li>
                <li>• Song-level track performance and ISRC records</li>
                <li>• Record label catalog attribution</li>
                <li>• Territorial listening countries & regions</li>
                <li>• Monthly reporting trend & historical ledger statements</li>
              </ul>
            </div>

            <div className="md:col-span-2 p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-center items-center text-center">
              <AlertCircle className="w-8 h-8 text-slate-500 mb-2" />
              <div className="text-sm font-semibold text-white">Honest Ledger Integrity Policy</div>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                New accounts start with ₹0.00 until streaming platforms finalize their quarterly statement reconciliation (60–90 days). We do not project fabricated revenue estimates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: ARTIST COMMUNITY & FEEDBACK */}
      <section className="py-20 border-b border-slate-900 bg-[#060912]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                Community Feedback
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Artist Feedback & Direct Operations Access
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                We believe in authentic communication rather than fabricated celebrity quotes or fake star counters. Independent artists and producers can submit suggestions, review requests, and feedback directly to our product operations team.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Share Artist Feedback</span>
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  Contact Desk Directly
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3">
                <div className="font-semibold text-white">How Your Feedback Shapes Rudraatma:</div>
                <div className="text-slate-400 text-xs">
                  Every submission is logged in our operational queue, reviewed weekly by engineering, and used to optimize metadata schemas and payout workflows.
                </div>
                <div className="pt-2 text-[11px] font-mono text-blue-400">
                  Direct Response Window: 24–48 Hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: FAQ */}
      <section className="py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Comprehensive policies regarding release timing, pricing, ownership, cover licenses, and payouts.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {FAQS_DATA.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-800 bg-[#090e1a] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-white hover:text-blue-400 transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 13: BLOG PREVIEW */}
      <section className="py-20 border-b border-slate-900 bg-[#060912]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                Industry Knowledge
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
                Recent Guides & Knowledge Base
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Practical guides authored by our music operations and metadata compliance desk.
              </p>
            </div>
            <button
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BLOGS_DATA.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate('/blogs')}
                className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="text-[10px] uppercase font-mono text-blue-400">{article.category}</div>
                  <h3 className="text-sm font-bold text-white font-display mt-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{article.readTime}</span>
                  <span className="text-blue-400 group-hover:translate-x-1 transition-transform">Read →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA STRIP */}
      <section className="py-16 bg-gradient-to-b from-[#090e1a] to-[#070b14] border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display text-balance">
            Ready to Distribute Your Next Single or Album?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Take full control of your releases, manage your catalog, and receive direct royalty statements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            >
              Compare All Plans
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 14: FOOTER */}
      <PublicFooter />

      {/* Interactive Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
};
