import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  DollarSign,
  ArrowRight,
  LogOut,
  X,
  ExternalLink,
  RefreshCw,
  Zap,
  Globe,
  Radio,
} from 'lucide-react';
import { StripeMerchantProfile, DEFAULT_STRIPE_MERCHANT } from '../types/merchant';
import { Currency } from '../types/booking';
import { formatFare } from '../utils/pricing';

interface StripeMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  merchant: StripeMerchantProfile | null;
  onMerchantLogin: (merchant: StripeMerchantProfile) => void;
  onMerchantLogout: () => void;
}

export const StripeMerchantModal: React.FC<StripeMerchantModalProps> = ({
  isOpen,
  onClose,
  currency,
  merchant,
  onMerchantLogin,
  onMerchantLogout,
}) => {
  const [email, setEmail] = useState('info@elite-ride.org');
  const [password, setPassword] = useState('••••••••••••');
  const [apiKey, setApiKey] = useState('sk_live_51DOM2026ELITE7781xcd');
  const [selectedMode, setSelectedMode] = useState<'live' | 'test'>('live');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      if (!email.includes('@')) {
        setErrorMsg('Please enter a valid merchant email address (e.g. info@elite-ride.org).');
        setIsLoading(false);
        return;
      }

      const updated: StripeMerchantProfile = {
        ...DEFAULT_STRIPE_MERCHANT,
        email,
        mode: selectedMode,
        lastLogin: new Date().toLocaleString(),
      };

      onMerchantLogin(updated);
      setIsLoading(false);
      setSuccessMsg('Successfully logged into Stripe Merchant account. Payment gateway active!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 700);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onMerchantLogin({
        ...DEFAULT_STRIPE_MERCHANT,
        mode: selectedMode,
        lastLogin: new Date().toLocaleString(),
      });
      setIsLoading(false);
      setSuccessMsg('Logged in as verified Dominica Merchant: Elite Ride Dominica Ltd');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] flex flex-col overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/60 cursor-pointer z-10 transition-colors"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-neutral-800 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                Stripe Connect &amp; Merchant Gateway
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Dominica Licensed
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Stripe Merchant Portal &amp; Payments
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Authenticate merchant credentials to process cards, trigger 80% chauffeur splits, and manage NBD settlements.
            </p>
          </div>
        </div>

        {/* Success or Error Feedback */}
        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-300 flex items-center gap-2.5 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-xs text-rose-300 flex items-center gap-2.5 shadow-md">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* VIEW A: MERCHANT IS CURRENTLY LOGGED IN */}
        {merchant ? (
          <div className="space-y-6">
            {/* Merchant Status Card */}
            <div className="p-5 bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {merchant.businessName}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                    CONNECTED
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {merchant.merchantId}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Available Balance</div>
                  <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">
                    {formatFare(merchant.availableBalanceXCD, currency)}
                  </div>
                  <div className="text-[10px] text-neutral-500">Ready for NBD transfer</div>
                </div>

                <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Pending Escrow</div>
                  <div className="text-base font-extrabold text-amber-400 font-mono mt-0.5">
                    {formatFare(merchant.pendingBalanceXCD, currency)}
                  </div>
                  <div className="text-[10px] text-neutral-500">In-transit ride hold</div>
                </div>

                <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Chauffeur Split</div>
                  <div className="text-base font-extrabold text-indigo-300 font-mono mt-0.5">
                    80% / 20%
                  </div>
                  <div className="text-[10px] text-neutral-500">Automated per ride</div>
                </div>
              </div>

              {/* Settlement Account info */}
              <div className="pt-2 border-t border-neutral-800/80 space-y-1.5 text-xs text-neutral-300">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Dominica Merchant Entity:</span>
                  <span className="font-mono text-white">{merchant.registrationNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Primary Contact:</span>
                  <span className="font-mono text-emerald-400">{merchant.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Settlement Payout Bank:</span>
                  <span className="font-mono text-white">{merchant.settlementAccount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Gateway Mode:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    merchant.mode === 'live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {merchant.mode} mode active
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onMerchantLogin({
                    ...merchant,
                    mode: merchant.mode === 'live' ? 'test' : 'live',
                  });
                  setSuccessMsg(`Toggled to ${merchant.mode === 'live' ? 'TEST' : 'LIVE'} mode.`);
                }}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch to {merchant.mode === 'live' ? 'Test Sandbox' : 'Live Production'}</span>
              </button>

              <button
                type="button"
                onClick={onMerchantLogout}
                className="px-4 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ml-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Stripe Merchant</span>
              </button>
            </div>
          </div>
        ) : (
          /* VIEW B: MERCHANT LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl text-xs text-indigo-200 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-indigo-300 mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Stripe Merchant Authentication Required</span>
              </div>
              Log in to enable live card transaction processing, auto-generate passenger tax invoices, and authorize direct 80% chauffeur payouts.
            </div>

            {/* Merchant Email */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Registered Merchant Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@elite-ride.org"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Official operator address: info@elite-ride.org
              </span>
            </div>

            {/* Password / API Secret */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Stripe Password / Restricted Secret Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Mode Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Stripe Processing Environment
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMode('live')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedMode === 'live'
                      ? 'bg-emerald-500 text-neutral-950 shadow-md'
                      : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Live Production (DOM)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('test')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedMode === 'test'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Test Sandbox (Mock)</span>
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating Merchant...</span>
                ) : (
                  <>
                    <span>Log In to Stripe Merchant Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-emerald-500/40 text-emerald-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Instant Login (Elite Ride Dominica Chauffeur Network)</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Notes */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 gap-2">
          <span>Stripe Connect Merchant ID: acct_1DOM2026ELITE</span>
          <span>Commonwealth of Dominica Act #DOM-ER-2026</span>
        </div>
      </div>
    </div>
  );
};
