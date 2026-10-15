import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Car, CreditCard, FileText } from 'lucide-react';
import { AppView } from '../types/booking';
import { EliteRideLogo } from './EliteRideLogo';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onOpenLogoDesign?: () => void;
  onReplaySplash?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
}) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-900">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <EliteRideLogo
              variant="horizontal"
              size="md"
              theme="dark"
              showTagline={true}
              onClick={() => onNavigate('home')}
              className="cursor-pointer"
            />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Official on-demand ride-hailing and transit platform operating in the Commonwealth of Dominica under
              commercial registration <strong>#DOM-ER-2026</strong>.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Licensed &amp; Police Vetted Fleet</span>
            </div>
          </div>

          {/* Vehicle Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              Vehicle Categories
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <span className="text-neutral-300">Elite Standard Sedan</span> (Town Commutes, 4 Pax)
              </li>
              <li>
                <span className="text-neutral-300">Elite 4WD Mountain SUV</span> (Rainforest Roads, 5 Pax)
              </li>
              <li>
                <span className="text-neutral-300">Elite Shared Coaster</span> (Highway Corridor, 12 Pax)
              </li>
              <li>
                <span className="text-neutral-300">Airport VIP Transfer</span> (Douglas-Charles DOM, 6 Pax)
              </li>
            </ul>
          </div>

          {/* Payment Gateways & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              Local Payments &amp; Tax
            </h4>
            <ul className="text-xs space-y-2">
              <li>· Stripe Merchant Gateway (80% Driver Allocation)</li>
              <li>· National Bank of Dominica (NBD) MoBanking</li>
              <li>· mPay Mobile Wallet</li>
              <li>· XCD / USD Debit &amp; Credit Cards</li>
              <li>· Dominica 15% VAT Compliant Invoicing</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              Dispatch &amp; Operations
            </h4>
            <div className="text-xs space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Roseau Bayfront Center &amp; Melville Hall Airport Dispatch Pavilion, Dominica
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 Operations: +1 (767) 225-1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@elite-ride.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice & Modern Responsive Grid Navigation */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between text-xs text-neutral-500 gap-6">
          <div className="text-center lg:text-left">
            © {new Date().getFullYear()} Elite Ride Dominica Ltd. All rights reserved. Registration #DOM-ER-2026.
            <span className="block sm:inline text-neutral-400 sm:ml-2">Merchant Inquiries: info@elite-ride.org</span>
          </div>

          {/* Modern Responsive Grid Layout for Navigation */}
          <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigate('admin_portal')}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => onNavigate('driver_portal')}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-neutral-300 hover:text-white font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group"
            >
              <Car className="w-3.5 h-3.5 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Driver Portal</span>
            </button>

            <button
              onClick={() => onNavigate('policies')}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-neutral-300 hover:text-white font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group"
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>15% Policy</span>
            </button>

            <button
              onClick={() => onNavigate('policies')}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-neutral-300 hover:text-white font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-neutral-400 group-hover:scale-110 transition-transform" />
              <span>Terms of Use</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
