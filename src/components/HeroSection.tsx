import React from 'react';
import { ArrowRight, ShieldCheck, Radio, Smartphone, Sparkles, Layers } from 'lucide-react';
import { EliteRideLogo } from './EliteRideLogo';

interface HeroSectionProps {
  onStartBooking: () => void;
  onOpenDriverPortal: () => void;
  onOpenRiderSignUp?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenDriverSignUp?: () => void;
  onOpenLogoDesign?: () => void;
  onReplaySplash?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBooking,
  onOpenDriverPortal,
  onOpenRiderSignUp,
  onOpenAdminPortal,
  onOpenDriverSignUp,
  onOpenLogoDesign,
  onReplaySplash,
}) => {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-neutral-950 py-10 sm:py-16">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Prominent Official Logo Design Showcase */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative group p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-neutral-900/90 via-neutral-900/70 to-neutral-950 border border-neutral-800 shadow-2xl backdrop-blur-md max-w-md w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/20 via-emerald-500/20 to-sky-500/20 rounded-3xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex flex-col items-center">
              <EliteRideLogo
                variant="full"
                size="lg"
                theme="dark"
                showTagline={true}
                className="transform transition-transform duration-300 group-hover:scale-105"
              />
              
              <div className="mt-4 flex items-center justify-center gap-2 pt-3 border-t border-neutral-800/80 w-full text-[11px] text-neutral-400">
                {onOpenLogoDesign && (
                  <button
                    onClick={onOpenLogoDesign}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Logo Design Specs</span>
                  </button>
                )}
                {onReplaySplash && (
                  <>
                    <span className="text-neutral-600">·</span>
                    <button
                      onClick={onReplaySplash}
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors font-medium cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Replay Opening Intro</span>
                    </button>
                  </>
                )}
              </div>
            </div>
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
