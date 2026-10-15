export interface DominicaLocation {
  id: string;
  name: string;
  area: 'West' | 'North' | 'South' | 'East' | 'Central';
  type: 'airport' | 'town' | 'resort' | 'hub';
  isCommonAirport: boolean;
}

export const DOMINICA_LOCATIONS: DominicaLocation[] = [
  { id: 'ROSEAU', name: 'Roseau (Capital)', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'DOM', name: 'Douglas-Charles Airport (DOM)', area: 'North', type: 'airport', isCommonAirport: true },
  { id: 'DCF', name: 'Canefield Airport (DCF)', area: 'West', type: 'airport', isCommonAirport: true },
  { id: 'ANSE_DU_ME', name: 'Anse du Mé', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'ATKINSON', name: 'Atkinson', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'BAGATELLE', name: 'Bagatelle', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'BATAKA', name: 'Bataka', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'BELLES', name: 'Belles', area: 'Central', type: 'town', isCommonAirport: false },
  { id: 'BELLEVUE_CHOPIN', name: 'Bellevue Chopin', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'BENSE', name: 'Bense', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'BIOCHE', name: 'Bioche', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'BOETICA', name: 'Boetica', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'BORNES', name: 'Bornes', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'CALIBISHIE', name: 'Calibishie', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'CAMPBELL', name: 'Campbell', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'CANEFIELD', name: 'Canefield', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'CAPUCIN', name: 'Capucin', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'CASTLE_BRUCE', name: 'Castle Bruce', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'CLIFTON', name: 'Clifton', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'COLIHAUT', name: 'Colihaut', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'COTTAGE', name: 'Cottage', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'COULIBISTRIE', name: 'Coulibistrie', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'DELICES', name: 'Delices', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'DUBLANC', name: 'Dublanc', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'DUBUC', name: 'Dubuc', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'EGGLESTON', name: 'Eggleston', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'FOND_CANI', name: 'Fond Cani', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'FOND_ST_JEAN', name: 'Fond St. Jean', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'GALION', name: 'Galion', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'GIRAUDEL', name: 'Giraudel', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'GOOD_HOPE', name: 'Good Hope', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'GOODWILL', name: 'Goodwill', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'GRAND_BAY', name: 'Grand Bay (Berekua)', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'GRAND_FOND', name: 'Grand Fond', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'LA_PLAINE', name: 'La Plaine', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'LAUDAT', name: 'Laudat', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'LAYOU', name: 'Layou', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'LOUBIERE', name: 'Loubiere', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'MAHAUT', name: 'Mahaut', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'MARIGOT', name: 'Marigot', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'MASSACRE', name: 'Massacre', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'MERO', name: 'Mero', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'MORNE_DANIEL', name: 'Morne Daniel', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'MORNE_PROSPER', name: 'Morne Prosper', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'PAIX_BOUCHE', name: 'Paix Bouche', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'PENVILLE', name: 'Penville', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'PETITE_SAVANNE', name: 'Petite Savanne', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'PETIT_SOUFRIERE', name: 'Petit Soufrière', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'PICHELIN', name: 'Pichelin', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'POINTE_MICHEL', name: 'Pointe Michel', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'PONT_CASSE', name: 'Pont Cassé', area: 'Central', type: 'hub', isCommonAirport: false },
  { id: 'PORTSMOUTH', name: 'Portsmouth (Grand-Anse)', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'ROSALIE', name: 'Rosalie', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'SAINT_JOSEPH', name: 'Saint Joseph', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'SALISBURY', name: 'Salisbury (Barroui)', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'SALYBIA', name: 'Salybia', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'SAN_SAUVEUR', name: 'San Sauveur', area: 'East', type: 'town', isCommonAirport: false },
  { id: 'SCOTTS_HEAD', name: 'Scotts Head', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'SOUFRIERE', name: 'Soufrière', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'STOCK_FARM', name: 'Stock Farm', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'STOWE', name: 'Stowe', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'TANETANE', name: 'Tanetane', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'TAROU', name: 'Tarou', area: 'West', type: 'town', isCommonAirport: false },
  { id: 'THIBAUD', name: 'Thibaud', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'TOUCARI', name: 'Toucari', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'TRAFALGAR', name: 'Trafalgar', area: 'South', type: 'town', isCommonAirport: false },
  { id: 'VIEILLE_CASE', name: 'Vieille Case', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'WARNER', name: 'Warner', area: 'Central', type: 'town', isCommonAirport: false },
  { id: 'WESLEY', name: 'Wesley (La Soie)', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'WOODFORD_HILL', name: 'Woodford Hill', area: 'North', type: 'town', isCommonAirport: false },
  { id: 'WOTTEN_WAVEN', name: 'Wotten Waven', area: 'South', type: 'town', isCommonAirport: false },
];

