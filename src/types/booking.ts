import { VehicleTier } from '../data/dominicaData';

export type Currency = 'XCD' | 'USD';

export type AppView = 'book' | 'tracking' | 'admin_portal' | 'driver_portal' | 'policies';

export interface RiderProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  homeLocationId: string;
  preferredPayment: 'nbd_mobanking' | 'mpay' | 'card_xcd' | 'cash';
  nbdAccountNumber?: string;
  tripsCount: number;
}

export interface RideBookingData {
  pickupId: string;
  dropoffId: string;
  customPickup: string;
  customDropoff: string;
  hasStopover: boolean;
  stopoverId: string;
  vehicleTierId: string;
  isScheduled: boolean;
  scheduleDate: string;
  scheduleTime: string;
  passengers: number;
  heavyLuggageDeclared: boolean;
  paymentMethod: 'nbd_mobanking' | 'mpay' | 'card_xcd' | 'cash';
  nbdAccountNumber?: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  flightNumber: string;
  notes: string;
}

export interface FareCalculation {
  distanceMiles: number;
  estimatedMinutes: number;
  baseFeeXCD: number;
  distanceFeeXCD: number;
  subtotalXCD: number;
  vatXCD: number;
  totalXCD: number;
  totalUSD: number;
  tier: VehicleTier;
}

export interface ActiveDriver {
  id: string;
  name: string;
  rating: number;
  tripsCompleted: number;
  vehicleModel: string;
  licensePlate: string;
  phone: string;
  currentLat: number;
  currentLng: number;
}

export interface ActiveRide {
  id: string;
  booking: RideBookingData;
  tier: VehicleTier;
  fare: FareCalculation;
  driver: ActiveDriver;
  status: 'dispatched' | 'arrived_pickup' | 'in_transit' | 'completed' | 'cancelled';
  dispatchedAt: number;
  etaMinutes: number;
  pickupLabel: string;
  dropoffLabel: string;
  stopoverLabel?: string;
  cancelGracePeriodSeconds: number;
}
