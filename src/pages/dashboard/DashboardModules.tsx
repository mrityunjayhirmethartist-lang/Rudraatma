import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { LabelItem, ArtistProfile, SupportTicket, SmartLink, OtherRequest, TransactionItem } from '../../types';
import { PRICING_PLANS } from '../../data/pricingData';
import {
  Tag,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Wallet,
  Users,
  LifeBuoy,
  CreditCard,
  Receipt,
  MoreHorizontal,
  Youtube,
  Mic2,
  Share2,
  FileEdit,
  Send,
  Copy,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

// ======================== 1. MY LABELS PAGE ========================
export const MyLabelsPage: React.FC = () => {
  const { token } = useAuth();
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [newLabelName, setNewLabelName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setLabels(data.labels || []));
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newLabelName })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLabels(prev => [data.label, ...prev]);
        setNewLabelName('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="My Labels">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-display">My Record Labels</h1>
            <p className="text-xs text-slate-400">Manage approved record label entities, custom label codes, and catalog allocations</p>
          </div>
        </div>

        {/* Create Label Input */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800">
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="Enter new label name (e.g. Rudra Sounds Records)..."
              className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !newLabelName.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register Label</span>
            </button>
          </form>
        </div>

        {/* Labels List */}
        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800">
          {labels.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">No labels registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3">Label Name</th>
                    <th className="pb-3">Label Code</th>
                    <th className="pb-3">Approval Status</th>
                    <th className="pb-3">Linked Catalog</th>
                    <th className="pb-3">Date Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {labels.map((l) => (
                    <tr key={l.id}>
                      <td className="py-3 font-semibold text-white">{l.name}</td>
                      <td className="py-3 font-mono text-[11px] text-blue-400">{l.code}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          l.status === 'Approved' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px]">{l.catalogCount} Releases</td>
                      <td className="py-3 font-mono text-[11px] text-slate-400">{l.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 2. PROFILE PAGE ========================
export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Artist Account Profile</h1>
          <p className="text-xs text-slate-400">Manage legal identification, country, and security credentials</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
              <input type="text" defaultValue={user?.fullName} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Account Email</label>
              <input type="email" readOnly value={user?.email} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 cursor-not-allowed" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
              <input type="text" defaultValue={user?.country} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Account Role</label>
              <input type="text" readOnly value={user?.role} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-blue-400 font-mono capitalize" />
            </div>
          </div>

          {saved && (
            <div className="p-3 text-xs text-emerald-300 bg-emerald-950/60 rounded-lg">
              Profile details updated.
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setSaved(true)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 3. REPORTS & ROYALTIES ========================
export const ReportsPage: React.FC = () => {
  const { token } = useAuth();
  const { navigate } = useRouter();
  const [statements, setStatements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => {
        setStatements(d.monthlyRoyalties || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownload = (month?: string) => {
    const url = month
      ? `/api/dashboard/royalties/export?month=${encodeURIComponent(month)}`
      : '/api/dashboard/royalties/export';
    window.location.href = url;
  };

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-display">Royalty Statements & Stream Reports</h1>
            <p className="text-xs text-slate-400">Quarterly reconciliation feeds processed directly from digital service providers</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/financial')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>View Visual Recharts Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDownload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All Statements (.CSV)</span>
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Accounting Cycles:</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-white font-semibold">
                2025 – 2026 Live Feeds
              </span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              {statements.length} verified monthly periods
            </span>
          </div>

          {statements.length === 0 ? (
            <div className="py-16 text-center bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">No finalized royalty statements yet</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Partner platforms report streaming calculations on a 60-to-90 day reconciliation lag. Statements will populate here once verified by our accounting desk.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3">Statement Ref</th>
                    <th className="pb-3">Period</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Verified Plays</th>
                    <th className="pb-3">Gross (₹)</th>
                    <th className="pb-3">Net Artist (₹)</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {statements.map((s) => (
                    <tr key={s.statementId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-mono text-[11px] text-blue-400 font-semibold">{s.statementId}</td>
                      <td className="py-3 font-medium text-white">{s.monthLabel}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.status === 'Cleared' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80' : 'bg-amber-950 text-amber-400 border border-amber-800/80'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px]">{s.streams.toLocaleString('en-IN')}</td>
                      <td className="py-3 font-mono text-slate-300">₹{s.grossRoyalty.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 font-mono font-bold text-emerald-400">₹{s.netRoyalty.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDownload(s.month)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 border border-slate-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>CSV</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 4. FINANCIAL & WALLET ========================
export { FinancialPage } from './FinancialPage';

// ======================== 5. USER MANAGEMENT ========================
export const UserManagementPage: React.FC = () => {
  const { token } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => setMembers(d.teamMembers || []));
  }, [token]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const res = await fetch('/api/dashboard/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: inviteName, email: inviteEmail, role: inviteRole })
    });
    const d = await res.json();
    if (d.success) {
      setMembers(prev => [...prev, d.member]);
      setInviteName('');
      setInviteEmail('');
    }
  };

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Workspace Team & Roles</h1>
          <p className="text-xs text-slate-400">Invite label managers, collaborators, or accountants with scoped role permissions</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800">
          <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Team Member Name"
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="member@domain.com"
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            >
              <option value="Label Manager">Label Manager</option>
              <option value="Artist">Artist Collaborator</option>
              <option value="Viewer">Viewer / Accountant</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Invite Member
            </button>
          </form>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Workspace Role</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="py-3 font-semibold text-white">{m.name}</td>
                  <td className="py-3 font-mono text-slate-400">{m.email}</td>
                  <td className="py-3">{m.role}</td>
                  <td className="py-3 text-emerald-400 font-mono text-[11px]">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 6. SUPPORT TICKETING ========================
export const SupportPage: React.FC = () => {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Metadata Inquiry');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => setTickets(d.tickets || []));
  }, [token]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    const res = await fetch('/api/dashboard/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ subject, category, message, priority: 'Medium' })
    });
    const d = await res.json();
    if (d.success) {
      setTickets(prev => [d.ticket, ...prev]);
      setSubject('');
      setMessage('');
    }
  };

  return (
    <DashboardLayout title="Support Desk">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Artist Support Desk</h1>
          <p className="text-xs text-slate-400">Open priority tickets with Rudraatma Music operations desk. Response within 24–48 hours.</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white font-display">Create Support Ticket</h2>
          <form onSubmit={handleCreateTicket} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ticket Subject..."
                className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="Metadata Inquiry">Metadata Inquiry</option>
                <option value="Audio / Artwork QC">Audio / Artwork QC</option>
                <option value="Payout Assistance">Payout Assistance</option>
                <option value="Takedown Assistance">Takedown Assistance</option>
              </select>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Describe your inquiry with relevant release titles..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Existing tickets */}
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-blue-400 mr-2">{t.id}</span>
                  <span className="font-bold text-white text-sm">{t.subject}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400">
                  {t.status}
                </span>
              </div>
              <div className="space-y-2 text-xs bg-slate-950/60 p-3 rounded-lg">
                {t.messages.map((m, i) => (
                  <div key={i} className="text-slate-300">
                    <strong className="text-white">{m.sender}:</strong> {m.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 7. SUBSCRIPTION MANAGEMENT ========================
export const SubscriptionPlanPage: React.FC = () => {
  const { navigate } = useRouter();
  const { token, selectedPlanId } = useAuth();
  const [activePlanId, setActivePlanId] = useState('growth-monthly');
  const [subscription, setSubscription] = useState<any>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const fetchSubscriptionData = () => {
    if (!token) return;
    fetch('/api/dashboard/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => {
        if (d.planId) setActivePlanId(d.planId);
        if (d.subscription) setSubscription(d.subscription);
      });
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [token]);

  const handleCancelAutoRenew = async () => {
    if (!confirm('Are you sure you want to cancel automatic renewal? Your benefits will remain active until the end of your current cycle.')) return;
    setCancelLoading(true);
    try {
      const res = await fetch('/api/razorpay/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCancelMessage(data.message);
        fetchSubscriptionData();
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const currentPlan = PRICING_PLANS.find(p => p.id === activePlanId) || PRICING_PLANS[0];

  return (
    <DashboardLayout title="Subscription Plan">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Subscription & Product Plan</h1>
          <p className="text-xs text-slate-400">View active subscription terms, renewal status, verified Razorpay payment records, and available catalog plans</p>
        </div>

        {/* Active Subscription Status Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#090e1a] to-[#090e1a] border border-blue-500/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                  {subscription?.status === 'active' ? (subscription?.autoRenew ? 'Active • Auto-Renewing' : 'Active • Renews Manually') : 'Active Plan'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Verified via Razorpay
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white font-display">
                {currentPlan.name}
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                {currentPlan.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-300">
                <div>
                  <span className="text-slate-400">Plan Rate: </span>
                  <span className="font-bold text-white">₹{currentPlan.priceINR} {currentPlan.billingText}</span>
                </div>
                {subscription?.renewsAt && (
                  <div>
                    <span className="text-slate-400">Next Renewal: </span>
                    <span className="text-blue-400 font-bold">{subscription.renewsAt}</span>
                  </div>
                )}
                {subscription?.paymentId && (
                  <div>
                    <span className="text-slate-400">Payment ID: </span>
                    <span className="text-emerald-400">{subscription.paymentId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {currentPlan.type !== 'one-time' && subscription?.autoRenew && (
                <button
                  onClick={handleCancelAutoRenew}
                  disabled={cancelLoading}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-900/60 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {cancelLoading ? 'Cancelling...' : 'Cancel Auto-Renewal'}
                </button>
              )}
              <button
                onClick={() => navigate('/dashboard/wallet-transactions')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                Payment Ledger
              </button>
            </div>
          </div>

          {cancelMessage && (
            <div className="mt-4 p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs text-blue-300">
              {cancelMessage}
            </div>
          )}
        </div>

        {/* Catalog Grid for Plan Switching */}
        <div>
          <h2 className="text-base font-bold text-white font-display mb-4">
            Available Distribution Plans & Standalone Releases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_PLANS.map((p) => {
              const isCurrent = p.id === activePlanId;
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl bg-[#090e1a] border flex flex-col justify-between ${
                    isCurrent ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-mono uppercase text-slate-400">{p.type}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          Active Plan
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white mt-1">{p.name}</h3>
                    <div className="text-xl font-bold font-mono text-white mt-2">
                      ₹{p.priceINR} <span className="text-xs text-slate-400 font-normal">{p.billingText}</span>
                    </div>
                    {p.annualCalculation && (
                      <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                        {p.annualCalculation}
                      </div>
                    )}
                    <div className="text-xs text-blue-300 mt-1 font-medium">{p.allowance}</div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800">
                    {isCurrent ? (
                      <div className="py-2 text-center text-xs font-semibold text-emerald-400 bg-emerald-950/40 rounded-lg">
                        Currently Selected
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate(`/checkout?planId=${p.id}`)}
                        className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                      >
                        {p.type === 'one-time' ? `Purchase for ₹${p.priceINR}` : `Switch to ${p.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 8. WALLET TRANSACTIONS ========================
export const WalletTransactionsPage: React.FC = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => setTransactions(d.transactions || []));
  }, [token]);

  return (
    <DashboardLayout title="Wallet Transactions">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Wallet Transactions & Ledger</h1>
          <p className="text-xs text-slate-400">Auditable accounting records of royalty credits, debits, and verified payouts</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800">
          {transactions.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">No transactions recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3">Reference ID</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Amount (INR)</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3 font-mono text-[11px] text-blue-400">{tx.reference}</td>
                      <td className="py-3 font-semibold text-white">{tx.type}</td>
                      <td className="py-3">{tx.description}</td>
                      <td className="py-3 font-mono text-white font-bold tabular-nums">₹{tx.amount.toFixed(2)}</td>
                      <td className="py-3 text-emerald-400 font-mono text-[11px]">{tx.status}</td>
                      <td className="py-3 font-mono text-[11px] text-slate-400">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 9. OTHERS (TOOLS) ========================
export const OthersPage: React.FC = () => {
  const [upcResult, setUpcResult] = useState('');
  const [isrcResult, setIsrcResult] = useState('');

  const generateUpc = () => {
    setUpcResult('890' + Math.floor(1000000000 + Math.random() * 9000000000));
  };

  const generateIsrc = () => {
    setIsrcResult('IN-RUD-26-' + Math.floor(1000 + Math.random() * 9000));
  };

  return (
    <DashboardLayout title="Others">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Metadata & Barcode Utilities</h1>
          <p className="text-xs text-slate-400">Generate candidate UPC packages, track-level ISRC identifiers, and metadata presets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white font-display">UPC Barcode Generator</h2>
            <p className="text-xs text-slate-400">Generate an EAN-13 compatible 890-prefix barcode for release packaging.</p>
            <button
              onClick={generateUpc}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Generate UPC Code
            </button>
            {upcResult && (
              <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-400 border border-slate-800">
                Generated UPC: {upcResult}
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white font-display">Track ISRC Code Generator</h2>
            <p className="text-xs text-slate-400">Standardized IN-RUD-26 track identification format.</p>
            <button
              onClick={generateIsrc}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Generate Track ISRC
            </button>
            {isrcResult && (
              <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-400 border border-slate-800">
                Generated ISRC: {isrcResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 10. YOUTUBE INTEGRATIONS ========================
export const YouTubePage: React.FC = () => {
  return (
    <DashboardLayout title="YouTube">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">YouTube Music & Content ID</h1>
          <p className="text-xs text-slate-400">Content ID fingerprinting status, Official Artist Channel (OAC) guidelines, and channel claims</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Youtube className="w-8 h-8 text-rose-500" />
            <div>
              <h2 className="text-sm font-bold text-white font-display">Official Artist Channel (OAC) Integration</h2>
              <span className="text-xs text-slate-400">Consolidate your Topic Channel and Vevo/personal channels into a musical note badge</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              • <strong>Content ID Eligibility:</strong> To claim monetization on user-uploaded videos containing your sound recording, you must own 100% exclusive master and publishing rights. Releases with third-party loops, non-exclusive beats, or public domain samples are not eligible.
            </p>
            <p>
              • <strong>OAC Requirements:</strong> You must have at least 1 commercially delivered release live on YouTube Music and own a personal YouTube channel representing your artist brand.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('OAC claims desk will verify your channel link within 7 business days.')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
            >
              Submit YouTube Channel for OAC Linking
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 11. MANAGE ARTISTS ========================
export const ManageArtistsPage: React.FC = () => {
  const { token, user } = useAuth();
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [name, setName] = useState('');
  const [primaryGenre, setPrimaryGenre] = useState('Pop');
  const [spotifyId, setSpotifyId] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => setArtists(d.artists || []));
  }, [token]);

  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch('/api/dashboard/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, primaryGenre, spotifyId })
    });
    const d = await res.json();
    if (d.success) {
      setArtists(prev => [...prev, d.artist]);
      setName('');
      setSpotifyId('');
    }
  };

  return (
    <DashboardLayout title="Manage Artists">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Artist Roster Profiles</h1>
          <p className="text-xs text-slate-400">Map artist profiles with Spotify & Apple Music identifiers to prevent catalog mixups</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800">
          <form onSubmit={handleCreateArtist} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Artist Name *"
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            />
            <input
              type="text"
              value={primaryGenre}
              onChange={(e) => setPrimaryGenre(e.target.value)}
              placeholder="Primary Genre"
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            />
            <input
              type="text"
              value={spotifyId}
              onChange={(e) => setSpotifyId(e.target.value)}
              placeholder="Spotify Artist URI (Optional)"
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Add Artist
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((art) => (
            <div key={art.id} className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm font-display">{art.name}</div>
              <div className="text-xs text-blue-400">{art.primaryGenre}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                Spotify ID: {art.spotifyId || 'Auto-mapping on first release'}
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Releases Linked: {art.releasesCount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 12. SMART LINKS ========================
export const SmartLinksPage: React.FC = () => {
  const { token, user } = useAuth();
  const [links, setLinks] = useState<SmartLink[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => setLinks(d.smartLinks || []));
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;
    const res = await fetch('/api/dashboard/smart-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, slug, artist: user?.fullName })
    });
    const d = await res.json();
    if (d.success) {
      setLinks(prev => [d.smartLink, ...prev]);
      setTitle('');
      setSlug('');
    }
  };

  return (
    <DashboardLayout title="Smart Links">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Smart Landing Pages</h1>
          <p className="text-xs text-slate-400">Shareable pre-save and streaming landing pages connecting Spotify, Apple Music, and YouTube</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800">
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Release Title"
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            />
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="custom-link-slug"
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Generate Smart Link
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {links.map((sml) => (
            <div key={sml.id} className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">{sml.title}</h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  https://rudraatmamusic.com/link/{sml.slug}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-blue-400">{sml.clicks} Clicks</span>
                <button
                  onClick={() => alert(`Copied https://rudraatmamusic.com/link/${sml.slug} to clipboard!`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-sans"
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 13. OTHER REQUESTS ========================
export const OtherRequestsPage: React.FC = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<OtherRequest[]>([]);
  const [type, setType] = useState<'Metadata Correction' | 'Takedown' | 'Artist Name Update' | 'Other'>('Metadata Correction');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/data', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => setRequests(d.requests || []));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;
    const res = await fetch('/api/dashboard/other-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, details })
    });
    const d = await res.json();
    if (d.success) {
      setRequests(prev => [d.request, ...prev]);
      setDetails('');
    }
  };

  return (
    <DashboardLayout title="Other Requests">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Formal Change Requests</h1>
          <p className="text-xs text-slate-400">Submit metadata corrections, platform takedowns, or artist name changes</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white font-display">Submit New Request</h2>
          <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Request Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="Metadata Correction">Metadata Correction</option>
                <option value="Takedown">Release Takedown Request</option>
                <option value="Artist Name Update">Artist Name Spelling Update</option>
                <option value="Other">Other Administrative Request</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Request Specifications & Reason</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Specify release UPC or track title along with the exact adjustment needed..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Submit Request
            </button>
          </form>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3">Type</th>
                <th className="pb-3">Details</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 font-semibold text-white">{r.type}</td>
                  <td className="py-3 text-slate-300">{r.details}</td>
                  <td className="py-3 font-mono text-emerald-400 text-[11px]">{r.status}</td>
                  <td className="py-3 font-mono text-[11px] text-slate-400">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ======================== 14. ADMIN PANEL ========================
export const AdminDashboardPage: React.FC = () => {
  const { token, user } = useAuth();
  const { navigate } = useRouter();

  const [overview, setOverview] = useState<any>(null);
  const [allReleases, setAllReleases] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentMetrics, setPaymentMetrics] = useState<any>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'failed' | 'created'>('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'request_changes' | 'reject'>('approve');
  const [adminNotes, setAdminNotes] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/overview', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => {
        setOverview(d.metrics);
        setAllUsers(d.users || []);
      });

    fetch('/api/admin/releases', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => setAllReleases(d.releases || []));

    fetch('/api/admin/payments', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(d => {
        setPayments(d.payments || []);
        setPaymentMetrics(d.metrics || null);
      });
  }, [token]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4">
        <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-2xl max-w-md">
          <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h1 className="text-lg font-bold font-display">Administrator Access Required</h1>
          <p className="text-xs text-slate-400 mt-2">
            You must be signed in with an administrative account to access this operational console.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            Log In as Admin Desk
          </button>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRelease) return;

    const res = await fetch(`/api/admin/releases/${selectedRelease.id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        action: reviewAction,
        notes: adminNotes,
        reason: adminReason
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      setActionSuccess(data.message);
      // update list
      setAllReleases(prev => prev.map(r => r.id === selectedRelease.id ? data.release : r));
      setTimeout(() => {
        setReviewModalOpen(false);
        setSelectedRelease(null);
        setActionSuccess(null);
        setAdminNotes('');
        setAdminReason('');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#060912] text-slate-100 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                Staff Administrator Console
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white font-display mt-1">
              Rudraatma Music Technical & Review Desk
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg hover:text-white"
            >
              Artist Portal
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg hover:text-white"
            >
              Public Site
            </button>
          </div>
        </div>

        {/* Overview Metrics */}
        {overview && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Total Registered Users</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">{overview.registeredUsers}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Awaiting Technical Review</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{overview.releasesAwaitingReview}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Approved Releases</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{overview.approvedReleases}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Verified Payment Total</span>
              <div className="text-2xl font-bold font-mono text-blue-400 mt-1">₹{overview.verifiedPaymentTotals}</div>
            </div>
          </div>
        )}

        {/* Releases Queue & Approval Desk */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display">
              Submitted Releases Queue (Approve / Request Changes / Reject)
            </h2>
            <span className="text-xs font-mono text-slate-400">{allReleases.length} releases logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Artist</th>
                  <th className="pb-3">UPC</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Current Status</th>
                  <th className="pb-3 text-right">Review Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {allReleases.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 font-semibold text-white">{r.title}</td>
                    <td className="py-3">{r.artist}</td>
                    <td className="py-3 font-mono text-[11px]">{r.upc}</td>
                    <td className="py-3 font-mono text-[11px]">{r.type}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.status === 'Approved' ? 'bg-emerald-950 text-emerald-400' :
                        r.status === 'Action Required' ? 'bg-orange-950 text-orange-400' :
                        'bg-amber-950 text-amber-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedRelease(r);
                          setReviewModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs"
                      >
                        Review Song
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management List */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white font-display">Registered User Accounts</h2>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Country</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {allUsers.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 font-semibold text-white">{u.fullName}</td>
                  <td className="py-3 font-mono text-slate-400">{u.email}</td>
                  <td className="py-3">{u.country}</td>
                  <td className="py-3 font-mono text-blue-400">{u.role}</td>
                  <td className="py-3 text-emerald-400">{u.isActive ? 'Active' : 'Pending OTP'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Razorpay Payments & Subscriptions Ledger */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-800">
                  Razorpay Payment Records
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {payments.length} Transactions Recorded
                </span>
              </div>
              <h2 className="text-base font-bold text-white font-display mt-1">
                Payments & Subscriptions Ledger
              </h2>
            </div>

            {paymentMetrics && (
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">VERIFIED REVENUE</div>
                  <div className="text-emerald-400 font-bold text-base tabular-nums">
                    ₹{paymentMetrics.totalRevenue}
                  </div>
                </div>
                <div className="text-right border-l border-slate-800 pl-4">
                  <div className="text-slate-400 text-[10px]">PAID / FAILED</div>
                  <div className="text-white">
                    <span className="text-emerald-400 font-bold">{paymentMetrics.paidCount}</span> /{' '}
                    <span className="text-rose-400">{paymentMetrics.failedCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              {(['all', 'paid', 'failed', 'created'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPaymentFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    paymentFilter === filter
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={paymentSearch}
              onChange={(e) => setPaymentSearch(e.target.value)}
              placeholder="Search by Order ID, Payment ID, or Email..."
              className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 max-w-xs font-mono"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Payment ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Plan / Product</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Gateway Mode</th>
                  <th className="pb-3">Payment Status</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {payments
                  .filter((p) => {
                    if (paymentFilter !== 'all' && p.status !== paymentFilter) return false;
                    if (paymentSearch) {
                      const q = paymentSearch.toLowerCase();
                      return (
                        p.orderId?.toLowerCase().includes(q) ||
                        p.paymentId?.toLowerCase().includes(q) ||
                        p.userEmail?.toLowerCase().includes(q) ||
                        p.planName?.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((p) => (
                    <tr key={p.orderId}>
                      <td className="py-3 font-mono text-[11px] text-blue-400">{p.orderId}</td>
                      <td className="py-3 font-mono text-[11px] text-slate-300">
                        {p.paymentId || '—'}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-white">{p.userName || 'Artist'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.userEmail}</div>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-white">{p.planName}</span>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">
                          {p.planType}
                        </div>
                      </td>
                      <td className="py-3 font-mono text-white font-bold tabular-nums">
                        ₹{p.amount}.00
                      </td>
                      <td className="py-3 font-mono text-[11px]">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          p.isTestMode ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {p.isTestMode ? 'Test Sandbox' : 'Live Gateway'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          p.status === 'paid' ? 'bg-emerald-950 text-emerald-400' :
                          p.status === 'failed' ? 'bg-rose-950 text-rose-400' :
                          p.status === 'cancelled' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-950 text-amber-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setReviewModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0b1120] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white font-display">
              Review Release: {selectedRelease.title} ({selectedRelease.artist})
            </h2>

            {actionSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg text-center">
                {actionSuccess}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Select Action *</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewAction('approve')}
                      className={`p-2 rounded-lg border font-semibold ${
                        reviewAction === 'approve' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Approve Release
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewAction('request_changes')}
                      className={`p-2 rounded-lg border font-semibold ${
                        reviewAction === 'request_changes' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Request Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewAction('reject')}
                      className={`p-2 rounded-lg border font-semibold ${
                        reviewAction === 'reject' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Reject Release
                    </button>
                  </div>
                </div>

                {reviewAction === 'approve' && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Optional Reviewer Notes</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      placeholder="e.g. Master passed technical inspection. Dispatched to candidate store endpoints."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                )}

                {(reviewAction === 'request_changes' || reviewAction === 'reject') && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Explanation Reason (Mandatory) *</label>
                    <textarea
                      value={adminReason}
                      onChange={(e) => setAdminReason(e.target.value)}
                      required
                      rows={3}
                      placeholder="Explain required artwork/audio revisions or reason for rejection respectfully..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                  >
                    Save Decision & Dispatch 48h Artist Popup
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
