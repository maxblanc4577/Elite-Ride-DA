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
} from 'lucide-react';
import {
  DOMINICA_LOCATIONS,
  VEHICLE_TIERS,
  PAYMENT_METHODS,
  VehicleTier,
} from '../data/dominicaData';
import { Currency, RideBookingData, ActiveRide, ActiveDriver, RiderProfile } from '../types/booking';
import { calculateRideFare, formatFare } from '../utils/pricing';

interface RideBookingFormProps {
  currency: Currency;
  onRideDispatched: (ride: ActiveRide) => void;
  currentRider?: RiderProfile | null;
  onOpenRiderAuth?: () => void;
}

export const RideBookingForm: React.FC<RideBookingFormProps> = ({
  currency,
  onRideDispatched,
  currentRider,
  onOpenRiderAuth,
}) => {
  const [booking, setBooking] = useState<RideBookingData>({
    pickupId: 'ROSEAU',
    dropoffId: 'DOM',
    customPickup: '',
    customDropoff: '',
    hasStopover: false,
    stopoverId: 'PONT_CASSE',
    vehicleTierId: 'mountain-4wd-suv',
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
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVehicleSectionOpen, setIsVehicleSectionOpen] = useState(false);

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

  const handleFieldChange = (field: keyof RideBookingData, value: any) => {
    setBooking((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const u = { ...prev };
        delete u[field];
        return u;
      });
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

    // Mock driver dispatch
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
        booking: { ...booking },
        tier: fareCalc.tier,
        fare: fareCalc,
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

  const isAirportRide = booking.pickupId === 'DOM' || booking.dropoffId === 'DOM' || booking.pickupId === 'DCF' || booking.dropoffId === 'DCF';

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ride Routing & Tier Selection (8 Cols) */}
        <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-7">
          {/* Header & Timing Switch */}
          <div className="flex flex-wrap items-center justify-between pb-5 border-b border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">
                On-Demand Dispatch · Dominica #DOM-ER-2026
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Book an Elite Ride
              </h2>
            </div>

            {/* Ride Now / Schedule Toggle */}
            <div className="flex items-center p-1 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleFieldChange('isScheduled', false)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
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
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
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

          {/* Route Selector (Pickup, Optional Stop-over, Drop-off) */}
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

              {/* Drop-off */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Destination</span>
                  </span>
                </label>
                <select
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
                {formErrors.dropoffId && (
                  <p className="mt-1 text-[11px] text-red-400">{formErrors.dropoffId}</p>
                )}
              </div>
            </div>

            {/* Optional Stop-over toggle */}
            {!booking.hasStopover ? (
              <button
                type="button"
                onClick={() => handleFieldChange('hasStopover', true)}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-1 py-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stop-Over Location (Grocery, Bank, Scenic Overlook)</span>
              </button>
            ) : (
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-amber-300 mb-1">
                    Stop-Over Location:
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
                  className="p-2 text-neutral-500 hover:text-red-400 rounded-lg mt-4"
                  title="Remove Stop-over"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Vehicle Tier Selection Cards (Collapsible) */}
          <div className="border border-neutral-800 rounded-2xl p-4 bg-neutral-950/60">
            <button
              type="button"
              onClick={() => setIsVehicleSectionOpen(!isVehicleSectionOpen)}
              className="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-10 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Select Vehicle Category
                    </span>
                    {(() => {
                      const activeTier = VEHICLE_TIERS.find((t) => t.id === booking.vehicleTierId) || VEHICLE_TIERS[0];
                      return (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          {activeTier.badge}
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const activeTier = VEHICLE_TIERS.find((t) => t.id === booking.vehicleTierId) || VEHICLE_TIERS[0];
                    return (
                      <div className="text-xs text-neutral-300 font-semibold truncate mt-0.5">
                        {activeTier.name}
                        <span className="text-neutral-500 font-normal ml-2">
                          ({activeTier.capacityPassengers} seats · {activeTier.capacityLuggage} bags)
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-xs text-neutral-400 group-hover:text-emerald-400 font-medium hidden sm:inline">
                  {isVehicleSectionOpen ? 'Collapse' : 'Change Category'}
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
                            ? 'bg-neutral-800/90 border-emerald-500 ring-1 ring-emerald-500'
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
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-neutral-800">
                              {tier.badge}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white">{tier.name}</h4>
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

          {/* Heavy Luggage & Mountain Terrain Declaration */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={booking.heavyLuggageDeclared}
                onChange={(e) => handleFieldChange('heavyLuggageDeclared', e.target.checked)}
                className="mt-1 w-4 h-4 accent-emerald-500 rounded"
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

        {/* Right Column: Fare Estimate, Dominica Payments & Dispatch (4 Cols) */}
        <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-6 sticky top-28">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Live Fare & Route Breakdown
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-neutral-300 font-medium">
                {fareCalc.distanceMiles} miles · ~{fareCalc.estimatedMinutes} mins
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {formatFare(fareCalc.totalXCD, currency)}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
              15% Dominica VAT transparently calculated
            </p>
          </div>

          {/* Itemized charges table */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2 text-xs text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-400">Base Dispatch Fee</span>
              <span className="font-mono">{formatFare(fareCalc.baseFeeXCD, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">
                Mileage (PER mi × 10 EC$)
              </span>
              <span className="font-mono">{formatFare(fareCalc.distanceFeeXCD, currency)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="font-mono">{formatFare(fareCalc.subtotalXCD, currency)}</span>
            </div>
            <div className="flex justify-between text-emerald-400/90 font-medium pt-1 border-t border-neutral-800">
              <span>15% Dominica VAT (Included)</span>
              <span className="font-mono">{formatFare(fareCalc.vatXCD, currency)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2.5">
              Official Dominica Payment Methods
            </label>
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
                      className="mt-0.5 accent-emerald-500"
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
                <span>Request {fareCalc.tier.name}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
