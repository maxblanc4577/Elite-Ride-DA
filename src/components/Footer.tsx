import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { AppView } from '../types/booking';
import { EliteRideLogo } from './EliteRideLogo';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
              onClick={() => onNavigate('book')}
              className="cursor-pointer"
            />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Official on-demand ride-hailing and transit platform operating in the Commonwealth of Dominica under
              commercial registration <strong>#DOM-ER-2026</strong>.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Licensed & Police Vetted Fleet</span>
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
              Local Payments & Tax
            </h4>
            <ul className="text-xs space-y-2">
              <li>· National Bank of Dominica (NBD) MoBanking</li>
              <li>· mPay Mobile Wallet</li>
              <li>· XCD Debit / Credit Cards</li>
              <li>· Cash Fares in EC$ (XCD) and USD</li>
              <li>· 15% Dominica VAT transparently itemized</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              Dispatch & Operations
            </h4>
            <div className="text-xs space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Roseau Bayfront Center & Melville Hall Airport Dispatch Pavilion, Dominica
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 Operations: +1 (767) 225-1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@elite-ride.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} Elite Ride Dominica Ltd. All rights reserved. Registration #DOM-ER-2026.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('admin_portal')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
            >
              Admin Portal (Driver Console)
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('driver_portal')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Driver Partner Portal
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('policies')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              15% Cancellation Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('policies')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
