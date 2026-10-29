import React from 'react';
import { useRouter } from '../context/RouterContext';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Shield, FileText, CheckCircle2 } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const { path, navigate } = useRouter();

  const getPolicyDetails = () => {
    switch (path) {
      case '/privacy':
        return {
          title: 'Privacy Policy',
          updated: 'January 2026',
          sections: [
            {
              heading: '1. Information We Collect',
              text: 'We collect account identification details including your name, email address, country of residence, billing details, and artist metadata required to register sound recordings with streaming platforms and barcode registries. We do not store unencrypted passwords or payment card details.'
            },
            {
              heading: '2. Use of Information',
              text: 'Information is utilized exclusively to manage your music distribution, process royalty payouts, fulfill statutory tax reporting, deliver in-app notifications regarding release status decisions, and authenticate your account.'
            },
            {
              heading: '3. Data Sharing with Streaming Destinations',
              text: 'To deliver your music to platforms such as Spotify, Apple Music, and YouTube, we transmit necessary metadata (artist names, track titles, ISRC/UPC barcodes, songwriting credits). Personal banking information is shared securely only with verified payment settlement gateways.'
            }
          ]
        };
      case '/refund-policy':
        return {
          title: 'Refund Policy',
          updated: 'January 2026',
          sections: [
            {
              heading: '1. One-Time Releases',
              text: 'One-time submission fees (Single Track ₹20, EP/Album ₹50) are non-refundable once technical quality inspection has commenced or metadata has been dispatched to streaming platform endpoints. If a release is rejected by our desk prior to review completion and cannot be rectified, you are entitled to a full re-submission credit or refund.'
            },
            {
              heading: '2. Subscriptions',
              text: 'Recurring subscription plans (Starter, Growth, Unlimited) may be cancelled anytime through your dashboard. Charges already processed for the active billing cycle are non-refundable, and your quota remains usable until the period concludes.'
            }
          ]
        };
      case '/cancellation-policy':
        return {
          title: 'Subscription & Cancellation Policy',
          updated: 'January 2026',
          sections: [
            {
              heading: '1. Cancellation Procedure',
              text: 'You may cancel recurring monthly or annual subscriptions anytime from the "Subscription Plan" section in your Artist Dashboard. Cancellation stops future recurring billings immediately.'
            },
            {
              heading: '2. Catalog Preservation Post-Cancellation',
              text: 'Titles uploaded under an active subscription remain active through the end of the paid cycle. To maintain legacy releases permanently without an ongoing subscription, titles may be migrated to one-time maintenance status as specified in our distribution schedule.'
            }
          ]
        };
      case '/distribution-agreement':
        return {
          title: 'Music Distribution Agreement',
          updated: 'January 2026',
          sections: [
            {
              heading: '1. Grant of Non-Exclusive License',
              text: 'You grant Rudraatma Music a non-exclusive, worldwide license to ingest, transcode, deliver, and authorize the public streaming and digital download of your submitted sound recordings and associated artwork across digital service providers.'
            },
            {
              heading: '2. 100% Artist Ownership Retention',
              text: 'You retain full and unrestricted ownership of all master copyrights, sound recordings, artwork, and underlying musical works. Rudraatma Music claims zero ownership equity in your creative works.'
            },
            {
              heading: '3. Artist Representations & Warranties',
              text: 'You represent that you own 100% of the master rights, have secured written clearance for all samples, have properly accredited songwriters and lyricists, and that submitted recordings do not infringe third-party copyrights or trademark laws.'
            }
          ]
        };
      case '/terms':
      default:
        return {
          title: 'Terms & Conditions',
          updated: 'January 2026',
          sections: [
            {
              heading: '1. Acceptance of Terms',
              text: 'By registering an account with Rudraatma Music or submitting content for digital distribution, you agree to comply with these terms, our Privacy Policy, and individual platform delivery guidelines.'
            },
            {
              heading: '2. User Accounts & Verification',
              text: 'Accounts must be registered with accurate personal information and activated via our secure email verification OTP. You are responsible for safeguarding your session credentials.'
            },
            {
              heading: '3. Prohibited Content',
              text: 'Submitting unauthorized third-party audio, uncleared samples, hate speech, or intentionally misleading metadata (spoofing artist names) will result in immediate suspension and release takedown.'
            }
          ]
        };
    }
  };

  const policy = getPolicyDetails();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Subnav between policies */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-900 text-xs">
            {[
              { path: '/terms', label: 'Terms & Conditions' },
              { path: '/privacy', label: 'Privacy Policy' },
              { path: '/refund-policy', label: 'Refund Policy' },
              { path: '/cancellation-policy', label: 'Subscription Cancellation' },
              { path: '/distribution-agreement', label: 'Distribution Agreement' }
            ].map((p) => (
              <button
                key={p.path}
                onClick={() => navigate(p.path)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  path === p.path
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                Official Policy
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
                {policy.title}
              </h1>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Last Revised: {policy.updated} · Rudraatma Music Legal Operations
              </div>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {policy.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h2 className="text-base font-bold text-white font-display">
                    {sec.heading}
                  </h2>
                  <p>{sec.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Questions regarding compliance?</span>
              <button
                onClick={() => navigate('/contact')}
                className="text-blue-400 hover:underline"
              >
                Contact Legal Desk
              </button>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
