export type SupportedLanguage = 'en' | 'fr' | 'es' | 'ht';

export interface TranslationStrings {
  home: string;
  bookRide: string;
  tracking: string;
  adminPortal: string;
  driverPortal: string;
  safetyPolicies: string;
  riderSignUp: string;
  driverSignUp: string;
  bookRideNow: string;
  trackActiveRide: string;
  pickupLocation: string;
  destination: string;
  scenicStopover: string;
  vehicleTier: string;
  selectTier: string;
  fareBreakdown: string;
  confirmBooking: string;
  confirmPaymentWithStripe: string;
  driverConsole: string;
  language: string;
  themeDay: string;
  themeNight: string;
  accessibilityMode: string;
  topRatedDrivers: string;
  driverVettingTagline: string;
  revenueDashboard: string;
  driverShare80: string;
  platformShare20: string;
  exportCsv: string;
  stripeMerchantStatus: string;
  liveGpsStreetView: string;
  emergencySOS: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    home: 'Home',
    bookRide: 'Book a Ride',
    tracking: 'Ride GPS Tracking',
    adminPortal: 'Admin Portal',
    driverPortal: 'Driver Portal',
    safetyPolicies: 'Safety & Policies',
    riderSignUp: 'Rider Sign Up',
    driverSignUp: 'Driver Sign Up',
    bookRideNow: 'Book Chauffeur Ride',
    trackActiveRide: 'Track Active Ride',
    pickupLocation: 'Dominica Pickup Location',
    destination: 'Dominica Destination',
    scenicStopover: 'Scenic Stopover',
    vehicleTier: 'Vehicle Class & Comfort Tier',
    selectTier: 'Select Chauffeur Tier',
    fareBreakdown: 'Guaranteed Fare Calculation',
    confirmBooking: 'Confirm & Dispatch Chauffeur',
    confirmPaymentWithStripe: 'Pay Securely via Stripe Card Merchant',
    driverConsole: 'Active Driver Console',
    language: 'Language',
    themeDay: 'Day Mode (Light)',
    themeNight: 'Elite Night (Dark)',
    accessibilityMode: 'Accessibility Contrast Mode',
    topRatedDrivers: 'Top Rated Dominica Chauffeurs',
    driverVettingTagline: 'Vetted, licensed professionals rated by verified riders across Dominica',
    revenueDashboard: '80/20 Driver Revenue Dashboard',
    driverShare80: '80% Driver Payout Share',
    platformShare20: '20% Platform Commission',
    exportCsv: 'Export Month CSV',
    stripeMerchantStatus: 'Stripe Merchant Gateway Active',
    liveGpsStreetView: 'Live GPS & Street View Radar',
    emergencySOS: 'Dominica Police 999 SOS',
  },
  fr: {
    home: 'Accueil',
    bookRide: 'Réserver un trajet',
    tracking: 'Suivi GPS en direct',
    adminPortal: 'Portail Administrateur',
    driverPortal: 'Portail Chauffeur',
    safetyPolicies: 'Sécurité & Politiques',
    riderSignUp: 'Inscription Passager',
    driverSignUp: 'Devenir Chauffeur',
    bookRideNow: 'Commander un Chauffeur',
    trackActiveRide: 'Suivre la Course Active',
    pickupLocation: 'Lieu de prise en charge',
    destination: 'Destination en Dominique',
    scenicStopover: 'Arrêt Panoramique',
    vehicleTier: 'Catégorie de véhicule',
    selectTier: 'Choisir la catégorie',
    fareBreakdown: 'Calcul garanti du tarif',
    confirmBooking: 'Confirmer & Réserver',
    confirmPaymentWithStripe: 'Paiement Sécurisé Stripe',
    driverConsole: 'Console Chauffeur',
    language: 'Langue',
    themeDay: 'Mode Jour (Clair)',
    themeNight: 'Nuit Élite (Sombre)',
    accessibilityMode: 'Mode Accessibilité & Contraste',
    topRatedDrivers: 'Chauffeurs les Mieux Notés de la Dominique',
    driverVettingTagline: 'Professionnels certifiés évalués par des passagers authentifiés',
    revenueDashboard: 'Tableau de Revenus Partage 80/20',
    driverShare80: '80% Revenu Chauffeur',
    platformShare20: '20% Commission Plateforme',
    exportCsv: 'Exporter CSV Mensuel',
    stripeMerchantStatus: 'Passerelle Marchande Stripe Active',
    liveGpsStreetView: 'Radar GPS & Vue Panoramique',
    emergencySOS: 'SOS Police Dominique 999',
  },
  es: {
    home: 'Inicio',
    bookRide: 'Reservar Viaje',
    tracking: 'Seguimiento GPS en Vivo',
    adminPortal: 'Portal de Administración',
    driverPortal: 'Portal del Conductor',
    safetyPolicies: 'Seguridad y Políticas',
    riderSignUp: 'Registro de Pasajero',
    driverSignUp: 'Registro de Conductor',
    bookRideNow: 'Solicitar Chofer Élite',
    trackActiveRide: 'Rastrear Viaje Activo',
    pickupLocation: 'Punto de recogida',
    destination: 'Destino en Dominica',
    scenicStopover: 'Parada Panorámica',
    vehicleTier: 'Gama de Vehículo',
    selectTier: 'Seleccionar Categoría',
    fareBreakdown: 'Cálculo de Tarifa Garantizada',
    confirmBooking: 'Confirmar y Despachar',
    confirmPaymentWithStripe: 'Pago Seguro con Tarjeta Stripe',
    driverConsole: 'Consola del Conductor',
    language: 'Idioma',
    themeDay: 'Modo Día (Claro)',
    themeNight: 'Noche Élite (Oscuro)',
    accessibilityMode: 'Modo de Accesibilidad y Contraste',
    topRatedDrivers: 'Chóferes Mejor Calificados de Dominica',
    driverVettingTagline: 'Profesionales examinados calificados por pasajeros reales',
    revenueDashboard: 'Panel de Ingresos División 80/20',
    driverShare80: '80% Pago al Conductor',
    platformShare20: '20% Comisión de la Plataforma',
    exportCsv: 'Exportar CSV del Mes',
    stripeMerchantStatus: 'Pasarela Mercantil Stripe Activa',
    liveGpsStreetView: 'Radar GPS y Vista Panorámica',
    emergencySOS: 'SOS Policía de Dominica 999',
  },
  ht: {
    home: 'Akèy',
    bookRide: 'Kòmande yon Kous',
    tracking: 'Swiv GPS an Direk',
    adminPortal: 'Pòtay Administratè',
    driverPortal: 'Pòtay Chofè',
    safetyPolicies: 'Sekirite ak Règleman',
    riderSignUp: 'Enskri Kòm Pasaje',
    driverSignUp: 'Enskri Kòm Chofè',
    bookRideNow: 'Kòmande Chofè Elite',
    trackActiveRide: 'Swiv Vwayaj Aktif la',
    pickupLocation: 'Kote w vle yo pran w lan',
    destination: 'Kote w prale nan Dominik',
    scenicStopover: 'Ti Rèd Manb / Kanpe Gade',
    vehicleTier: 'Klas Machin ak Konfò',
    selectTier: 'Chwazi Klas Machin',
    fareBreakdown: 'Kalkil Pri Garanti',
    confirmBooking: 'Konfime epi Voye Chofè a',
    confirmPaymentWithStripe: 'Peye ak Kat Kredi Stripe',
    driverConsole: 'Biwo Chofè Aktif',
    language: 'Lang',
    themeDay: 'Mod Jou (Klè)',
    themeNight: 'Mod Lannwit Elite (Nwa)',
    accessibilityMode: 'Mod Aksesibilite & Gwo Kontras',
    topRatedDrivers: 'Chofè ki Pi Byen Note nan Dominik',
    driverVettingTagline: 'Pwofesyonèl otorize ak verifye pa pasaje reyèl',
    revenueDashboard: 'Tablo Revni Pataj 80/20',
    driverShare80: '80% Peman pou Chofè',
    platformShare20: '20% Komisyon Platfòm',
    exportCsv: 'Telechaje CSV Mwa a',
    stripeMerchantStatus: 'Peman Komèsan Stripe Aktif',
    liveGpsStreetView: 'GPS ak Kamera Lari an Direk',
    emergencySOS: 'SOS Polis Dominik 999',
  },
};
