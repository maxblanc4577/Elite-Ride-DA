import React from 'react';
import { ArrowRight, ShieldCheck, Radio, Smartphone } from 'lucide-react';
import { EliteRideLogo } from './EliteRideLogo';

interface HeroSectionProps {
  onStartBooking: () => void;
  onOpenDriverPortal: () => void;
  onOpenRiderSignUp?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenDriverSignUp?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBooking,
  onOpenDriverPortal,
  onOpenRiderSignUp,
  onOpenAdminPortal,
  onOpenDriverSignUp,
}) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Visual Asset */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_dominica_luxury_suv_1791810331228.jpg"
          alt="Elite Ride Dominica executive 4WD SUV on coastal mountain road"
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Measured Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Official Brand Identity Presentation */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-neutral-950/80 border border-neutral-800 backdrop-blur-md shadow-2xl">
            <EliteRideLogo
              variant="horizontal"
              size="sm"
              theme="dark"
              showTagline={false}
            />
          </div>
        </div>

        {/* Unboxed Metadata Kicker */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-emerald-400 mb-5">
          <span>Commonwealth of Dominica</span>
          <span aria-hidden="true" className="text-neutral-500">·</span>
          <span>Official Ride-Hailing Network</span>
          <span aria-hidden="true" className="text-neutral-500">·</span>
          <span>Licensed Entity #DOM-ER-2026</span>
        </div>

        {/* Hero Title with text-balance */}
        <h1
          style={{ fontSize: '43px' }}
          className="font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] text-balance"
        >
          On-Demand Ride-Hailing & Executive Chauffeur Services Across Dominica
        </h1>

        <p className="mt-5 text-sm sm:text-base lg:text-lg text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
          The smart way to get around Dominica. Reliable GPS-tracked pickups across Roseau, Portsmouth,
          Canefield (DCF), Douglas-Charles Airport (DOM), and mountain rainforest corridors.
        </p>

        {/* Local Dominica Trust Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-300">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>NBD MoBanking & mPay Supported</span>
          </div>
          <span aria-hidden="true" className="text-neutral-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>15% Dominica VAT Itemized</span>
          </div>
          <span aria-hidden="true" className="text-neutral-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>24/7 Police SOS Dispatch Active</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onStartBooking}
            className="px-7 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span>Book a Ride Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
