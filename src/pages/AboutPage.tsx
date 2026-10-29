import React from 'react';
import { useRouter } from '../context/RouterContext';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import labVisualPath from '../assets/images/modern_artist_audio_lab_1791846330662.jpg';
import { Disc3, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1">
        {/* Banner */}
        <section className="py-16 sm:py-20 border-b border-slate-900 bg-gradient-to-b from-[#090e1a] to-[#070b14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Our Ethos & Principles
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display mt-2">
              About Rudraatma Music
            </h1>
            <p className="text-base text-slate-300 mt-4 leading-relaxed">
              Rudraatma Music provides independent recording artists, producers, and record labels with modern distribution infrastructure, rigorous metadata compliance, and transparent royalty reporting.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-sm text-slate-300 leading-relaxed">
                <div>
                  <h2 className="text-xl font-bold text-white font-display mb-2">
                    Our Mission
                  </h2>
                  <p>
                    The modern digital music landscape is saturated with distributors that obscure pricing, hide unannounced fee hikes, or make exaggerated claims of instantaneous playlist placement. Our mission is to restore professional clarity: providing verified distribution workflows, reliable barcode generation, clean artist dashboards, and straightforward ledger accounting in Indian Rupees (INR).
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white font-display mb-2">
                    Artist-Centric Sovereignty
                  </h2>
                  <p>
                    We operate purely as an administrative distributor and technical conduit. Artists and labels retain 100% of their copyrights, master recordings, and creative decisions. When you submit music through Rudraatma Music, you grant us only a non-exclusive license to deliver your sound files and metadata to designated digital streaming partners.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2.5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                    Core Operational Commitments
                  </h3>
                  {[
                    'Zero fabricated vanity metrics or unverified royalty claims',
                    'Direct accounting ledger with bank transfer (IMPS) and UPI settlements',
                    'Proactive technical inspection on audio specs and cover graphics',
                    'Transparent one-time release fees and disclosed monthly allowances'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                  <img
                    src={labVisualPath}
                    alt="Music Producer Audio Lab Workstation"
                    className="w-full h-auto aspect-4/3 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-5 bg-[#090e1a] border-t border-slate-800 text-xs">
                    <span className="font-bold text-white font-display">Dedicated Artist Operations</span>
                    <p className="text-slate-400 mt-1">
                      Our desk directly reviews submissions to ensure platform compliance before store delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 border-t border-slate-900 bg-[#060912]">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
            <h2 className="text-2xl font-bold text-white font-display">
              Ready to Work Together?
            </h2>
            <p className="text-xs text-slate-300">
              Join independent creators releasing music on their own terms.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
              >
                Contact Artist Desk
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};
