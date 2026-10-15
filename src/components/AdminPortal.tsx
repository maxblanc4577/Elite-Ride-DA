import React, { useState, useEffect, useMemo } from 'react';
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
  Download,
  CreditCard,
  RefreshCw,
  Sliders,
  Webhook,
  Activity,
  ArrowUpDown,
  Send,
  Building2,
  Lock,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { VEHICLE_TIERS, DOMINICA_LOCATIONS } from '../data/dominicaData';
import { Currency } from '../types/booking';
import { StripeMerchantProfile, DEFAULT_STRIPE_MERCHANT } from '../types/merchant';
import { formatFare } from '../utils/pricing';
import { EliteRideLogo } from './EliteRideLogo';

interface AdminPortalProps {
  currency: Currency;
  merchant?: StripeMerchantProfile | null;
  onOpenMerchantLogin?: () => void;
  onMerchantLogin?: (merchant: StripeMerchantProfile) => void;
  onMerchantLogout?: () => void;
}

interface AdminRideRecord {
  id: string;
  date: string;
  driverId: string;
  driverName: string;
  driverPlate: string;
  riderName: string;
  origin: string;
  destination: string;
  tier: string;
  grossFareXCD: number;
  vat15XCD: number;
  driver80XCD: number;
  platform20XCD: number;
  status: 'completed' | 'in_transit' | 'confirmed' | 'refunded';
  stripePaymentIntent: string;
  payoutStatus: 'settled' | 'pending' | 'reversed';
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currency,
  merchant,
  onOpenMerchantLogin,
  onMerchantLogin,
  onMerchantLogout,
}) => {
  const [adminTab, setAdminTab] = useState<'revenue' | 'stripe_merchant' | 'driver_console' | 'live_dispatch' | 'applications'>('revenue');
  const [revenueSubTab, setRevenueSubTab] = useState<'overview' | 'ledger' | 'stripe_webhooks' | 'stripe_merchant'>('overview');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Stripe merchant local state fallback
  const [localMerchant, setLocalMerchant] = useState<StripeMerchantProfile | null>(() => {
    try {
      const saved = localStorage.getItem('elite_ride_stripe_merchant');
      return saved ? JSON.parse(saved) : DEFAULT_STRIPE_MERCHANT;
    } catch {
      return DEFAULT_STRIPE_MERCHANT;
    }
  });

  const activeMerchant = merchant !== undefined ? merchant : localMerchant;

  // Custom merchant login form inputs
  const [customMerchantEmail, setCustomMerchantEmail] = useState('info@elite-ride.org');
  const [customMerchantApiKey, setCustomMerchantApiKey] = useState('sk_live_51DOM2026ELITE7781xcd');
  const [customMerchantMode, setCustomMerchantMode] = useState<'live' | 'test'>('live');
  const [customMerchantBank, setCustomMerchantBank] = useState('National Bank of Dominica (NBD) Checking #***5502');

  // Stripe Checkout Session Endpoint Test state
  const [checkoutTestStatus, setCheckoutTestStatus] = useState<{ loading: boolean; url?: string; error?: string; id?: string } | null>(null);

  const handleTestCheckoutSession = async () => {
    setCheckoutTestStatus({ loading: true });
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          tierId: 'mountain-4wd-suv',
          tierName: 'Elite 4WD Mountain SUV',
        }),
      });
      const data = await res.json();
      if (data.url || data.id) {
        setCheckoutTestStatus({
          loading: false,
          url: data.url,
          id: data.id || 'cs_test_session_active',
        });
        showNotice('Stripe Checkout Session created successfully via /api/create-checkout-session!');
      } else {
        setCheckoutTestStatus({
          loading: false,
          error: data.error || 'Failed to create Checkout Session',
        });
      }
    } catch (e: any) {
      setCheckoutTestStatus({
        loading: false,
        error: e?.message || 'Server connection error',
      });
    }
  };

  const handleUpdateMerchant = (m: StripeMerchantProfile) => {
    setLocalMerchant(m);
    try {
      localStorage.setItem('elite_ride_stripe_merchant', JSON.stringify(m));
    } catch {}
    if (onMerchantLogin) onMerchantLogin(m);
    showNotice(`Stripe Merchant account "${m.businessName}" (${m.merchantId}) authenticated successfully.`);
  };

  const handleCustomMerchantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StripeMerchantProfile = {
      ...DEFAULT_STRIPE_MERCHANT,
      email: customMerchantEmail,
      mode: customMerchantMode,
      settlementAccount: customMerchantBank,
      lastLogin: new Date().toLocaleString(),
    };
    handleUpdateMerchant(updated);
  };

  const handleDisconnectMerchant = () => {
    setLocalMerchant(null);
    try {
      localStorage.removeItem('elite_ride_stripe_merchant');
    } catch {}
    if (onMerchantLogout) onMerchantLogout();
    showNotice('Stripe Merchant logged out. Card payments will require administrator authentication.');
  };

  // Search filter for ride history
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_transit' | 'confirmed' | 'refunded'>('all');

  const showNotice = (msg: string) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(null), 5000);
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

  // Master Ride History Records (Used for 80/20 real-time revenue calculation & ledger)
  const [rideHistoryRecords, setRideHistoryRecords] = useState<AdminRideRecord[]>([
    {
      id: 'TRP-8921',
      date: '2026-10-14 11:20',
      driverId: 'drv-491',
      driverName: 'Jean-Pierre Bruno',
      driverPlate: 'DA-4912',
      riderName: 'Julian Montgomery',
      origin: 'Roseau Bayfront Ferry',
      destination: 'Douglas-Charles Airport (DOM)',
      tier: 'Elite 4WD Mountain SUV',
      grossFareXCD: 392.15,
      vat15XCD: 51.15,
      driver80XCD: 313.72,
      platform20XCD: 78.43,
      status: 'in_transit',
      stripePaymentIntent: 'pi_3M981729012',
      payoutStatus: 'pending',
    },
    {
      id: 'TRP-8920',
      date: '2026-10-14 10:15',
      driverId: 'drv-203',
      driverName: 'Althea Fontaine',
      driverPlate: 'DA-1893',
      riderName: 'Camille Dupuis',
      origin: 'Canefield Airport (DCF)',
      destination: 'Secret Bay Resort (Portsmouth)',
      tier: 'Elite Standard Sedan',
      grossFareXCD: 282.90,
      vat15XCD: 36.90,
      driver80XCD: 226.32,
      platform20XCD: 56.58,
      status: 'completed',
      stripePaymentIntent: 'pi_3M882190341',
      payoutStatus: 'settled',
    },
    {
      id: 'TRP-8919',
      date: '2026-10-13 16:40',
      driverId: 'drv-505',
      driverName: 'Gabriel Joseph',
      driverPlate: 'DA-0044',
      riderName: 'Dr. Evelyn St. Rose',
      origin: 'Douglas-Charles Airport (DOM)',
      destination: 'Fort Young Hotel (Roseau)',
      tier: 'Airport VIP Transfer',
      grossFareXCD: 485.00,
      vat15XCD: 63.26,
      driver80XCD: 388.00,
      platform20XCD: 97.00,
      status: 'completed',
      stripePaymentIntent: 'pi_3M771655029',
      payoutStatus: 'settled',
    },
    {
      id: 'TRP-8918',
      date: '2026-10-13 14:10',
      driverId: 'drv-881',
      driverName: 'Marcus Williams',
      driverPlate: 'HA-7721',
      riderName: 'Dominica Tour Group (8 Pax)',
      origin: 'Roseau Cruise Berth',
      destination: 'Trafalgar Falls & Titou Gorge',
      tier: 'Elite Shared Coaster',
      grossFareXCD: 520.00,
      vat15XCD: 67.83,
      driver80XCD: 416.00,
      platform20XCD: 104.00,
      status: 'completed',
      stripePaymentIntent: 'pi_3M662910443',
      payoutStatus: 'settled',
    },
    {
      id: 'TRP-8917',
      date: '2026-10-12 11:30',
      driverId: 'drv-491',
      driverName: 'Jean-Pierre Bruno',
      driverPlate: 'DA-4912',
      riderName: 'Marcus Vance',
      origin: 'Mero Beach',
      destination: 'Cabrits National Park',
      tier: 'Elite 4WD Mountain SUV',
      grossFareXCD: 240.00,
      vat15XCD: 31.30,
      driver80XCD: 192.00,
      platform20XCD: 48.00,
      status: 'completed',
      stripePaymentIntent: 'pi_3M550918231',
      payoutStatus: 'settled',
    },
    {
      id: 'TRP-8916',
      date: '2026-10-11 09:15',
      driverId: 'drv-203',
      driverName: 'Althea Fontaine',
      driverPlate: 'DA-1893',
      riderName: 'Sarah Jenkins',
      origin: 'Roseau Bayfront',
      destination: 'Soufriere Sulphur Springs',
      tier: 'Elite Standard Sedan',
      grossFareXCD: 145.00,
      vat15XCD: 18.91,
      driver80XCD: 116.00,
      platform20XCD: 29.00,
      status: 'completed',
      stripePaymentIntent: 'pi_3M441829001',
      payoutStatus: 'settled',
    },
    {
      id: 'TRP-8915',
      date: '2026-10-10 17:00',
      driverId: 'drv-505',
      driverName: 'Gabriel Joseph',
      driverPlate: 'DA-0044',
      riderName: 'Robert Duplessis',
      origin: 'Douglas-Charles Airport (DOM)',
      destination: 'Cabrits Resort & Spa',
      tier: 'Airport VIP Transfer',
      grossFareXCD: 410.00,
      vat15XCD: 53.48,
      driver80XCD: 328.00,
      platform20XCD: 82.00,
      status: 'completed',
      stripePaymentIntent: 'pi_3M331908221',
      payoutStatus: 'settled',
    },
  ]);

  // Read stored revenue transactions from StripePaymentModal if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem('elite_ride_admin_revenue');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted: AdminRideRecord[] = parsed.map((item: any) => ({
            id: item.receiptNumber ? `TRP-${item.receiptNumber.slice(-4)}` : `TRP-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date(item.timestamp || Date.now()).toISOString().slice(0, 16).replace('T', ' '),
            driverId: 'drv-491',
            driverName: 'Jean-Pierre Bruno',
            driverPlate: 'DA-4912',
            riderName: item.passengerName || 'Dominica Rider',
            origin: item.pickupLabel || 'Roseau',
            destination: item.dropoffLabel || 'Destination',
            tier: item.tierName || 'Elite 4WD Mountain SUV',
            grossFareXCD: item.totalXCD || 300,
            vat15XCD: item.vat15XCD || 39.13,
            driver80XCD: item.driverPayout80XCD || Number((item.totalXCD * 0.8).toFixed(2)),
            platform20XCD: item.platformCommission20XCD || Number((item.totalXCD * 0.2).toFixed(2)),
            status: 'completed',
            stripePaymentIntent: item.paymentIntentId || 'pi_mock_live',
            payoutStatus: 'settled',
          }));

          setRideHistoryRecords((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const fresh = formatted.filter((f) => !existingIds.has(f.id));
            return [...fresh, ...prev];
          });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Webhook Testing Module State
  const [webhookEventLog, setWebhookEventLog] = useState<Array<{ id: string; type: string; time: string; status: string; payload: any }>>([
    {
      id: 'evt_test_01',
      type: 'payment_intent.succeeded',
      time: '11:20:45 AM',
      status: '200 OK',
      payload: {
        id: 'pi_3M981729012',
        object: 'payment_intent',
        amount: 39215,
        currency: 'xcd',
        status: 'succeeded',
        metadata: { rideId: 'TRP-8921', driverSharePercent: 80, platformSharePercent: 20 },
      },
    },
  ]);
  const [selectedWebhookEvent, setSelectedWebhookEvent] = useState<any | null>(null);

  // Filtered ride records based on search query and status filter
  const filteredRecords = useMemo(() => {
    return rideHistoryRecords.filter((record) => {
      const matchesSearch =
        record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.stripePaymentIntent.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rideHistoryRecords, searchQuery, statusFilter]);

  // Real-time Revenue & 80/20 Splits Calculations
  const metrics = useMemo(() => {
    const valid = rideHistoryRecords.filter((r) => r.status !== 'refunded');
    const grossTotal = valid.reduce((sum, r) => sum + r.grossFareXCD, 0);
    const vatTotal = valid.reduce((sum, r) => sum + r.vat15XCD, 0);
    const driver80Total = valid.reduce((sum, r) => sum + r.driver80XCD, 0);
    const platform20Total = valid.reduce((sum, r) => sum + r.platform20XCD, 0);
    return { grossTotal, vatTotal, driver80Total, platform20Total, totalRides: valid.length };
  }, [rideHistoryRecords]);

  // Recharts Bar Chart Data: Daily Earnings Split for October 2026
  const rechartsDailyData = [
    { day: 'Oct 09', driverEarnings: 820, platformCommission: 205, total: 1025 },
    { day: 'Oct 10', driverEarnings: 1160, platformCommission: 290, total: 1450 },
    { day: 'Oct 11', driverEarnings: 940, platformCommission: 235, total: 1175 },
    { day: 'Oct 12', driverEarnings: 1480, platformCommission: 370, total: 1850 },
    { day: 'Oct 13', driverEarnings: 1840, platformCommission: 460, total: 2300 },
    { day: 'Oct 14', driverEarnings: 1960, platformCommission: 490, total: 2450 },
    { day: 'Oct 15 (Est)', driverEarnings: 1720, platformCommission: 430, total: 2150 },
  ];

  // CSV Export Functionality
  const handleExportCSV = () => {
    const headers = [
      'Ride ID',
      'Date & Time',
      'Assigned Chauffeur',
      'Driver Plate',
      'Rider Full Name',
      'Pickup Location',
      'Destination Location',
      'Vehicle Tier',
      'Gross Fare (EC$)',
      '15% VAT (EC$)',
      'Driver Payout (80% EC$)',
      'Platform Commission (20% EC$)',
      'Stripe Payment Intent ID',
      'Trip Status',
      'Payout Status',
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.date}"`,
      `"${r.driverName}"`,
      `"${r.driverPlate}"`,
      `"${r.riderName}"`,
      `"${r.origin}"`,
      `"${r.destination}"`,
      `"${r.tier}"`,
      r.grossFareXCD.toFixed(2),
      r.vat15XCD.toFixed(2),
      r.driver80XCD.toFixed(2),
      r.platform20XCD.toFixed(2),
      `"${r.stripePaymentIntent}"`,
      `"${r.status}"`,
      `"${r.payoutStatus}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EliteRide_Dominica_Revenue_Splits_Oct2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('Downloaded EliteRide_Dominica_Revenue_Splits_Oct2026.csv successfully.');
  };

  // Mock Stripe Webhook Generator
  const handleTriggerWebhook = (eventType: 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'charge.refunded') => {
    const targetRide = rideHistoryRecords[0];
    const eventId = `evt_mock_${Math.random().toString(36).substring(2, 9)}`;
    const nowTime = new Date().toLocaleTimeString();

    let newStatus: AdminRideRecord['status'] = 'completed';
    let newPayout: AdminRideRecord['payoutStatus'] = 'settled';

    if (eventType === 'payment_intent.payment_failed') {
      newStatus = 'confirmed';
      newPayout = 'pending';
    } else if (eventType === 'charge.refunded') {
      newStatus = 'refunded';
      newPayout = 'reversed';
    }

    // Update ride record in history
    setRideHistoryRecords((prev) =>
      prev.map((r) =>
        r.id === targetRide.id
          ? {
              ...r,
              status: newStatus,
              payoutStatus: newPayout,
            }
          : r
      )
    );

    const payload = {
      id: eventId,
      object: 'event',
      type: eventType,
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: targetRide.stripePaymentIntent,
          amount: Math.round(targetRide.grossFareXCD * 100),
          currency: 'xcd',
          customer_email: 'info@elite-ride.org',
          status: eventType === 'payment_intent.succeeded' ? 'succeeded' : eventType === 'charge.refunded' ? 'refunded' : 'requires_payment_method',
          metadata: {
            rideId: targetRide.id,
            driverName: targetRide.driverName,
            driver80ShareXCD: targetRide.driver80XCD,
            platform20CommissionXCD: targetRide.platform20XCD,
          },
        },
      },
    };

    const newLogItem = {
      id: eventId,
      type: eventType,
      time: nowTime,
      status: '200 OK (Processed)',
      payload,
    };

    setWebhookEventLog((prev) => [newLogItem, ...prev]);
    setSelectedWebhookEvent(payload);
    showNotice(`Mock Stripe webhook '${eventType}' dispatched for Ride ${targetRide.id}. Status transitioned to ${newStatus}.`);
  };

  // Driver vetting applicants
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
    showNotice(`Driver application #${id} approved! Dispatch privileges activated.`);
  };

  const activeDriver = driversList.find((d) => d.id === selectedDriverId) || driversList[0];
  const isDriverOnline = !!driverOnlineStatus[selectedDriverId];

  const toggleCurrentDriverShift = () => {
    setDriverOnlineStatus((prev) => ({
      ...prev,
      [selectedDriverId]: !prev[selectedDriverId],
    }));
  };

  const renderStripeMerchantContent = () => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                Stripe Merchant Console
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Dominica Licensed Operator
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-0.5">
              Stripe Merchant Gateway &amp; Chauffeur Payouts
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeMerchant ? (
            <button
              type="button"
              onClick={handleDisconnectMerchant}
              className="px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Log Out Merchant</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleUpdateMerchant(DEFAULT_STRIPE_MERCHANT)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Instant 1-Click Login</span>
            </button>
          )}
        </div>
      </div>

      {activeMerchant ? (
        /* AUTHENTICATED MERCHANT VIEW */
        <div className="space-y-6">
          {/* Status Banner */}
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-300">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <span className="font-bold text-white">Merchant Account Authenticated:</span>{' '}
                <span>{activeMerchant.businessName} ({activeMerchant.merchantId})</span>
                <span className="block text-[11px] text-emerald-400 font-mono mt-0.5">
                  Direct 80% Chauffeur Payouts &amp; 15% VAT Invoicing Active &amp; Ready
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-neutral-950 text-white font-mono text-[11px] font-bold border border-neutral-800">
                Mode: {activeMerchant.mode.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => {
                  handleUpdateMerchant({
                    ...activeMerchant,
                    mode: activeMerchant.mode === 'live' ? 'test' : 'live',
                  });
                }}
                className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium cursor-pointer transition-colors"
              >
                Toggle Mode
              </button>
            </div>
          </div>

          {/* Financial & Settlement Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
              <div className="text-[11px] text-neutral-400 uppercase font-semibold">Available Balance</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                {formatFare(activeMerchant.availableBalanceXCD, currency)}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Daily settlement to NBD</div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
              <div className="text-[11px] text-neutral-400 uppercase font-semibold">Pending Escrow</div>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">
                {formatFare(activeMerchant.pendingBalanceXCD, currency)}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Clearing transit fares</div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
              <div className="text-[11px] text-neutral-400 uppercase font-semibold">Driver Revenue Split</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                80.0%
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Direct to Dominica Chauffeurs</div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
              <div className="text-[11px] text-neutral-400 uppercase font-semibold">Platform Commission</div>
              <div className="text-xl font-black text-indigo-300 font-mono mt-1">
                20.0%
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Retained for GPS dispatch</div>
            </div>
          </div>

          {/* Merchant Details & Live Simulation Box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Verified Merchant Profile */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3.5 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Registered Dominica Merchant Entity</span>
              </h4>

              <div className="space-y-2 text-neutral-300">
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-500">Legal Business Name:</span>
                  <span className="font-semibold text-white">{activeMerchant.businessName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-500">Commercial Registration:</span>
                  <span className="font-mono text-emerald-400">{activeMerchant.registrationNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-500">Official Merchant Email:</span>
                  <span className="font-mono text-white">{activeMerchant.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-500">Settlement Bank:</span>
                  <span className="text-neutral-200">{activeMerchant.settlementAccount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-500">Stripe Merchant ID:</span>
                  <span className="font-mono text-neutral-400">{activeMerchant.merchantId}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Charges &amp; Payouts:</span>
                  <span className="text-emerald-400 font-bold">Enabled &amp; Verified</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Transaction Test Module & Checkout Session API Test */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>Stripe Merchant Testing &amp; Checkout Session API</span>
              </h4>
              <p className="text-neutral-400 text-xs">
                Validate live payment authorization, simulate 80% chauffeur payout credit, and test the server-side Stripe Checkout session endpoint.
              </p>

              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Route:</span>
                  <span className="text-white font-medium">Roseau Bayfront ➔ Secret Bay (Portsmouth)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Gross Fare:</span>
                  <span className="text-white font-mono font-bold">EC$ 300.00</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Driver 80% Payout:</span>
                  <span className="font-mono">EC$ 240.00</span>
                </div>
                <div className="flex justify-between text-indigo-300">
                  <span>Platform 20% Retention:</span>
                  <span className="font-mono">EC$ 60.00</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const testIntent = `pi_test_${Math.random().toString(36).substring(2, 9)}`;
                    const newRecord: AdminRideRecord = {
                      id: `TRP-${Math.floor(1000 + Math.random() * 9000)}`,
                      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                      driverId: 'drv-491',
                      driverName: 'Jean-Pierre Bruno',
                      driverPlate: 'DA-4912',
                      riderName: 'Verified Cardholder (Dominica Visitor)',
                      origin: 'Roseau Bayfront',
                      destination: 'Secret Bay (Portsmouth)',
                      tier: 'Elite 4WD Mountain SUV',
                      grossFareXCD: 300.00,
                      vat15XCD: 39.13,
                      driver80XCD: 240.00,
                      platform20XCD: 60.00,
                      status: 'completed',
                      stripePaymentIntent: testIntent,
                      payoutStatus: 'settled',
                    };
                    setRideHistoryRecords((prev) => [newRecord, ...prev]);
                    showNotice(`Test transaction ${testIntent} processed! EC$ 240.00 (80%) credited to Jean-Pierre Bruno.`);
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Process Test Charge &amp; Update Ledger</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestCheckoutSession}
                  disabled={checkoutTestStatus?.loading}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Webhook className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {checkoutTestStatus?.loading
                      ? 'Creating Session via /api/create-checkout-session...'
                      : 'Test Stripe Checkout Session Endpoint (/api/create-checkout-session)'}
                  </span>
                </button>

                {checkoutTestStatus && (
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      checkoutTestStatus.error
                        ? 'bg-red-950/60 border-red-800 text-red-300'
                        : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {checkoutTestStatus.error ? (
                      <div>Error: {checkoutTestStatus.error}</div>
                    ) : (
                      <div className="space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Session Generated: {checkoutTestStatus.id}</span>
                        </div>
                        {checkoutTestStatus.url && (
                          <div className="pt-1">
                            <a
                              href={checkoutTestStatus.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-mono text-[11px]"
                            >
                              <span>Open Hosted Checkout URL</span>
                              <Eye className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* UN-AUTHENTICATED MERCHANT LOGIN VIEW */
        <div className="max-w-xl mx-auto p-6 sm:p-8 bg-neutral-950 border border-neutral-800 rounded-3xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-extrabold text-white">
              Admin Stripe Merchant Authentication
            </h4>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Authenticate your Dominica Stripe Merchant account to authorize cashless card rides, enforce 80% chauffeur payouts, and enable official 15% VAT tax invoices.
            </p>
          </div>

          <form onSubmit={handleCustomMerchantSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Merchant Account Email *
              </label>
              <input
                type="email"
                required
                value={customMerchantEmail}
                onChange={(e) => setCustomMerchantEmail(e.target.value)}
                placeholder="info@elite-ride.org"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Stripe API Key (Secret / Restricted) *
              </label>
              <input
                type="password"
                required
                value={customMerchantApiKey}
                onChange={(e) => setCustomMerchantApiKey(e.target.value)}
                placeholder="sk_live_... or sk_test_..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Environment Mode *
                </label>
                <select
                  value={customMerchantMode}
                  onChange={(e) => setCustomMerchantMode(e.target.value as 'live' | 'test')}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="live">Live Production (EC$)</option>
                  <option value="test">Test Sandbox (Test Cards)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Settlement Bank Account
                </label>
                <input
                  type="text"
                  value={customMerchantBank}
                  onChange={(e) => setCustomMerchantBank(e.target.value)}
                  placeholder="National Bank of Dominica (NBD)"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate Stripe Merchant &amp; Authorize Payments</span>
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-neutral-950 px-3 text-neutral-500">OR 1-CLICK DEMO AUTHENTICATION</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleUpdateMerchant(DEFAULT_STRIPE_MERCHANT)}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>Instant Login as Elite Ride Dominica Ltd (DOM-ER-2026)</span>
          </button>

          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1 text-center">
            <p>
              Merchant ID: <span className="font-mono text-emerald-400">acct_1DOM2026ELITE</span> · Reg: <span className="font-mono text-white">#DOM-ER-2026</span>
            </p>
            <p className="text-neutral-500">
              Settlement: National Bank of Dominica (NBD) Checking Account #***5502
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Admin Portal Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3.5">
          <EliteRideLogo variant="mark" size="sm" theme="dark" />
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold block">
              Central Dispatch &amp; Operations Control · #DOM-ER-2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Elite Ride Admin &amp; Merchant Portal
            </h2>
          </div>
        </div>

        {/* Top-Level Navigation Tabs */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-semibold shadow-inner">
          <button
            onClick={() => setAdminTab('revenue')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              adminTab === 'revenue'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue Dashboard (80/20)</span>
          </button>
          <button
            onClick={() => setAdminTab('stripe_merchant')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              adminTab === 'stripe_merchant'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Stripe Merchant (Payment Auth)</span>
            {activeMerchant ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 ml-0.5" />
            )}
          </button>
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
        </div>

        {/* Merchant Live Authentication Pill */}
        {activeMerchant ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAdminTab('stripe_merchant')}
              className="px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Stripe Gateway Active:</span>
              <span className="font-mono text-white">{activeMerchant.merchantId}</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-400 uppercase font-bold">
                {activeMerchant.mode}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAdminTab('stripe_merchant')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/50 hover:border-amber-400 text-amber-200 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm animate-pulse"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Stripe Unauthenticated — Log In to Authorize Payments</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Operations Notice Banner */}
      {adminNotice && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-300 flex items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{adminNotice}</span>
          </div>
          <button
            onClick={() => setAdminNotice(null)}
            className="text-neutral-400 hover:text-white text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: ENHANCED REVENUE DASHBOARD (80% DRIVER / 20% PLATFORM + STRIPE)
          ========================================================================= */}
      {adminTab === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Subtabs & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRevenueSubTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  revenueSubTab === 'overview'
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'text-neutral-400 hover:text-white bg-neutral-950'
                }`}
              >
                Revenue Overview &amp; Analytics
              </button>
              <button
                onClick={() => setRevenueSubTab('ledger')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  revenueSubTab === 'ledger'
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'text-neutral-400 hover:text-white bg-neutral-950'
                }`}
              >
                Granular Driver Payout Ledger
              </button>
              <button
                onClick={() => setRevenueSubTab('stripe_webhooks')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  revenueSubTab === 'stripe_webhooks'
                    ? 'bg-indigo-600 text-white'
                    : 'text-neutral-400 hover:text-white bg-neutral-950'
                }`}
              >
                <Webhook className="w-3.5 h-3.5" />
                <span>Stripe Testing Module</span>
              </button>
              <button
                onClick={() => setRevenueSubTab('stripe_merchant')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  revenueSubTab === 'stripe_merchant'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white bg-neutral-950'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Stripe Merchant Login</span>
                {activeMerchant && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              {activeMerchant ? (
                <button
                  type="button"
                  onClick={() => setRevenueSubTab('stripe_merchant')}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 border border-emerald-500/30 text-[11px] text-emerald-300 hover:border-emerald-500/60 cursor-pointer transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold">Merchant Active:</span>
                  <span className="font-mono text-white">{activeMerchant.merchantId}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setRevenueSubTab('stripe_merchant')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-900 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Login Merchant</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export Month CSV</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                <span>Total Gross Volume</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {formatFare(metrics.grossTotal, currency)}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">Across {metrics.totalRides} recorded rides</div>
            </div>

            <div className="bg-neutral-900 border border-emerald-500/30 rounded-3xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                <span className="text-emerald-400 font-bold">80% Driver Payouts</span>
                <Car className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                {formatFare(metrics.driver80Total, currency)}
              </div>
              <div className="text-[11px] text-emerald-500/80 mt-1">Retained by local Dominica chauffeurs</div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                <span>20% Platform Commission</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-extrabold text-indigo-300 font-mono">
                {formatFare(metrics.platform20Total, currency)}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">Retained for server &amp; radar dispatch ops</div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                <span>Dominica 15% VAT Act</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-amber-400 font-mono">
                {formatFare(metrics.vatTotal, currency)}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">Compliant tax remitted to Inland Revenue</div>
            </div>
          </div>

          {/* OVERVIEW SUBTAB: RECHARTS BAR CHART */}
          {revenueSubTab === 'overview' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Daily Earnings Split for Current Month (80% Driver vs 20% Platform)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Real-time visualization of daily gross revenue allocated between chauffeur earnings and operations fee.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> 80% Driver Payout
                  </span>
                  <span className="flex items-center gap-1 text-indigo-400 ml-2">
                    <span className="w-3 h-3 rounded bg-indigo-500 inline-block" /> 20% Platform Commission
                  </span>
                </div>
              </div>

              {/* Recharts Canvas */}
              <div className="w-full h-72 pt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rechartsDailyData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#737373"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#404040' }}
                    />
                    <YAxis
                      stroke="#737373"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#404040' }}
                      tickFormatter={(val) => (currency === 'USD' ? `$${(val / 2.7).toFixed(0)}` : `EC$${val}`)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                              <span className="font-bold text-white block">{label}</span>
                              <div className="text-emerald-400 font-mono">
                                80% Driver: {formatFare(data.driverEarnings, currency)}
                              </div>
                              <div className="text-indigo-400 font-mono">
                                20% Platform: {formatFare(data.platformCommission, currency)}
                              </div>
                              <div className="text-neutral-400 font-mono border-t border-neutral-800 pt-1 mt-1">
                                Gross Total: {formatFare(data.total, currency)}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="driverEarnings" name="80% Driver Share" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="platformCommission" name="20% Platform Commission" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* LEDGER & SEARCH SUBTAB */}
          {(revenueSubTab === 'overview' || revenueSubTab === 'ledger') && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Driver Payout Ledger &amp; Ride History
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Search and inspect transparent 80/20 splits, customer receipts, and Stripe verification tokens.
                  </p>
                </div>

                {/* Search Bar & Status Filter */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search driver, rider, or ID..."
                      className="bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="in_transit">In Transit</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="border-b border-neutral-800 text-[11px] text-neutral-400 uppercase">
                    <tr>
                      <th className="py-3 px-3">Ride ID &amp; Time</th>
                      <th className="py-3 px-3">Chauffeur</th>
                      <th className="py-3 px-3">Rider &amp; Route</th>
                      <th className="py-3 px-3">Gross Fare</th>
                      <th className="py-3 px-3 text-emerald-400">80% Driver Payout</th>
                      <th className="py-3 px-3 text-indigo-400">20% Platform</th>
                      <th className="py-3 px-3">Stripe Intent</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-neutral-500 font-sans">
                          No rides found matching your search query.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-neutral-950/40 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-white block">{r.id}</span>
                            <span className="text-[10px] text-neutral-500">{r.date}</span>
                          </td>
                          <td className="py-3 px-3 font-sans">
                            <span className="font-semibold text-white block">{r.driverName}</span>
                            <span className="text-[10px] font-mono text-neutral-400">({r.driverPlate})</span>
                          </td>
                          <td className="py-3 px-3 font-sans">
                            <span className="font-medium text-neutral-200 block">{r.riderName}</span>
                            <span className="text-[10px] text-neutral-400 truncate max-w-[180px] block">
                              {r.origin} ➔ {r.destination}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-white">
                            {formatFare(r.grossFareXCD, currency)}
                          </td>
                          <td className="py-3 px-3 text-emerald-400 font-bold">
                            {formatFare(r.driver80XCD, currency)}
                          </td>
                          <td className="py-3 px-3 text-indigo-300">
                            {formatFare(r.platform20XCD, currency)}
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] text-neutral-400 font-mono block truncate max-w-[110px]" title={r.stripePaymentIntent}>
                              {r.stripePaymentIntent}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                                r.status === 'completed'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : r.status === 'in_transit'
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : 'bg-red-950 text-red-400 border border-red-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STRIPE WEBHOOK TESTING MODULE */}
          {revenueSubTab === 'stripe_webhooks' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-mono font-bold mb-1">
                    <Webhook className="w-3.5 h-3.5" />
                    <span>Mock Stripe Webhook Simulator</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Stripe Merchant Payment Verification &amp; Webhook Module
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
                    Verify payment status transitions, automatic receipt issuance, and revenue ledger updates without requiring live banking credentials.
                  </p>
                </div>

                {/* Dispatch Trigger Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleTriggerWebhook('payment_intent.succeeded')}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>payment_intent.succeeded</span>
                  </button>
                  <button
                    onClick={() => handleTriggerWebhook('payment_intent.payment_failed')}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>payment_intent.payment_failed</span>
                  </button>
                  <button
                    onClick={() => handleTriggerWebhook('charge.refunded')}
                    className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>charge.refunded</span>
                  </button>
                </div>
              </div>

              {/* Event Logs & JSON Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Webhook Dispatches ({webhookEventLog.length})
                  </span>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {webhookEventLog.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedWebhookEvent(ev.payload)}
                        className="p-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-mono font-bold text-indigo-400 block">{ev.type}</span>
                          <span className="text-[10px] text-neutral-500">{ev.id} · {ev.time}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                          {ev.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Payload Inspector
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">JSON Format</span>
                  </div>
                  <pre className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-64">
                    {selectedWebhookEvent
                      ? JSON.stringify(selectedWebhookEvent, null, 2)
                      : JSON.stringify(webhookEventLog[0]?.payload || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* STRIPE MERCHANT INTEGRATION & LOGIN SUBTAB */}
          {revenueSubTab === 'stripe_merchant' && renderStripeMerchantContent()}
        </div>
      )}

      {/* =========================================================================
          TAB 1B: DEDICATED STRIPE MERCHANT CONSOLE & AUTHENTICATION TAB
          ========================================================================= */}
      {adminTab === 'stripe_merchant' && (
        <div className="space-y-6 animate-fade-in">
          {renderStripeMerchantContent()}
        </div>
      )}

      {/* =========================================================================
          TAB 2: ACTIVE DRIVER CONSOLE
          ========================================================================= */}
      {adminTab === 'driver_console' && (
        <div className="space-y-6">
          {/* Driver Selector Pills */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-3">
              Select Fleet Chauffeur Unit
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {driversList.map((driver) => {
                const online = !!driverOnlineStatus[driver.id];
                const isSelected = driver.id === selectedDriverId;
                return (
                  <button
                    key={driver.id}
                    onClick={() => setSelectedDriverId(driver.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-xs">{driver.name}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          online ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'
                        }`}
                      />
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">{driver.plate}</div>
                    <div className="text-[10px] text-neutral-500 truncate">{driver.tier}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Driver Profile & Shift Status Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center font-bold text-xl text-emerald-400 border border-neutral-700">
                {activeDriver.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white">{activeDriver.name}</h3>
                  <span className="text-xs text-amber-400 font-bold">★ {activeDriver.rating}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {activeDriver.vehicle} · Plate: <span className="font-mono text-white">{activeDriver.plate}</span>
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                      isDriverOnline
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isDriverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
                    <span>{isDriverOnline ? 'Online & Available' : 'Off-Duty (Standby)'}</span>
                  </span>
                  <span className="text-neutral-500 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{activeDriver.location}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleCurrentDriverShift}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  isDriverOnline
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                }`}
              >
                {isDriverOnline ? 'Go Offline (End Shift)' : 'Go Online (Start Shift)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LIVE DISPATCH RADAR
          ========================================================================= */}
      {adminTab === 'live_dispatch' && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Dominica Live Queue &amp; Dispatches</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="border-b border-neutral-800 text-[11px] text-neutral-400 uppercase">
                  <tr>
                    <th className="py-3 px-4">Trip ID</th>
                    <th className="py-3 px-4">Origin ➔ Destination</th>
                    <th className="py-3 px-4">Assigned Driver</th>
                    <th className="py-3 px-4">Fare</th>
                    <th className="py-3 px-4">80% Chauffeur</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {rideHistoryRecords.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{r.id}</td>
                      <td className="py-3 px-4 font-sans">{r.origin} ➔ {r.destination}</td>
                      <td className="py-3 px-4 font-sans">{r.driverName} ({r.driverPlate})</td>
                      <td className="py-3 px-4">{formatFare(r.grossFareXCD, currency)}</td>
                      <td className="py-3 px-4 text-emerald-300 font-bold">{formatFare(r.driver80XCD, currency)}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className="text-emerald-400 font-bold">● {r.status.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: DRIVER APPLICATIONS
          ========================================================================= */}
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
                      Approve &amp; Grant Dispatch
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
    </div>
  );
};
