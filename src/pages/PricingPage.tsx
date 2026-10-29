import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { PRICING_PLANS } from '../data/pricingData';
import { CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { setSelectedPlanId } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'one-time' | 'monthly' | 'annual'>('all');

  const filteredPlans = PRICING_PLANS.filter(plan => {
    if (activeTab === 'all') return true;
    return plan.type === activeTab;
  });

  const handleGetStarted = (planId: string) => {
    setSelectedPlanId(planId);
    navigate(`/checkout?planId=${planId}`);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="py-16 sm:py-20 border-b border-slate-900 bg-gradient-to-b from-[#090e1a] to-[#070b14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Clear & Transparent Pricing
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display mt-2 text-balance">
              Predictable Plans for Independent Artists & Record Labels
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              Choose standalone pay-per-release options or recurring monthly and discounted annual subscriptions. Every plan includes free ISRC & UPC barcodes, full copyright retention, and direct royalty reporting.
            </p>

            {/* Segmented Filter Control */}
            <div className="mt-8 inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Products (8)
              </button>
              <button
                onClick={() => setActiveTab('one-time')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'one-time'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                One-Time Releases
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Plans
              </button>
              <button
                onClick={() => setActiveTab('annual')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'annual'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual Plans (Save ₹100)
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-2xl bg-[#090e1a] border flex flex-col justify-between transition-all ${
                    plan.popular
                      ? 'border-blue-500/70 shadow-xl shadow-blue-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        {plan.type}
                      </span>
                      {plan.badge && (
                        <span className="text-[10px] font-semibold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80 font-mono">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-white font-display mt-2">
                      {plan.name}
                    </h2>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
                        ₹{plan.priceINR}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {plan.billingText}
                      </span>
                    </div>

                    {plan.annualCalculation && (
                      <div className="mt-1 text-[11px] text-emerald-400 font-mono">
                        {plan.annualCalculation}
                      </div>
                    )}

                    <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/60 text-xs text-blue-300 font-medium">
                      {plan.allowance}
                    </div>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-800">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Plan Inclusions
                      </div>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleGetStarted(plan.id)}
                      className={`w-full py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-center text-[10px] text-slate-400 mt-2">
                      Resolves to ₹{plan.priceINR} {plan.type === 'one-time' ? 'one-time' : 'at checkout'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Notice & Fair Use Policy */}
        <section className="py-12 border-t border-slate-900 bg-[#060912]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-400 leading-relaxed space-y-4">
            <h3 className="text-sm font-bold text-white font-display">
              Transparency & Subscription Terms
            </h3>
            <p>
              • <strong className="text-slate-300">One-Time Releases:</strong> ₹20 Single Track and ₹50 EP/Album (up to 15 tracks) are single-purchase distributions. They are never converted into recurring subscriptions or billed again without your explicit order.
            </p>
            <p>
              • <strong className="text-slate-300">Annual Calculations:</strong> Annual plans transparently discount ₹100 compared to twelve monthly billings (Starter: ₹149 × 12 − ₹100 = ₹1,688/year; Growth: ₹200 × 12 − ₹100 = ₹2,300/year; Unlimited: ₹300 × 12 − ₹100 = ₹3,500/year). Annual plans are charged in a single upfront transaction for the full 12-month period.
            </p>
            <p>
              • <strong className="text-slate-300">Fair-Use Policy:</strong> Unlimited plans allow regular catalog expansion. To safeguard ingestion queues against automated bot spam, submissions undergo standard technical inspection and adhere to digital store duplicate-content prevention policies.
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};
