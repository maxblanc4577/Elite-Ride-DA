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
import { PoliciesSection } from './components/PoliciesSection';
import { Footer } from './components/Footer';
import { AppView, Currency, ActiveRide, RiderProfile } from './types/booking';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('book');
  const [currency, setCurrency] = useState<Currency>('XCD');
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);

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
  };

  const handleRiderLogout = () => {
    setCurrentRider(null);
    try {
      localStorage.removeItem('elite_ride_rider');
    } catch {
      // storage unavailable
    }
  };

  const handleRideDispatched = (ride: ActiveRide) => {
    setActiveRide(ride);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelRide = () => {
    setActiveRide(null);
    setCurrentView('book');
  };

  const handleResetRide = () => {
    setActiveRide(null);
    setCurrentView('book');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* 3-Zone Clean Header with Admin Portal & Rider Sign Up */}
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
      />

      <main className="flex-1 pb-16">
        {currentView === 'book' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <HeroSection
              onStartBooking={() => {
                const el = document.getElementById('booking-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenDriverPortal={() => {
                setCurrentView('driver_portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenRiderSignUp={() => setIsRiderAuthOpen(true)}
              onOpenAdminPortal={() => {
                setCurrentView('admin_portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Core Ride Booking Terminal */}
            <section id="booking-section" className="px-4 sm:px-6 lg:px-8">
              <RideBookingForm
                currency={currency}
                onRideDispatched={handleRideDispatched}
                currentRider={currentRider}
                onOpenRiderAuth={() => setIsRiderAuthOpen(true)}
              />
            </section>

            {/* Official Policies & 15% Cancellation Fee */}
            <PoliciesSection />
          </div>
        )}

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
            <PoliciesSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(view) => {
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Rider Sign Up & Profile Modal */}
      <RiderAuthModal
        isOpen={isRiderAuthOpen}
        onClose={() => setIsRiderAuthOpen(false)}
        onLogin={handleRiderLogin}
        currentRider={currentRider}
        onLogout={handleRiderLogout}
      />
    </div>
  );
}
