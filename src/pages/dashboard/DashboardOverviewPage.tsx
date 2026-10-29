import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Release, LabelItem, MonthlyRoyalty, DspRoyaltyShare } from '../../types';
import {
  Tag,
  Disc3,
  Wallet,
  Receipt,
  CreditCard,
  Plus,
  ArrowRight,
  BarChart2,
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  Sparkles
} from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  const { navigate } = useRouter();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [lastPayout, setLastPayout] = useState<number>(0);
  const [currentPlan, setCurrentPlan] = useState<string>('Growth Monthly');
  const [monthlyRoyalties, setMonthlyRoyalties] = useState<MonthlyRoyalty[]>([]);
  const [dspBreakdown, setDspBreakdown] = useState<DspRoyaltyShare[]>([]);

  // Royalty Trends filter states
  const [timeRange, setTimeRange] = useState<'6m' | 'top5' | 'top10' | 'top20'>('6m');
  const [trendFilter, setTrendFilter] = useState<'Platform' | 'Singer' | 'Song' | 'Label' | 'Country' | 'Monthly Trend'>('Platform');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/dashboard/data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLabels(data.labels || []);
          setReleases(data.releases || []);
          setBalance(data.balance ?? 0);
          setLastPayout(data.lastPayout ?? 0);
          setMonthlyRoyalties(data.monthlyRoyalties || []);
          setDspBreakdown(data.dspBreakdown || []);
          if (data.planId) {
            const planNames: Record<string, string> = {
              'single-track': 'Single Track',
              'ep-album': 'EP / Album',
              'starter-monthly': 'Starter Monthly',
              'growth-monthly': 'Growth Monthly',
              'unlimited-monthly': 'Unlimited Monthly',
              'starter-annual': 'Starter Annual',
              'growth-annual': 'Growth Annual',
              'unlimited-annual': 'Unlimited Annual'
            };
            setCurrentPlan(planNames[data.planId] || 'Growth Monthly');
          }
        }
      } catch (err) {
        console.error('Fetch dashboard data failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const approvedLabelsCount = labels.filter(l => l.status === 'Approved').length;
  const approvedCatalogCount = releases.filter(r => r.status === 'Approved').length;

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-8">
        {/* Personalized Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Hi, {user?.fullName || 'Artist'}! We hope you're doing well.
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Welcome to your centralized music distribution console and catalog command center.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/releases/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Release</span>
            </button>
          </div>
        </div>

        {/* 5 Real Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Approved Labels */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Approved Labels</span>
                <Tag className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {approvedLabelsCount}
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/labels')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-between"
            >
              <span>View Labels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Approved Catalog */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Approved Catalog</span>
                <Disc3 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {approvedCatalogCount}
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/releases')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-between"
            >
              <span>View Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Account Balance */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Account Balance</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                ₹{balance.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/financial')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 hover:text-white font-semibold flex items-center justify-between"
            >
              <span>Financial Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Last Payout */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Last Payout</span>
                <Receipt className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                ₹{lastPayout.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/wallet-transactions')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 hover:text-white font-semibold flex items-center justify-between"
            >
              <span>Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 5: Current Plan */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Current Plan</span>
                <CreditCard className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-sm font-bold text-white font-display truncate">
                {currentPlan}
              </div>
              <div className="text-[11px] text-blue-400 mt-0.5">Active Subscription</div>
            </div>
            <button
              onClick={() => navigate('/dashboard/subscription')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-between"
            >
              <span>View Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* LATEST RELEASES SECTION */}
        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white font-display">Latest Releases</h2>
              <p className="text-xs text-slate-400">Track submission status, barcode assignments, and catalog details</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard/releases')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                See All
              </button>
              <button
                onClick={() => navigate('/dashboard/releases/new')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload One</span>
              </button>
            </div>
          </div>

          {releases.length === 0 ? (
            <div className="py-12 text-center bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
              <Disc3 className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">No releases found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your catalog is currently empty. Upload your first single, EP, or album to start distribution.
              </p>
              <button
                onClick={() => navigate('/dashboard/releases/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                Upload One
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3 font-medium">Release Title</th>
                    <th className="pb-3 font-medium">Primary Artist</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">UPC Barcode</th>
                    <th className="pb-3 font-medium">Submitted</th>
                    <th className="pb-3 font-medium">Actual Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {releases.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-medium text-white flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                          {r.artworkUrl ? (
                            <img src={r.artworkUrl} alt={r.title} className="w-full h-full object-cover" />
                          ) : (
                            <Disc3 className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <span className="truncate max-w-[200px]">{r.title}</span>
                      </td>
                      <td className="py-3">{r.artist}</td>
                      <td className="py-3 font-mono text-[11px]">{r.type}</td>
                      <td className="py-3 font-mono text-[11px]">{r.upc}</td>
                      <td className="py-3 font-mono text-[11px] text-slate-400">
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                            r.status === 'Approved'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                              : r.status === 'Submitted' || r.status === 'Under Review'
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                              : r.status === 'Action Required'
                              ? 'bg-orange-950/80 text-orange-400 border border-orange-800/80'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate(`/dashboard/releases/${r.id}`)}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ROYALTY TRENDS SECTION */}
        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white font-display">Royalty Trends & Analytics</h2>
              <p className="text-xs text-slate-400">Filter streaming statements and revenue across reporting dimensions</p>
            </div>

            {/* Time range selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              {(['6m', 'top5', 'top10', 'top20'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    timeRange === range
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range === '6m' ? '6 Months' : range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {(['Platform', 'Singer', 'Song', 'Label', 'Country', 'Monthly Trend'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTrendFilter(f)}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
                  trendFilter === f
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Filter by {f}
              </button>
            ))}
          </div>

          {/* Recharts Visual Dashboard Preview */}
          {monthlyRoyalties.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Total Net Royalties (Cleared & Pipeline):</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{monthlyRoyalties.reduce((acc, m) => acc + m.netRoyalty, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/dashboard/financial')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <span>Open Full Financial & Royalty Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {trendFilter === 'Platform' ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dspBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 11 }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Royalties']}
                      />
                      <Bar dataKey="royalties" name="Royalties (₹)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeRange === '6m' ? monthlyRoyalties.slice(-6) : monthlyRoyalties}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="ovRoyaltyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="monthLabel" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 11 }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Net Royalty']}
                      />
                      <Area
                        type="monotone"
                        dataKey="netRoyalty"
                        name="Net Artist Share (₹)"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#ovRoyaltyGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span>100% Artist Keep · Reconciled across Spotify, Apple Music, YouTube, JioSaavn & Amazon</span>
                <button
                  onClick={() => navigate('/dashboard/financial')}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  View Payouts & Statements →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <BarChart2 className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">
                No statement data found
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Verified streaming reporting statements will appear here after receiving DSP quarterly settlement feeds (typically 60–90 days).
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
