import React, { useState } from 'react';
import { X, Sparkles, Check, Download, Layers, ShieldCheck } from 'lucide-react';
import { EliteRideLogo } from './EliteRideLogo';

interface LogoDesignViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplaySplash?: () => void;
}

export const LogoDesignViewerModal: React.FC<LogoDesignViewerModalProps> = ({
  isOpen,
  onClose,
  onReplaySplash,
}) => {
  const [activeTab, setActiveTab] = useState<'badge' | 'dark' | 'light' | 'emblem'>('badge');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider mb-1">
              Official Identity Assets
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Elite Ride Dominica · Logo Design System
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Metallic aerodynamic speed streams with stylized slanted spine and Caribbean typography.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800/80 hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Variant Tabs */}
        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={() => setActiveTab('badge')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'badge'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Luxury Card Badge (Original)
          </button>
          <button
            onClick={() => setActiveTab('dark')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dark'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Dark Mode Lockup
          </button>
          <button
            onClick={() => setActiveTab('light')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'light'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Light Mode Lockup
          </button>
          <button
            onClick={() => setActiveTab('emblem')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'emblem'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Aerodynamic Emblem Mark
          </button>
        </div>

        {/* Display Canvas */}
        <div className="mt-6 rounded-2xl border border-neutral-800 p-8 sm:p-12 flex items-center justify-center min-h-[260px] bg-gradient-to-b from-neutral-950 to-neutral-900/60 relative overflow-hidden">
          {activeTab === 'badge' && (
            <div className="transform transition-transform hover:scale-105 duration-300">
              <EliteRideLogo variant="badge" size="lg" />
            </div>
          )}

          {activeTab === 'dark' && (
            <div className="transform transition-transform hover:scale-105 duration-300">
              <EliteRideLogo variant="full" size="xl" theme="dark" showTagline={true} />
            </div>
          )}

          {activeTab === 'light' && (
            <div className="p-8 rounded-2xl bg-slate-100 border border-slate-300 transform transition-transform hover:scale-105 duration-300">
              <EliteRideLogo variant="full" size="xl" theme="light" showTagline={true} />
            </div>
          )}

          {activeTab === 'emblem' && (
            <div className="flex flex-col items-center gap-4">
              <EliteRideLogo variant="mark" size="xl" theme="dark" />
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Five Aerodynamic Speed Streams & Slanted 'E' Core
              </span>
            </div>
          )}
        </div>

        {/* Design Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-neutral-400 font-medium block">Typography</span>
            <p className="font-mono text-white font-bold">Sans Black / 0.2em Spacing</p>
            <p className="text-[11px] text-neutral-400 italic">"Dominica's premier ride-sharing platform..."</p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-neutral-400 font-medium block">Color Palette</span>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-4 h-4 rounded-md bg-[#0a192f] border border-neutral-700" title="#0a192f Navy" />
              <span className="w-4 h-4 rounded-md bg-[#ffffff] border border-neutral-700" title="#ffffff Chrome White" />
              <span className="w-4 h-4 rounded-md bg-[#38bdf8] border border-neutral-700" title="#38bdf8 Sky" />
              <span className="w-4 h-4 rounded-md bg-[#10b981] border border-neutral-700" title="#10b981 Emerald" />
            </div>
            <p className="text-[10px] text-neutral-400 font-mono mt-1">Navy #0a192f · Emerald #10b981</p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-neutral-400 font-medium block">Certification</span>
            <p className="text-white font-semibold">Commonwealth of Dominica</p>
            <p className="text-[11px] text-emerald-400">Official Registered Transit Mark</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          {onReplaySplash && (
            <button
              onClick={() => {
                onClose();
                onReplaySplash();
              }}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Replay App Opening Screen</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-extrabold transition-all ml-auto cursor-pointer"
          >
            Continue to App
          </button>
        </div>
      </div>
    </div>
  );
};
