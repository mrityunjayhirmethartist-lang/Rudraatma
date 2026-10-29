import React from 'react';
import { useRouter } from '../context/RouterContext';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import {
  Disc3,
  Sliders,
  FolderKanban,
  FileCode2,
  Image as ImageIcon,
  CalendarClock,
  TrendingUp,
  Headphones,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Cpu
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { navigate } = useRouter();

  const services = [
    {
      id: 'dist',
      title: 'Digital Music Distribution',
      desc: 'Deliver uncompressed high-fidelity sound recordings to global streaming services, digital download platforms, and regional South Asian ecosystems.',
      details: [
        'Lossless 16-bit / 24-bit WAV & FLAC audio ingestion',
        'Automatic assignment of official ISRC and UPC codes',
        'Candidate delivery to Spotify, Apple Music, YouTube Music, JioSaavn, Amazon Music, Deezer, and Tidal',
        'Optional YouTube Content ID fingerprinting for 100% exclusive masters'
      ]
    },
    {
      id: 'release-mgmt',
      title: 'Release & Catalog Management',
      desc: 'Keep complete sovereignty over your singles, multi-track EPs, and full studio albums in one organized archive.',
      details: [
        'Single, EP, and Album packaging support up to 15 tracks',
        'Multi-artist credit structuring (primary, featured, lyricist, composer, producer)',
        'Explicit content marking and Parental Advisory declaration',
        'Historical catalog archiving with permanent barcode tagging'
      ]
    },
    {
      id: 'artist-tools',
      title: 'Artist Profiles & Smart Links',
      desc: 'Connect your catalog with your digital presence and provide fans with one-click pre-save and listen gateways.',
      details: [
        'Automated Smart Link landing pages per release',
        'Direct links for Spotify, Apple Music, and YouTube',
        'Artist roster management across multiple independent projects',
        'Profile mapping to prevent artist catalog collisions on streaming apps'
      ]
    },
    {
      id: 'reports',
      title: 'Royalty Statements & Financial Ledger',
      desc: 'Transparent accounting with real monthly streaming statements imported directly into your dashboard balance.',
      details: [
        'Track-by-track and platform-by-platform earnings breakdown',
        'Cleared available balance reported in Indian Rupees (INR)',
        'Direct payout withdrawals via Indian Bank Transfer (IMPS/NEFT) and UPI',
        'Zero hidden transactional withholding on verified streaming royalties'
      ]
    },
    {
      id: 'support',
      title: 'Quality Review & Human Support Desk',
      desc: 'Hands-on technical verification ensuring that every release meets digital store guidelines before ingestion.',
      details: [
        'Automated and manual artwork quality inspection (3000x3000px, RGB mode)',
        'Metadata spelling and character encoding validation',
        'Fast-track correction workflows via the Other Requests portal',
        'Dedicated support ticket desk with verified email replies in 24–48 hours'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1">
        {/* Header Banner */}
        <section className="py-16 sm:py-20 border-b border-slate-900 bg-gradient-to-b from-[#090e1a] to-[#070b14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                Core Offerings
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display mt-2">
                Our Distribution Services
              </h1>
              <p className="text-base text-slate-300 mt-4 leading-relaxed">
                Rudraatma Music delivers a comprehensive technical suite for independent artists, producers, and boutique record labels. Explore our distribution architecture, release validation tools, and royalty accounting.
              </p>
            </div>
          </div>
        </section>

        {/* Services In-Depth */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {services.map((srv, idx) => (
              <div
                key={srv.id}
                className="p-6 sm:p-8 rounded-2xl bg-[#090e1a] border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                <div className="lg:col-span-5">
                  <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                    Service {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                    {srv.title}
                  </h2>
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="lg:col-span-7 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
                  <div className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider mb-3">
                    Key Specifications & Capabilities
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                    {srv.details.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="py-16 border-t border-slate-900 bg-[#060912]">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Begin Distributing Your Music Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Create an account in minutes or view our transparent pricing options.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/20"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
              >
                View Pricing
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};