export interface VehicleTier {
  id: string;
  name: string;
  badge: string;
  description: string;
  capacityPassengers: number;
  capacityLuggage: number;
  baseFeeXCD: number;
  ratePerMileXCD: number;
  image: string;
  recommended: string;
  features: string[];
}

export const VEHICLE_TIERS: VehicleTier[] = [
  {
    id: 'standard-sedan',
    name: 'Elite Standard Sedan',
    badge: 'Everyday Commutes',
    description: 'Comfortable air-conditioned standard passenger rides for town commutes and coastal highways.',
    capacityPassengers: 4,
    capacityLuggage: 2,
    baseFeeXCD: 1.00,
    ratePerMileXCD: 5.00,
    image: '/src/assets/images/airport_vip_meet_greet_1791810373743.jpg',
    recommended: 'Town commutes in Roseau, Portsmouth & short coastal hops',
    features: ['Up to 4 Passengers', 'Compact Trunk Space', 'Whisper Climate Control', 'GPS Live Tracking'],
  },
  {
    id: 'mountain-4wd-suv',
    name: 'Elite 4WD Mountain SUV',
    badge: 'Dominica Terrain Essential',
    description: 'High ground clearance and permanent 4WD engineered specifically for Dominica’s mountainous terrain, steep gradients, and wet rainforest switchbacks.',
    capacityPassengers: 5,
    capacityLuggage: 4,
    baseFeeXCD: 1.00,
    ratePerMileXCD: 5.00,
    image: '/src/assets/images/fleet_luxury_suv_prado_1791810343575.jpg',
    recommended: 'Steep hills, Pont Cassé rainforest traverse, Soufrière & villa access',
    features: ['Full-Time 4WD High/Low', 'Heavy-Duty Mountain Suspension', 'Extra Trunk Capacity', 'Mountain Certified Driver'],
  },
  {
    id: 'shared-coaster',
    name: 'Elite Shared Coaster',
    badge: 'Budget Group Transit',
    description: 'Shared passenger coaster minibus connecting major communities along the primary highway corridor at economical per-rider rates.',
    capacityPassengers: 12,
    capacityLuggage: 8,
    baseFeeXCD: 1.00,
    ratePerMileXCD: 5.00,
    image: '/src/assets/images/elite_shared_coaster_1791825622539.jpg',
    recommended: 'Group travel, budget commuters along Roseau — Portsmouth highway',
    features: ['Up to 12 Passengers', 'Overhead Luggage Racks', 'High-Frequency Express Stops', 'Economical Fare Split'],
  },
  {
    id: 'airport-vip-transfer',
    name: 'Airport VIP Transfer',
    badge: 'DOM & DCF Specialists',
    description: 'Spacious executive vehicle with dedicated luggage capacity, flight radar tracking, curbside baggage assistance, and cold refreshments.',
    capacityPassengers: 6,
    capacityLuggage: 7,
    baseFeeXCD: 1.00,
    ratePerMileXCD: 5.00,
    image: '/src/assets/images/fleet_executive_vip_van_1791810353306.jpg',
    recommended: 'Douglas-Charles (DOM) arrivals, Canefield (DCF), resort luggage transfer',
    features: ['Flight Tracking Radar', 'Generous Luggage Cargo Space', 'Chilled Bottled Water', 'Tarmac Name Placard'],
  },
];

