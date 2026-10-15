import React, { useState, useEffect } from 'react';
import {
  User,
  X,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShieldCheck,
  History,
  Clock,
  Calendar,
  FileText,
  Trash2,
  Star,
  ExternalLink,
  Car,
} from 'lucide-react';
import { DOMINICA_LOCATIONS, PAYMENT_METHODS } from '../data/dominicaData';
import { RiderProfile, RideHistoryItem } from '../types/booking';
import { EliteRideLogo } from './EliteRideLogo';

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
  const [profileTab, setProfileTab] = useState<'contact' | 'history' | 'scheduled' | 'overview'>('contact');
  const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>([]);
  const [scheduledTransfers, setScheduledTransfers] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<RideHistoryItem | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+1 (767) ',
    email: '',
    flightNumber: '',
    homeLocationId: 'ROSEAU',
    preferredPayment: 'nbd_mobanking' as 'nbd_mobanking' | 'mpay' | 'card_xcd' | 'cash',
    nbdAccountNumber: '',
  });

  const [profileFormData, setProfileFormData] = useState({
    fullName: '',
    phone: '+1 (767) ',
    email: '',
    flightNumber: '',
    homeLocationId: 'ROSEAU',
    preferredPayment: 'nbd_mobanking' as 'nbd_mobanking' | 'mpay' | 'card_xcd' | 'cash',
    nbdAccountNumber: '',
  });

  const [profileSavedToast, setProfileSavedToast] = useState(false);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync profile form data whenever currentRider changes or modal opens
  useEffect(() => {
    if (currentRider) {
      setProfileFormData({
        fullName: currentRider.fullName || '',
        phone: currentRider.phone || '+1 (767) ',
        email: currentRider.email || '',
        flightNumber: currentRider.flightNumber || '',
        homeLocationId: currentRider.homeLocationId || 'ROSEAU',
        preferredPayment: currentRider.preferredPayment || 'nbd_mobanking',
        nbdAccountNumber: currentRider.nbdAccountNumber || '',
      });
      setProfileSavedToast(false);
      setProfileErrorMsg(null);
    }
  }, [currentRider, isOpen]);

  // Load Ride History from local storage whenever modal opens or rider changes
  useEffect(() => {
    if (!currentRider) return;
    const storageKey = `elite_ride_history_${currentRider.id}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setRideHistory(JSON.parse(saved));
      } else {
        // Seed default historical trips for authenticated rider
        const seededTrips: RideHistoryItem[] = [
          {
            id: 'TRP-8491',
            riderId: currentRider.id,
            date: 'Oct 12, 2026',
            timestamp: Date.now() - 86400000 * 2,
            pickup: 'Roseau Bayfront (Cruise Berth)',
            dropoff: 'Douglas-Charles Airport (DOM)',
            stopover: 'Pont Cassé Rainforest Pass',
            tierName: 'Elite 4WD Mountain SUV',
            driverName: 'Darren "Kalinago" Shillingford',
            vehicleModel: 'Toyota Land Cruiser Prado 4WD (DA-4912)',
            fareXCD: 442.75,
            fareUSD: 163.98,
            paymentMethod: 'NBD MoBanking',
            status: 'completed',
            rating: 5,
          },
          {
            id: 'TRP-7104',
            riderId: currentRider.id,
            date: 'Oct 07, 2026',
            timestamp: Date.now() - 86400000 * 7,
            pickup: 'Canefield Airport (DCF)',
            dropoff: 'Secret Bay Luxury Villas (Portsmouth)',
            tierName: 'Elite 4WD Mountain SUV',
            driverName: 'Jean-Pierre Bruno',
            vehicleModel: 'Toyota Land Cruiser Prado (Metallic Charcoal)',
            fareXCD: 330.0,
            fareUSD: 122.22,
            paymentMethod: 'mPay Wallet',
            status: 'completed',
            rating: 5,
          },
          {
            id: 'TRP-6092',
            riderId: currentRider.id,
            date: 'Sep 29, 2026',
            timestamp: Date.now() - 86400000 * 15,
            pickup: 'Portsmouth Marine Center',
            dropoff: 'Scotts Head Marine Reserve',
            tierName: 'Elite Standard Sedan',
            driverName: 'Althea Fontaine',
            vehicleModel: 'Toyota Corolla Sedan (Silver)',
            fareXCD: 210.0,
            fareUSD: 77.78,
            paymentMethod: 'Card (XCD)',
            status: 'completed',
            rating: 5,
          },
        ];
        localStorage.setItem(storageKey, JSON.stringify(seededTrips));
        setRideHistory(seededTrips);
      }

      // Load Scheduled Airport Transfers
      const scheduledKey = `elite_ride_scheduled_${currentRider.id}`;
      const scheduledSaved = localStorage.getItem(scheduledKey);
      if (scheduledSaved) {
        setScheduledTransfers(JSON.parse(scheduledSaved));
      } else {
        const seedScheduled = [
          {
            id: 'SCH-DOM-881',
            date: '2026-10-18',
            time: '14:30',
            pickupLabel: 'Secret Bay Luxury Villas (Portsmouth)',
            dropoffLabel: 'Douglas-Charles Airport (DOM)',
            tierName: 'Airport VIP Transfer',
            fareXCD: 425.0,
            receiptNumber: 'REC-DOM-782109',
            createdAt: Date.now() - 3600000,
          },
        ];
        localStorage.setItem(scheduledKey, JSON.stringify(seedScheduled));
        setScheduledTransfers(seedScheduled);
      }
    } catch {
      // storage unavailable
    }
  }, [currentRider, isOpen]);

  const handleClearHistory = () => {
    if (!currentRider) return;
    if (confirm('Are you sure you want to clear your saved trip history?')) {
      const storageKey = `elite_ride_history_${currentRider.id}`;
      localStorage.removeItem(storageKey);
      setRideHistory([]);
    }
  };

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRider) return;
    setProfileErrorMsg(null);

    if (!profileFormData.fullName.trim()) {
      setProfileErrorMsg('Please enter your full legal name');
      return;
    }
    if (!profileFormData.phone.trim() || profileFormData.phone.trim() === '+1 (767)') {
      setProfileErrorMsg('Please enter your mobile or WhatsApp contact number');
      return;
    }

    const updatedRider: RiderProfile = {
      ...currentRider,
      fullName: profileFormData.fullName.trim(),
      phone: profileFormData.phone.trim(),
      email: profileFormData.email.trim() || 'rider@dominica.dm',
      flightNumber: profileFormData.flightNumber.trim(),
      homeLocationId: profileFormData.homeLocationId,
      preferredPayment: profileFormData.preferredPayment,
      nbdAccountNumber: profileFormData.nbdAccountNumber.trim(),
    };

    onLogin(updatedRider);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3500);
  };

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
      flightNumber: formData.flightNumber.trim(),
      homeLocationId: formData.homeLocationId,
      preferredPayment: formData.preferredPayment,
      nbdAccountNumber: formData.nbdAccountNumber,
      tripsCount: mode === 'signup' ? 0 : 3,
    };

    if (typeof window !== 'undefined') {
      if ((window as any).resetRideLocationAndFare) {
        (window as any).resetRideLocationAndFare();
      }
      window.dispatchEvent(new CustomEvent('eliteride_reset_location_and_fare'));
    }

    onLogin(rider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full ${currentRider ? 'max-w-2xl' : 'max-w-md'} bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden`}>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/60 cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {currentRider ? (
          /* Profile view if already logged in */
          <div className="flex-1 flex flex-col overflow-hidden space-y-5">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                  {currentRider.fullName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{currentRider.fullName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      Verified Rider
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">{currentRider.phone} · {currentRider.email}</p>
                </div>
              </div>

              {/* Rider Tabs: Profile & Contact vs Ride History vs Scheduled vs Account Status */}
              <div className="flex flex-wrap items-center p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-semibold gap-1">
                <button
                  type="button"
                  onClick={() => setProfileTab('contact')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    profileTab === 'contact'
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile & Contact</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('history')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    profileTab === 'history'
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Ride History ({rideHistory.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('scheduled')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    profileTab === 'scheduled'
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Scheduled ({scheduledTransfers.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('overview')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    profileTab === 'overview'
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Status</span>
                </button>
              </div>
            </div>

            {/* TAB: PROFILE & CONTACT DETAILS (Editable) */}
            {profileTab === 'contact' && (
              <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto space-y-4 pr-1">
                {profileSavedToast && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Profile &amp; contact details updated! All future dispatches will use these verified details.</span>
                  </div>
                )}
                {profileErrorMsg && (
                  <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{profileErrorMsg}</span>
                  </div>
                )}

                <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Lead Rider Contact Information
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Lead Rider Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Julian Montgomery"
                        value={profileFormData.fullName}
                        onChange={(e) => setProfileFormData({ ...profileFormData, fullName: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        WhatsApp / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (767) 555-0192"
                        value={profileFormData.phone}
                        onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Email Address (For Invoices & 15% VAT Receipts)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. julian@example.dm"
                        value={profileFormData.email}
                        onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Flight Number (Optional for DOM / DCF live radar sync)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AA 3169 / interCaribbean 234"
                        value={profileFormData.flightNumber}
                        onChange={(e) => setProfileFormData({ ...profileFormData, flightNumber: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Dominica Community &amp; Payment Preferences
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Default Frequent / Home Pickup Community
                      </label>
                      <select
                        value={profileFormData.homeLocationId}
                        onChange={(e) => setProfileFormData({ ...profileFormData, homeLocationId: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                        Preferred Payment Method
                      </label>
                      <select
                        value={profileFormData.preferredPayment}
                        onChange={(e) => setProfileFormData({ ...profileFormData, preferredPayment: e.target.value as any })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {profileFormData.preferredPayment === 'nbd_mobanking' && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Default NBD MoBanking Account ID (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. NBD-0091-8842"
                          value={profileFormData.nbdAccountNumber}
                          onChange={(e) => setProfileFormData({ ...profileFormData, nbdAccountNumber: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile &amp; Contact Details</span>
                </button>
              </form>
            )}

            {/* TAB 1: RIDE HISTORY SECTION (Persisted in Local Storage) */}
            {profileTab === 'history' && (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs uppercase font-bold text-neutral-300">
                      Previous Trips &amp; Dispatches (Local Storage Persisted)
                    </span>
                  </div>
                  {rideHistory.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-[11px] text-neutral-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear History</span>
                    </button>
                  )}
                </div>

                {rideHistory.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-800 text-neutral-400 space-y-2">
                    <History className="w-8 h-8 mx-auto text-neutral-600" />
                    <p className="text-sm font-medium text-white">No ride history found</p>
                    <p className="text-xs">Your completed and active trips across Dominica will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rideHistory.map((trip) => (
                      <div
                        key={trip.id}
                        className="p-4 bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800/90 rounded-2xl transition-all space-y-3"
                      >
                        {/* Top row: Date, Trip ID, Status */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-emerald-400 font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                              #{trip.id}
                            </span>
                            <span className="text-neutral-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-neutral-500" />
                              {trip.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                                trip.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : trip.status === 'in_transit'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
                              }`}
                            >
                              {trip.status.replace('_', ' ')}
                            </span>
                            <div className="flex items-center text-amber-400 text-xs">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span className="ml-0.5 font-bold">{trip.rating || 5}.0</span>
                            </div>
                          </div>
                        </div>

                        {/* Route Timeline */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                            <span className="text-neutral-400">Pickup:</span>
                            <span className="font-semibold text-white truncate">{trip.pickup}</span>
                          </div>
                          {trip.stopover && (
                            <div className="flex items-center gap-2 pl-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                              <span className="text-neutral-400">Stopover:</span>
                              <span className="text-amber-300 truncate">{trip.stopover}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
                            <span className="text-neutral-400">Drop-off:</span>
                            <span className="font-semibold text-white truncate">{trip.dropoff}</span>
                          </div>
                        </div>

                        {/* Details footer: vehicle, driver, payment & fare */}
                        <div className="pt-2.5 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                            <Car className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{trip.tierName}</span>
                            <span>·</span>
                            <span className="text-neutral-300">{trip.driverName}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="font-mono font-bold text-emerald-400 text-sm">
                                EC$ {trip.fareXCD.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-neutral-400 ml-1.5 font-mono">
                                (${trip.fareUSD.toFixed(2)} USD)
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(trip)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <FileText className="w-3 h-3 text-emerald-400" />
                              <span>Receipt</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ACCOUNT OVERVIEW & PREFERENCES */}
            {profileTab === 'overview' && (
              <div className="space-y-4">
                <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-left space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Default Home Pickup:</span>
                    <span className="text-white font-medium">
                      {DOMINICA_LOCATIONS.find((l) => l.id === currentRider.homeLocationId)?.name || 'Roseau'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Preferred Payment Gateway:</span>
                    <span className="text-emerald-400 font-medium uppercase font-mono">
                      {currentRider.preferredPayment.replace('_', ' ')}
                    </span>
                  </div>
                  {currentRider.nbdAccountNumber && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">NBD Account ID:</span>
                      <span className="text-white font-mono">{currentRider.nbdAccountNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Lifetime Trips Completed:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {Math.max(currentRider.tripsCount || 0, rideHistory.length)} rides
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-900/60 text-[11px] text-neutral-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Your rider profile and previous trip history are securely stored in your browser's persistent local storage.
                  </span>
                </div>
              </div>
            )}

            {/* TAB: SCHEDULED AIRPORT TRANSFERS */}
            {profileTab === 'scheduled' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Upcoming Dominica Airport Transfers
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Reserved chauffeurs staged for your scheduled arrival or departure flights.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {scheduledTransfers.length} Booked
                  </span>
                </div>

                {scheduledTransfers.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-neutral-400 space-y-2">
                    <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p>No upcoming scheduled rides found.</p>
                    <p className="text-[11px] text-neutral-500">
                      Toggle "Schedule Ahead for Airport Transfer" in the booking form to book future rides.
                    </p>
                  </div>
                ) : (
                  scheduledTransfers.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-emerald-500/40 transition-colors space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {item.id}
                          </span>
                          <span className="font-bold text-white">{item.tierName}</span>
                        </div>
                        <span className="text-emerald-400 font-mono font-bold">
                          EC$ {item.fareXCD ? Number(item.fareXCD).toFixed(2) : '390.00'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850">
                        <div>
                          <span className="text-neutral-500 block">Date &amp; Time:</span>
                          <span className="font-semibold text-white">
                            {item.date} at {item.time}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Status &amp; Receipt:</span>
                          <span className="text-emerald-400 font-mono">
                            {item.receiptNumber || 'CONFIRMED'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-neutral-500">Pickup:</span>
                          <span className="font-medium text-white truncate">{item.pickupLabel}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-neutral-500">Destination:</span>
                          <span className="font-medium text-white truncate">{item.dropoffLabel}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Receipt Modal Overlay */}
            {selectedReceipt && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <EliteRideLogo variant="mark" size="sm" theme="dark" />
                      <div>
                        <h4 className="font-bold text-white text-sm">Official Trip Receipt</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">#{selectedReceipt.id} · Dominica</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(null)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Date:</span>
                      <span className="text-white">{selectedReceipt.date}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Vehicle Tier:</span>
                      <span className="text-white">{selectedReceipt.tierName}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Assigned Chauffeur:</span>
                      <span className="text-white">{selectedReceipt.driverName}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Payment Method:</span>
                      <span className="text-emerald-400 font-mono">{selectedReceipt.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Base Dispatch Fee</span>
                      <span className="font-mono text-white">EC$ 1.00</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Mountain Mileage Subtotal</span>
                      <span className="font-mono text-white">EC$ {(selectedReceipt.fareXCD / 1.15 - 1.0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>15% Dominica VAT</span>
                      <span className="font-mono text-white">EC$ {(selectedReceipt.fareXCD - selectedReceipt.fareXCD / 1.15).toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-emerald-400 text-sm">
                      <span>Total Paid</span>
                      <span className="font-mono">EC$ {selectedReceipt.fareXCD.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReceipt(null)}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Close Receipt
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex gap-3 pt-2 border-t border-neutral-800 shrink-0">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                Close &amp; Continue
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-red-400 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign Up / Sign In Form */
          <div>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <EliteRideLogo variant="mark" size="md" theme="dark" />
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
                      Flight Number (Optional for DOM / DCF live radar sync)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AA 3169 / interCaribbean 234"
                      value={formData.flightNumber}
                      onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-emerald-500"
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
