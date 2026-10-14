import React, { useState } from 'react';
import { Menu, X, Car, ShieldCheck, User, Radio, UserPlus, LayoutDashboard } from 'lucide-react';
import { AppView, Currency, RiderProfile, ActiveDriver } from '../types/booking';
import { EliteRideLogo } from './EliteRideLogo';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currency: Currency;
  onToggleCurrency: () => void;
  hasActiveRide: boolean;
  currentRider: RiderProfile | null;
  onOpenRiderAuth: () => void;
  currentDriver?: ActiveDriver | null;
  onOpenDriverSignUp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currency,
  onToggleCurrency,
  hasActiveRide,
  currentRider,
  onOpenRiderAuth,
  currentDriver,
  onOpenDriverSignUp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Official Elite Ride Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="shrink-0 flex items-center text-left cursor-pointer group focus:outline-none"
          aria-label="Elite Ride Dominica Home"
        >
          <EliteRideLogo
            variant="horizontal"
            size="sm"
            theme="dark"
            className="hover:opacity-95 transition-opacity"
          />
        </button>

        {/* Zone 2: Navigation Links (Single-line, no wraps) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-medium text-neutral-300">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'home' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('book')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'book' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            Book a Ride
          </button>

          <button
            onClick={() => onNavigate('tracking')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'tracking' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            {hasActiveRide && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
            <span>Ride GPS Tracking</span>
          </button>

          {/* Admin Portal with Active Driver Console highlight */}
          <button
            onClick={() => onNavigate('admin_portal')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'admin_portal' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Driver Console
            </span>
          </button>

          <button
            onClick={() => onNavigate('driver_portal')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'driver_portal' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            Driver Portal
          </button>

          <button
            onClick={() => onNavigate('policies')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'policies' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            Safety & Policies
          </button>
        </nav>

        {/* Zone 3: Currency Switcher, Rider Sign Up & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            type="button"
            className="px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Switch display currency"
          >
            <span className={currency === 'XCD' ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
              EC$
            </span>
            <span className="mx-1 text-neutral-600">/</span>
            <span className={currency === 'USD' ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
              USD
            </span>
          </button>

          {/* Rider Sign Up / Profile CTA */}
          {currentRider ? (
            <button
              onClick={onOpenRiderAuth}
              type="button"
              className="px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/50 hover:border-emerald-400 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="View your Rider Profile & Saved Preferences"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentRider.fullName.split(' ')[0]}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-mono">
                {currentRider.id}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenRiderAuth}
              type="button"
              className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Sign up as a Rider in Dominica"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Rider Sign Up</span>
            </button>
          )}

          {/* Driver Sign Up / Console CTA */}
          {currentDriver ? (
            <button
              onClick={() => onNavigate('driver_portal')}
              type="button"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open Driver Partner Console"
            >
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Driver: {currentDriver.name.split(' ')[0]}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-mono">
                {currentDriver.licensePlate}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenDriverSignUp}
              type="button"
              className="px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/60 hover:border-emerald-400 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Sign up as a verified driver in Dominica"
            >
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              <span>Driver Sign Up</span>
            </button>
          )}
          {hasActiveRide ? (
            <button
              onClick={() => onNavigate('tracking')}
              className="hidden sm:flex px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Track Active Ride</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onNavigate('book');
                const el = document.getElementById('booking-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:flex px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              Book Ride
            </button>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-800 bg-neutral-950 px-4 py-5 space-y-3">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-medium text-neutral-300 hover:text-emerald-400 py-1"
          >
            Home Overview
          </button>
          <button
            onClick={() => {
              onNavigate('book');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-medium text-neutral-300 hover:text-emerald-400 py-1"
          >
            Book a Ride (Phase 2 Terminal)
          </button>
          <button
            onClick={() => {
              onNavigate('tracking');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-medium text-neutral-300 hover:text-emerald-400 py-1"
          >
            Active GPS Ride Tracking {hasActiveRide && '● (Active)'}
          </button>
          <button
            onClick={() => {
              onNavigate('admin_portal');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-semibold text-emerald-400 hover:text-emerald-300 py-1 flex items-center justify-between"
          >
            <span>Admin Portal</span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 rounded font-mono">Active Driver Console</span>
          </button>
          <button
            onClick={() => {
              onNavigate('driver_portal');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-medium text-neutral-300 hover:text-emerald-400 py-1"
          >
            Driver Portal & Partner Registration
          </button>
          <button
            onClick={() => {
              onNavigate('policies');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left text-sm font-medium text-neutral-300 hover:text-emerald-400 py-1"
          >
            Safety, Terms & 15% Cancellation Fee
          </button>

          <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenRiderAuth();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-400 text-neutral-950 flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{currentRider ? `Rider: ${currentRider.fullName.split(' ')[0]}` : 'Rider Sign Up'}</span>
              </button>
              <button
                onClick={() => {
                  if (onOpenDriverSignUp) onOpenDriverSignUp();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-900 border border-emerald-500/60 text-emerald-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Car className="w-3.5 h-3.5" />
                <span>{currentDriver ? `Driver: ${currentDriver.name.split(' ')[0]}` : 'Driver Sign Up'}</span>
              </button>
            </div>
            <button
              onClick={onToggleCurrency}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-emerald-400 cursor-pointer"
            >
              Currency: {currency === 'XCD' ? 'EC$' : 'USD'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