export interface PaymentMethodOption {
  id: 'nbd_mobanking' | 'mpay' | 'card_xcd' | 'cash';
  name: string;
  description: string;
  isDominicaPreferred?: boolean;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'nbd_mobanking',
    name: 'NBD MoBanking',
    description: 'National Bank of Dominica mobile account — Instant Quick Pay shortcut',
    isDominicaPreferred: true,
  },
  {
    id: 'mpay',
    name: 'mPay Wallet',
    description: 'Local Dominica mobile wallet transfer',
  },
  {
    id: 'card_xcd',
    name: 'Debit / Credit Card (XCD)',
    description: 'Visa, MasterCard, or local debit card',
  },
  {
    id: 'cash',
    name: 'Cash Payment',
    description: 'Pay driver directly in EC$ (XCD) or USD upon drop-off',
  },
];

// Distance matrix in miles (Dominica route calculations)
export function getRouteMiles(fromId: string, toId: string): number {
  if (fromId === toId) return 1.5;

  const pairs: Record<string, number> = {
    'ROSEAU-DCF': 3.5,
    'ROSEAU-PORTSMOUTH': 27.5,
    'ROSEAU-DOM': 34.0,
    'ROSEAU-PONT_CASSE': 9.2,
    'ROSEAU-SOUFRIERE': 8.5,
    'ROSEAU-SCOTTS_HEAD': 11.2,
    'ROSEAU-COULIBRI_RIDGE': 11.5,
    'ROSEAU-FORT_YOUNG': 0.8,
    'ROSEAU-SECRET_BAY': 28.0,
    'ROSEAU-INTERCON_CABRITS': 29.5,
    'ROSEAU-CALIBISHIE': 38.0,
    'ROSEAU-MAHAUT': 5.0,
    'ROSEAU-SALISBURY': 14.0,
    'ROSEAU-ST_JOSEPH': 10.5,

    'DOM-PORTSMOUTH': 23.5,
    'DOM-SECRET_BAY': 24.5,
    'DOM-INTERCON_CABRITS': 26.0,
    'DOM-CALIBISHIE': 10.5,
    'DOM-MARIGOT': 2.5,
    'DOM-PONT_CASSE': 25.0,
    'DOM-SOUFRIERE': 42.0,
    'DOM-COULIBRI_RIDGE': 45.0,

    'DCF-PORTSMOUTH': 24.5,
    'DCF-SECRET_BAY': 25.0,
    'DCF-INTERCON_CABRITS': 26.5,
    'DCF-PONT_CASSE': 10.5,

    'PORTSMOUTH-SECRET_BAY': 2.5,
    'PORTSMOUTH-INTERCON_CABRITS': 2.0,
    'PORTSMOUTH-CALIBISHIE': 14.5,
  };

  const key1 = `${fromId}-${toId}`;
  const key2 = `${toId}-${fromId}`;

  if (pairs[key1]) return pairs[key1];
  if (pairs[key2]) return pairs[key2];

  const loc1 = DOMINICA_LOCATIONS.find((l) => l.id === fromId);
  const loc2 = DOMINICA_LOCATIONS.find((l) => l.id === toId);

  if (loc1 && loc2) {
    if (loc1.area === loc2.area) {
      return 4.5;
    }
    if ((loc1.area === 'South' && loc2.area === 'North') || (loc1.area === 'North' && loc2.area === 'South')) {
      return 33.0;
    }
    if ((loc1.area === 'South' && loc2.area === 'East') || (loc1.area === 'East' && loc2.area === 'South')) {
      return 22.0;
    }
    if ((loc1.area === 'West' && loc2.area === 'East') || (loc1.area === 'East' && loc2.area === 'West')) {
      return 18.5;
    }
    if ((loc1.area === 'North' && loc2.area === 'East') || (loc1.area === 'East' && loc2.area === 'North')) {
      return 14.0;
    }
    if ((loc1.area === 'South' && loc2.area === 'West') || (loc1.area === 'West' && loc2.area === 'South')) {
      return 8.5;
    }
    if (loc1.area === 'Central' || loc2.area === 'Central') {
      return 12.0;
    }
  }

  // Default average based on areas
  return 15.0;
}

