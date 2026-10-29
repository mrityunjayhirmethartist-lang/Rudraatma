import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Disc3,
  Layers,
  PieChart as PieIcon,
  BarChart3,
  FileSpreadsheet,
  Info,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { MonthlyRoyalty, DspRoyaltyShare, TrackRoyalty, TransactionItem } from '../../types';

// Custom Dark Tooltip for Royalty Trends Chart
const CustomTrendsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MonthlyRoyalty;
    return (
      <div className="p-3.5 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md text-xs min-w-[220px]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="font-semibold text-white font-display flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            {data.monthLabel || label}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              data.status === 'Cleared'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                : data.status === 'In Clearance'
                ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                : 'bg-blue-950 text-blue-400 border border-blue-800/60'
            }`}
          >
            {data.status}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              Gross Royalty:
            </span>
            <span className="font-mono font-bold text-white">₹{data.grossRoyalty?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Net Artist Share:
            </span>
            <span className="font-mono font-bold text-emerald-400">₹{data.netRoyalty?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800/70">
            <span>Verified Streams:</span>
            <span className="font-mono text-slate-200">{data.streams?.toLocaleString('en-IN')} plays</span>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Effective RPM:</span>
            <span className="font-mono text-cyan-300">
              ₹{data.streams > 0 ? ((data.netRoyalty / data.streams) * 1000).toFixed(2) : '0.00'} / 1k
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for DSP Distribution Pie Chart
const CustomDspTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DspRoyaltyShare;
    return (
      <div className="p-3 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md text-xs">
        <div className="font-semibold text-white mb-1.5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span>{data.name}</span>
        </div>
        <div className="space-y-1 font-mono">
          <div className="text-slate-300 flex justify-between gap-4">
            <span>Revenue:</span>
            <span className="font-bold text-white">₹{data.royalties?.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-slate-400 flex justify-between gap-4 text-[11px]">
            <span>Share:</span>
            <span className="text-cyan-400">{data.percentage}%</span>
          </div>
          <div className="text-slate-400 flex justify-between gap-4 text-[11px]">
            <span>Streams:</span>
            <span>{data.streams?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const FinancialPage: React.FC = () => {
  const { token, user } = useAuth();
  const { navigate } = useRouter();

  // Dashboard Data State
  const [balance, setBalance] = useState<number>(0);
  const [lastPayout, setLastPayout] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [monthlyRoyalties, setMonthlyRoyalties] = useState<MonthlyRoyalty[]>([]);
  const [dspBreakdown, setDspBreakdown] = useState<DspRoyaltyShare[]>([]);
  const [topTracks, setTopTracks] = useState<TrackRoyalty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active Tab: 'trends' | 'dsp' | 'statements' | 'payout'
  const [activeTab, setActiveTab] = useState<'trends' | 'dsp' | 'statements' | 'payout'>('trends');

  // Chart Controls
  const [timeRange, setTimeRange] = useState<'6m' | 'all'>('6m');
  const [chartMetric, setChartMetric] = useState<'royalties' | 'streams' | 'dual'>('royalties');
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  // Payout Form State
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [payoutMethod, setPayoutMethod] = useState<'Bank Transfer (IMPS)' | 'UPI ID'>('Bank Transfer (IMPS)');
  const [payoutDetails, setPayoutDetails] = useState<string>('');
  const [payoutSubmitting, setPayoutSubmitting] = useState<boolean>(false);
  const [payoutMsg, setPayoutMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch Dashboard Data
  const fetchData = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/dashboard/data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setBalance(d.balance ?? 0);
        setLastPayout(d.lastPayout ?? 0);
        setTransactions(d.transactions || []);
        setMonthlyRoyalties(d.monthlyRoyalties || []);
        setDspBreakdown(d.dspBreakdown || []);
        setTopTracks(d.topTracks || []);
      }
    } catch (err) {
      console.error('Failed to load financial telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Handle Payout Request
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(payoutAmount);
    if (amt <= 0 || isNaN(amt)) {
      setPayoutMsg({ type: 'error', text: 'Please enter a valid payout amount.' });
      return;
    }
    if (amt < 100) {
      setPayoutMsg({ type: 'error', text: 'Minimum withdrawal threshold is ₹100.00.' });
      return;
    }
    if (amt > balance) {
      setPayoutMsg({ type: 'error', text: 'Requested payout exceeds cleared available wallet balance.' });
      return;
    }
    if (!payoutDetails.trim()) {
      setPayoutMsg({ type: 'error', text: 'Beneficiary account or UPI ID details are required.' });
      return;
    }

    setPayoutSubmitting(true);
    setPayoutMsg(null);

    try {
      const res = await fetch('/api/dashboard/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: amt, method: payoutMethod, details: payoutDetails.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBalance(data.newBalance);
        setLastPayout(amt);
        setTransactions(prev => [data.transaction, ...prev]);
        setPayoutMsg({
          type: 'success',
          text: `Payout request for ₹${amt.toFixed(2)} submitted successfully! Settlement Reference: ${data.transaction.reference}. Disbursement will credit within 24 business hours.`
        });
        setPayoutAmount('');
        setPayoutDetails('');
      } else {
        setPayoutMsg({ type: 'error', text: data.error || 'Failed to submit withdrawal request.' });
      }
    } catch {
      setPayoutMsg({ type: 'error', text: 'Network failure while dispatching payout request.' });
    } finally {
      setPayoutSubmitting(false);
    }
  };

  // Filtered Monthly Royalties for Chart
  const chartData = useMemo(() => {
    if (timeRange === '6m') {
      return monthlyRoyalties.slice(-6);
    }
    return monthlyRoyalties;
  }, [monthlyRoyalties, timeRange]);

  // Aggregate KPIs
  const totalLifetimeRoyalties = useMemo(() => {
    return monthlyRoyalties.reduce((acc, m) => acc + (m.netRoyalty || 0), 0);
  }, [monthlyRoyalties]);

  const totalLifetimeStreams = useMemo(() => {
    return monthlyRoyalties.reduce((acc, m) => acc + (m.streams || 0), 0);
  }, [monthlyRoyalties]);

  const pendingClearanceRoyalties = useMemo(() => {
    return monthlyRoyalties
      .filter(m => m.status === 'In Clearance' || m.status === 'Processing')
      .reduce((acc, m) => acc + (m.netRoyalty || 0), 0);
  }, [monthlyRoyalties]);

  const avgLifetimeRPM = useMemo(() => {
    if (totalLifetimeStreams === 0) return 0;
    return (totalLifetimeRoyalties / totalLifetimeStreams) * 1000;
  }, [totalLifetimeRoyalties, totalLifetimeStreams]);

  // Threshold Calculation (₹100 min)
  const thresholdPercent = Math.min(100, Math.round((balance / 100) * 100));

  // CSV Export Trigger
  const handleDownloadStatement = (month?: string) => {
    const url = month
      ? `/api/dashboard/royalties/export?month=${encodeURIComponent(month)}`
      : '/api/dashboard/royalties/export';
    window.location.href = url;
  };

  return (
    <DashboardLayout title="Financial">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-950 text-blue-400 border border-blue-800 rounded-md">
                100% Artist Keep
              </span>
              <span className="text-xs text-slate-400">Account: {user?.fullName || 'Artist'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Financials & Royalty Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Recharts visual analytics of digital streaming royalties, DSP market shares, and verified bank payouts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleDownloadStatement()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl text-xs font-semibold transition-all shadow-sm"
              title="Download consolidated royalty ledger CSV"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export All Statements (.CSV)</span>
            </button>

            <button
              onClick={() => setActiveTab('payout')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Request Payout</span>
            </button>
          </div>
        </div>

        {/* 5 Primary Financial Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1: Available Wallet Balance */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0b1424] to-[#090e1a] border border-emerald-900/40 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Cleared Available Balance</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Withdrawal status:</span>
              <span className={`font-semibold ${balance >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {balance >= 100 ? 'Eligible for Payout' : 'Under Threshold'}
              </span>
            </div>
          </div>

          {/* 2: Lifetime Cleared Royalties */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Lifetime Gross Royalties</span>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                ₹{totalLifetimeRoyalties.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Across all partner DSPs</span>
              <span className="text-emerald-400 font-mono flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +18.4%
              </span>
            </div>
          </div>

          {/* 3: In-Flight DSP Reconciliation (60-90 Day Pipeline) */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">DSP Clearing Pipeline</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tabular-nums">
                ₹{pendingClearanceRoyalties.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>60–90 day reconciliation lag</span>
              <span className="text-amber-300 font-medium">In Transit</span>
            </div>
          </div>

          {/* 4: Total Verified Streams */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Verified Streams</span>
                <Disc3 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-300 tabular-nums">
                {totalLifetimeStreams >= 1000000
                  ? `${(totalLifetimeStreams / 1000000).toFixed(2)}M`
                  : totalLifetimeStreams >= 1000
                  ? `${(totalLifetimeStreams / 1000).toFixed(1)}k`
                  : totalLifetimeStreams}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Avg RPM:</span>
              <span className="font-mono text-white font-semibold">₹{avgLifetimeRPM.toFixed(2)} / 1k</span>
            </div>
          </div>

          {/* 5: Completed Payouts & Threshold */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Last Settled Payout</span>
                <CreditCard className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                ₹{lastPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Threshold (₹100 min):</span>
                <span className="font-mono text-emerald-400">{thresholdPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${thresholdPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-px">
          {[
            { id: 'trends', label: 'Monthly Trends (Recharts)', icon: BarChart3 },
            { id: 'dsp', label: 'DSP Platform Breakdown', icon: PieIcon },
            { id: 'statements', label: 'Monthly Statements', icon: FileSpreadsheet },
            { id: 'payout', label: 'Payout & Bank Settlement', icon: Wallet }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-400 font-semibold bg-blue-500/5'
                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: VISUAL RECHARTS MONTHLY ROYALTY TRENDS DASHBOARD */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* Chart Container Card */}
            <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-6">
              {/* Header and Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white font-display">
                      Monthly Royalty Earnings Trends
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
                      Live Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Historical progression of monthly streaming revenues, verified streams, and net payouts
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Time Range Selector */}
                  <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                    <button
                      onClick={() => setTimeRange('6m')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        timeRange === '6m'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Last 6 Months
                    </button>
                    <button
                      onClick={() => setTimeRange('all')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        timeRange === 'all'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All Cycles
                    </button>
                  </div>

                  {/* Chart Metric Selector */}
                  <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                    <button
                      onClick={() => setChartMetric('royalties')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        chartMetric === 'royalties'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Royalties (₹)
                    </button>
                    <button
                      onClick={() => setChartMetric('streams')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        chartMetric === 'streams'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Streams
                    </button>
                    <button
                      onClick={() => setChartMetric('dual')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        chartMetric === 'dual'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Dual Axis
                    </button>
                  </div>

                  {/* Chart Type Selector */}
                  <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                    <button
                      onClick={() => setChartType('area')}
                      className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                        chartType === 'area'
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Area Chart"
                    >
                      Area
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                        chartType === 'bar'
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Bar Chart"
                    >
                      Bars
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                        chartType === 'line'
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Line Chart"
                    >
                      Line
                    </button>
                  </div>
                </div>
              </div>

              {/* RECHARTS MAIN CONTAINER */}
              <div className="w-full h-80 sm:h-96 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'area' ? (
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="royaltyGrossGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="royaltyNetGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="streamsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="monthLabel"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                        tickFormatter={(v) => (chartMetric === 'streams' ? `${(v / 1000).toFixed(0)}k` : `₹${(v / 1000).toFixed(0)}k`)}
                      />
                      {chartMetric === 'dual' && (
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#8b5cf6"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k plays`}
                        />
                      )}
                      <Tooltip content={<CustomTrendsTooltip />} />
                      <Legend
                        wrapperStyle={{ paddingTop: 16, fontSize: 12, color: '#94a3b8' }}
                        iconType="circle"
                      />

                      {chartMetric !== 'streams' && (
                        <>
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="grossRoyalty"
                            name="Gross Royalty (₹)"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#royaltyGrossGrad)"
                          />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="netRoyalty"
                            name="Net Artist Share (₹)"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#royaltyNetGrad)"
                          />
                        </>
                      )}

                      {(chartMetric === 'streams' || chartMetric === 'dual') && (
                        <Area
                          yAxisId={chartMetric === 'dual' ? 'right' : 'left'}
                          type="monotone"
                          dataKey="streams"
                          name="Verified Streams"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#streamsGrad)"
                        />
                      )}
                    </AreaChart>
                  ) : chartType === 'bar' ? (
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="monthLabel"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                        tickFormatter={(v) => (chartMetric === 'streams' ? `${(v / 1000).toFixed(0)}k` : `₹${(v / 1000).toFixed(0)}k`)}
                      />
                      <Tooltip content={<CustomTrendsTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12, color: '#94a3b8' }} />

                      {chartMetric !== 'streams' && (
                        <>
                          <Bar dataKey="grossRoyalty" name="Gross Royalty (₹)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="netRoyalty" name="Net Artist Share (₹)" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </>
                      )}
                      {chartMetric === 'streams' && (
                        <Bar dataKey="streams" name="Verified Streams" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                      )}
                    </BarChart>
                  ) : (
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="monthLabel"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                        tickFormatter={(v) => (chartMetric === 'streams' ? `${(v / 1000).toFixed(0)}k` : `₹${(v / 1000).toFixed(0)}k`)}
                      />
                      <Tooltip content={<CustomTrendsTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12, color: '#94a3b8' }} />

                      {chartMetric !== 'streams' && (
                        <>
                          <Line
                            type="monotone"
                            dataKey="grossRoyalty"
                            name="Gross Royalty (₹)"
                            stroke="#06b6d4"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: '#06b6d4' }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="netRoyalty"
                            name="Net Artist Share (₹)"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10b981' }}
                            activeDot={{ r: 6 }}
                          />
                        </>
                      )}
                      {chartMetric === 'streams' && (
                        <Line
                          type="monotone"
                          dataKey="streams"
                          name="Verified Streams"
                          stroke="#8b5cf6"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#8b5cf6' }}
                          activeDot={{ r: 6 }}
                        />
                      )}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Insights and Reconciliation Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Peak Revenue Cycle</span>
                  </div>
                  <div className="text-sm font-bold text-white font-display">
                    {monthlyRoyalties.length > 0
                      ? [...monthlyRoyalties].sort((a, b) => b.netRoyalty - a.netRoyalty)[0]?.monthLabel
                      : 'N/A'}{' '}
                    - ₹
                    {monthlyRoyalties.length > 0
                      ? Math.max(...monthlyRoyalties.map(m => m.netRoyalty)).toLocaleString('en-IN')
                      : '0'}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Highest quarterly settlement recorded</p>
                </div>

                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Distribution Royalty Rate</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400 font-display">
                    100% Artist Keep
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Zero commission deduction on master rights</p>
                </div>

                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>Reconciliation Timeline</span>
                  </div>
                  <div className="text-sm font-bold text-white font-display">
                    60 to 90 Days Lag
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">DSP global accounting standard cycle</p>
                </div>
              </div>
            </div>

            {/* Top Performing Releases Bar Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Tracks Bar Chart */}
              <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                    <Disc3 className="w-4 h-4 text-blue-400" />
                    <span>Top Royalty-Generating Releases</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Revenue generated by track catalog</p>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={topTracks}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis
                        type="number"
                        stroke="#64748b"
                        fontSize={11}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                      />
                      <YAxis
                        type="category"
                        dataKey="title"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        width={120}
                        tickFormatter={(v) => (v.length > 14 ? v.slice(0, 14) + '…' : v)}
                      />
                      <Tooltip
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Royalties']}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: 8,
                          fontSize: 11
                        }}
                      />
                      <Bar dataKey="royalties" fill="#3b82f6" radius={[0, 6, 6, 0]}>
                        {topTracks.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6'][index % 4]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {topTracks.map(trk => (
                    <div key={trk.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate max-w-[200px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-white truncate">{trk.title}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-400 text-[11px]">{trk.streams.toLocaleString('en-IN')} plays</span>
                        <span className="text-emerald-400 font-bold">₹{trk.royalties.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DSP Quick Donut Card */}
              <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <PieIcon className="w-4 h-4 text-cyan-400" />
                      <span>DSP Platform Contribution</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Streaming revenue breakdown by store</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dsp')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <span>Full Breakdown</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dspBreakdown}
                        dataKey="royalties"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {dspBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomDspTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  {dspBreakdown.slice(0, 4).map(dsp => (
                    <div key={dsp.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/50">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dsp.color }} />
                        <span className="text-slate-300 text-[11px] truncate">{dsp.name}</span>
                      </div>
                      <span className="font-mono font-bold text-white text-[11px]">{dsp.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED DSP PLATFORM BREAKDOWN */}
        {activeTab === 'dsp' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Pie Chart Card */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    Platform Revenue Share
                  </h2>
                  <p className="text-xs text-slate-400">
                    Proportionate royalties generated across digital streaming providers
                  </p>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dspBreakdown}
                        dataKey="royalties"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={3}
                      >
                        {dspBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomDspTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-center p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Total Royalties Monitored</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    ₹{totalLifetimeRoyalties.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* DSP Table & Statistics */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    DSP Performance Ledger
                  </h2>
                  <p className="text-xs text-slate-400">
                    Verified play counts, gross royalty payouts, and store-specific market rates
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="pb-3">Platform</th>
                        <th className="pb-3">Share</th>
                        <th className="pb-3">Streams</th>
                        <th className="pb-3">Avg Rate/Stream</th>
                        <th className="pb-3 text-right">Net Royalties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {dspBreakdown.map(dsp => {
                        const perStream = dsp.streams > 0 ? (dsp.royalties / dsp.streams).toFixed(3) : '0.00';
                        return (
                          <tr key={dsp.name} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3.5 font-semibold text-white flex items-center gap-2.5">
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: dsp.color }} />
                              <span>{dsp.name}</span>
                            </td>
                            <td className="py-3.5">
                              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-cyan-300 border border-slate-800">
                                {dsp.percentage}%
                              </span>
                            </td>
                            <td className="py-3.5 font-mono text-[11px] text-slate-300">
                              {dsp.streams.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 font-mono text-[11px] text-slate-400">
                              ₹{perStream}
                            </td>
                            <td className="py-3.5 text-right font-mono font-bold text-emerald-400">
                              ₹{dsp.royalties.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* DSP Policy Note */}
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/60 flex items-start gap-3">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-white">Store Payout Rates:</strong> Streaming rates vary based on subscriber territory (Tier 1 vs. India domestic), premium vs. ad-supported free tiers, and currency exchange rates. Rudraatma Music settles 100% of the raw provider calculation directly to your wallet.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MONTHLY RECONCILIATION STATEMENTS */}
        {activeTab === 'statements' && (
          <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Monthly Royalty Statements
                </h2>
                <p className="text-xs text-slate-400">
                  Itemized monthly accounting statements with verified DSP settlement receipts
                </p>
              </div>

              <button
                onClick={() => handleDownloadStatement()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Full Ledger (.CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3">Statement ID</th>
                    <th className="pb-3">Reporting Period</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Streams</th>
                    <th className="pb-3">Gross (₹)</th>
                    <th className="pb-3">Net Artist (₹)</th>
                    <th className="pb-3">Settlement Date</th>
                    <th className="pb-3 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {monthlyRoyalties.map((stmt) => (
                    <tr key={stmt.statementId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 font-mono text-[11px] text-blue-400 font-semibold">
                        {stmt.statementId}
                      </td>
                      <td className="py-3.5 font-medium text-white">
                        {stmt.monthLabel}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            stmt.status === 'Cleared'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                              : stmt.status === 'In Clearance'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/80'
                              : 'bg-blue-950 text-blue-400 border border-blue-800/80'
                          }`}
                        >
                          {stmt.status === 'Cleared' && <CheckCircle2 className="w-3 h-3" />}
                          {stmt.status === 'In Clearance' && <Clock className="w-3 h-3" />}
                          <span>{stmt.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-[11px]">
                        {stmt.streams.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 font-mono text-slate-300">
                        ₹{stmt.grossRoyalty.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 font-mono font-bold text-emerald-400">
                        ₹{stmt.netRoyalty.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 font-mono text-[11px] text-slate-400">
                        {stmt.payoutDate ? new Date(stmt.payoutDate).toLocaleDateString() : 'Awaiting Cycle'}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDownloadStatement(stmt.month)}
                          className="p-1.5 hover:bg-slate-800 text-blue-400 hover:text-blue-300 rounded-lg transition-colors"
                          title="Download statement CSV"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYOUT & SETTLEMENT */}
        {activeTab === 'payout' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Withdrawal Request Form */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-5">
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Request Wallet Payout
                </h2>
                <p className="text-xs text-slate-400">
                  Instant settlement via IMPS or Unified Payments Interface (UPI)
                </p>
              </div>

              {/* Status Message */}
              {payoutMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    payoutMsg.type === 'success'
                      ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                      : 'bg-rose-950/60 border border-rose-800 text-rose-200'
                  }`}
                >
                  {payoutMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{payoutMsg.text}</span>
                </div>
              )}

              {/* Available Balance Reminder */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Cleared Balance Available</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPayoutAmount(balance.toFixed(2))}
                  disabled={balance < 100}
                  className="px-2.5 py-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/60 border border-blue-800/80 rounded-lg disabled:opacity-40"
                >
                  Max Available
                </button>
              </div>

              <form onSubmit={handleRequestPayout} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Withdrawal Amount in INR *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-500 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="100"
                      max={balance}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Minimum payout threshold: ₹100.00</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Payout Method *
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Bank Transfer (IMPS)">Bank Transfer (IMPS / IFSC)</option>
                    <option value="UPI ID">Verified UPI ID (Google Pay, PhonePe, Paytm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Beneficiary Account / UPI Identifier *
                  </label>
                  <input
                    type="text"
                    value={payoutDetails}
                    onChange={(e) => setPayoutDetails(e.target.value)}
                    placeholder={
                      payoutMethod === 'UPI ID'
                        ? 'e.g. artistname@oksbi or 9876543210@paytm'
                        : 'e.g. A/C 50100492819 IFSC HDFC0000123'
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={payoutSubmitting || balance < 100}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{payoutSubmitting ? 'Verifying & Dispatching...' : 'Submit Withdrawal Request'}</span>
                </button>
              </form>
            </div>

            {/* Payout & Settlement Ledger */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Wallet Settlement History
                </h2>
                <p className="text-xs text-slate-400">
                  Audit log of credited royalties, automated withdrawals, and bank transfers
                </p>
              </div>

              {transactions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  No financial transactions recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Description</th>
                        <th className="pb-3">Reference</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 font-semibold">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                tx.type === 'Credit'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                                  : 'bg-blue-950 text-blue-400 border border-blue-800/80'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3 font-medium text-white truncate max-w-[200px]">
                            {tx.description}
                          </td>
                          <td className="py-3 font-mono text-[11px] text-slate-400">
                            {tx.reference}
                          </td>
                          <td className="py-3 font-mono text-[11px] text-slate-400">
                            {tx.date}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                tx.status === 'Completed'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : 'bg-amber-950 text-amber-400'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td
                            className={`py-3 text-right font-mono font-bold ${
                              tx.type === 'Credit' ? 'text-emerald-400' : 'text-slate-200'
                            }`}
                          >
                            {tx.type === 'Credit' ? '+' : '-'}₹
                            {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
