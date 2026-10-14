import React, { useState } from 'react';
import {
  X,
  Car,
  ShieldCheck,
  Phone,
  CheckCircle2,
  DollarSign,
  FileText,
  AlertTriangle,
  Award,
  ArrowRight,
  User,
} from 'lucide-react';
import { VEHICLE_TIERS } from '../data/dominicaData';
import { ActiveDriver } from '../types/booking';
import { EliteRideLogo } from './EliteRideLogo';

interface DriverSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDriverRegistered: (driver: ActiveDriver) => void;
  currentDriver: ActiveDriver | null;
  onDriverSignOut?: () => void;
}

export const DriverSignUpModal: React.FC<DriverSignUpModalProps> = ({
  isOpen,
  onClose,
  onDriverRegistered,
  currentDriver,
  onDriverSignOut,
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+1 (767) ',
    email: '',
    vehicleTier: 'mountain-4wd-suv',
    vehiclePlate: '',
    vehicleModel: 'Toyota Land Cruiser Prado 4WD',
    vehicleYear: '2023',
    driverLicenseNumber: '',
    nbdAccountNumber: '',
    hasCleanPoliceRecord: true,
  });

  const [signInIdentifier, setSignInIdentifier] = useState('DA-4912');
  const [signInPhone, setSignInPhone] = useState('+1 (767) 245-1100');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredDriver, setRegisteredDriver] = useState<ActiveDriver | null>(null);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full legal name as it appears on your license');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim() === '+1 (767)') {
      setErrorMsg('Please provide a valid Dominica mobile or WhatsApp contact number');
      return;
    }
    if (!formData.vehiclePlate.trim()) {
      setErrorMsg('Please enter your vehicle license plate (e.g. DA-4912)');
      return;
    }
    if (!formData.driverLicenseNumber.trim()) {
      setErrorMsg('Please enter your Dominica Driver\'s License number');
      return;
    }
    if (!formData.hasCleanPoliceRecord) {
      setErrorMsg('You must certify compliance with Dominica police vetting standards');
      return;
    }

    const newDriver: ActiveDriver = {
      id: `DRV-767-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.fullName,
      rating: 5.0,
      tripsCompleted: 0,
      vehicleModel: `${formData.vehicleModel} (${formData.vehicleYear})`,
      licensePlate: formData.vehiclePlate.toUpperCase(),
      phone: formData.phone,
      currentLat: 15.301,
      currentLng: -61.388,
    };

    try {
      localStorage.setItem('elite_ride_driver', JSON.stringify(newDriver));
    } catch {
      // storage unavailable
    }

    setRegisteredDriver(newDriver);
    setIsSuccess(true);
    onDriverRegistered(newDriver);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Default driver profile
    const verifiedDriver: ActiveDriver = {
      id: 'DRV-767-4912',
      name: 'Jean-Pierre Bruno',
      rating: 4.96,
      tripsCompleted: 342,
      vehicleModel: 'Toyota Land Cruiser Prado 4WD (2022)',
      licensePlate: signInIdentifier.toUpperCase() || 'DA-4912',
      phone: signInPhone || '+1 (767) 245-1100',
      currentLat: 15.301,
      currentLng: -61.388,
    };

    try {
      localStorage.setItem('elite_ride_driver', JSON.stringify(verifiedDriver));
    } catch {
      // storage unavailable
    }

    onDriverRegistered(verifiedDriver);
    onClose();
  };

  const handleQuickDemoDriver = () => {
    const demoDriver: ActiveDriver = {
      id: 'DRV-767-4912',
      name: 'Jean-Pierre Bruno',
      rating: 4.96,
      tripsCompleted: 342,
      vehicleModel: 'Toyota Land Cruiser Prado 4WD (2022)',
      licensePlate: 'DA-4912',
      phone: '+1 (767) 245-1100',
      currentLat: 15.301,
      currentLng: -61.388,
    };

    try {
      localStorage.setItem('elite_ride_driver', JSON.stringify(demoDriver));
    } catch {
      // storage unavailable
    }

    onDriverRegistered(demoDriver);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/60 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Current Active Driver Profile View */}
        {currentDriver && !isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold border border-emerald-500/40">
              {currentDriver.name.split(' ').map((n) => n[0]).join('')}
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-bold text-white">{currentDriver.name}</h3>
                <span className="text-xs text-amber-400 font-bold">★ {currentDriver.rating}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Plate: <strong className="text-emerald-400 font-mono">{currentDriver.licensePlate}</strong> · {currentDriver.vehicleModel}
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-mono font-bold">
                Driver ID: {currentDriver.id}
              </span>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-left space-y-2.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">Phone / WhatsApp:</span>
                <span className="text-white font-mono">{currentDriver.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Lifetime Completed Trips:</span>
                <span className="text-emerald-400 font-bold">{currentDriver.tripsCompleted} trips</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Payout Status:</span>
                <span className="text-white font-mono">NBD MoBanking Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Police & Insurance Status:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Police Vetted & Approved
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                Access Driver Console
              </button>
              {onDriverSignOut && (
                <button
                  onClick={() => {
                    onDriverSignOut();
                    onClose();
                  }}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-red-400 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        ) : isSuccess ? (
          /* Registration Success State */
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white">Driver Registration Complete!</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Welcome to Elite Ride Dominica, <strong>{registeredDriver?.name}</strong>. Your driver profile is verified and ready for mountain dispatches.
              </p>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs text-left space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans">Assigned Driver ID:</span>
                <span className="text-emerald-400 font-bold">{registeredDriver?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans">Vehicle Plate:</span>
                <span className="text-white">{registeredDriver?.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans">Commission:</span>
                <span className="text-emerald-400 font-sans font-semibold">100% Tips Retained</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-extrabold rounded-xl text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Launch Driver Console & Go Online</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Sign Up / Sign In Form */
          <div>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <EliteRideLogo variant="mark" size="md" theme="dark" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                {mode === 'signup' ? 'Become an Elite Ride Driver' : 'Driver Partner Sign In'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {mode === 'signup'
                  ? 'Drive your sedan, SUV, or coaster van across Dominica. Weekly NBD MoBanking payouts & 100% tips retained.'
                  : 'Access your shift dashboard, active dispatches, and weekly earnings summary.'}
              </p>

              {/* Mode Toggle */}
              <div className="flex p-1 bg-neutral-950 rounded-xl border border-neutral-800 mt-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Driver Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Driver Sign In
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === 'signup' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jean-Pierre Bruno"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Mobile / WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (767) 245-XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="driver@dominica.dm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Vehicle Category *
                  </label>
                  <select
                    value={formData.vehicleTier}
                    onChange={(e) => setFormData({ ...formData, vehicleTier: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {VEHICLE_TIERS.map((tier) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.name} ({tier.badge}) - Up to {tier.capacityPassengers} Passengers
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      License Plate # *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DA-4912"
                      value={formData.vehiclePlate}
                      onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white uppercase font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Vehicle Model & Year *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prado 4WD 2022"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Dominica Driver's License # *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DL-DOM-99214"
                      value={formData.driverLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, driverLicenseNumber: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white uppercase font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      NBD MoBanking Payout Account
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NBD-0091-8821"
                      value={formData.nbdAccountNumber}
                      onChange={(e) => setFormData({ ...formData, nbdAccountNumber: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Vetting affirmation checkbox */}
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasCleanPoliceRecord}
                      onChange={(e) => setFormData({ ...formData, hasCleanPoliceRecord: e.target.checked })}
                      className="mt-0.5 accent-emerald-500 rounded"
                    />
                    <span className="text-[11px] text-neutral-300 leading-snug">
                      I certify that I hold a valid Dominica commercial driver's license, comprehensive passenger insurance, and clean police vetting record.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-extrabold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Car className="w-4 h-4" />
                  <span>Submit Driver Sign Up & Register</span>
                </button>
              </form>
            ) : (
              /* Sign In Form */
              <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Driver License Plate # or Driver ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DA-4912 or DRV-767-4912"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white uppercase font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Registered Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (767) 245-1100"
                    value={signInPhone}
                    onChange={(e) => setSignInPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-extrabold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In to Driver Cockpit</span>
                </button>

                {/* Quick Demo Sign In */}
                <div className="pt-3 border-t border-neutral-800 text-center">
                  <span className="text-[11px] text-neutral-400 block mb-2">
                    Quick prototype driver access:
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickDemoDriver}
                    className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 text-emerald-400 border border-neutral-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Instant Login as Verified Driver (Jean-Pierre Bruno · DA-4912)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
