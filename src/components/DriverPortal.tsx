import React, { useState, useEffect } from 'react';
import {
  Car,
  DollarSign,
  TrendingUp,
  Award,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Filter,
  Gauge,
  UserPlus,
} from 'lucide-react';
import { VEHICLE_TIERS } from '../data/dominicaData';
import { Currency } from '../types/booking';
import { formatFare } from '../utils/pricing';
import { EliteRideLogo } from './EliteRideLogo';

interface DriverPortalProps {
  currency: Currency;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ currency }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'apply'>('dashboard');
  const [incomingRequest, setIncomingRequest] = useState<any | null>(null);
  const [acceptTimer, setAcceptTimer] = useState(15);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');

  const [acceptedTrips, setAcceptedTrips] = useState<any[]>([
    {
      id: 'TRP-1092',
      pickup: 'Roseau Cruise Ship Berth',
      destination: 'Douglas-Charles Airport (DOM)',
      fareXCD: 447.0,
      tipXCD: 45.0,
      time: '08:45 AM',
      passenger: 'Sarah Jenkins',
      tier: 'Elite 4WD Mountain SUV',
    },
    {
      id: 'TRP-1091',
      pickup: 'Canefield Airport (DCF)',
      destination: 'Secret Bay Villas (Portsmouth)',
      fareXCD: 330.0,
      tipXCD: 30.0,
      time: '07:15 AM',
      passenger: 'Robert Duplessis',
      tier: 'Elite 4WD Mountain SUV',
    },
  ]);

  // Existing Ride Metadata for the Past 7 Days (Driver Weekly Earnings & Tips)
  const [weeklyRides] = useState<any[]>([
    // Day 0: Today (Mon)
    {
      id: 'TRP-1092',
      dayLabel: 'Today (Mon)',
      date: 'Oct 13',
      daysAgo: 0,
      pickup: 'Roseau Cruise Ship Berth',
      destination: 'Douglas-Charles Airport (DOM)',
      fareXCD: 447.0,
      tipXCD: 45.0,
      time: '08:45 AM',
      passenger: 'Sarah Jenkins',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'NBD MoBanking',
    },
    {
      id: 'TRP-1091',
      dayLabel: 'Today (Mon)',
      date: 'Oct 13',
      daysAgo: 0,
      pickup: 'Canefield Airport (DCF)',
      destination: 'Secret Bay Villas (Portsmouth)',
      fareXCD: 330.0,
      tipXCD: 30.0,
      time: '07:15 AM',
      passenger: 'Robert Duplessis',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'mPay Wallet',
    },
    // Day 1: Sun
    {
      id: 'TRP-1088',
      dayLabel: 'Sun',
      date: 'Oct 12',
      daysAgo: 1,
      pickup: 'Roseau Bayfront (Ferry Terminal)',
      destination: 'Cabrits Resort Kempinski',
      fareXCD: 380.0,
      tipXCD: 40.0,
      time: '02:30 PM',
      passenger: 'Elena Rostova',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'Card (XCD)',
    },
    {
      id: 'TRP-1087',
      dayLabel: 'Sun',
      date: 'Oct 12',
      daysAgo: 1,
      pickup: 'Pont Cassé Roundabout',
      destination: 'Emerald Pool Rainforest Lodge',
      fareXCD: 195.0,
      tipXCD: 25.0,
      time: '11:15 AM',
      passenger: 'Liam Connor',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'NBD MoBanking',
    },
    {
      id: 'TRP-1086',
      dayLabel: 'Sun',
      date: 'Oct 12',
      daysAgo: 1,
      pickup: 'Douglas-Charles Airport (DOM)',
      destination: 'Fort Young Hotel (Roseau)',
      fareXCD: 410.0,
      tipXCD: 35.0,
      time: '09:00 AM',
      passenger: 'Marcus Vance',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'Card (XCD)',
    },
    // Day 2: Sat
    {
      id: 'TRP-1084',
      dayLabel: 'Sat',
      date: 'Oct 11',
      daysAgo: 2,
      pickup: 'Roseau Cruise Terminal',
      destination: 'Jungle Bay Dominica (Soufrière)',
      fareXCD: 450.0,
      tipXCD: 50.0,
      time: '03:45 PM',
      passenger: 'Claire & Dan Martin',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'Card (XCD)',
    },
    {
      id: 'TRP-1083',
      dayLabel: 'Sat',
      date: 'Oct 11',
      daysAgo: 2,
      pickup: 'Salisbury Coastal Beach',
      destination: 'Roseau French Quarter',
      fareXCD: 290.0,
      tipXCD: 25.0,
      time: '10:20 AM',
      passenger: 'Kofi Mensah',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'NBD MoBanking',
    },
    // Day 3: Fri
    {
      id: 'TRP-1081',
      dayLabel: 'Fri',
      date: 'Oct 10',
      daysAgo: 3,
      pickup: 'Portsmouth Marine Center',
      destination: 'Mero Beach Eco-Lodge',
      fareXCD: 340.0,
      tipXCD: 30.0,
      time: '04:10 PM',
      passenger: 'Sophie Dubois',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'mPay Wallet',
    },
    {
      id: 'TRP-1080',
      dayLabel: 'Fri',
      date: 'Oct 10',
      daysAgo: 3,
      pickup: 'Douglas-Charles Airport (DOM)',
      destination: 'Secret Bay Luxury Villas',
      fareXCD: 447.0,
      tipXCD: 45.0,
      time: '01:25 PM',
      passenger: 'Harrison Ford-Smith',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'NBD MoBanking',
    },
    // Day 4: Thu
    {
      id: 'TRP-1078',
      dayLabel: 'Thu',
      date: 'Oct 09',
      daysAgo: 4,
      pickup: 'Canefield Industrial Park',
      destination: 'Coulibri Ridge Eco-Resort',
      fareXCD: 310.0,
      tipXCD: 20.0,
      time: '05:30 PM',
      passenger: 'Aiden Brooks',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'Card (XCD)',
    },
    {
      id: 'TRP-1077',
      dayLabel: 'Thu',
      date: 'Oct 09',
      daysAgo: 4,
      pickup: 'Woodford Hill Overlook',
      destination: 'Roseau Bayfront',
      fareXCD: 420.0,
      tipXCD: 40.0,
      time: '11:45 AM',
      passenger: 'Naomi Campbell-Lewis',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'NBD MoBanking',
    },
    {
      id: 'TRP-1076',
      dayLabel: 'Thu',
      date: 'Oct 09',
      daysAgo: 4,
      pickup: 'Trafalgar Falls Visitor Hub',
      destination: 'Wotten Waven Hot Springs',
      fareXCD: 180.0,
      tipXCD: 15.0,
      time: '08:30 AM',
      passenger: 'Tobias Meyer',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'Cash (XCD)',
    },
    // Day 5: Wed
    {
      id: 'TRP-1074',
      dayLabel: 'Wed',
      date: 'Oct 08',
      daysAgo: 5,
      pickup: 'Roseau Ferry Terminal',
      destination: 'Douglas-Charles Airport (DOM)',
      fareXCD: 447.0,
      tipXCD: 50.0,
      time: '02:00 PM',
      passenger: 'Grace O’Connor',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'NBD MoBanking',
    },
    {
      id: 'TRP-1073',
      dayLabel: 'Wed',
      date: 'Oct 08',
      daysAgo: 5,
      pickup: 'Grand Bay Cultural Center',
      destination: 'Roseau Botanical Gardens',
      fareXCD: 280.0,
      tipXCD: 25.0,
      time: '09:15 AM',
      passenger: 'Darius Thorne',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'mPay Wallet',
    },
    // Day 6: Tue
    {
      id: 'TRP-1071',
      dayLabel: 'Tue',
      date: 'Oct 07',
      daysAgo: 6,
      pickup: 'Scotts Head Marine Reserve',
      destination: 'InterContinental Cabrits',
      fareXCD: 390.0,
      tipXCD: 35.0,
      time: '04:00 PM',
      passenger: 'Victoria Sterling',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'Card (XCD)',
    },
    {
      id: 'TRP-1070',
      dayLabel: 'Tue',
      date: 'Oct 07',
      daysAgo: 6,
      pickup: 'Calibishie Ridge Lodges',
      destination: 'Canefield Airport (DCF)',
      fareXCD: 320.0,
      tipXCD: 30.0,
      time: '10:45 AM',
      passenger: 'Ethan Huntley',
      tier: 'Elite 4WD Mountain SUV',
      paymentMethod: 'NBD MoBanking',
    },
  ]);

  // Compute 7-day Weekly Earnings using ride metadata
  const totalWeeklyFares = weeklyRides.reduce((sum, r) => sum + r.fareXCD, 0);
  const totalWeeklyTips = weeklyRides.reduce((sum, r) => sum + r.tipXCD, 0);
  const totalWeeklyEarnings = totalWeeklyFares + totalWeeklyTips;
  const totalWeeklyTrips = weeklyRides.length;
  const avgEarningsPerTrip = totalWeeklyTrips > 0 ? totalWeeklyEarnings / totalWeeklyTrips : 0;

  // Group by day for daily breakdown bar
  const daysOfWeek = ['Today (Mon)', 'Sun', 'Sat', 'Fri', 'Thu', 'Wed', 'Tue'];
  const dailyBreakdown = daysOfWeek.map((day) => {
    const ridesForDay = weeklyRides.filter((r) => r.dayLabel === day);
    const dayFares = ridesForDay.reduce((s, r) => s + r.fareXCD, 0);
    const dayTips = ridesForDay.reduce((s, r) => s + r.tipXCD, 0);
    const dayTotal = dayFares + dayTips;
    return {
      day,
      tripsCount: ridesForDay.length,
      fares: dayFares,
      tips: dayTips,
      total: dayTotal,
    };
  });
  const maxDayTotal = Math.max(...dailyBreakdown.map((d) => d.total), 1);

  const filteredWeeklyRides = selectedDayFilter === 'all'
    ? weeklyRides
    : weeklyRides.filter((r) => r.dayLabel === selectedDayFilter);

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
        tipXCD: 25.0,
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
        <div className="flex items-center gap-3.5">
          <EliteRideLogo variant="mark" size="sm" theme="dark" />
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold block">
              Driver Partner Portal
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              {activeTab === 'dashboard' ? 'Active Driver Console' : 'Apply to Drive for Elite Ride'}
            </h2>
          </div>
        </div>

        {/* Quick return button when viewing application tab */}
        {activeTab === 'apply' && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500 text-xs font-bold text-emerald-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Go to Driver's Profile (Jean-Pierre)</span>
          </button>
        )}
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-6">
          {/* Driver's Profile & Cockpit Status Bar */}
          <div
            id="driver-profile-card"
            className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center font-bold text-lg text-emerald-400 border border-neutral-700">
                JB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Jean-Pierre Bruno</h3>
                  <span className="text-xs text-amber-400 font-bold">★ 4.96</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-emerald-400" />
                    Cockpit Active
                  </span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Plate: <span className="font-mono text-emerald-400">#DA-4912</span> · Toyota Land Cruiser Prado 4WD
                </div>
              </div>
            </div>

            {/* Moved to Driver's Profile: Driver Cockpit & Shift Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Tab Switcher in Driver's Profile */}
              <div className="inline-flex items-center p-1 bg-neutral-950 border border-neutral-800 rounded-xl shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-emerald-500 text-neutral-950 shadow-sm"
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Driver Cockpit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-neutral-400 hover:text-white hover:bg-neutral-900"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Become a Driver</span>
                </button>
              </div>

              <div className="h-6 w-px bg-neutral-800 hidden sm:block" />

              {/* Online / Offline Status Button */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 hidden lg:inline">
                  Shift: {isOnline ? <strong className="text-emerald-400">ONLINE</strong> : <strong className="text-neutral-500">OFFLINE</strong>}
                </span>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                    isOnline
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  }`}
                >
                  {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
              </div>
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

          {/* WEEKLY EARNINGS SUMMARY CARD (Past 7 Days Ride Metadata) */}
          <div
            id="driver-weekly-earnings-card"
            data-testid="weekly-earnings-card"
            className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    Weekly Earnings Summary
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                  Past 7 Days Driver Payout &amp; Tips
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Past 7 Days Cycle (Oct 07 – Oct 13)</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-800">
                  NBD Direct Deposit
                </span>
              </div>
            </div>

            {/* Total Weekly Earnings & Breakdown Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gross Total (Fares + Tips) */}
              <div className="bg-gradient-to-br from-neutral-950 to-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4.5">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-xs uppercase font-semibold">Total Weekly Earnings</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {formatFare(totalWeeklyEarnings, currency)}
                </div>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">
                  Fares + 100% Retained Tips
                </p>
              </div>

              {/* Total Fares */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4.5">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-xs uppercase font-semibold">Total Fares Collected</span>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {formatFare(totalWeeklyFares, currency)}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  From {totalWeeklyTrips} mountain dispatches
                </p>
              </div>

              {/* Total Tips */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4.5">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-xs uppercase font-semibold">Total Tips Collected</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tabular-nums">
                  {formatFare(totalWeeklyTips, currency)}
                </div>
                <p className="text-[11px] text-amber-400/90 mt-1">
                  100% Retained by Driver · Zero fee
                </p>
              </div>

              {/* Trips & Avg Per Trip */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4.5">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-xs uppercase font-semibold">Trips &amp; Average</span>
                  <Car className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {totalWeeklyTrips} <span className="text-xs font-normal text-neutral-400">trips</span>
                </div>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">
                  ~{formatFare(avgEarningsPerTrip, currency)} / trip avg
                </p>
              </div>
            </div>

            {/* 7-Day Visual Daily Performance Chart */}
            <div className="p-4 sm:p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Daily Earnings Distribution (Last 7 Days)</span>
                <span className="text-neutral-400 text-[11px]">Tap day to filter metadata</span>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-2 items-end h-28">
                {dailyBreakdown.map((item, idx) => {
                  const heightPercent = Math.max(18, Math.round((item.total / maxDayTotal) * 100));
                  const isSelected = selectedDayFilter === item.day;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDayFilter(selectedDayFilter === item.day ? 'all' : item.day)}
                      className={`h-full flex flex-col justify-end items-center gap-1.5 p-1 rounded-xl transition-all cursor-pointer ${
                        isSelected ? 'bg-neutral-800/80 ring-1 ring-emerald-500' : 'hover:bg-neutral-900/60'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold text-neutral-300">
                        {currency === 'USD' ? `$${(item.total / 2.7).toFixed(0)}` : `EC$${item.total.toFixed(0)}`}
                      </span>
                      <div className="w-full bg-neutral-800 rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: `${heightPercent}%` }}>
                        <div
                          className="w-full bg-emerald-400 transition-all rounded-t-lg"
                          style={{ height: '100%' }}
                          title={`${item.day}: Fares ${formatFare(item.fares, currency)}, Tips ${formatFare(item.tips, currency)}`}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium truncate w-full text-center">
                        {item.day.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Day filter pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-800/80 text-[11px]">
                <span className="text-neutral-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-neutral-500" />
                  <span>Filter:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDayFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedDayFilter === 'all'
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  All 7 Days ({weeklyRides.length})
                </button>
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDayFilter(day)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      selectedDayFilter === day
                        ? 'bg-emerald-500 text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* 7-Day Ride Metadata Table & Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold text-white">
                  Past 7 Days Dispatched Ride Records ({filteredWeeklyRides.length})
                </h4>
                <span className="text-[11px] text-emerald-400 font-mono">
                  Total in view: {formatFare(filteredWeeklyRides.reduce((s, r) => s + r.fareXCD + r.tipXCD, 0), currency)}
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredWeeklyRides.map((ride, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs hover:border-neutral-700 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-neutral-400">{ride.id}</span>
                        <span className="text-neutral-500">·</span>
                        <span className="font-semibold text-white">{ride.passenger}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-900">
                          {ride.dayLabel} · {ride.date} {ride.time}
                        </span>
                      </div>
                      <div className="text-neutral-400 text-[11px] mt-0.5 truncate">
                        {ride.pickup} ➔ {ride.destination}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-neutral-400 text-[10px] block">Fare</span>
                        <span className="font-mono font-bold text-white">
                          {formatFare(ride.fareXCD, currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-amber-400 text-[10px] block">Tip</span>
                        <span className="font-mono font-bold text-amber-300">
                          +{formatFare(ride.tipXCD, currency)}
                        </span>
                      </div>
                      <div className="border-l border-neutral-800 pl-3">
                        <span className="text-neutral-400 text-[10px] block">Driver Total</span>
                        <span className="font-mono font-extrabold text-emerald-400 text-sm">
                          {formatFare(ride.fareXCD + ride.tipXCD, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                    {trip.tipXCD && (
                      <span className="text-[10px] text-amber-300 font-mono block">
                        +{formatFare(trip.tipXCD, currency)} tip
                      </span>
                    )}
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
                className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
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
