import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { PRICING_PLANS } from '../data/pricingData';
import { PricingPlan } from '../types';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Lock,
  AlertCircle,
  CreditCard,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  XCircle,
  Sparkles,
  HelpCircle,
  FileText,
  BadgeCheck,
  ArrowLeft
} from 'lucide-react';

interface GatewayConfig {
  keyId: string;
  isConfigured: boolean;
  isLive: boolean;
  mode: 'live' | 'test';
  companyName: string;
}

interface PaymentSuccessData {
  orderId: string;
  paymentId: string;
  amount: number;
  planName: string;
  planType: string;
  date: string;
  isSubscription: boolean;
  autoRenew: boolean;
}

interface PaymentFailureData {
  orderId: string;
  code?: string;
  description: string;
  paymentId?: string;
}

export const CheckoutPage: React.FC = () => {
  const { path, queryParam, navigate } = useRouter();
  const { user, token, selectedPlanId, setSelectedPlanId } = useAuth();

  const planIdFromQuery = queryParam('planId') || selectedPlanId || 'growth-monthly';
  const selectedPlan: PricingPlan =
    PRICING_PLANS.find((p) => p.id === planIdFromQuery) ||
    PRICING_PLANS.find((p) => p.id === 'growth-monthly') ||
    PRICING_PLANS[0];

  const [gatewayConfig, setGatewayConfig] = useState<GatewayConfig | null>(null);
  const [autoRenewConsent, setAutoRenewConsent] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Status screens
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(null);
  const [failureData, setFailureData] = useState<PaymentFailureData | null>(null);
  const [cancelledData, setCancelledData] = useState<{ orderId: string; planName: string } | null>(null);

  // Test simulation modal if keys are placeholder
  const [testModalOpen, setTestModalOpen] = useState<boolean>(false);
  const [pendingSimOrder, setPendingSimOrder] = useState<any>(null);

  // Sync selected plan
  useEffect(() => {
    if (selectedPlan) {
      setSelectedPlanId(selectedPlan.id);
    }
  }, [selectedPlan.id]);

  // Fetch Razorpay configuration
  useEffect(() => {
    fetch('/api/razorpay/config')
      .then((res) => res.json())
      .then((data) => setGatewayConfig(data))
      .catch(() => {
        setGatewayConfig({
          keyId: 'rzp_test_placeholder',
          isConfigured: false,
          isLive: false,
          mode: 'test',
          companyName: 'Rudraatma Music'
        });
      });
  }, []);

  // Ensure Razorpay Checkout script is loaded
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Verify Payment on Backend
  const verifyPaymentOnServer = async (
    orderId: string,
    paymentId: string,
    signature: string,
    planId: string
  ) => {
    try {
      const res = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
          planId
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData({
          orderId: data.order.orderId,
          paymentId: data.order.paymentId || paymentId,
          amount: data.plan.priceINR,
          planName: data.plan.name,
          planType: data.plan.type,
          date: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          isSubscription: data.plan.type !== 'one-time',
          autoRenew: Boolean(data.order.autoRenew)
        });
        setFailureData(null);
        setCancelledData(null);
      } else {
        setFailureData({
          orderId,
          description: data.error || 'Server payment signature verification failed.'
        });
      }
    } catch {
      setFailureData({
        orderId,
        description: 'Network communication failure during payment signature verification.'
      });
    } finally {
      setProcessing(false);
    }
  };

  // Trigger Checkout Flow
  const handleInitiatePayment = async () => {
    if (!user) {
      // Preserve plan selection when redirecting unauthenticated user
      navigate(`/login?redirect=${encodeURIComponent(`/checkout?planId=${selectedPlan.id}`)}`);
      return;
    }

    // Require recurring consent if it's a subscription
    const isSubscription = selectedPlan.type !== 'one-time';
    if (isSubscription && !autoRenewConsent) {
      setErrorMessage('Please accept the recurring billing terms or select a one-time release product.');
      return;
    }

    setProcessing(true);
    setErrorMessage(null);
    setFailureData(null);
    setCancelledData(null);

    try {
      // Step 1: Create Order on Backend (never trust frontend prices)
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          autoRenewConsent: isSubscription ? autoRenewConsent : false
        })
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        setErrorMessage(orderData.error || 'Failed to initialize payment order on server.');
        setProcessing(false);
        return;
      }

      // Check if real keys are configured and Razorpay script is functional
      const scriptReady = await loadRazorpayScript();

      // If Razorpay SDK is available and key is configured (or test key)
      const hasRealKeys =
        gatewayConfig?.isConfigured &&
        orderData.keyId &&
        orderData.keyId !== 'rzp_test_placeholder' &&
        (orderData.keyId.startsWith('rzp_test_') || orderData.keyId.startsWith('rzp_live_'));

      if (scriptReady && hasRealKeys && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amountPaise,
          currency: orderData.currency || 'INR',
          name: 'Rudraatma Music',
          description: `${selectedPlan.name} – ${selectedPlan.type === 'one-time' ? 'One-time Release' : 'Music Distribution'}`,
          image: '/logo.png',
          order_id: orderData.orderId,
          prefill: {
            name: user.fullName,
            email: user.email,
            contact: ''
          },
          notes: {
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            userId: user.id
          },
          theme: {
            color: '#2563eb'
          },
          handler: function (response: any) {
            verifyPaymentOnServer(
              orderData.orderId,
              response.razorpay_payment_id,
              response.razorpay_signature,
              selectedPlan.id
            );
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              setCancelledData({
                orderId: orderData.orderId,
                planName: selectedPlan.name
              });
              fetch('/api/razorpay/record-cancellation', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ orderId: orderData.orderId })
              });
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);

        rzp.on('payment.failed', function (resp: any) {
          setProcessing(false);
          setFailureData({
            orderId: orderData.orderId,
            code: resp.error?.code,
            description: resp.error?.description || 'Your payment was declined by the issuer or cancelled.',
            paymentId: resp.error?.metadata?.payment_id
          });
          fetch('/api/razorpay/record-failure', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              orderId: orderData.orderId,
              errorReason: resp.error?.description,
              paymentId: resp.error?.metadata?.payment_id
            })
          });
        });

        rzp.open();
      } else {
        // High-Fidelity Test Mode Simulator
        // This executes the identical backend HMAC signature verification flow
        setPendingSimOrder(orderData);
        setTestModalOpen(true);
        setProcessing(false);
      }
    } catch {
      setErrorMessage('Network connection error contacting billing gateway.');
      setProcessing(false);
    }
  };

  // Execute Simulated Test Payment (Success or Failure)
  const handleCompleteSimulation = async (outcome: 'success' | 'failure' | 'cancel') => {
    if (!pendingSimOrder) return;
    setTestModalOpen(false);

    if (outcome === 'cancel') {
      setCancelledData({
        orderId: pendingSimOrder.orderId,
        planName: selectedPlan.name
      });
      await fetch('/api/razorpay/record-cancellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: pendingSimOrder.orderId })
      });
      return;
    }

    if (outcome === 'failure') {
      setFailureData({
        orderId: pendingSimOrder.orderId,
        code: 'BAD_REQUEST_ERROR',
        description: 'Payment authorization declined by issuing bank (Simulated Test Mode).',
        paymentId: `pay_test_${Date.now().toString().slice(-6)}`
      });
      await fetch('/api/razorpay/record-failure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          orderId: pendingSimOrder.orderId,
          errorReason: 'Payment authorization declined by issuing bank (Simulated Test Mode).'
        })
      });
      return;
    }

    // Outcome === 'success': Generate simulated signature and verify on backend
    setProcessing(true);
    const mockPaymentId = `pay_rzp_test_${Date.now().toString().slice(-8)}`;
    const mockSignature = `sig_test_${Date.now()}`;

    await verifyPaymentOnServer(
      pendingSimOrder.orderId,
      mockPaymentId,
      mockSignature,
      selectedPlan.id
    );
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb & Return to Pricing */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Cancel & Return to Pricing</span>
            </button>

            {gatewayConfig && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    gatewayConfig.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="text-slate-400">Razorpay</span>
                <span className={gatewayConfig.isLive ? 'text-emerald-400' : 'text-amber-400 font-semibold'}>
                  {gatewayConfig.isLive ? 'Live Mode' : 'Test Sandbox Mode'}
                </span>
              </div>
            )}
          </div>

          {/* ===================== VIEW 1: SUCCESSFUL PAYMENT ===================== */}
          {successData ? (
            <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#090e1a] border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 border border-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Payment Authorized & Verified
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
                Payment Successful!
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Your payment for <strong className="text-white">{successData.planName}</strong> has been verified via Razorpay and your artist workspace is now active.
              </p>

              {/* Order Receipt Card */}
              <div className="mt-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-3 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-slate-400">Product / Plan</span>
                  <span className="font-semibold text-white">{successData.planName}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-slate-400">Amount Paid</span>
                  <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                    ₹{successData.amount}.00
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-slate-400">Billing Cycle</span>
                  <span className="font-mono text-slate-200 capitalize">
                    {successData.planType === 'one-time' ? 'One-time Payment' : `${successData.planType} Subscription`}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-slate-400">Razorpay Payment ID</span>
                  <span className="font-mono text-blue-400">{successData.paymentId}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-slate-400">Order Reference</span>
                  <span className="font-mono text-slate-300">{successData.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Verification Timestamp</span>
                  <span className="font-mono text-slate-300">{successData.date}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Proceed to Artist Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/dashboard/wallet-transactions')}
                  className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                >
                  View Wallet Transaction History
                </button>
              </div>
            </div>
          ) : failureData ? (
            /* ===================== VIEW 2: PAYMENT FAILURE ===================== */
            <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#090e1a] border border-rose-800/80 shadow-2xl text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-5 border border-rose-500/30">
                <XCircle className="w-9 h-9" />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold">
                Transaction Not Completed
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
                Payment Failed or Declined
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                {failureData.description || 'The transaction could not be authorized. No funds were debited.'}
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-left space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Reference</span>
                  <span className="font-mono text-slate-300">{failureData.orderId}</span>
                </div>
                {failureData.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment ID</span>
                    <span className="font-mono text-slate-300">{failureData.paymentId}</span>
                  </div>
                )}
                {failureData.code && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Error Code</span>
                    <span className="font-mono text-rose-400">{failureData.code}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleInitiatePayment}
                  disabled={processing}
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Payment</span>
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Choose Another Plan
                </button>
              </div>
            </div>
          ) : (
            /* ===================== VIEW 3: CHECKOUT REVIEW & AUTHORIZE ===================== */
            <div>
              <div className="mb-8">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                  Secure Razorpay Checkout
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
                  Review & Authorize Order
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Billed in Indian Rupees (INR) via official Razorpay Standard Checkout.
                </p>
              </div>

              {/* Cancelled Notice Banner */}
              {cancelledData && (
                <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-amber-800/60 text-xs text-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Checkout for <strong>{cancelledData.planName}</strong> was dismissed. You can resume whenever you are ready.
                    </span>
                  </div>
                  <button
                    onClick={() => setCancelledData(null)}
                    className="text-[11px] underline text-slate-400 hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Error Notice */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Plan Details & Recurring Consent */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Selected Product Card */}
                  <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
                    <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                            {selectedPlan.type === 'one-time' ? 'One-time Release' : `${selectedPlan.type} Subscription`}
                          </span>
                          {selectedPlan.badge && (
                            <span className="text-[10px] font-semibold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/80 font-mono">
                              {selectedPlan.badge}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-white font-display mt-1">
                          {selectedPlan.name}
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">{selectedPlan.allowance}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-bold font-mono text-white tabular-nums">
                          ₹{selectedPlan.priceINR}
                        </span>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {selectedPlan.billingText}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedPlan.description}
                    </p>

                    {/* Plan Inclusions Checklist */}
                    <div className="pt-3 border-t border-slate-800">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                        Included Features
                      </span>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {selectedPlan.features.slice(0, 5).map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Subscription Consent or One-Time Disclosure */}
                    {selectedPlan.type !== 'one-time' ? (
                      <div className="mt-4 p-4 rounded-xl bg-blue-950/20 border border-blue-900/60 space-y-3">
                        <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Subscription & Recurring Billing Consent</span>
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Your selected plan renews automatically at <strong className="text-white">₹{selectedPlan.priceINR} {selectedPlan.billingText}</strong> until cancelled. You may cancel renewal at any time with zero penalty from your artist dashboard.
                        </p>
                        <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={autoRenewConsent}
                            onChange={(e) => setAutoRenewConsent(e.target.checked)}
                            className="mt-0.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-xs text-slate-200 select-none">
                            I authorize Rudraatma Music to charge ₹{selectedPlan.priceINR} {selectedPlan.billingText} to my selected payment method until cancelled.
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>One-Time Payment:</strong> Billed once at ₹{selectedPlan.priceINR}. There are no automatic monthly or annual renewals.
                        </span>
                      </div>
                    )}

                    {/* Guest notice */}
                    {!user && (
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-blue-300 flex items-center justify-between">
                        <span>Signing in saves this plan selection and opens checkout automatically.</span>
                        <button
                          onClick={() => navigate(`/login?redirect=${encodeURIComponent(`/checkout?planId=${selectedPlan.id}`)}`)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold whitespace-nowrap ml-2"
                        >
                          Sign In
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Price Summary & Checkout Action */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Pricing Summary
                    </h3>

                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Plan Rate ({selectedPlan.name})</span>
                        <span className="font-mono text-white tabular-nums">
                          ₹{selectedPlan.priceINR}.00
                        </span>
                      </div>

                      {selectedPlan.annualCalculation && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Annual Direct Savings</span>
                          <span className="font-mono tabular-nums">−₹100.00</span>
                        </div>
                      )}

                      <div className="flex justify-between text-slate-400">
                        <span>Taxes & Barcode Fees</span>
                        <span className="font-mono text-white">Included</span>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                        <span>Total Payable Now</span>
                        <span className="font-mono text-xl text-blue-400 tabular-nums">
                          ₹{selectedPlan.priceINR}
                        </span>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handleInitiatePayment}
                      disabled={processing || (selectedPlan.type !== 'one-time' && !autoRenewConsent)}
                      className="w-full py-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {processing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Contacting Gateway...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span>
                            {user
                              ? `Pay ₹${selectedPlan.priceINR} with Razorpay`
                              : 'Sign In to Authorize Plan'}
                          </span>
                        </div>
                      )}
                    </button>

                    {/* Security Seals */}
                    <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Server-side HMAC-SHA256 signature verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>UPI, Credit/Debit Cards, Net Banking & Wallets</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 leading-relaxed text-center">
                      Payment processing is protected by Razorpay 256-bit SSL encryption. Card credentials are never stored on Rudraatma Music servers.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===================== SIMULATION TEST MODAL ===================== */}
      {testModalOpen && pendingSimOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => handleCompleteSimulation('cancel')} />
          <div className="relative w-full max-w-md bg-[#0b1120] border border-blue-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white font-display">Razorpay Test Simulator</h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                Sandbox Mode
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are running in Razorpay Sandbox Test Mode. Choose an outcome below to test the complete server-side order lifecycle, signature verification, and plan activation:
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="text-blue-400">{pendingSimOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="text-white">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payable:</span>
                <span className="text-emerald-400 font-bold">₹{selectedPlan.priceINR}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleCompleteSimulation('success')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate Successful Payment (Verify on Server)</span>
              </button>

              <button
                onClick={() => handleCompleteSimulation('failure')}
                className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Simulate Payment Decline (Bank Reject)</span>
              </button>

              <button
                onClick={() => handleCompleteSimulation('cancel')}
                className="w-full py-2 text-slate-400 hover:text-white text-xs transition-colors"
              >
                Cancel Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
};
