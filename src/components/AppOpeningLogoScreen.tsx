import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, MapPin, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import { EliteRideLogo } from './EliteRideLogo';

interface AppOpeningLogoScreenProps {
  onEnterApp: () => void;
  autoCloseDelayMs?: number;
}

export const AppOpeningLogoScreen: React.FC<AppOpeningLogoScreenProps> = ({
  onEnterApp,
  autoCloseDelayMs = 2800,
}) => {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState('Initializing Dominica Transit Fleet...');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / autoCloseDelayMs) * 100));
      setProgress(pct);

      if (pct < 35) {
        setPhaseText('Initializing Dominica Transit Fleet...');
      } else if (pct < 70) {
        setPhaseText('Connecting Real-Time GPS & Mountain Corridors...');
      } else if (pct < 95) {
        setPhaseText('Syncing NBD MoBanking & Island Security...');
      } else {
        setPhaseText('Welcome to Elite Ride Dominica');
      }

      if (pct >= 100) {
        clearInterval(interval);
        handleClose();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [autoCloseDelayMs]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onEnterApp();
    }, 350);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Elite Ride Dominica App Launch"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#060c18] via-neutral-950 to-[#040912] text-white px-4 transition-all duration-300 ${
        isClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Decorative Ambient Light Rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-emerald-500/15 rounded-full blur-[100px]" />
        
        {/* Subtle geometric speed grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
        {/* Kicker badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-7 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Commonwealth of Dominica · Official Transit</span>
        </div>

        {/* Central Logo Design Presentation */}
        <div className="relative group p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-neutral-900/90 via-neutral-900/70 to-neutral-950/90 border border-neutral-800 shadow-[0_20px_60px_-15px_rgba(2,132,199,0.3)] backdrop-blur-xl w-full">
          {/* Subtle Outer Neon Rim */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/30 via-emerald-500/20 to-sky-500/30 rounded-3xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity pointer-events-none" />

          <div className="relative flex flex-col items-center">
            {/* Logo Component in Full Display Mode */}
            <EliteRideLogo
              variant="full"
              size="xl"
              theme="dark"
              showTagline={true}
              className="transform transition-transform hover:scale-105 duration-300"
            />

            {/* Official Certification Stamp */}
            <div className="mt-6 pt-5 border-t border-neutral-800/80 w-full flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Licensed Network
              </span>
              <span className="text-neutral-500">|</span>
              <span className="text-sky-400 font-semibold">#DOM-ER-2026</span>
              <span className="text-neutral-500">|</span>
              <span className="flex items-center gap-1 text-neutral-300">
                <MapPin className="w-3 h-3 text-emerald-400" />
                Roseau
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress & Status Indicator */}
        <div className="w-full mt-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
              {phaseText}
            </span>
            <span className="font-mono text-emerald-400 font-semibold">{progress}%</span>
          </div>

          {/* Progress track */}
          <div className="h-1.5 w-full bg-neutral-800/90 rounded-full overflow-hidden p-0.5 border border-neutral-700/50">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-sky-400 to-emerald-300 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enter App Call-to-Action */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={handleClose}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-neutral-950 font-black text-sm tracking-wide rounded-2xl shadow-xl hover:shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Enter Elite Ride</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-4 text-[11px] text-neutral-500">
          Dominica&apos;s GPS-Guided Ride-Hailing, Chauffeur & Airport Network
        </p>
      </div>
    </div>
  );
};
