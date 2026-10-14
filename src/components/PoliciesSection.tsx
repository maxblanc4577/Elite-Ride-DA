import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, FileText, Scale, PhoneCall, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface PoliciesSectionProps {
  defaultCollapsed?: boolean;
}

export const PoliciesSection: React.FC<PoliciesSectionProps> = ({ defaultCollapsed = true }) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <section id="safety-policies" className="py-8 sm:py-12 bg-neutral-950 border-t border-neutral-800 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Collapsible Header Banner */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsCollapsed(!isCollapsed)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsCollapsed(!isCollapsed);
            }
          }}
          className="w-full text-left bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 rounded-3xl p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-lg group focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          aria-expanded={!isCollapsed}
          aria-controls="safety-policies-content"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold">
                  Commonwealth of Dominica Compliance · #DOM-ER-2026
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  4 Safety Pillars
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
                <span>Official Company Policies &amp; Passenger Safety</span>
              </h2>
              <p className="mt-1 text-neutral-400 text-xs line-clamp-1 sm:line-clamp-none">
                Elite Ride Dominica Ltd. is a licensed passenger transport network governed by the Ministry of Tourism &amp; Civil Aviation.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-medium text-neutral-400 group-hover:text-white hidden sm:inline transition-colors">
                {isCollapsed ? 'Click to Expand' : 'Click to Collapse'}
              </span>
              <div className="p-2 sm:px-3 sm:py-2 bg-neutral-800 group-hover:bg-emerald-950 text-neutral-300 group-hover:text-emerald-300 rounded-xl border border-neutral-700 group-hover:border-emerald-600/50 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm">
                {isCollapsed ? (
                  <>
                    <ChevronDown className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Expand Policies</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 text-neutral-300" />
                    <span className="hidden sm:inline">Collapse Policies</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick-Preview Summary Badges when Collapsed */}
          {isCollapsed && (
            <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-neutral-500 font-semibold mr-1">
                Policy Highlights:
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-amber-300">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>15% Cancellation Fee (2m grace)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Zero Tolerance &amp; 999 Police SOS</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300">
                <Scale className="w-3 h-3 text-neutral-400" />
                <span>Mountain Luggage Limits</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300">
                <FileText className="w-3 h-3 text-neutral-400" />
                <span>15% Dominica VAT &amp; NBD MoBanking</span>
              </span>
            </div>
          )}
        </div>

        {/* 4 Policy Pillars - Collapsible Content */}
        {!isCollapsed && (
          <div id="safety-policies-content" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Policy 1: Cancellation Fee & Grace Period */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 mb-4">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  15% Cancellation Fee &amp; 2-Minute Grace Window
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Once an Elite Ride driver has accepted and commenced dispatch towards your pickup coordinates, a <strong>15% cancellation fee</strong> applies to compensate the driver's mountain transit time and fuel expenditure.
                </p>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
                  <div>· <strong>0–2 Minute Grace Period:</strong> You may cancel without charge within 120 seconds of request.</div>
                  <div>· <strong>Driver Delay Waiver:</strong> If your assigned driver is more than 8 minutes behind initial ETA, cancellation is 100% free.</div>
                </div>
              </div>

              {/* Policy 2: Zero Tolerance Safety & Police SOS */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Zero-Tolerance Harassment &amp; 24/7 Police SOS
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Elite Ride enforces a strict zero-tolerance code for verbal abuse, physical harassment, intoxicated misconduct, and reckless mountain transit. All drivers undergo annual police record vetting.
                </p>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
                  <div>· <strong>Direct Police Dispatch:</strong> In-app SOS button links live telemetry to Commonwealth of Dominica Police Force (999).</div>
                  <div>· <strong>Mountain Safety Standards:</strong> Drivers maintain defensive driving speeds on rainy rainforest switchbacks.</div>
                </div>
              </div>

              {/* Policy 3: Heavy Baggage & Mountain Road Regulations */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-emerald-400 mb-4">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Mandatory Mountain Luggage Declaration
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Due to Dominica's steep volcanic topography and narrow mountain passes (e.g. Pont Cassé and Morne Prosper), vehicle cargo limits are strictly enforced for safe center of gravity.
                </p>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
                  <div>· Standard Sedans: Up to 2 check-in suitcases.</div>
                  <div>· 4WD Mountain SUVs &amp; Airport Vans: Mandatory declaration for &gt;2 oversized bags or scuba dive crates.</div>
                </div>
              </div>

              {/* Policy 4: Dominica 15% VAT & Payment Transparency */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-emerald-400 mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  15% Dominica VAT &amp; NBD MoBanking Integration
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Pursuant to the Dominica Value Added Tax Act, an official <strong>15% VAT</strong> is transparently itemized on every fare calculation and provided on digital receipts.
                </p>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
                  <div>· <strong>NBD MoBanking:</strong> Preferred national payment gateway with zero surcharge fees.</div>
                  <div>· <strong>Cash Fares:</strong> Drivers carry change in Eastern Caribbean Dollars (EC$) and accept US Dollars (USD).</div>
                </div>
              </div>
            </div>

            {/* Legal Footer Registration Badge */}
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Registered Commercial Entity: <strong>Elite Ride Dominica Ltd.</strong></span>
              </div>
              <div className="font-mono text-emerald-400">
                Registration #DOM-ER-2026 · Roseau, Dominica
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