export const VAT_RATE = 0.15; // 15% Dominica VAT
export const EXCHANGE_RATE_USD_TO_XCD = 2.70;

export interface EliteEstimationLocationMeta {
  id: string;
  name: string;
  shortName: string;
  district: string;
  travelTime: string;
  minutesRemaining: number;
  distanceMiles: number;
  highwayCorridor: string;
  streetViewImage: string;
  compass: string;
  elevation: string;
  speed: string;
  roadType: string;
  coordinates: { x: number; y: number };
  pathD: string;
}

export const ELITE_ESTIMATION_LOCATIONS_META: EliteEstimationLocationMeta[] = [
  {
    id: 'DOM',
    name: 'Douglas-Charles Airport (DOM)',
    shortName: 'Douglas-Charles (DOM)',
    district: 'St. Andrew',
    travelTime: '55 mins',
    minutesRemaining: 55,
    distanceMiles: 34.0,
    highwayCorridor: 'Nicholas Liverpool Highway · North East Pass',
    streetViewImage: '/src/assets/images/dominica_street_view_rainforest_1791833359756.jpg',
    compass: '038° NE',
    elevation: '24m ASL',
    speed: '65 km/h',
    roadType: 'Airport Express Highway',
    coordinates: { x: 490, y: 110 },
    pathD: 'M 240,480 C 260,390 320,290 410,210 S 480,140 490,110',
  },
  {
    id: 'PORTSMOUTH',
    name: 'Portsmouth (Grand-Anse)',
    shortName: 'Portsmouth',
    district: 'St. John',
    travelTime: '45 mins',
    minutesRemaining: 45,
    distanceMiles: 27.5,
    highwayCorridor: 'E.O. Leblanc Coastal Highway · North West Pass',
    streetViewImage: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    compass: '335° NW',
    elevation: '8m ASL',
    speed: '58 km/h',
    roadType: 'Coastal 2-Lane Highway',
    coordinates: { x: 190, y: 150 },
    pathD: 'M 240,480 C 210,380 200,280 195,200 S 190,165 190,150',
  },
  {
    id: 'ROSEAU',
    name: 'Roseau (Capital)',
    shortName: 'Roseau',
    district: 'St. George',
    travelTime: '8 mins',
    minutesRemaining: 8,
    distanceMiles: 1.5,
    highwayCorridor: 'Dame Eugenia Charles Blvd & Bayfront',
    streetViewImage: '/src/assets/images/dominica_street_view_town_1791833375166.jpg',
    compass: '184° S',
    elevation: '6m ASL',
    speed: '28 km/h',
    roadType: 'Capital Waterfront Boulevard',
    coordinates: { x: 240, y: 480 },
    pathD: 'M 240,480 C 242,475 245,470 248,475 S 240,482 240,480',
  },
  {
    id: 'DCF',
    name: 'Canefield Airport (DCF)',
    shortName: 'Canefield (DCF)',
    district: 'St. Paul',
    travelTime: '12 mins',
    minutesRemaining: 12,
    distanceMiles: 3.5,
    highwayCorridor: 'E.O. Leblanc Highway · South West Gateway',
    streetViewImage: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    compass: '345° NNW',
    elevation: '4m ASL',
    speed: '50 km/h',
    roadType: 'Coastal Highway Corridor',
    coordinates: { x: 220, y: 420 },
    pathD: 'M 240,480 C 235,460 225,440 220,420',
  },
  {
    id: 'PONT_CASSE',
    name: 'Pont Cassé',
    shortName: 'Pont Cassé',
    district: 'St. Paul',
    travelTime: '22 mins',
    minutesRemaining: 22,
    distanceMiles: 9.2,
    highwayCorridor: 'Imperial Road · Central Rainforest Pass',
    streetViewImage: '/src/assets/images/dominica_street_view_rainforest_1791833359756.jpg',
    compass: '042° NE',
    elevation: '485m ASL',
    speed: '42 km/h',
    roadType: 'Highland Mountain Switchbacks',
    coordinates: { x: 310, y: 350 },
    pathD: 'M 240,480 C 265,430 290,390 310,350',
  },
  {
    id: 'SOUFRIERE',
    name: 'Soufrière',
    shortName: 'Soufrière',
    district: 'St. Mark',
    travelTime: '20 mins',
    minutesRemaining: 20,
    distanceMiles: 8.5,
    highwayCorridor: 'South Coast Scenic Corridor · Marine Reserve',
    streetViewImage: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    compass: '165° SSE',
    elevation: '15m ASL',
    speed: '45 km/h',
    roadType: 'South Coastal Ridge Road',
    coordinates: { x: 260, y: 550 },
    pathD: 'M 240,480 C 250,505 255,530 260,550',
  },
  {
    id: 'SCOTTS_HEAD',
    name: 'Scotts Head',
    shortName: 'Scotts Head',
    district: 'St. Mark',
    travelTime: '28 mins',
    minutesRemaining: 28,
    distanceMiles: 11.2,
    highwayCorridor: 'South Peninsula Road · Soufriere Bay',
    streetViewImage: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    compass: '172° S',
    elevation: '3m ASL',
    speed: '40 km/h',
    roadType: 'Peninsula Coastal Road',
    coordinates: { x: 250, y: 580 },
    pathD: 'M 240,480 C 250,505 260,545 250,580',
  },
  {
    id: 'CASTLE_BRUCE',
    name: 'Castle Bruce',
    shortName: 'Castle Bruce',
    district: 'St. David',
    travelTime: '38 mins',
    minutesRemaining: 38,
    distanceMiles: 19.5,
    highwayCorridor: 'East Coast Highway · Kalinago Territory Approach',
    streetViewImage: '/src/assets/images/dominica_street_view_rainforest_1791833359756.jpg',
    compass: '075° ENE',
    elevation: '95m ASL',
    speed: '48 km/h',
    roadType: 'East Mountain Ridge',
    coordinates: { x: 440, y: 310 },
    pathD: 'M 240,480 C 280,410 330,360 440,310',
  },
  {
    id: 'SALISBURY',
    name: 'Salisbury (Barroui)',
    shortName: 'Salisbury',
    district: 'St. Joseph',
    travelTime: '26 mins',
    minutesRemaining: 26,
    distanceMiles: 14.0,
    highwayCorridor: 'E.O. Leblanc Coastal Highway · Central West Coast',
    streetViewImage: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    compass: '330° NW',
    elevation: '10m ASL',
    speed: '55 km/h',
    roadType: 'West Coastal Highway',
    coordinates: { x: 200, y: 290 },
    pathD: 'M 240,480 C 220,420 210,350 200,290',
  },
  {
    id: 'MERO',
    name: 'Mero Beach',
    shortName: 'Mero',
    district: 'St. Joseph',
    travelTime: '22 mins',
    minutesRemaining: 22,
    distanceMiles: 11.5,
    highwayCorridor: 'E.O. Leblanc Coastal Highway · Silver Sand Shore',
    streetViewImage: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    compass: '332° NW',
    elevation: '5m ASL',
    speed: '56 km/h',
    roadType: 'West Coastal Highway',
    coordinates: { x: 205, y: 320 },
    pathD: 'M 240,480 C 225,430 215,370 205,320',
  },
  {
    id: 'CALIBISHIE',
    name: 'Calibishie',
    shortName: 'Calibishie',
    district: 'St. Andrew',
    travelTime: '60 mins',
    minutesRemaining: 60,
    distanceMiles: 38.0,
    highwayCorridor: 'North Coast Red Rocks Corridor',
    streetViewImage: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    compass: '015° NNE',
    elevation: '18m ASL',
    speed: '50 km/h',
    roadType: 'Northern Scenic Coastal Highway',
    coordinates: { x: 440, y: 80 },
    pathD: 'M 240,480 C 280,380 370,250 490,110 S 450,90 440,80',
  },
  {
    id: 'GRAND_BAY',
    name: 'Grand Bay (Berekua)',
    shortName: 'Grand Bay',
    district: 'St. Patrick',
    travelTime: '32 mins',
    minutesRemaining: 32,
    distanceMiles: 13.5,
    highwayCorridor: 'South East Highway · Geneva Valley',
    streetViewImage: '/src/assets/images/dominica_street_view_rainforest_1791833359756.jpg',
    compass: '145° SE',
    elevation: '120m ASL',
    speed: '44 km/h',
    roadType: 'South East Mountain Corridor',
    coordinates: { x: 330, y: 540 },
    pathD: 'M 240,480 C 270,500 300,520 330,540',
  },
  {
    id: 'MARIGOT',
    name: 'Marigot',
    shortName: 'Marigot',
    district: 'St. Andrew',
    travelTime: '52 mins',
    minutesRemaining: 52,
    distanceMiles: 32.5,
    highwayCorridor: 'Nicholas Liverpool Highway · Marigot Bay',
    streetViewImage: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    compass: '035° NE',
    elevation: '14m ASL',
    speed: '60 km/h',
    roadType: 'North East Coastal Highway',
    coordinates: { x: 470, y: 140 },
    pathD: 'M 240,480 C 270,390 350,280 440,180 S 465,150 470,140',
  },
  {
    id: 'SALYBIA',
    name: 'Salybia (Kalinago Barana Autê)',
    shortName: 'Salybia',
    district: 'St. David',
    travelTime: '48 mins',
    minutesRemaining: 48,
    distanceMiles: 26.0,
    highwayCorridor: 'Kalinago Heritage Highway',
    streetViewImage: '/src/assets/images/dominica_street_view_rainforest_1791833359756.jpg',
    compass: '065° ENE',
    elevation: '70m ASL',
    speed: '45 km/h',
    roadType: 'Indigenous Territory Scenic Route',
    coordinates: { x: 470, y: 250 },
    pathD: 'M 240,480 C 290,410 370,330 470,250',
  },
];

