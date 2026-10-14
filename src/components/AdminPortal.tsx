import React, { useState, useEffect } from 'react';
import {
  Users,
  Car,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Radio,
  Bell,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  FileText,
  Search,
  Filter,
  Eye,
  Phone,
  Plus,
  AlertTriangle,
  Navigation,
  Star,
  Award,
} from 'lucide-react';
import { VEHICLE_TIERS, DOMINICA_LOCATIONS } from '../data/dominicaData';
import { Currency } from '../types/booking';
import { formatFare } from '../utils/pricing';
import { EliteRideLogo } from './EliteRideLogo';

interface AdminPortalProps {
  currency: Currency;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ currency }) => {
  const [adminTab, setAdminTab] = useState<'driver_console' | 'live_dispatch' | 'applications' | 'revenue'>('driver_console');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(null), 4500);
  };

  // Active Driver Console State (inside Admin Portal)
  const [selectedDriverId, setSelectedDriverId] = useState('drv-491');
  const [driverOnlineStatus, setDriverOnlineStatus] = useState<Record<string, boolean>>({
    'drv-491': true,
    'drv-203': true,
    'drv-881': false,
    'drv-505': true,
  });

  const [driversList, setDriversList] = useState([
    {
      id: 'drv-491',
      name: 'Jean-Pierre Bruno',
      plate: 'DA-4912',
      vehicle: 'Toyota Land Cruiser Prado 4WD',
      tier: 'Elite 4WD Mountain SUV',
      location: 'Roseau Bayfront (Ferry Terminal)',
      rating: 4.96,
      tripsToday: 6,
      earningsXCD: 620.0,
      phone: '+1 (767) 225-8841',
    },
    {
      id: 'drv-203',
      name: 'Althea Fontaine',
      plate: 'DA-1893',
      vehicle: 'Toyota Corolla Sedan (Silver)',
      tier: 'Elite Standard Sedan',
      location: 'Portsmouth & Prince Rupert Bay',
      rating: 4.92,
      tripsToday: 4,
      earningsXCD: 340.0,
      phone: '+1 (767) 235-9014',
    },
    {
      id: 'drv-881',
      name: 'Marcus Williams',
      plate: 'HA-7721',
      vehicle: 'Toyota Coaster 12-Pax Van',
      tier: 'Elite Shared Coaster',
      location: 'Canefield Highway Corridor',
      rating: 4.88,
      tripsToday: 8,
      earningsXCD: 480.0,
      phone: '+1 (767) 276-3392',
    },
    {
      id: 'drv-505',
      name: 'Gabriel Joseph',
      plate: 'DA-0044',
      vehicle: 'Mercedes-Benz VIP Executive Lounge',
      tier: 'Airport VIP Transfer',
      location: 'Douglas-Charles Airport (DOM) Station',
      rating: 4.98,
      tripsToday: 3,
      earningsXCD: 750.0,
      phone: '+1 (767) 245-1100',
    },
  ]);

  // Incoming Dispatch Simulator
  const [incomingRequest, setIncomingRequest] = useState<any | null>(null);
  const [requestTimer, setRequestTimer] = useState(15);

  useEffect(() => {
    const isCurrentOnline = driverOnlineStatus[selectedDriverId];
    if (!isCurrentOnline) {
      setIncomingRequest(null);
      return;
    }

    const t = setInterval(() => {
      if (!incomingRequest && Math.random() > 0.45) {
        setIncomingRequest({
          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          pickup: 'Roseau (Capital)',
          dropoff: 'Portsmouth (Grand-Anse)',
          distanceMiles: 27.5,
          tierName: 'Elite 4WD Mountain SUV',
          fareXCD: 317.4,
          passengerName: 'David K. (4.9★)',
        });
        setRequestTimer(15);
      }
    }, 10000);

    return () => clearInterval(t);
  }, [selectedDriverId, driverOnlineStatus, incomingRequest]);

  useEffect(() => {
    if (!incomingRequest) return;
    const interval = setInterval(() => {
      setRequestTimer((prev) => {
        if (prev <= 1) {
          setIncomingRequest(null);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [incomingRequest]);

  const activeDriver = driversList.find((d) => d.id === selectedDriverId) || driversList[0];
  const isDriverOnline = !!driverOnlineStatus[selectedDriverId];

  const toggleCurrentDriverShift = () => {
    setDriverOnlineStatus((prev) => ({
      ...prev,
      [selectedDriverId]: !prev[selectedDriverId],
    }));
  };

  // Mock applicant list
  const [applicants, setApplicants] = useState([
    {
      id: 'APP-812',
      name: 'Kevon Titre',
      phone: '+1 (767) 245-8819',
      license: 'DL-DOM-77182',
      vehicle: 'Toyota Hilux 4WD (2023)',
      plate: 'DA-8812',
      policeCheck: true,
      status: 'pending',
      nbdAccount: 'NBD-9912-3310',
    },
    {
      id: 'APP-811',
      name: 'Nathalie Joseph',
      phone: '+1 (767) 285-0041',
      license: 'DL-DOM-64019',
      vehicle: 'Nissan X-Trail (2022)',
      plate: 'DA-5521',
      policeCheck: true,
      status: 'approved',
      nbdAccount: 'NBD-1049-5502',
    },
  ]);

  const approveApplicant = (id: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Admin Portal Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3.5">
          <EliteRideLogo variant="mark" size="sm" theme="dark" />
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold block">
              Central Dispatch & Operations Control · #DOM-ER-2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Elite Ride Admin Portal
            </h2>
          </div>
        </div>

        {/* Consolidated Admin Navigation Tabs */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-semibold shadow-inner">
          <button
            onClick={() => setAdminTab('driver_console')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              adminTab === 'driver_console'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            Active Driver Console
          </button>
          <button
            onClick={() => setAdminTab('live_dispatch')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              adminTab === 'live_dispatch'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            Live Dispatch Radar
          </button>
          <button
            onClick={() => setAdminTab('applications')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              adminTab === 'applications'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            Driver Applications
          </button>
          <button
            onClick={() => setAdminTab('revenue')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              adminTab === 'revenue'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            Platform & 15% VAT
          </button>
        </div>
      </div>

      {/* Admin Operations Notice Banner */}
      {adminNotice && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl flex items-center gap-3 text-emerald-200 text-xs shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{adminNotice}</span>
        </div>
      )}

      {/* TAB 1: ACTIVE DRIVER CONSOLE (Placed inside Admin Portal as requested) */}
      {adminTab === 'driver_console' && (
        <div className="space-y-6">
          {/* Driver Selector & Shift Switcher */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-neutral-400 block mb-1">
                Select Active Fleet Driver
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {driversList.map((driver) => {
                  const isSel = driver.id === selectedDriverId;
                  const isOnline = !!driverOnlineStatus[driver.id];
                  return (
                    <button
                      key={driver.id}
                      onClick={() => {
                        setSelectedDriverId(driver.id);
                        setIncomingRequest(null);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                        isSel
                          ? 'bg-neutral-800 border-emerald-500 text-white ring-1 ring-emerald-500'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                      <span>{driver.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">({driver.plate})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shift On/Off Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-300 font-medium">
                Driver Shift: {isDriverOnline ? <strong className="text-emerald-400 font-bold">ONLINE (Active)</strong> : <strong className="text-neutral-500">OFFLINE</strong>}
              </span>
              <button
                onClick={toggleCurrentDriverShift}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isDriverOnline
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                {isDriverOnline ? 'Set Offline' : 'Set Online'}
              </button>
            </div>
          </div>

          {/* Incoming Dispatch Card if Driver is Online */}
          {incomingRequest && isDriverOnline && (
            <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl animate-pulse-subtle">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80 mb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Bell className="w-5 h-5 animate-bounce" />
                  <span>Incoming Ride Dispatch Alert for {activeDriver.name}</span>
                </div>
                <div className="px-3 py-1 bg-emerald-500 text-neutral-950 rounded-full font-mono font-bold text-xs">
                  {requestTimer}s to Accept
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs text-neutral-200">
                <div>
                  <span className="text-neutral-400 block mb-0.5">Rider</span>
                  <span className="font-bold text-white text-sm">{incomingRequest.passengerName}</span>
                  <span className="block text-emerald-400 mt-0.5">Tier: {incomingRequest.tierName}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-neutral-400 block mb-0.5">Estimated Driver Payout</span>
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
                    <span>Drop-off: <strong>{incomingRequest.dropoff}</strong> ({incomingRequest.distanceMiles} mi)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    showNotice(`Ride ${incomingRequest.id} assigned to ${activeDriver.name}! Driver in-car terminal notified.`);
                    setIncomingRequest(null);
                  }}
                  className="flex-1 py-3 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept & Assign Dispatch</span>
                </button>
                <button
                  onClick={() => setIncomingRequest(null)}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* Active Driver Profile & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
              <span className="text-xs uppercase font-semibold text-neutral-400 block mb-2">
                Assigned Vehicle & Location
              </span>
              <div className="font-bold text-white text-base">{activeDriver.vehicle}</div>
              <div className="text-xs text-neutral-400 mt-1">Plate: <span className="font-mono text-emerald-400 font-bold">{activeDriver.plate}</span></div>
              <div className="text-xs text-neutral-400 mt-1">Staged Station: <span className="text-neutral-200">{activeDriver.location}</span></div>
              <div className="text-[11px] text-neutral-500 mt-3 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeDriver.phone}</span>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
              <span className="text-xs uppercase font-semibold text-neutral-400 block mb-1">
                Today's Shift Earnings
              </span>
              <div className="text-3xl font-extrabold text-white font-mono">
                {formatFare(activeDriver.earningsXCD, currency)}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 font-mono">
                Direct to NBD MoBanking Account
              </div>
              <div className="text-xs text-neutral-400 mt-3">
                Completed Trips: <strong className="text-white">{activeDriver.tripsToday}</strong>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
              <span className="text-xs uppercase font-semibold text-neutral-400 block mb-1">
                Chauffeur Rating & Vetting
              </span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono flex items-center gap-1">
                <span>★</span>
                <span>{activeDriver.rating.toFixed(2)}</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Dominica Mountain Road Certified
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Annual Police Clearance Verified</span>
              </div>
            </div>
          </div>

          {/* Driver Active Shift Trips & Dispatch Actions */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Shift Activity & Live Logs:</span>
                  <span className="text-emerald-400">{activeDriver.name}</span>
                  <span className="text-xs font-mono text-neutral-400">({activeDriver.plate})</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Real-time GPS trip audit, assigned fares, and automated 15% VAT settlement.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showNotice(`Emergency Police SOS test signal sent to unit #${activeDriver.plate} (${activeDriver.name}). Police link 999 ACK verified.`);
                  }}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test Police SOS</span>
                </button>
                <button
                  onClick={() => {
                    showNotice(`Direct staging ping sent to ${activeDriver.name} (${activeDriver.plate}): Staged at Douglas-Charles Airport (DOM) arrivals.`);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Direct Staging Ping</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="border-b border-neutral-800 text-[11px] text-neutral-400 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Trip ID</th>
                    <th className="py-2.5 px-3">Dominica Route</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Gross Fare</th>
                    <th className="py-2.5 px-3">Driver Share</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  <tr>
                    <td className="py-3 px-3 text-emerald-400 font-bold">#TRP-8921</td>
                    <td className="py-3 px-3 font-sans">Roseau Bayfront ➔ Douglas-Charles Airport (DOM)</td>
                    <td className="py-3 px-3 text-neutral-400">11:20 AM</td>
                    <td className="py-3 px-3">{formatFare(392.15, currency)}</td>
                    <td className="py-3 px-3 text-emerald-300">{formatFare(333.33, currency)}</td>
                    <td className="py-3 px-3"><span className="text-emerald-400 font-bold font-sans">● In Transit</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-emerald-400 font-bold">#TRP-8914</td>
                    <td className="py-3 px-3 font-sans">Canefield ➔ Laudat (Titou Gorge Trailhead)</td>
                    <td className="py-3 px-3 text-neutral-400">09:45 AM</td>
                    <td className="py-3 px-3">{formatFare(95.0, currency)}</td>
                    <td className="py-3 px-3 text-emerald-300">{formatFare(80.75, currency)}</td>
                    <td className="py-3 px-3"><span className="text-neutral-400 font-sans">Completed</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-emerald-400 font-bold">#TRP-8902</td>
                    <td className="py-3 px-3 font-sans">Roseau ➔ Soufrière Sulphur Springs</td>
                    <td className="py-3 px-3 text-neutral-400">08:10 AM</td>
                    <td className="py-3 px-3">{formatFare(132.85, currency)}</td>
                    <td className="py-3 px-3 text-emerald-300">{formatFare(112.92, currency)}</td>
                    <td className="py-3 px-3"><span className="text-neutral-400 font-sans">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE DISPATCH RADAR */}
      {adminTab === 'live_dispatch' && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Dominica Live Queue & Dispatches</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="border-b border-neutral-800 text-[11px] text-neutral-400 uppercase">
                  <tr>
                    <th className="py-3 px-4">Trip ID</th>
                    <th className="py-3 px-4">Origin ➔ Destination</th>
                    <th className="py-3 px-4">Assigned Driver</th>
                    <th className="py-3 px-4">Fare (EC$)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  <tr>
                    <td className="py-3 px-4 text-emerald-400 font-bold">#TRP-8921</td>
                    <td className="py-3 px-4 font-sans">Roseau Bayfront ➔ Douglas-Charles Airport (DOM)</td>
                    <td className="py-3 px-4 font-sans">Jean-Pierre Bruno (#DA-4912)</td>
                    <td className="py-3 px-4">{formatFare(392.15, currency)}</td>
                    <td className="py-3 px-4"><span className="text-emerald-400 font-bold">● IN TRANSIT</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-emerald-400 font-bold">#TRP-8920</td>
                    <td className="py-3 px-4 font-sans">Canefield Airport (DCF) ➔ Portsmouth</td>
                    <td className="py-3 px-4 font-sans">Althea Fontaine (#DA-1893)</td>
                    <td className="py-3 px-4">{formatFare(282.9, currency)}</td>
                    <td className="py-3 px-4"><span className="text-amber-400 font-bold">● ARRIVED PICKUP</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-emerald-400 font-bold">#TRP-8919</td>
                    <td className="py-3 px-4 font-sans">Marigot ➔ Calibishie</td>
                    <td className="py-3 px-4 font-sans">Gabriel Joseph (#DA-0044)</td>
                    <td className="py-3 px-4">{formatFare(127.65, currency)}</td>
                    <td className="py-3 px-4"><span className="text-neutral-400">COMPLETED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DRIVER APPLICATIONS */}
      {adminTab === 'applications' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white mb-2">Driver Partner Vetting Queue</h3>
          <p className="text-xs text-neutral-400 mb-4">
            Review driver partner license numbers, police record clearance certifications, and vehicle road-worthiness before granting dispatch permissions.
          </p>

          <div className="space-y-3">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{app.name}</span>
                    <span className="text-neutral-500 font-mono">({app.id})</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="text-neutral-400 text-[11px] mt-1 space-x-3">
                    <span>License: <strong className="font-mono text-white">{app.license}</strong></span>
                    <span>Vehicle: <strong className="text-white">{app.vehicle}</strong> ({app.plate})</span>
                    <span>NBD: <strong className="font-mono text-emerald-400">{app.nbdAccount}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'pending' ? (
                    <button
                      onClick={() => approveApplicant(app.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Approve & Grant Dispatch
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Active Partner
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM REVENUE & 15% VAT */}
      {adminTab === 'revenue' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <span className="text-xs uppercase font-semibold text-neutral-400 block mb-1">
              Gross Platform Volume (Today)
            </span>
            <div className="text-3xl font-extrabold text-white font-mono">
              {formatFare(4890.0, currency)}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Processed across Dominica fleet</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <span className="text-xs uppercase font-semibold text-neutral-400 block mb-1">
              15% Dominica VAT Collected
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {formatFare(733.5, currency)}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Compliant with Dominica VAT Act</div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <span className="text-xs uppercase font-semibold text-neutral-400 block mb-1">
              Emergency Police SOS System
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              ACTIVE
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">24/7 Police Force (999) Link Normal</div>
          </div>
        </div>
      )}
    </div>
  );
};
