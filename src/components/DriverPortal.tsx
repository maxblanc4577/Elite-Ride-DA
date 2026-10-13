import React, { useState, useEffect } from 'react';
import {
  Car,
  DollarSign,
  TrendingUp,
  Award,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { VEHICLE_TIERS } from '../data/dominicaData';
import { Currency } from '../types/booking';
import { formatFare } from '../utils/pricing';

interface DriverPortalProps {
  currency: Currency;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ currency }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'apply'>('dashboard');
  const [incomingRequest, setIncomingRequest] = useState<any | null>(null);
  const [acceptTimer, setAcceptTimer] = useState(15);
  const [acceptedTrips, setAcceptedTrips] = useState<any[]>([
    {
      id: 'TRP-1092',
      pickup: 'Roseau Cruise Ship Berth',
      destination: 'Douglas-Charles Airport (DOM)',
      fareXCD: 447.0,
      time: '08:45 AM',
      passenger: 'Sarah Jenkins',
      tier: 'Elite 4WD Mountain SUV',
    },
    {
      id: 'TRP-1091',
      pickup: 'Canefield Airport (DCF)',
      destination: 'Secret Bay Villas (Portsmouth)',
      fareXCD: 330.0,
      time: '07:15 AM',
      passenger: 'Robert Duplessis',
      tier: 'Elite 4WD Mountain SUV',
    },
  ]);

  // Driver Application Form State
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    phone: '',
    vehicleTier: 'mountain-4wd-suv',
    vehiclePlate: '',
    driverLicenseNumber: '',
    nbdAccountNumber: '',
    hasCleanPoliceRecord: true,
    vehicleYear: '2023',
  });
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Periodic incoming trip simulator when driver is Online
  useEffect(() => {
    if (!isOnline) {
      setIncomingRequest(null);
      return;
    }

    const interval = setInterval(() => {
      if (!incomingRequest && Math.random() > 0.4) {
        setIncomingRequest({
          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          pickup: 'Roseau Bayfront (Ferry Terminal)',
          dropoff: 'Portsmouth / Prince Rupert Bay',
          distanceMiles: 27.5,
          tierName: 'Elite 4WD Mountain SUV',
          fareXCD: 360.0,
          passengerName: 'David K. (4.9★)',
          declaredHeavyLuggage: true,
        });
        setAcceptTimer(15);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isOnline, incomingRequest]);

  // Countdown for incoming request
  useEffect(() => {
    if (!incomingRequest) return;
    const t = setInterval(() => {
      setAcceptTimer((prev) => {
        if (prev <= 1) {
          setIncomingRequest(null);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [incomingRequest]);

  const handleAcceptRide = () => {
    if (!incomingRequest) return;
    setAcceptedTrips([
      {
        id: incomingRequest.id,
        pickup: incomingRequest.pickup,
        destination: incomingRequest.dropoff,
        fareXCD: incomingRequest.fareXCD,
        time: 'Just now',
        passenger: incomingRequest.passengerName,
        tier: incomingRequest.tierName,
      },
      ...acceptedTrips,
    ]);
    setIncomingRequest(null);
  };

  const handleDeclineRide = () => {
    setIncomingRequest(null);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.fullName || !applyForm.phone || !applyForm.driverLicenseNumber) {
      alert('Please complete all required fields.');
      return;
    }
    setApplySubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Tab Switcher: Driver Cockpit vs Become a Driver */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold block">
            Driver Partner Portal
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            {activeTab === 'dashboard' ? 'Active Driver Console' : 'Apply to Drive for Elite Ride'}
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Driver Cockpit
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'apply'
                ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Become a Driver
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-6">
          {/* Top Status & Shift Toggle Bar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center font-bold text-lg text-emerald-400 border border-neutral-700">
                JB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Jean-Pierre Bruno</h3>
                  <span className="text-xs text-amber-400 font-bold">★ 4.96</span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Plate: <span className="font-mono text-emerald-400">#DA-4912</span> · Toyota Land Cruiser Prado 4WD
                </div>
              </div>
            </div>

            {/* Online / Offline Status Button */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">
                Shift Status: {isOnline ? <strong className="text-emerald-400">ONLINE (Dispatching)</strong> : <strong className="text-neutral-500">OFFLINE</strong>}
              </span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isOnline
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                {isOnline ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          </div>

          {/* Incoming Dispatch Notification Card */}
          {incomingRequest && isOnline && (
            <div className="bg-emerald-950/70 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl animate-pulse-subtle">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80 mb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Bell className="w-5 h-5 animate-bounce" />
                  <span>Incoming Ride Dispatch Request</span>
                </div>
                <div className="px-3 py-1 bg-emerald-500 text-neutral-950 rounded-full font-mono font-bold text-xs">
                  {acceptTimer}s to Accept
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs text-neutral-200">
                <div>
                  <span className="text-neutral-400 block mb-0.5">Passenger</span>
                  <span className="font-bold text-white text-sm">{incomingRequest.passengerName}</span>
                  <span className="block text-emerald-400 mt-0.5">Tier: {incomingRequest.tierName}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-neutral-400 block mb-0.5">Est. Driver Payout (EC$)</span>
                  <span className="text-2xl font-bold font-mono text-emerald-300">
                    {formatFare(incomingRequest.fareXCD, currency)}
                  </span>
                </div>
                <div className="sm:col-span-2 space-y-1.5 pt-2 border-t border-emerald-900/60">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pickup: <strong>{incomingRequest.pickup}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Destination: <strong>{incomingRequest.dropoff}</strong> ({incomingRequest.distanceMiles} mi)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAcceptRide}
                  className="flex-1 py-3 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Ride Dispatch</span>
                </button>
                <button
                  onClick={handleDeclineRide}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold rounded-xl text-xs sm:text-sm"
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* Earnings & Performance KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <span className="text-xs uppercase font-semibold text-neutral-400 block mb-1">
                Today's Payout Earnings
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                {formatFare(777.0, currency)}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 font-mono">
                Direct to NBD MoBanking
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <span className="text-xs uppercase font-semibold text-neutral-400 block mb-1">
                Trips Completed Today
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                {acceptedTrips.length}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                100% On-Time Mountain Transit
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <span className="text-xs uppercase font-semibold text-neutral-400 block mb-1">
                Driver Acceptance Rate
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                98.2%
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Top Tier Driver Bonus Active
              </div>
            </div>
          </div>

          {/* Shift Trip History */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <h4 className="text-sm font-bold text-white mb-4">Today's Completed Dispatches</h4>
            <div className="space-y-3">
              {acceptedTrips.map((trip, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-neutral-950 rounded-xl border border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{trip.passenger}</div>
                    <div className="text-neutral-400 text-[11px]">
                      {trip.pickup} ➔ {trip.destination}
                    </div>
                    <div className="text-neutral-500 text-[10px] mt-0.5">
                      {trip.tier} · Completed at {trip.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-emerald-400 block">
                      +{formatFare(trip.fareXCD, currency)}
                    </span>
                    <span className="text-[10px] text-neutral-500">Paid via NBD MoBanking</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Driver Application Form */
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          {applySubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white">Application Received</h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Thank you for applying to drive with Elite Ride Dominica (#DOM-ER-2026). Our fleet inspection officer will review your documents and schedule vehicle inspection within 24 hours.
              </p>
              <button
                onClick={() => {
                  setApplySubmitted(false);
                  setActiveTab('dashboard');
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl"
              >
                Return to Driver Cockpit
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Partner with Dominica's Premier Ride-Hailing Network
                </h3>
                <p className="text-xs text-neutral-400">
                  Earn competitive weekly payouts directly to your National Bank of Dominica (NBD) account with transparent 15% VAT reporting and guaranteed on-demand passenger volume.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jean-Pierre Bruno"
                    value={applyForm.fullName}
                    onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Mobile Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (767) 225-XXXX"
                    value={applyForm.phone}
                    onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Vehicle Category *
                  </label>
                  <select
                    value={applyForm.vehicleTier}
                    onChange={(e) => setApplyForm({ ...applyForm, vehicleTier: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    {VEHICLE_TIERS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.badge})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Vehicle License Plate & Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DA-4912 (2022)"
                    value={applyForm.vehiclePlate}
                    onChange={(e) => setApplyForm({ ...applyForm, vehiclePlate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Dominica Driver's License # *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-DOM-99214"
                    value={applyForm.driverLicenseNumber}
                    onChange={(e) => setApplyForm({ ...applyForm, driverLicenseNumber: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    NBD MoBanking Payout Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NBD-0091-8821"
                    value={applyForm.nbdAccountNumber}
                    onChange={(e) => setApplyForm({ ...applyForm, nbdAccountNumber: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Requirement Checkbox */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyForm.hasCleanPoliceRecord}
                    onChange={(e) => setApplyForm({ ...applyForm, hasCleanPoliceRecord: e.target.checked })}
                    className="mt-1 w-4 h-4 accent-emerald-500 rounded"
                  />
                  <div className="text-xs text-neutral-300">
                    <span className="font-bold text-white block">
                      Police Record Clearance & Safety Agreement
                    </span>
                    <span>
                      I certify that I hold a valid Dominica driver's license with zero major traffic infractions, agree to periodic vehicle safety inspections for mountain driving, and commit to the zero-tolerance passenger safety code.
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-md"
              >
                Submit Driver Partner Application
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
