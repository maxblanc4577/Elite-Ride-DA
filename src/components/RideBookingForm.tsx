import React, { useState, useEffect } from 'react';
import {
  Car,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Users,
  Briefcase,
  AlertTriangle,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  Plane,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserPlus,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Link as LinkIcon,
  CheckCircle2,
} from 'lucide-react';
import {
  DOMINICA_LOCATIONS,
  VEHICLE_TIERS,
  PAYMENT_METHODS,
  VehicleTier,
  getRouteMiles,
} from '../data/dominicaData';
import { Currency, RideBookingData, ActiveRide, ActiveDriver, RiderProfile } from '../types/booking';
import { calculateRideFare, formatFare } from '../utils/pricing';
import { RideEstimationWidget } from './RideEstimationWidget';
import { EliteRideLogo } from './EliteRideLogo';

interface RideBookingFormProps {
  currency: Currency;
  onRideDispatched: (ride: ActiveRide) => void;
  currentRider?: RiderProfile | null;
  onOpenRiderAuth?: () => void;
  selectedTierId?: string;
  onTierChange?: (tierId: string) => void;
}

export const RideBookingForm: React.FC<RideBookingFormProps> = ({
  currency,
  onRideDispatched,
  currentRider,
  onOpenRiderAuth,
  selectedTierId = 'standard-sedan',
  onTierChange,
}) => {
  const [booking, setBooking] = useState<RideBookingData>({
    pickupId: 'ROSEAU',
    dropoffId: 'DOM',
    customPickup: '',
    customDropoff: '',
    hasStopover: false,
    stopoverId: 'PONT_CASSE',
    additionalStops: [],
    vehicleTierId: selectedTierId || 'standard-sedan',
    isScheduled: false,
    scheduleDate: new Date().toISOString().split('T')[0],
    scheduleTime: '15:00',
    passengers: 2,
    heavyLuggageDeclared: true,
    paymentMethod: 'nbd_mobanking',
    nbdAccountNumber: '',
    passengerName: '',
    passengerPhone: '',
    passengerEmail: '',
    flightNumber: '',
    notes: '',
    isSplitFare: true,
    splitPassengersCount: 4,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVehicleSectionOpen, setIsVehicleSectionOpen] = useState(false);
  const [isPaymentSectionOpen, setIsPaymentSectionOpen] = useState(false);

  // Split fare UI state for 'Elite Shared Coaster'
  const [splitPassengersCount, setSplitPassengersCount] = useState<number>(4);
  const [isSplitFareEnabled, setIsSplitFareEnabled] = useState<boolean>(true);
  const [copiedSplitLink, setCopiedSplitLink] = useState<boolean>(false);
  const [shareSuccessNotice, setShareSuccessNotice] = useState<string | null>(null);

  // State for Location, Fare Calculation & Final Price Reset (EC$ 0.00)
  const [isFareReset, setIsFareReset] = useState<boolean>(false);

  const handleResetRideAndFare = () => {
    setBooking((prev) => ({
      ...prev,
      pickupId: 'ROSEAU',
      dropoffId: 'DOM',
      additionalStops: [],
      hasStopover: false,
    }));
    setIsFareReset(true);
  };

  // Listen to global reset events and register window.resetRideLocationAndFare
  useEffect(() => {
    const handleResetEvent = () => {
      handleResetRideAndFare();
    };
    window.addEventListener('eliteride_reset_location_and_fare', handleResetEvent);
    (window as any).resetRideLocationAndFare = () => {
      handleResetRideAndFare();
      window.dispatchEvent(new CustomEvent('eliteride_reset_location_and_fare'));
    };
    return () => {
      window.removeEventListener('eliteride_reset_location_and_fare', handleResetEvent);
    };
  }, []);

  const fareCalc = calculateRideFare(booking);

  // Sync current rider account profile when signed in
  useEffect(() => {
    if (currentRider) {
      setBooking((prev) => ({
        ...prev,
        passengerName: currentRider.fullName || prev.passengerName,
        passengerPhone: currentRider.phone || prev.passengerPhone,
        passengerEmail: currentRider.email || prev.passengerEmail,
        pickupId: prev.customPickup ? prev.pickupId : (currentRider.homeLocationId || prev.pickupId),
        paymentMethod: currentRider.preferredPayment || prev.paymentMethod,
        nbdAccountNumber: currentRider.nbdAccountNumber || prev.nbdAccountNumber,
      }));
    }
  }, [currentRider]);

  // Sync selectedTierId when passed from parent or quick selector
  useEffect(() => {
    if (selectedTierId && selectedTierId !== booking.vehicleTierId) {
      setBooking((prev) => ({ ...prev, vehicleTierId: selectedTierId }));
    }
  }, [selectedTierId]);

  const handleFieldChange = (field: keyof RideBookingData, value: any) => {
    setIsFareReset(false);
    setBooking((prev) => ({ ...prev, [field]: value }));
    if (field === 'vehicleTierId' && onTierChange) {
      onTierChange(value);
    }
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const u = { ...prev };
        delete u[field];
        return u;
      });
    }
  };

  // Additional stops handlers (up to two stops beyond destination)
  const handleAddAdditionalStop = () => {
    const currentStops = booking.additionalStops || [];
    if (currentStops.length >= 2) return;

    const used = [booking.pickupId, booking.dropoffId, ...currentStops];
    const candidate = DOMINICA_LOCATIONS.find((l) => !used.includes(l.id)) || DOMINICA_LOCATIONS[0];
    const updated = [...currentStops, candidate.id];
    handleFieldChange('additionalStops', updated);
  };

  const handleUpdateAdditionalStop = (index: number, newStopId: string) => {
    const updated = [...(booking.additionalStops || [])];
    updated[index] = newStopId;
    handleFieldChange('additionalStops', updated);
  };

  const handleRemoveAdditionalStop = (index: number) => {
    const updated = [...(booking.additionalStops || [])];
    updated.splice(index, 1);
    handleFieldChange('additionalStops', updated);
  };

  // Split fare calculations for Elite Shared Coaster
  const isSharedCoaster = booking.vehicleTierId === 'shared-coaster';
  const effectiveSplitRiders = Math.max(2, Math.min(12, splitPassengersCount));

  const displayTotalXCD = isFareReset ? 0 : fareCalc.totalXCD;
  const displayTotalUSD = isFareReset ? 0 : fareCalc.totalUSD;
  const displayBaseFeeXCD = isFareReset ? 0 : fareCalc.baseFeeXCD;
  const displayDistanceFeeXCD = isFareReset ? 0 : fareCalc.distanceFeeXCD;
  const displaySubtotalXCD = isFareReset ? 0 : fareCalc.subtotalXCD;
  const displayVatXCD = isFareReset ? 0 : fareCalc.vatXCD;

  const splitShareXCD = parseFloat((displayTotalXCD / effectiveSplitRiders).toFixed(2));
  const splitShareUSD = parseFloat((displayTotalUSD / effectiveSplitRiders).toFixed(2));

  const pickupLocationObj = DOMINICA_LOCATIONS.find((l) => l.id === booking.pickupId);
  const dropoffLocationObj = DOMINICA_LOCATIONS.find((l) => l.id === booking.dropoffId);

  const splitPaymentLink = typeof window !== 'undefined'
    ? `${window.location.origin}/pay/split?code=CSTR-${booking.pickupId}-${booking.dropoffId}&riders=${effectiveSplitRiders}&fare=${splitShareXCD}&cur=${currency}`
    : `https://eliteride.dm/pay/split?code=CSTR-${booking.pickupId}-${booking.dropoffId}&riders=${effectiveSplitRiders}&fare=${splitShareXCD}&cur=${currency}`;

  const handleCopySplitLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(splitPaymentLink).then(() => {
        setCopiedSplitLink(true);
        setTimeout(() => setCopiedSplitLink(false), 3000);
      });
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚌 Elite Shared Coaster Dominica Ride Split\nPickup: ${pickupLocationObj?.name || 'Pickup'}\nDestination: ${dropoffLocationObj?.name || 'Destination'}\nTotal: EC$ ${fareCalc.totalXCD.toFixed(2)} (${effectiveSplitRiders} passengers)\nYour Split Share: EC$ ${splitShareXCD.toFixed(2)} ($${splitShareUSD.toFixed(2)} USD)\n\nPay your individual share securely here:\n${splitPaymentLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Elite Ride Dominica — Coaster Split Fare',
          text: `Split fare for our Elite Shared Coaster trip: EC$ ${splitShareXCD.toFixed(2)} per person`,
          url: splitPaymentLink,
        });
        setShareSuccessNotice('Split fare link shared successfully!');
        setTimeout(() => setShareSuccessNotice(null), 3000);
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      handleCopySplitLink();
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!booking.passengerName.trim()) {
      errors.passengerName = 'Please enter rider full name';
    }
    if (!booking.passengerPhone.trim()) {
      errors.passengerPhone = 'Please enter WhatsApp or mobile contact for driver dispatch';
    }
    if (booking.pickupId === booking.dropoffId && !booking.customPickup) {
      errors.dropoffId = 'Pickup and destination must be different locations';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const pickupLoc = DOMINICA_LOCATIONS.find((l) => l.id === booking.pickupId);
    const dropoffLoc = DOMINICA_LOCATIONS.find((l) => l.id === booking.dropoffId);
    const stopoverLoc = booking.hasStopover ? DOMINICA_LOCATIONS.find((l) => l.id === booking.stopoverId) : undefined;

    const driversByTier: Record<string, ActiveDriver> = {
      'mountain-4wd-suv': {
        id: 'drv-491',
        name: 'Jean-Pierre Bruno',
        rating: 4.96,
        tripsCompleted: 742,
        vehicleModel: 'Toyota Land Cruiser Prado 4WD (Metallic Charcoal)',
        licensePlate: 'DA-4912',
        phone: '+1 (767) 225-8841',
        currentLat: 15.301,
        currentLng: -61.388,
      },
      'standard-sedan': {
        id: 'drv-203',
        name: 'Althea Fontaine',
        rating: 4.92,
        tripsCompleted: 518,
        vehicleModel: 'Toyota Corolla Sedan (Silver)',
        licensePlate: 'DA-1893',
        phone: '+1 (767) 235-9014',
        currentLat: 15.298,
        currentLng: -61.385,
      },
      'shared-coaster': {
        id: 'drv-881',
        name: 'Marcus Williams',
        rating: 4.88,
        tripsCompleted: 1240,
        vehicleModel: 'Toyota Coaster 12-Pax Passenger Van',
        licensePlate: 'HA-7721',
        phone: '+1 (767) 276-3392',
        currentLat: 15.31,
        currentLng: -61.39,
      },
      'airport-vip-transfer': {
        id: 'drv-505',
        name: 'Gabriel Joseph',
        rating: 4.98,
        tripsCompleted: 980,
        vehicleModel: 'Mercedes-Benz VIP Executive Lounge (Jet Black)',
        licensePlate: 'DA-0044',
        phone: '+1 (767) 245-1100',
        currentLat: 15.54,
        currentLng: -61.30,
      },
    };

    const selectedDriver = driversByTier[booking.vehicleTierId] || driversByTier['mountain-4wd-suv'];

    setTimeout(() => {
      const activeRide: ActiveRide = {
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        booking: {
          ...booking,
          isSplitFare: isSharedCoaster && isSplitFareEnabled,
          splitPassengersCount: effectiveSplitRiders,
          splitPaymentLink,
        },
        tier: fareCalc.tier,
        fare: {
          ...fareCalc,
          splitFareXCD: isSharedCoaster ? splitShareXCD : undefined,
          splitFareUSD: isSharedCoaster ? splitShareUSD : undefined,
        },
        driver: selectedDriver,
        status: 'dispatched',
        dispatchedAt: Date.now(),
        etaMinutes: Math.max(3, Math.round(fareCalc.distanceMiles * 0.4)),
        pickupLabel: pickupLoc ? pickupLoc.name : booking.customPickup || 'Dominica Pickup',
        dropoffLabel: dropoffLoc ? dropoffLoc.name : booking.customDropoff || 'Dominica Destination',
        stopoverLabel: stopoverLoc ? stopoverLoc.name : undefined,
        cancelGracePeriodSeconds: 120,
      };

      setIsSubmitting(false);
      onRideDispatched(activeRide);
    }, 800);
  };

  const isAirportRide =
    booking.pickupId === 'DOM' ||
    booking.dropoffId === 'DOM' ||
    booking.pickupId === 'DCF' ||
    booking.dropoffId === 'DCF';

  const selectedPaymentMethod = PAYMENT_METHODS.find((m) => m.id === booking.paymentMethod);

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ride Routing & Tier Selection (8 Cols) - CSS Selector 1 */}
        <div className="lg:col-span-8 bg-gradient-to-b from-neutral-900/95 via-neutral-900 to-neutral-950 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-7 ring-1 ring-emerald-500/20 backdrop-blur-sm relative">
          {/* Header & Timing Switch */}
          <div className="flex flex-wrap items-center justify-between pb-5 border-b border-neutral-800 gap-4">
            <div className="flex items-center gap-3">
              <EliteRideLogo variant="mark" size="sm" theme="dark" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">
                    Dominica Dispatch #DOM-ER-2026
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Phase 2
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Configure &amp; Book Your Ride
                </h2>
              </div>
            </div>

            {/* Ride Now / Schedule Toggle */}
            <div className="flex items-center p-1 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleFieldChange('isScheduled', false)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  !booking.isScheduled
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Ride Now (Instant)
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('isScheduled', true)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  booking.isScheduled
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Schedule Ride
              </button>
            </div>
          </div>

          {/* Schedule Date/Time if enabled */}
          {booking.isScheduled && (
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={booking.scheduleDate}
                  onChange={(e) => handleFieldChange('scheduleDate', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Pickup Time
                </label>
                <input
                  type="time"
                  value={booking.scheduleTime}
                  onChange={(e) => handleFieldChange('scheduleTime', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Route Selector (Pickup, Destination, and Additional Stops Beyond Destination) */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pickup Location</span>
                  </span>
                </label>
                <select
                  value={booking.pickupId}
                  onChange={(e) => handleFieldChange('pickupId', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {DOMINICA_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination (Primary Drop-off) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Primary Destination</span>
                  </span>
                </label>
                <select
                  id="dropoff-location-select"
                  data-testid="dropoff-location-select"
                  value={booking.dropoffId}
                  onChange={(e) => handleFieldChange('dropoffId', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {DOMINICA_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <select
                  id="est-destination"
                  aria-hidden="true"
                  className="sr-only"
                  value={booking.dropoffId}
                  onChange={(e) => handleFieldChange('dropoffId', e.target.value)}
                  tabIndex={-1}
                >
                  {DOMINICA_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                {formErrors.dropoffId && (
                  <p className="mt-1 text-[11px] text-red-400">{formErrors.dropoffId}</p>
                )}
              </div>
            </div>

            {/* Additional Stop Locations Beyond Destination (Up to 2 stops) */}
            <div className="space-y-2.5 pt-1">
              {booking.additionalStops && booking.additionalStops.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Additional Stops Beyond Destination ({booking.additionalStops.length}/2)</span>
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Total Route: {fareCalc.distanceMiles} miles
                    </span>
                  </div>

                  {booking.additionalStops.map((stopId, idx) => {
                    const prevLocId = idx === 0 ? booking.dropoffId : booking.additionalStops![idx - 1];
                    const legMiles = getRouteMiles(prevLocId, stopId);

                    return (
                      <div
                        key={idx}
                        className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 text-[10px] flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <span>Additional Stop {idx + 1} (Beyond {idx === 0 ? 'Destination' : 'Stop 1'})</span>
                            </label>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">
                              +{legMiles} mi leg distance
                            </span>
                          </div>
                          <select
                            value={stopId}
                            onChange={(e) => handleUpdateAdditionalStop(idx, e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          >
                            {DOMINICA_LOCATIONS.map((loc) => (
                              <option key={loc.id} value={loc.id}>
                                {loc.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalStop(idx)}
                          className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer mt-4"
                          title={`Remove Additional Stop ${idx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Stop Button if fewer than 2 additional stops */}
              {(!booking.additionalStops || booking.additionalStops.length < 2) && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddAdditionalStop}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-3 py-2 bg-neutral-950 border border-neutral-800 hover:border-emerald-600/50 rounded-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      Add Stop Beyond Destination ({2 - (booking.additionalStops?.length || 0)} available)
                    </span>
                  </button>

                  {/* Mid-route Stopover toggle button if not active */}
                  {!booking.hasStopover && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('hasStopover', true)}
                      className="text-xs font-medium text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5 px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-neutral-500" />
                      <span>Add Mid-Route En-Route Stopover</span>
                    </button>
                  )}
                </div>
              )}

              {/* Mid-route Stopover Box if active */}
              {booking.hasStopover && (
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between gap-3 mt-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-amber-300 mb-1">
                      Mid-Route Stopover (Grocery, Bank, Overlook):
                    </label>
                    <select
                      value={booking.stopoverId}
                      onChange={(e) => handleFieldChange('stopoverId', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    >
                      {DOMINICA_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('hasStopover', false)}
                    className="p-2 text-neutral-500 hover:text-red-400 rounded-lg mt-4 cursor-pointer"
                    title="Remove Mid-route Stopover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Ride Estimation Widget with Interactive Map, Search, Street View & Telemetry */}
          <RideEstimationWidget
            pickupId={booking.pickupId}
            dropoffId={booking.dropoffId}
            onPickupChange={(newPickup) => handleFieldChange('pickupId', newPickup)}
            onDropoffChange={(newDropoff) => handleFieldChange('dropoffId', newDropoff)}
            currency={currency}
            fareTotalXCD={displayTotalXCD}
            distanceMiles={fareCalc.distanceMiles}
            isFareReset={isFareReset}
            onResetRideAndFare={handleResetRideAndFare}
          />

          {/* Vehicle Tier Selection Cards (Collapsible) - CSS Selector: div:nth-of-type(4) */}
          <div
            className={`border rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
              booking.vehicleTierId === 'standard-sedan'
                ? 'border-emerald-500/80 bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950/25 ring-1 ring-emerald-500/40 shadow-xl shadow-emerald-950/30'
                : 'border-neutral-800 bg-neutral-950/60'
            }`}
          >
            <button
              type="button"
              onClick={() => setIsVehicleSectionOpen(!isVehicleSectionOpen)}
              className="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-11 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800 shadow-inner">
                  {(() => {
                    const activeTier = VEHICLE_TIERS.find((t) => t.id === booking.vehicleTierId) || VEHICLE_TIERS[0];
                    return (
                      <img
                        src={activeTier.image}
                        alt={activeTier.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    );
                  })()}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Selected Vehicle Category
                    </span>
                    {(() => {
                      const activeTier = VEHICLE_TIERS.find((t) => t.id === booking.vehicleTierId) || VEHICLE_TIERS[0];
                      return (
                        <>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                            {activeTier.badge}
                          </span>
                          {activeTier.id === 'standard-sedan' && (
                            <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                              <span>Elite Standard Sedan</span>
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  {(() => {
                    const activeTier = VEHICLE_TIERS.find((t) => t.id === booking.vehicleTierId) || VEHICLE_TIERS[0];
                    return (
                      <div className="text-xs text-neutral-300 font-semibold truncate mt-0.5 flex items-center gap-2">
                        <span className="text-white font-bold">{activeTier.name}</span>
                        <span className="text-neutral-500 font-normal">
                          ({activeTier.capacityPassengers} seats · {activeTier.capacityLuggage} bags)
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-xs text-neutral-400 group-hover:text-emerald-400 font-medium hidden sm:inline">
                  {isVehicleSectionOpen ? 'Close Grid' : 'Browse All 4 Tiers'}
                </span>
                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 group-hover:text-emerald-400 transition-colors">
                  {isVehicleSectionOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </button>

            {/* Quick One-Tap Tier Switcher Bar */}
            <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tier Quick-Select:</span>
              </span>
              {VEHICLE_TIERS.map((tier) => {
                const isSelected = booking.vehicleTierId === tier.id;
                return (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => handleFieldChange('vehicleTierId', tier.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md ring-2 ring-emerald-400/50 scale-[1.02]'
                        : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    <span>{tier.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-neutral-950 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Expanded Content */}
            {isVehicleSectionOpen && (
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-3 text-[11px] text-neutral-400">
                  <span>Choose from official Dominica fleet categories:</span>
                  <span className="font-mono text-emerald-400">Rates in {currency}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {VEHICLE_TIERS.map((tier) => {
                    const isSelected = booking.vehicleTierId === tier.id;
                    const tierMiles = fareCalc.distanceMiles;
                    const tierSubtotal = tier.baseFeeXCD + tierMiles * tier.ratePerMileXCD;
                    const tierTotal = tierSubtotal * 1.15;

                    return (
                      <div
                        key={tier.id}
                        onClick={() => {
                          handleFieldChange('vehicleTierId', tier.id);
                          setIsVehicleSectionOpen(false);
                        }}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-neutral-850 border-emerald-500 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-950/40'
                            : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          {/* Image Preview & Badge */}
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-neutral-900">
                            <img
                              src={tier.image}
                              alt={tier.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 bg-neutral-950/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-neutral-800 flex items-center gap-1">
                              {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                              <span>{tier.badge}</span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-emerald-500 text-neutral-950 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-md flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Active</span>
                              </div>
                            )}
                            {tier.id === 'shared-coaster' && (
                              <div className="absolute bottom-2 right-2 bg-emerald-500 text-neutral-950 px-2 py-0.5 rounded text-[10px] font-extrabold shadow-md">
                                Split Fare Supported
                              </div>
                            )}
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                <span>{tier.name}</span>
                                {tier.id === 'standard-sedan' && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-emerald-300 font-mono rounded">
                                    Sedan
                                  </span>
                                )}
                              </h4>
                              <p className="text-[11px] text-neutral-400 line-clamp-1">{tier.description}</p>
                            </div>
                          </div>

                          {/* Capacity and specs */}
                          <div className="flex items-center gap-4 mt-2.5 text-xs text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{tier.capacityPassengers} seats</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{tier.capacityLuggage} bags</span>
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                          <span className="text-[11px] text-neutral-400">
                            PER mi × 10 EC$ + EC$ 1.00 Base
                          </span>
                          <span className="text-xs font-bold font-mono text-emerald-400">
                            ~{formatFare(tierTotal, currency)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SPLIT FARE FEATURE FOR 'ELITE SHARED COASTER' */}
          {isSharedCoaster && (
            <div
              id="coaster-split-fare-panel"
              data-testid="coaster-split-fare-panel"
              className="bg-gradient-to-br from-neutral-950 to-neutral-900 border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                        Elite Shared Coaster
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                        Split Fare Active
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      Divide Total Trip Cost Between Passengers
                    </h3>
                  </div>
                </div>

                {/* Enable / Disable Split Toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <span className="text-xs text-neutral-300 font-medium">Split Coaster Fare</span>
                  <input
                    type="checkbox"
                    checked={isSplitFareEnabled}
                    onChange={(e) => setIsSplitFareEnabled(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              {isSplitFareEnabled && (
                <div className="space-y-6">
                  {/* Passenger Count Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-200">
                        Select Number of Passengers Sharing Trip Cost:
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {effectiveSplitRiders} Paying Passengers (Max 12 Coaster Seats)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {[2, 3, 4, 6, 8, 10, 12].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setSplitPassengersCount(num);
                            handleFieldChange('splitPassengersCount', num);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            effectiveSplitRiders === num
                              ? 'bg-emerald-400 text-neutral-950 shadow-md scale-105'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                          }`}
                        >
                          {num} Passengers
                        </button>
                      ))}

                      {/* Custom Stepper */}
                      <div className="flex items-center gap-1.5 ml-auto bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1">
                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.max(2, effectiveSplitRiders - 1);
                            setSplitPassengersCount(val);
                            handleFieldChange('splitPassengersCount', val);
                          }}
                          className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-xs text-emerald-400">
                          {effectiveSplitRiders}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.min(12, effectiveSplitRiders + 1);
                            setSplitPassengersCount(val);
                            handleFieldChange('splitPassengersCount', val);
                          }}
                          className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Itemized Split Share Readout */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-neutral-950 rounded-2xl border border-neutral-800">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                        Total Coaster Trip Cost
                      </span>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                        {formatFare(fareCalc.totalXCD, currency)}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">
                        Includes 15% Dominica VAT
                      </span>
                    </div>

                    <div className="sm:border-l sm:border-neutral-800 sm:pl-4">
                      <span className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                        Divided Between
                      </span>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                        {effectiveSplitRiders} <span className="text-xs font-normal text-neutral-400">passengers</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 mt-0.5 block">
                        Equal Co-Payment Split
                      </span>
                    </div>

                    <div className="sm:border-l sm:border-neutral-800 sm:pl-4">
                      <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                        Each Passenger Pays
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                        {formatFare(splitShareXCD, currency)}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                        {currency === 'XCD' ? `~$${splitShareUSD.toFixed(2)} USD each` : `~EC$ ${splitShareXCD.toFixed(2)} each`}
                      </span>
                    </div>
                  </div>

                  {/* Generated Shareable Payment Link Section */}
                  <div className="space-y-3 p-5 bg-neutral-950/80 rounded-2xl border border-neutral-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4 text-emerald-400" />
                        <span>Passenger Split Payment Link:</span>
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Share with co-riders to collect payments
                      </span>
                    </div>

                    {/* Link URL Display */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-2">
                      <input
                        type="text"
                        readOnly
                        value={splitPaymentLink}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-mono select-all focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={handleCopySplitLink}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          copiedSplitLink
                            ? 'bg-emerald-500 text-neutral-950'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        }`}
                      >
                        {copiedSplitLink ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleShareWhatsApp}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        title="Share via WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNativeShare}
                        className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        title="Share with device"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {shareSuccessNotice && (
                      <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{shareSuccessNotice}</span>
                      </div>
                    )}

                    {/* Split Passengers Roster / Seats preview */}
                    <div className="pt-2 border-t border-neutral-900">
                      <span className="text-[11px] font-semibold text-neutral-400 block mb-2">
                        Split Fare Seat Breakdown ({effectiveSplitRiders} Passengers):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="p-2 bg-neutral-900/90 rounded-lg border border-emerald-600/40">
                          <span className="font-bold text-emerald-400 block truncate">Rider 1 (Organizer)</span>
                          <span className="font-mono text-white">{formatFare(splitShareXCD, currency)}</span>
                        </div>
                        {Array.from({ length: effectiveSplitRiders - 1 }).map((_, idx) => (
                          <div key={idx} className="p-2 bg-neutral-900/60 rounded-lg border border-neutral-800">
                            <span className="font-medium text-neutral-300 block truncate">Rider {idx + 2}</span>
                            <span className="font-mono text-neutral-400">{formatFare(splitShareXCD, currency)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-neutral-400 flex items-center gap-2 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Each recipient can settle their EC$ {splitShareXCD.toFixed(2)} portion via NBD MoBanking, mPay Wallet, Card, or Cash.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Heavy Luggage & Mountain Terrain Declaration */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={booking.heavyLuggageDeclared}
                onChange={(e) => handleFieldChange('heavyLuggageDeclared', e.target.checked)}
                className="mt-1 w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-white block">
                  Mandatory Declaration of Heavy Baggage for 4WD Mountain Terrain
                </span>
                <span className="text-[11px] text-neutral-400 block leading-relaxed">
                  Dominica's steep rainforest inclines require secure trunk allocation and weight distribution. Check this box if carrying &gt;2 check-in suitcases, scuba equipment, or airport crates.
                </span>
              </div>
            </label>
          </div>

          {/* Passenger Information */}
          <div className="pt-2 border-t border-neutral-800 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Rider Contact Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Lead Rider Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Julian Montgomery"
                  value={booking.passengerName}
                  onChange={(e) => handleFieldChange('passengerName', e.target.value)}
                  className={`w-full bg-neutral-950 border ${
                    formErrors.passengerName ? 'border-red-500' : 'border-neutral-700'
                  } rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500`}
                />
                {formErrors.passengerName && (
                  <p className="mt-1 text-[11px] text-red-400">{formErrors.passengerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+1 (767) 555-0192"
                  value={booking.passengerPhone}
                  onChange={(e) => handleFieldChange('passengerPhone', e.target.value)}
                  className={`w-full bg-neutral-950 border ${
                    formErrors.passengerPhone ? 'border-red-500' : 'border-neutral-700'
                  } rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500`}
                />
                {formErrors.passengerPhone && (
                  <p className="mt-1 text-[11px] text-red-400">{formErrors.passengerPhone}</p>
                )}
              </div>

              {isAirportRide && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Flight Number (Optional for DOM / DCF live radar sync)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AA 3169 / interCaribbean 234"
                    value={booking.flightNumber}
                    onChange={(e) => handleFieldChange('flightNumber', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Fare Estimate, Dominica Payments & Dispatch (4 Cols) - CSS Selector 2 */}
        <div className="lg:col-span-4 bg-gradient-to-b from-neutral-900/95 via-neutral-900 to-neutral-950 border border-neutral-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 lg:sticky lg:top-24 ring-1 ring-emerald-500/20 backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                Live Fare &amp; Route Breakdown
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Phase 2 Final
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-neutral-300 font-medium">
                {isFareReset ? '0 miles · ~0 mins' : `${fareCalc.distanceMiles} miles · ~${fareCalc.estimatedMinutes} mins`}
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {formatFare(displayTotalXCD, currency)}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
              15% Dominica VAT transparently calculated
            </p>
          </div>

          {/* Special Coaster Split Fare Callout Card in Right Column */}
          {isSharedCoaster && isSplitFareEnabled && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Split Fare ({effectiveSplitRiders} Riders)</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  Shared Coaster
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-neutral-300">Each Rider Pays:</span>
                <span className="text-xl font-mono font-extrabold text-emerald-300">
                  {formatFare(splitShareXCD, currency)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopySplitLink}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-800/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSplitLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSplitLink ? 'Split Link Copied!' : 'Copy Split Payment Link'}</span>
              </button>
            </div>
          )}

          {/* Itemized charges table */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2 text-xs text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-400">Base Dispatch Fee</span>
              <span className="font-mono">{formatFare(displayBaseFeeXCD, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">
                Mileage ({isFareReset ? 0 : fareCalc.distanceMiles} mi × 10 EC$)
              </span>
              <span className="font-mono">{formatFare(displayDistanceFeeXCD, currency)}</span>
            </div>
            {booking.additionalStops && booking.additionalStops.length > 0 && (
              <div className="flex justify-between text-[11px] text-amber-300">
                <span>Additional Stops ({booking.additionalStops.length} stops)</span>
                <span className="font-mono">Included in total mileage</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="font-mono">{formatFare(displaySubtotalXCD, currency)}</span>
            </div>
            <div className="flex justify-between text-emerald-400/90 font-medium pt-1 border-t border-neutral-800">
              <span>15% Dominica VAT (Included)</span>
              <span className="font-mono">{formatFare(displayVatXCD, currency)}</span>
            </div>
          </div>

          {/* Payment Method Selector (Collapsible) - CSS Selector: div:nth-of-type(3) > label:nth-of-type(1) */}
          <div className="border border-neutral-800 rounded-2xl p-4 bg-neutral-950/60 transition-all duration-300">
            <label
              onClick={() => setIsPaymentSectionOpen((prev) => !prev)}
              className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between mb-0 cursor-pointer select-none group py-1 rounded-xl transition-colors hover:text-emerald-300"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsPaymentSectionOpen((prev) => !prev);
                }
              }}
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Dominica Payment Methods</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 group-hover:text-emerald-300 normal-case">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  {selectedPaymentMethod?.name || 'Selected'}
                </span>
                <span>{isPaymentSectionOpen ? 'Collapse' : 'Expand'}</span>
                {isPaymentSectionOpen ? (
                  <ChevronUp className="w-4 h-4 text-emerald-400 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-emerald-400 transition-transform duration-200" />
                )}
              </span>
            </label>

            {/* Collapsed State Preview Card */}
            {!isPaymentSectionOpen && (
              <div
                onClick={() => setIsPaymentSectionOpen(true)}
                className="mt-3 p-3 bg-neutral-900/80 hover:bg-neutral-900 border border-emerald-500/40 hover:border-emerald-500/80 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30 shrink-0" />
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {selectedPaymentMethod?.name}
                      </span>
                      {selectedPaymentMethod?.isDominicaPreferred && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/90 px-1.5 py-0.2 rounded border border-emerald-800 shrink-0">
                          #1 in Dominica
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {selectedPaymentMethod?.description}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold group-hover:underline shrink-0 ml-2">
                  Change
                </span>
              </div>
            )}

            {/* Expanded Payment Options */}
            {isPaymentSectionOpen && (
              <div className="mt-3 space-y-2">
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = booking.paymentMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        onClick={() => handleFieldChange('paymentMethod', method.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-neutral-800 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          checked={isSelected}
                          onChange={() => handleFieldChange('paymentMethod', method.id)}
                          className="mt-0.5 accent-emerald-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{method.name}</span>
                            {method.isDominicaPreferred && (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                                #1 in Dominica
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                            {method.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Quick NBD MoBanking input field if selected */}
                {booking.paymentMethod === 'nbd_mobanking' && (
                  <div className="mt-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-300">
                    <span className="font-semibold text-emerald-400 block mb-1">
                      NBD MoBanking Quick Pay Active
                    </span>
                    <p className="text-neutral-400 text-[10px] mb-2">
                      Charge directly to your saved NBD MoBanking default or enter your NBD customer ID:
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. NBD-XXXX-XXXX"
                      value={booking.nbdAccountNumber || ''}
                      onChange={(e) => handleFieldChange('nbdAccountNumber', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cancellation Notice Policy */}
          <div className="p-3 bg-neutral-950/70 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              15% cancellation fee applies if driver dispatch has begun (0-2 minute grace period).
            </span>
          </div>

          {/* Dispatch CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Dispatching Driver...</span>
            ) : (
              <>
                <span>
                  Request {fareCalc.tier.name}
                  {isSharedCoaster && isSplitFareEnabled ? ` (EC$ ${splitShareXCD.toFixed(2)}/rider)` : ''}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
