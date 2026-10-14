/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RideBookingForm } from './components/RideBookingForm';
import { LiveTrackingSimulator } from './components/LiveTrackingSimulator';
import { DriverPortal } from './components/DriverPortal';
import { AdminPortal } from './components/AdminPortal';
import { RiderAuthModal } from './components/RiderAuthModal';
import { DriverSignUpModal } from './components/DriverSignUpModal';
import { PoliciesSection } from './components/PoliciesSection';
import { Footer } from './components/Footer';
import { AppOpeningLogoScreen } from './components/AppOpeningLogoScreen';
import { LogoDesignViewerModal } from './components/LogoDesignViewerModal';
import { AppView, Currency, ActiveRide, RiderProfile, ActiveDriver, RideHistoryItem } from './types/booking';
import { VEHICLE_TIERS, DOMINICA_LOCATIONS } from './data/dominicaData';
import { ArrowRight, ShieldCheck, MapPin, Car, Radio, Smartphone, ChevronRight, ChevronDown, ChevronUp, Award, Compass, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currency, setCurrency] = useState<Currency>('XCD');
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string>('standard-sedan');

  // App Opening Logo Screen (Opens the app showcasing the official logo design)
  const [showOpeningLogo, setShowOpeningLogo] = useState<boolean>(true);
  const [isLogoDesignModalOpen, setIsLogoDesignModalOpen] = useState<boolean>(false);

  // Rider authentication profile state
  const [currentRider, setCurrentRider] = useState<RiderProfile | null>(() => {
    try {
      const saved = localStorage.getItem('elite_ride_rider');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isRiderAuthOpen, setIsRiderAuthOpen] = useState(false);

  // Driver partner profile state
  const [currentDriver, setCurrentDriver] = useState<ActiveDriver | null>(() => {
    try {
      const saved = localStorage.getItem('elite_ride_driver');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isDriverSignUpOpen, setIsDriverSignUpOpen] = useState(false);

  const handleDriverRegistered = (driver: ActiveDriver) => {
    setCurrentDriver(driver);
    try {
      localStorage.setItem('elite_ride_driver', JSON.stringify(driver));
    } catch {
      // storage unavailable
    }
  };

  const handleDriverSignOut = () => {
    setCurrentDriver(null);
    try {
      localStorage.removeItem('elite_ride_driver');
    } catch {
      // storage unavailable
    }
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'XCD' ? 'USD' : 'XCD'));
  };

  const handleRiderLogin = (rider: RiderProfile) => {
    setCurrentRider(rider);
    try {
      localStorage.setItem('elite_ride_rider', JSON.stringify(rider));
    } catch {
      // storage unavailable
    }
    // Location, Fare Calculation & Final Price Reset on Login
    if (typeof window !== 'undefined') {
      if ((window as any).resetRideLocationAndFare) {
        (window as any).resetRideLocationAndFare();
      }
      window.dispatchEvent(new CustomEvent('eliteride_reset_location_and_fare'));
    }
  };

  const handleRiderLogout = () => {
    setCurrentRider(null);
    try {
      localStorage.removeItem('elite_ride_rider');
    } catch {
      // storage unavailable
    }
    // Location, Fare Calculation & Final Price Reset on Logout
    if (typeof window !== 'undefined') {
      if ((window as any).resetRideLocationAndFare) {
        (window as any).resetRideLocationAndFare();
      }
      window.dispatchEvent(new CustomEvent('eliteride_reset_location_and_fare'));
    }
  };

  const handleRideDispatched = (ride: ActiveRide) => {
    setActiveRide(ride);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Persist to Rider History in Local Storage
    try {
      const riderId = currentRider ? currentRider.id : 'RDR-GUEST';
      const storageKey = `elite_ride_history_${riderId}`;
      const existing = localStorage.getItem(storageKey);
      const parsed: RideHistoryItem[] = existing ? JSON.parse(existing) : [];

      const newHistoryItem: RideHistoryItem = {
        id: `TRP-${ride.id}`,
        riderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now(),
        pickup: ride.pickupLabel,
        dropoff: ride.dropoffLabel,
        stopover: ride.stopoverLabel,
        tierName: ride.tier.name,
        driverName: ride.driver.name,
        vehicleModel: ride.driver.vehicleModel,
        fareXCD: ride.fare.totalXCD,
        fareUSD: ride.fare.totalUSD,
        paymentMethod: ride.booking.paymentMethod.replace('_', ' ').toUpperCase(),
        status: 'in_transit',
        rating: 5,
      };

      const updatedHistory = [newHistoryItem, ...parsed];
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));

      // Also update rider trips count
      if (currentRider) {
        const updatedProfile: RiderProfile = {
          ...currentRider,
          tripsCount: (currentRider.tripsCount || 0) + 1,
        };
        setCurrentRider(updatedProfile);
        localStorage.setItem('elite_ride_rider', JSON.stringify(updatedProfile));
      }
    } catch (e) {
      console.warn('Could not persist ride to local storage:', e);
    }
  };

  const handleCancelRide = () => {
    setActiveRide(null);
    setCurrentView('book');
  };

  const handleResetRide = () => {
    setActiveRide(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* 3-Zone Clean Header with Admin Portal, Rider Sign Up & Driver Sign Up */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currency={currency}
        onToggleCurrency={toggleCurrency}
        hasActiveRide={activeRide !== null}
        currentRider={currentRider}
        onOpenRiderAuth={() => setIsRiderAuthOpen(true)}
        currentDriver={currentDriver}
        onOpenDriverSignUp={() => setIsDriverSignUpOpen(true)}
        onOpenLogoDesign={() => setIsLogoDesignModalOpen(true)}
        onReplaySplash={() => setShowOpeningLogo(true)}
      />

      <main className="flex-1 pb-16">
        {/* =========================================================================
            PHASE 1: MAIN HOME PAGE
            Features Hero Section, Fleet Preview & Direct Phase-2 Booking Launch
            ========================================================================= */}
        {currentView === 'home' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <HeroSection
              onStartBooking={() => {
                setCurrentView('book');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDriverPortal={() => {
                setCurrentView('driver_portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenRiderSignUp={() => setIsRiderAuthOpen(true)}
              onOpenDriverSignUp={() => setIsDriverSignUpOpen(true)}
              onOpenAdminPortal={() => {
                setCurrentView('admin_portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenLogoDesign={() => setIsLogoDesignModalOpen(true)}
              onReplaySplash={() => setShowOpeningLogo(true)}
            />

            {/* Dominica Island Transit Highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/95 to-emerald-950/40 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                      <Radio className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">Live GPS &amp; Street View Cameras</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Track your driver along E.O. Leblanc Coastal Highway, Pont Cassé rainforest pass, and Roseau Bayfront with high-definition real-time street cams.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">Local Dominica Payment Gateways</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Instant cashless fare settlements via National Bank of Dominica (NBD) MoBanking QR codes, mPay mobile wallet, and major credit cards in EC$ or USD.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white">24/7 Police SOS &amp; Vetted Drivers</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      All chauffeurs hold valid Commonwealth of Dominica commercial licenses and clean police clearances. Floating one-tap 999 SOS emergency response.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Official Policies & 15% Cancellation Fee */}
            <PoliciesSection />
          </div>
        )}

        {/* =========================================================================
            PHASE 2: DEDICATED RIDE BOOKING TERMINAL
            ========================================================================= */}
        {currentView === 'book' && (
          <div className="space-y-8 py-8">
            {/* Phase 2 Header & Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-neutral-900 border border-neutral-800/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        setCurrentView('home');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>← Back to Home</span>
                    </button>
                    <span className="text-neutral-600">/</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                      PHASE 2 OF BOOKING
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    Dominica Ride Booking Terminal
                  </h1>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                    Configure your pickup, destination, optional scenic stopover, and vehicle tier. Real-time mileage and Dominica VAT calculated instantly.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsRiderAuthOpen(true)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-semibold transition-colors border border-neutral-700 cursor-pointer"
                  >
                    {currentRider ? `Rider: ${currentRider.fullName.split(' ')[0]} (${currentRider.id})` : 'Sign In for Ride History'}
                  </button>
                </div>
              </div>
            </div>



            {/* Core Ride Booking Form (CSS Selector Elements 1 & 2 Inside) */}
            <section id="booking-section" className="px-4 sm:px-6 lg:px-8">
              <RideBookingForm
                currency={currency}
                selectedTierId={selectedTierId}
                onTierChange={(tierId) => setSelectedTierId(tierId)}
                onRideDispatched={handleRideDispatched}
                currentRider={currentRider}
                onOpenRiderAuth={() => setIsRiderAuthOpen(true)}
              />
            </section>

            {/* Policies in Booking View */}
            <PoliciesSection />
          </div>
        )}

        {/* Live GPS & Street View Tracking View */}
        {currentView === 'tracking' && (
          <div className="py-10 px-4 sm:px-6 lg:px-8">
            <LiveTrackingSimulator
              ride={activeRide}
              currency={currency}
              onCancelRide={handleCancelRide}
              onResetRide={handleResetRide}
              onStartDemoRide={handleRideDispatched}
            />
          </div>
        )}

        {/* Admin Portal featuring the Active Driver Console */}
        {currentView === 'admin_portal' && (
          <div className="py-10 px-4 sm:px-6 lg:px-8">
            <AdminPortal currency={currency} />
          </div>
        )}

        {currentView === 'driver_portal' && (
          <div className="py-10 px-4 sm:px-6 lg:px-8">
            <DriverPortal currency={currency} />
          </div>
        )}

        {currentView === 'policies' && (
          <div className="py-10 px-4 sm:px-6 lg:px-8">
            <PoliciesSection defaultCollapsed={false} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLogoDesign={() => setIsLogoDesignModalOpen(true)}
        onReplaySplash={() => setShowOpeningLogo(true)}
      />

      {/* Rider Sign Up & Profile Modal */}
      <RiderAuthModal
        isOpen={isRiderAuthOpen}
        onClose={() => setIsRiderAuthOpen(false)}
        onLogin={handleRiderLogin}
        currentRider={currentRider}
        onLogout={handleRiderLogout}
      />

      {/* Driver Partner Sign Up & Onboarding Modal */}
      <DriverSignUpModal
        isOpen={isDriverSignUpOpen}
        onClose={() => setIsDriverSignUpOpen(false)}
        onDriverRegistered={(driver) => {
          handleDriverRegistered(driver);
          setCurrentView('driver_portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentDriver={currentDriver}
        onDriverSignOut={handleDriverSignOut}
      />

      {/* App Launch Opening Logo Screen (Opens the app showcasing the official logo design) */}
      {showOpeningLogo && (
        <AppOpeningLogoScreen
          onEnterApp={() => setShowOpeningLogo(false)}
          autoCloseDelayMs={2800}
        />
      )}

      {/* Interactive Logo Design Viewer Modal */}
      <LogoDesignViewerModal
        isOpen={isLogoDesignModalOpen}
        onClose={() => setIsLogoDesignModalOpen(false)}
        onReplaySplash={() => setShowOpeningLogo(true)}
      />
    </div>
  );
}
