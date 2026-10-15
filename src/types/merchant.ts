export interface StripeMerchantProfile {
  merchantId: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  currency: 'XCD' | 'USD';
  status: 'active' | 'restricted' | 'pending';
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  driverDirectTransfers80: boolean;
  platformCommission20: boolean;
  mode: 'live' | 'test';
  settlementAccount: string;
  publishableKey: string;
  availableBalanceXCD: number;
  pendingBalanceXCD: number;
  lastLogin: string;
  registrationNumber: string;
}

export const DEFAULT_STRIPE_MERCHANT: StripeMerchantProfile = {
  merchantId: 'acct_1DOM2026ELITE',
  businessName: 'Elite Ride Dominica Ltd',
  email: 'info@elite-ride.org',
  phone: '+1 (767) 225-1234',
  country: 'DM (Commonwealth of Dominica)',
  currency: 'XCD',
  status: 'active',
  chargesEnabled: true,
  payoutsEnabled: true,
  driverDirectTransfers80: true,
  platformCommission20: true,
  mode: 'live',
  settlementAccount: 'National Bank of Dominica (NBD) · Acc ***5502',
  publishableKey: 'pk_live_51DOM2026ELITERIDE7781',
  availableBalanceXCD: 48920.50,
  pendingBalanceXCD: 5640.00,
  lastLogin: '2026-10-15 08:30 AST',
  registrationNumber: '#DOM-ER-2026',
};
