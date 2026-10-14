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

  // If there's a stopover on the way, add extra distance
  if (booking.hasStopover && booking.stopoverId) {
    const extraMiles = getRouteMiles(booking.pickupId, booking.stopoverId) * 0.5;
    miles = parseFloat((miles + extraMiles).toFixed(1));
  }

  // If there are additional stop locations beyond the destination (up to 2 stops)
  if (booking.additionalStops && booking.additionalStops.length > 0) {
    let prevPoint = booking.dropoffId;
    for (const stopId of booking.additionalStops) {
      if (stopId) {
        const legDistance = getRouteMiles(prevPoint, stopId);
        miles = parseFloat((miles + legDistance).toFixed(1));
        prevPoint = stopId;
      }
    }
  }

  const baseFeeXCD = tier.baseFeeXCD;
  const distanceFeeXCD = parseFloat((miles * tier.ratePerMileXCD).toFixed(2));
  const subtotalXCD = parseFloat((baseFeeXCD + distanceFeeXCD).toFixed(2));
  const vatXCD = parseFloat((subtotalXCD * VAT_RATE).toFixed(2));
  const totalXCD = parseFloat((subtotalXCD + vatXCD).toFixed(2));
  const totalUSD = parseFloat((totalXCD / EXCHANGE_RATE_USD_TO_XCD).toFixed(2));

  // Approx minutes based on Dominica mountain terrain (~25-30 mph avg speed)
  const estimatedMinutes = Math.max(8, Math.round(miles * 2.1));

  // Split fare calculation if enabled or split count provided
  const splitCount = booking.splitPassengersCount && booking.splitPassengersCount > 1 ? booking.splitPassengersCount : 1;
  const splitFareXCD = parseFloat((totalXCD / splitCount).toFixed(2));
  const splitFareUSD = parseFloat((totalUSD / splitCount).toFixed(2));

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
    splitFareXCD,
    splitFareUSD,
  };
}

export function formatFare(amountXCD: number, currency: Currency): string {
  if (currency === 'USD') {
    const usd = (amountXCD / EXCHANGE_RATE_USD_TO_XCD).toFixed(2);
    return `$${usd} USD`;
  }
  return `EC$ ${amountXCD.toFixed(2)}`;
}
