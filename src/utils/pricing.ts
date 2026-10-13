import {
  VEHICLE_TIERS,
  getRouteMiles,
  VAT_RATE,
  EXCHANGE_RATE_USD_TO_XCD,
  VehicleTier,
} from '../data/dominicaData';
import { Currency, FareCalculation, RideBookingData } from '../types/booking';

export function calculateRideFare(booking: RideBookingData): FareCalculation {
  const tier = VEHICLE_TIERS.find((t) => t.id === booking.vehicleTierId) || VEHICLE_TIERS[0];
  let miles = getRouteMiles(booking.pickupId, booking.dropoffId);

  // If there's a stopover, add ~35% extra mileage & wait time
  if (booking.hasStopover && booking.stopoverId) {
    const extraMiles = getRouteMiles(booking.pickupId, booking.stopoverId) * 0.5;
    miles = parseFloat((miles + extraMiles).toFixed(1));
  }

  const baseFeeXCD = tier.baseFeeXCD;
  const distanceFeeXCD = parseFloat((miles * tier.ratePerMileXCD).toFixed(2));
  const subtotalXCD = parseFloat((baseFeeXCD + distanceFeeXCD).toFixed(2));
  const vatXCD = parseFloat((subtotalXCD * VAT_RATE).toFixed(2));
  const totalXCD = parseFloat((subtotalXCD + vatXCD).toFixed(2));
  const totalUSD = parseFloat((totalXCD / EXCHANGE_RATE_USD_TO_XCD).toFixed(2));

  // Approx minutes based on Dominica mountain terrain (~25-30 mph avg speed)
  const estimatedMinutes = Math.max(8, Math.round(miles * 2.1));

  return {
    distanceMiles: miles,
    estimatedMinutes,
    baseFeeXCD,
    distanceFeeXCD,
    subtotalXCD,
    vatXCD,
    totalXCD,
    totalUSD,
    tier,
  };
}

export function formatFare(amountXCD: number, currency: Currency): string {
  if (currency === 'USD') {
    const usd = (amountXCD / EXCHANGE_RATE_USD_TO_XCD).toFixed(2);
    return `$${usd} USD`;
  }
  return `EC$ ${amountXCD.toFixed(2)}`;
}
