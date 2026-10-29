import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertTriangle, XCircle, X, ArrowRight, Disc3 } from 'lucide-react';

export const ArtistNotificationPopup: React.FC = () => {
  const { activePopup, dismissPopup } = useAuth();
  const { navigate } = useRouter();

  if (!activePopup) return null;

  const isApproved = activePopup.notification_type === 'approved';
  const isChanges = activePopup.notification_type === 'changes_requested';
  const isRejected = activePopup.notification_type === 'rejected';

  const handleViewRelease = async () => {
    await dismissPopup(activePopup.id);
    navigate(`/dashboard/releases/${activePopup.release_id}`);
  };

  const handleDismiss = async () => {
    await dismissPopup(activePopup.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={handleDismiss} />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-[#0b1120] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>

        {/* State Icon & Heading */}
        <div className="flex items-start gap-4">
          {isApproved && (
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          )}
          {isChanges && (
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
          )}
          {isRejected && (
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
              <XCircle className="w-7 h-7" />
            </div>
          )}

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              {isApproved && 'Quality Review Decision · Approved'}
              {isChanges && 'Quality Review Decision · Action Required'}
              {isRejected && 'Quality Review Decision · Not Approved'}
            </span>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              {activePopup.title}
            </h3>
            <p className="text-sm font-medium text-slate-200 mt-1">
              {isApproved && 'Your song has been approved!'}
              {isChanges && 'Your release needs a few changes before it can be approved.'}
              {isRejected && 'Unfortunately, your release could not be approved at this time.'}
            </p>
          </div>
        </div>

        {/* Release Detail Capsule */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
            {activePopup.artwork_url ? (
              <img
                src={activePopup.artwork_url}
                alt={activePopup.release_title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Disc3 className="w-7 h-7 text-blue-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate font-display">
              {activePopup.release_title}
            </h4>
            <p className="text-xs text-slate-300 truncate mt-0.5">
              Artist: <span className="text-white font-medium">{activePopup.artist_name}</span>
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 font-mono">
              <span>Reviewed: {new Date(activePopup.created_at).toLocaleDateString()}</span>
              <span>·</span>
              <span className={isApproved ? 'text-emerald-400' : isChanges ? 'text-amber-400' : 'text-rose-400'}>
                Status: {isApproved ? 'Approved' : isChanges ? 'Action Required' : 'Not Approved'}
              </span>
            </div>
          </div>
        </div>

        {/* Supporting Message & Explanations */}
        <div className="mt-4 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-900">
          {isApproved && (
            <p>
              Your release has passed our review. You can check its status and view the next steps in your dashboard.
              <span className="block mt-1 text-slate-400 text-[11px]">
                Note: Ingestion to candidate digital streaming partners is dispatched following technical approval. DSPs reflect live catalog based on individual store review queues.
              </span>
            </p>
          )}

          {isChanges && (
            <div>
              <p className="font-semibold text-amber-300 mb-1">Required Corrections from Technical Desk:</p>
              <p className="text-slate-200">{activePopup.admin_reason || 'Please verify metadata and artwork matching.'}</p>
            </div>
          )}

          {isRejected && (
            <div>
              <p className="font-semibold text-rose-300 mb-1">Reason for Non-Approval:</p>
              <p className="text-slate-200">{activePopup.admin_reason || 'Audio or copyright declaration did not satisfy verification criteria.'}</p>
            </div>
          )}
        </div>

        {/* 48-Hour Expiry Notice */}
        <div className="mt-3 text-[11px] text-slate-400 font-mono text-center">
          Active decision popup expires in 48 hours. Accessible in the Notification Centre anytime.
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Got It
          </button>
          <button
            onClick={handleViewRelease}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm shadow-blue-500/20"
          >
            <span>{isChanges ? 'Review Changes' : 'View Release'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
