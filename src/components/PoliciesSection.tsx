import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, Scale, PhoneCall, CheckCircle2 } from 'lucide-react';

export const PoliciesSection: React.FC = () => {
  return (
    <section id="safety-policies" className="py-20 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
            Commonwealth of Dominica Compliance · #DOM-ER-2026
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Official Company Policies & Passenger Safety
          </h2>
          <p className="mt-3 text-neutral-400 text-sm">
            Elite Ride Dominica Ltd. is a licensed passenger transport network governed by the Ministry of Tourism,
            Civil Aviation and Sustainable Development, Commonwealth of Dominica.
          </p>
        </div>

        {/* 4 Policy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Policy 1: Cancellation Fee & Grace Period */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              15% Cancellation Fee & 2-Minute Grace Window
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
              Zero-Tolerance Harassment & 24/7 Police SOS
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
              <div>· 4WD Mountain SUVs & Airport Vans: Mandatory declaration for &gt;2 oversized bags or scuba dive crates.</div>
            </div>
          </div>

          {/* Policy 4: Dominica 15% VAT & Payment Transparency */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-emerald-400 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              15% Dominica VAT & NBD MoBanking Integration
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
    </section>
  );
};
