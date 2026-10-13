import React, { useState } from 'react';
import { User, X, CheckCircle2, Phone, Mail, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { DOMINICA_LOCATIONS, PAYMENT_METHODS } from '../data/dominicaData';
import { RiderProfile } from '../types/booking';

interface RiderAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (rider: RiderProfile) => void;
  currentRider: RiderProfile | null;
  onLogout: () => void;
}

export const RiderAuthModal: React.FC<RiderAuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentRider,
  onLogout,
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+1 (767) ',
    email: '',
    homeLocationId: 'ROSEAU',
    preferredPayment: 'nbd_mobanking' as 'nbd_mobanking' | 'mpay' | 'card_xcd' | 'cash',
    nbdAccountNumber: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!formData.fullName.trim() && mode === 'signup') {
      setErrorMsg('Please enter your full legal name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim() === '+1 (767)') {
      setErrorMsg('Please enter your mobile or WhatsApp contact number');
      return;
    }

    const rider: RiderProfile = {
      id: `RDR-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: mode === 'signup' ? formData.fullName : 'Dominica Rider',
      phone: formData.phone,
      email: formData.email || 'rider@dominica.dm',
      homeLocationId: formData.homeLocationId,
      preferredPayment: formData.preferredPayment,
      nbdAccountNumber: formData.nbdAccountNumber,
      tripsCount: mode === 'signup' ? 0 : 4,
    };

    onLogin(rider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/60"
        >
          <X className="w-4 h-4" />
        </button>

        {currentRider ? (
          /* Profile view if already logged in */
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
              {currentRider.fullName.split(' ').map((n) => n[0]).join('')}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{currentRider.fullName}</h3>
              <p className="text-xs text-neutral-400 mt-0.5">{currentRider.phone} · {currentRider.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-neutral-800 text-emerald-400 text-[11px] font-mono">
                Rider ID: {currentRider.id}
              </span>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Default Home Pickup:</span>
                <span className="text-white font-medium">
                  {DOMINICA_LOCATIONS.find((l) => l.id === currentRider.homeLocationId)?.name || 'Roseau'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Payment Gateway:</span>
                <span className="text-emerald-400 font-medium uppercase font-mono">
                  {currentRider.preferredPayment.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Completed Trips:</span>
                <span className="text-white font-mono">{currentRider.tripsCount} rides</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs"
              >
                Back to Booking
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-red-400 font-semibold rounded-xl text-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign Up / Sign In Form */
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {mode === 'signup' ? 'Create Rider Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Save your Dominica pickup spots, default NBD MoBanking payment, and track trips.
              </p>

              {/* Mode Toggle */}
              <div className="flex p-1 bg-neutral-950 rounded-xl border border-neutral-800 mt-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    mode === 'signup' ? 'bg-emerald-500 text-neutral-950 shadow-sm' : 'text-neutral-400'
                  }`}
                >
                  Sign Up (New Rider)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    mode === 'signin' ? 'bg-emerald-500 text-neutral-950 shadow-sm' : 'text-neutral-400'
                  }`}
                >
                  Sign In
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 rounded-xl text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julian Montgomery"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (767) 555-0192"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Email Address (For Invoices & 15% VAT Receipts)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. julian@example.dm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Frequent / Home Pickup Community
                    </label>
                    <select
                      value={formData.homeLocationId}
                      onChange={(e) => setFormData({ ...formData, homeLocationId: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {DOMINICA_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Preferred Payment Gateway
                    </label>
                    <select
                      value={formData.preferredPayment}
                      onChange={(e) => setFormData({ ...formData, preferredPayment: e.target.value as any })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.preferredPayment === 'nbd_mobanking' && (
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Default NBD MoBanking Account ID (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. NBD-0091-8842"
                        value={formData.nbdAccountNumber}
                        onChange={(e) => setFormData({ ...formData, nbdAccountNumber: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md mt-2"
              >
                {mode === 'signup' ? 'Complete Rider Sign Up' : 'Sign In to Account'}
              </button>

              <div className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected under Dominica Data Privacy & #DOM-ER-2026</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