export function resolveEliteLocationMeta(queryOrId?: string): EliteEstimationLocationMeta {
  if (!queryOrId) return ELITE_ESTIMATION_LOCATIONS_META[0];
  const q = queryOrId.toLowerCase().trim();
  const direct = ELITE_ESTIMATION_LOCATIONS_META.find(
    (item) => item.id.toLowerCase() === q || item.name.toLowerCase() === q || item.shortName.toLowerCase() === q
  );
  if (direct) return direct;

  const partial = ELITE_ESTIMATION_LOCATIONS_META.find(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.shortName.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
  );
  if (partial) return partial;

  const domLoc = DOMINICA_LOCATIONS.find((l) => l.id.toLowerCase() === q || l.name.toLowerCase().includes(q));
  const name = domLoc ? domLoc.name : queryOrId;
  const miles = domLoc ? getRouteMiles('ROSEAU', domLoc.id) : 15.0;
  const minutes = Math.max(8, Math.round(miles * 1.6));
  return {
    id: domLoc ? domLoc.id : 'CUSTOM',
    name,
    shortName: name.split(' ')[0] || name,
    district: domLoc?.area ? `Dominica (${domLoc.area})` : 'Commonwealth of Dominica',
    travelTime: `${minutes} mins`,
    minutesRemaining: minutes,
    distanceMiles: miles,
    highwayCorridor: 'Commonwealth Island Highway',
    streetViewImage: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    compass: '350° N',
    elevation: '40m ASL',
    speed: '45 km/h',
    roadType: 'Dominica Island Corridor',
    coordinates: { x: 260, y: 380 },
    pathD: 'M 240,480 Q 250,420 260,380',
  };
}

