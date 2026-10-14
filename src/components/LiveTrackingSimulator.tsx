import React, { useState, useEffect } from 'react';
import {
  Car,
  Phone,
  MessageSquare,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Share2,
  X,
  Send,
  Eye,
  Maximize2,
  Minimize2,
  Compass,
  Gauge,
  Mountain,
  Waves,
  Camera,
  Navigation,
  RotateCcw,
  Sliders,
  Play,
  Check,
  Split,
  Map as MapIcon,
} from 'lucide-react';
import { ActiveRide, Currency } from '../types/booking';
import { formatFare } from '../utils/pricing';
import { DOMINICA_LOCATIONS, VEHICLE_TIERS } from '../data/dominicaData';
import { EliteRideLogo } from './EliteRideLogo';

interface LiveTrackingSimulatorProps {
  ride: ActiveRide | null;
  currency: Currency;
  onCancelRide: () => void;
  onResetRide: () => void;
  onStartDemoRide?: (ride: ActiveRide) => void;
}

// Dominica authentic Street View scenes
const STREET_VIEW_SCENES = [
  {
    id: 'coastal',
    title: 'E.O. Leblanc Coastal Highway',
    subtitle: 'West Coast Coastal Highway · St. Joseph / Mero / Salisbury',
    image: '/src/assets/images/dominica_street_view_coast_1791833350707.jpg',
    speed: '54 km/h',
    compass: '328° NW',
    elevation: '12m ASL',
    weather: 'Sunny & Coastal Breeze',
    roadType: 'Coastal 2-Lane Highway',
    nextLandmark: 'Mero Beach Turnoff (0.7 mi)',
    icon: Waves,
  },
  {
    id: 'rainforest',
    title: 'Pont Cassé Rainforest Pass',
    subtitle: 'Central Highland Traverse · Morne Trois Pitons National Park',
    image: '/src/assets/images/dominica_street_view_rainforest_1791833359756.jpg',
    speed: '38 km/h',
    compass: '042° NE',
    elevation: '485m ASL',
    weather: 'Tropical Mist · High Grip',
    roadType: 'Mountain Switchbacks',
    nextLandmark: 'Pont Cassé Roundabout (1.4 mi)',
    icon: Mountain,
  },
  {
    id: 'bayfront',
    title: 'Roseau Bayfront Boulevard',
    subtitle: 'Dame Eugenia Charles Blvd · Roseau Harbour District',
    image: '/src/assets/images/dominica_street_view_town_1791833375166.jpg',
    speed: '28 km/h',
    compass: '184° S',
    elevation: '6m ASL',
    weather: 'Sunny & Warm 29°C',
    roadType: 'Capital Waterfront Boulevard',
    nextLandmark: 'Dominica Museum & Cruise Berth (0.2 mi)',
    icon: Navigation,
  },
];

export const LiveTrackingSimulator: React.FC<LiveTrackingSimulatorProps> = ({
  ride,
  currency,
  onCancelRide,
  onResetRide,
  onStartDemoRide,
}) => {
  const [currentStatus, setCurrentStatus] = useState<ActiveRide['status']>('dispatched');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [graceSecondsLeft, setGraceSecondsLeft] = useState(120);

  // Dynamic Countdown Timer until Driver reaches pickup
  const initialPickupSeconds = 240; // 4 minutes estimated arrival time
  const [pickupSecondsRemaining, setPickupSecondsRemaining] = useState(initialPickupSeconds);

  // Real-time Chat & Simulated Messaging State
  const [showChatModal, setShowChatModal] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [isDriverTyping, setIsDriverTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    {
      sender: 'driver',
      text: 'Good day! I have accepted your dispatch. Navigating towards your pickup location now.',
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sosActivated, setSosActivated] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [copiedCoordsToast, setCopiedCoordsToast] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Street View State
  const [viewMode, setViewMode] = useState<'street_view' | 'radar' | 'split'>('street_view');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [panOffset, setPanOffset] = useState(0); // -40 to +40 pan
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreenStreetView, setIsFullscreenStreetView] = useState(false);
  const [speedFluctuation, setSpeedFluctuation] = useState(0);

  // Auto-select scenic street view according to route
  useEffect(() => {
    if (!ride) return;
    const combined = `${ride.pickupLabel} ${ride.dropoffLabel} ${ride.stopoverLabel || ''}`.toLowerCase();
    if (combined.includes('pont cassé') || combined.includes('belles') || combined.includes('castle bruce') || combined.includes('marigot') || combined.includes('douglas-charles')) {
      setSelectedSceneIndex(1); // Rainforest pass
    } else if (combined.includes('roseau') && (combined.includes('goodwill') || combined.includes('loubiere') || combined.includes('newtown'))) {
      setSelectedSceneIndex(2); // Roseau bayfront
    } else {
      setSelectedSceneIndex(0); // Coastal highway
    }
  }, [ride]);

  // When status becomes 'in_transit', default to street view mode so rider immediately sees the road
  useEffect(() => {
    if (currentStatus === 'in_transit') {
      setViewMode('street_view');
    }
  }, [currentStatus]);

  // Status progression simulation & Dynamic Countdown Timer
  useEffect(() => {
    if (!ride) return;

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);

      // Dynamic countdown timer calculates remaining minutes and seconds to pickup
      setPickupSecondsRemaining((prev) => {
        if (currentStatus === 'dispatched') {
          if (prev <= 1) {
            setCurrentStatus('arrived_pickup');
            return 0;
          }
          return prev - 1;
        }
        return prev;
      });

      // Progression through subsequent stages
      if (currentStatus === 'arrived_pickup') {
        setSecondsElapsed((prev) => {
          if (prev > 26) {
            setCurrentStatus('in_transit');
          }
          return prev;
        });
      } else if (currentStatus === 'in_transit') {
        setSecondsElapsed((prev) => {
          if (prev > 54) {
            setCurrentStatus('completed');
          }
          return prev;
        });
      }

      // Subtle speed fluctuations for realism
      setSpeedFluctuation(Math.floor(Math.sin(Date.now() / 1500) * 4));
      setGraceSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [ride, currentStatus]);

  const handleLaunchDemo = () => {
    if (!onStartDemoRide) return;
    const demoTier = VEHICLE_TIERS[1]; // 4WD SUV
    const demoRide: ActiveRide = {
      id: `DEMO-${Date.now().toString().slice(-4)}`,
      booking: {
        pickupId: 'ROSEAU',
        dropoffId: 'DOM',
        customPickup: '',
        customDropoff: '',
        hasStopover: false,
        stopoverId: '',
        vehicleTierId: demoTier.id,
        isScheduled: false,
        scheduleDate: '',
        scheduleTime: '',
        passengers: 2,
        heavyLuggageDeclared: false,
        paymentMethod: 'nbd_mobanking',
        passengerName: 'Julian Matthew',
        passengerPhone: '+1 (767) 275-8819',
        passengerEmail: 'julian.matthew@dominica.dm',
        flightNumber: 'AA 3192',
        notes: 'Heading to Douglas-Charles for flight.',
      },
      tier: demoTier,
      fare: {
        distanceMiles: 38.4,
        estimatedMinutes: 65,
        baseFeeXCD: 1.0,
        distanceFeeXCD: 384.0,
        subtotalXCD: 385.0,
        vatXCD: 57.75,
        totalXCD: 442.75,
        totalUSD: 163.98,
        tier: demoTier,
      },
      driver: {
        id: 'drv-491',
        name: 'Darren "Kalinago" Shillingford',
        rating: 4.96,
        tripsCompleted: 842,
        vehicleModel: 'Toyota Land Cruiser Prado 4WD',
        licensePlate: 'HE-4912',
        phone: '+1 (767) 276-4910',
        currentLat: 15.301,
        currentLng: -61.388,
      },
      status: 'in_transit',
      dispatchedAt: Date.now() - 30000,
      etaMinutes: 42,
      pickupLabel: 'Roseau (Capital)',
      dropoffLabel: 'Douglas-Charles Airport (DOM)',
      cancelGracePeriodSeconds: 120,
    };
    onStartDemoRide(demoRide);
  };

  if (!ride) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <Car className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Active Ride Dispatch in Progress</h3>
        <p className="text-sm text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
          Request a ride in the booking terminal, or launch an instant simulated journey across Dominica to test live GPS tracking and authentic 360° street view road cameras.
        </p>

        {onStartDemoRide && (
          <button
            onClick={handleLaunchDemo}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Demo Trip & Experience Street View</span>
          </button>
        )}
      </div>
    );
  }

  const currentScene = STREET_VIEW_SCENES[selectedSceneIndex];
  const progressPercent = Math.min(100, Math.round((secondsElapsed / 54) * 100));

  // Dynamic countdown calculations
  const pickupMinutes = Math.floor(pickupSecondsRemaining / 60);
  const pickupSeconds = pickupSecondsRemaining % 60;
  const formattedPickupCountdown = `${pickupMinutes}:${pickupSeconds < 10 ? '0' : ''}${pickupSeconds}`;
  const estimatedArrivalClock = new Date(Date.now() + pickupSecondsRemaining * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const pickupProgressPercent = Math.min(100, Math.round(((initialPickupSeconds - pickupSecondsRemaining) / initialPickupSeconds) * 100));

  const handleFastForwardToArrival = () => {
    setPickupSecondsRemaining(3);
  };

  const handleSendChatMessage = (textToSend?: string) => {
    const text = (typeof textToSend === 'string' ? textToSend : inputMessage).trim();
    if (!text) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setInputMessage('');

    // Trigger driver typing indicator
    setIsDriverTyping(true);

    setTimeout(() => {
      setIsDriverTyping(false);
      let reply = 'Understood! Maintaining smooth speed on the Dominica mountain highway.';
      const lower = text.toLowerCase();
      if (lower.includes('luggage') || lower.includes('bag')) {
        reply = `Noted! The ${ride.driver.vehicleModel.split(' ')[0]} has ample luggage space. I will assist you with loading all bags upon arrival.`;
      } else if (lower.includes('where') || lower.includes('far') || lower.includes('eta') || lower.includes('time') || lower.includes('min')) {
        const minsLeft = Math.max(1, Math.ceil(pickupSecondsRemaining / 60));
        reply = `I am currently along the main road corridor. Approximately ${minsLeft} minute${minsLeft > 1 ? 's' : ''} away from ${ride.pickupLabel}.`;
      } else if (lower.includes('car') || lower.includes('color') || lower.includes('colour') || lower.includes('look')) {
        reply = `Look out for my ${ride.driver.vehicleModel}, license plate ${ride.driver.licensePlate}. My hazard lights will be flashing at pickup.`;
      } else if (lower.includes('wait') || lower.includes('outside') || lower.includes('entrance') || lower.includes('lobby')) {
        reply = 'Excellent, see you right there at the entrance! Approaching now.';
      } else if (lower.includes('flight') || lower.includes('airport')) {
        reply = 'Copy that! I will take the scenic coastal bypass to avoid congestion and get you to the terminal on time.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'driver',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (!showChatModal) {
        setUnreadChatCount((c) => c + 1);
      }
    }, 1400);
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(`https://elite-ride-dominica.dm/track/${ride.id}`);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Top Status Header */}
      <div className="bg-neutral-950 p-5 sm:p-6 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <EliteRideLogo variant="mark" size="sm" theme="dark" />
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                DOMINICA FLEET GPS · #DOM-ER-{ride.id.slice(-4)}
              </span>
              {currentStatus === 'in_transit' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                  <Camera className="w-3 h-3" />
                  STREET VIEW LIVE
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {currentStatus === 'dispatched' && 'Driver En Route to Pickup'}
              {currentStatus === 'arrived_pickup' && 'Driver Has Arrived at Pickup'}
              {currentStatus === 'in_transit' && 'Trip In Progress across Dominica'}
              {currentStatus === 'completed' && 'Trip Successfully Completed'}
            </h3>
          </div>
        </div>

        {/* Consolidated Action Controls */}
        <div className="inline-flex items-center gap-2 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl shadow-inner">
          {/* Emergency SOS Button */}
          <button
            onClick={() => setSosActivated(true)}
            className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>24/7 SOS 999</span>
          </button>

          {/* Share trip button */}
          <button
            onClick={handleCopyShare}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs transition-colors border border-neutral-700 cursor-pointer"
            title="Share Trip Tracking Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Copy link toast */}
      {copiedToast && (
        <div className="bg-emerald-950 border-b border-emerald-800 px-4 py-2 text-center text-xs text-emerald-300 font-mono">
          ✓ Live GPS Tracking & Street View URL copied to clipboard!
        </div>
      )}

      {/* TRIP STATUS STEPPER (Lets user switch/preview stages like 'Trip In Progress across Dominica') */}
      <div className="bg-neutral-950/90 px-4 sm:px-6 py-2.5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
          Journey Stage:
        </span>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {(
            [
              { key: 'dispatched', label: '1. En Route' },
              { key: 'arrived_pickup', label: '2. Arrived' },
              { key: 'in_transit', label: '3. In Progress (Street View)' },
              { key: 'completed', label: '4. Arrived Destination' },
            ] as const
          ).map((stage) => {
            const isActive = currentStatus === stage.key;
            return (
              <button
                key={stage.key}
                onClick={() => setCurrentStatus(stage.key)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
                }`}
              >
                {stage.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW SELECTOR BAR: Street View vs Radar Map vs Split */}
      <div className="bg-neutral-950 px-4 sm:px-6 py-3 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setViewMode('street_view')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'street_view'
                ? 'bg-emerald-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Street View (Dominica Road Cam)</span>
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'radar'
                ? 'bg-emerald-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>GPS Radar</span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'split'
                ? 'bg-emerald-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>
        </div>

        {/* Scenic Sector Switcher (Coastal / Rainforest / Bayfront) */}
        {(viewMode === 'street_view' || viewMode === 'split') && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-mono text-neutral-400 mr-1 hidden sm:inline">
              Dominica Sector:
            </span>
            {STREET_VIEW_SCENES.map((scene, idx) => {
              const IconComp = scene.icon;
              const isSelected = selectedSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  onClick={() => setSelectedSceneIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 border transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <IconComp className="w-3 h-3 text-emerald-400" />
                  <span>{scene.title.split(' ')[0]} {scene.title.split(' ')[1] || ''}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          MAIN VISUAL CONTAINER: STREET VIEW / RADAR / SPLIT
          ========================================================================= */}
      <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} border-b border-neutral-800 bg-neutral-950`}>
        
        {/* ================= STREET VIEW PERSPECTIVE ================= */}
        {(viewMode === 'street_view' || viewMode === 'split') && (
          <div className={`relative ${viewMode === 'street_view' ? 'h-80 sm:h-[440px]' : 'h-72 sm:h-80'} bg-black overflow-hidden flex flex-col justify-between group`}>
            {/* Street View Image Canvas with Interactive Pan */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={currentScene.image}
                alt={currentScene.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover select-none transition-transform duration-300 ease-out`}
                style={{
                  transform: `scale(${isZoomed ? 1.35 : 1.08}) translateX(${panOffset}px)`,
                }}
              />
              {/* Subtle road dashboard reflection and vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-black/60 pointer-events-none" />
            </div>

            {/* TOP STREET VIEW HUD: Telemetry & Live Cam Status */}
            <div className="relative z-20 p-3 sm:p-4 flex items-start justify-between gap-3 text-white">
              <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-red-300 uppercase">
                  LIVE DASHCAM · 1080p 60FPS
                </span>
                <span className="text-[11px] font-mono text-neutral-400 border-l border-white/20 pl-2">
                  DOM-491
                </span>
              </div>

              {/* Pan & Zoom interactive controls */}
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setPanOffset((prev) => Math.max(-120, prev - 30))}
                  className="px-2 py-1 text-[11px] font-mono bg-neutral-800/80 hover:bg-neutral-700 rounded text-neutral-200"
                  title="Pan Left"
                >
                  ◀ Pan
                </button>
                <button
                  onClick={() => setPanOffset(0)}
                  className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                  title="Reset Camera Center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPanOffset((prev) => Math.min(120, prev + 30))}
                  className="px-2 py-1 text-[11px] font-mono bg-neutral-800/80 hover:bg-neutral-700 rounded text-neutral-200"
                  title="Pan Right"
                >
                  Pan ▶
                </button>
                <button
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className={`p-1 rounded text-neutral-300 hover:text-white ${isZoomed ? 'bg-emerald-600 text-white' : 'hover:bg-neutral-800'}`}
                  title={isZoomed ? 'Zoom Out 1x' : 'Zoom In 1.35x'}
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsFullscreenStreetView(true)}
                  className="p-1 hover:bg-neutral-800 rounded text-neutral-300 hover:text-white"
                  title="Fullscreen Street View Theater"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CENTER ROAD BANNER ON TRIP IN PROGRESS */}
            {currentStatus === 'in_transit' && (
              <div className="relative z-20 self-center px-4 py-2 bg-black/75 backdrop-blur-md border border-emerald-500/50 rounded-2xl text-center shadow-2xl max-w-md mx-4 animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Trip In Progress across Dominica</span>
                </div>
                <h4 className="text-white font-bold text-sm sm:text-base">
                  {currentScene.title}
                </h4>
                <p className="text-[11px] text-neutral-300 font-mono mt-0.5">
                  {currentScene.subtitle}
                </p>
              </div>
            )}

            {/* BOTTOM STREET VIEW HUD: Speedometer, Bearing, Altitude, Landmark */}
            <div className="relative z-20 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
              <div className="flex flex-wrap items-end justify-between gap-3">
                {/* Speed & Heading */}
                <div className="flex items-center gap-3">
                  <div className="bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 flex items-center gap-2.5">
                    <Gauge className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block leading-none">
                        Live Speed
                      </span>
                      <span className="text-lg font-bold font-mono text-white leading-tight">
                        {parseInt(currentScene.speed) + speedFluctuation} <span className="text-xs text-neutral-400 font-normal">km/h</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/15 flex items-center gap-2 hidden sm:flex">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block leading-none">
                        Bearing
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {currentScene.compass}
                      </span>
                    </div>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/15 flex items-center gap-2 hidden sm:flex">
                    <Mountain className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block leading-none">
                        Elevation
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {currentScene.elevation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Waypoint milestone banner */}
                <div className="bg-emerald-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-right">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 block font-semibold">
                    Approaching Waypoint
                  </span>
                  <span className="text-xs text-white font-medium">
                    {currentScene.nextLandmark}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2D RADAR TOPO PERSPECTIVE ================= */}
        {(viewMode === 'radar' || viewMode === 'split') && (
          <div className={`relative ${viewMode === 'radar' ? 'h-80 sm:h-[440px]' : 'h-72 sm:h-80'} bg-neutral-950 overflow-hidden flex items-center justify-center border-l border-neutral-800/80`}>
            {/* Dominica Topographic Map Canvas Artwork */}
            <svg className="w-full h-full opacity-40 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 120,40 Q 240,20 380,45 Q 520,70 600,140 Q 640,220 620,320 Q 580,420 500,480 Q 420,530 320,540 Q 220,530 160,460 Q 110,380 100,280 Q 90,160 120,40 Z"
                fill="#064e3b"
                stroke="#10b981"
                strokeWidth="1.5"
                transform="scale(0.8) translate(100, -20)"
              />
              <ellipse cx="380" cy="180" rx="140" ry="70" fill="#047857" opacity="0.3" />
              <ellipse cx="360" cy="240" rx="110" ry="60" fill="#059669" opacity="0.4" />
              <path
                id="svg-route-path"
                className="svg-route-path"
                d="M 220,70 Q 300,120 360,200 Q 440,260 500,320"
                fill="none"
                stroke="#34d399"
                strokeWidth="3.5"
                strokeDasharray="400"
                strokeDashoffset={400 - (400 * progressPercent) / 100}
              />
            </svg>

            {/* Live Route Curve with Moving Vehicle */}
            <div className="relative z-10 w-4/5 max-w-md">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 mb-2">
                <span className="flex items-center gap-1.5 text-white bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[120px]">{ride.pickupLabel}</span>
                </span>
                <span className="flex items-center gap-1.5 text-white bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[120px]">{ride.dropoffLabel}</span>
                </span>
              </div>

              {/* Route Progress Bar */}
              <div className="h-3 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-neutral-700 relative">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Moving Car Marker */}
              <div
                className="flex items-center gap-2 mt-3 transition-all duration-700"
                style={{ marginLeft: `${Math.max(0, Math.min(80, progressPercent - 5))}%` }}
              >
                <div className="bg-emerald-500 text-neutral-950 p-1.5 rounded-full shadow-lg">
                  <Car className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-bold text-white bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-700 shadow">
                  {currentStatus === 'completed'
                    ? 'Arrived Destination'
                    : `${Math.max(1, Math.round((ride.fare.estimatedMinutes * (100 - progressPercent)) / 100))} min ETA`}
                </span>
              </div>
            </div>

            {/* Radar status note */}
            <div className="absolute bottom-3 left-4 text-[10px] text-neutral-500 font-mono">
              DOMINICA TOPOGRAPHIC RADAR · ACTIVE HIGHWAY SENSING
            </div>
          </div>
        )}
      </div>

      {/* Driver & Ride Details Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Driver Information Card & Dynamic Countdown Timer */}
        <div className="md:col-span-7 space-y-5">
          {/* DYNAMIC PICKUP COUNTDOWN TIMER CARD */}
          {currentStatus === 'dispatched' && (
            <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-neutral-950 to-neutral-900 border border-emerald-500/50 rounded-2xl shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Dynamic Pickup Countdown Timer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-neutral-400">
                    Est. Arrival: <strong className="text-white">{estimatedArrivalClock}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleFastForwardToArrival}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 transition-colors cursor-pointer"
                    title="Simulate rapid driver arrival for testing"
                  >
                    ⚡ Fast-Forward (3s)
                  </button>
                </div>
              </div>

              {/* Countdown Numbers Display */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums flex items-center gap-2">
                    <Clock className="w-7 h-7 text-emerald-400 animate-spin-slow" />
                    <span>{formattedPickupCountdown}</span>
                    <span className="text-xs font-sans font-normal text-emerald-300">remaining</span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1">
                    Driver {ride.driver.name} is <span className="text-emerald-400 font-bold">~{Math.max(1, Math.ceil(pickupSecondsRemaining / 60))} minute(s)</span> away from <strong className="text-white">{ride.pickupLabel}</strong>.
                  </p>
                </div>
              </div>

              {/* Dynamic Proximity Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-linear shadow-sm shadow-emerald-400/50"
                    style={{ width: `${pickupProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>Dispatched: Dominica Fleet Base</span>
                  <span>Pickup Proximity: {pickupProgressPercent}%</span>
                </div>
              </div>
            </div>
          )}

          {currentStatus === 'arrived_pickup' && (
            <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-xs text-emerald-200 flex items-center gap-3 animate-pulse shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">Driver Has Arrived at Pickup Point!</h4>
                <p className="text-xs text-emerald-300 mt-0.5">
                  {ride.driver.name} has pulled up to <strong>{ride.pickupLabel}</strong> in the {ride.driver.vehicleModel} ({ride.driver.licensePlate}).
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4 p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700 relative flex items-center justify-center text-white font-bold text-lg">
              <span>{ride.driver.name.split(' ').map((n) => n[0]).join('')}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base truncate">{ride.driver.name}</h4>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <span>★</span>
                  <span>{ride.driver.rating.toFixed(2)}</span>
                  <span className="text-neutral-500 font-normal">({ride.driver.tripsCompleted})</span>
                </div>
              </div>

              <p className="text-xs text-neutral-300 mt-0.5 font-medium">
                {ride.driver.vehicleModel}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-xs font-mono font-bold text-emerald-400">
                  {ride.driver.licensePlate}
                </span>
                <span className="text-[11px] text-neutral-400">
                  Certified Mountain Chauffeur · Police Clearance Verified
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Call & Chat */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowChatModal(true)}
              className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-neutral-700"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Chat with Driver</span>
            </button>

            <a
              href={`tel:${ride.driver.phone}`}
              className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-neutral-700"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call ({ride.driver.phone})</span>
            </a>
          </div>

          {/* Route Summary */}
          <div className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">Pickup:</span>
              <span className="text-white font-medium">{ride.pickupLabel}</span>
            </div>
            {ride.stopoverLabel && (
              <div className="flex items-start gap-2 text-amber-300">
                <span className="font-bold">Stop-Over:</span>
                <span>{ride.stopoverLabel}</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">Drop-off:</span>
              <span className="text-white font-medium">{ride.dropoffLabel}</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 flex justify-between text-neutral-400 text-[11px]">
              <span>Distance: {ride.fare.distanceMiles} miles</span>
              <span>Vehicle: {ride.tier.name}</span>
            </div>
          </div>
        </div>

        {/* Right: Payment, Policy & Cancellation */}
        <div className="md:col-span-5 space-y-4">
          {/* Fare Box */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-2">
              Trip Fare Breakdown (15% VAT Included)
            </span>
            <div className="space-y-1.5 text-xs text-neutral-300 mb-3">
              <div className="flex justify-between">
                <span className="text-neutral-400">Base Dispatch Fee</span>
                <span className="font-mono">{formatFare(ride.fare.baseFeeXCD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Mileage (PER mi × 10 EC$)</span>
                <span className="font-mono">{formatFare(ride.fare.distanceFeeXCD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">15% Dominica VAT</span>
                <span className="font-mono">{formatFare(ride.fare.vatXCD, currency)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-baseline justify-between">
              <span className="font-bold text-white text-xs">Total Fare</span>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {formatFare(ride.fare.totalXCD, currency)}
                </span>
                <div className="text-[10px] text-neutral-500 font-mono">
                  Payment: {ride.booking.paymentMethod.toUpperCase().replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy Banner */}
          <div className="p-3.5 bg-neutral-950/70 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Cancellation Policy</span>
            </div>
            <p>
              Free cancellation within 2-minute grace period. A 15% cancellation fee applies once driver dispatch has begun.
            </p>
            {graceSecondsLeft > 0 ? (
              <span className="text-emerald-400 block font-mono">
                Grace period active: {graceSecondsLeft}s remaining for $0 penalty
              </span>
            ) : (
              <span className="text-amber-400 block font-mono">
                Grace period expired: 15% cancellation fee applies
              </span>
            )}
          </div>

          {/* Cancellation or Completion Action */}
          {currentStatus === 'completed' ? (
            <button
              onClick={onResetRide}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md"
            >
              Book Another Ride
            </button>
          ) : (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-red-400 rounded-xl text-xs font-semibold transition-colors border border-neutral-700"
            >
              Cancel Ride {graceSecondsLeft > 0 ? '(Free)' : '(15% Fee Applies)'}
            </button>
          )}
        </div>
      </div>

      {/* FULLSCREEN STREET VIEW THEATER MODAL */}
      {isFullscreenStreetView && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className="font-bold text-sm sm:text-base">{currentScene.title} · Fullscreen Street View</h4>
                <span className="text-xs text-neutral-400 font-mono">{currentScene.subtitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
                {STREET_VIEW_SCENES.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedSceneIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      selectedSceneIndex === idx ? 'bg-emerald-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {scene.title.split(' ')[0]}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsFullscreenStreetView(false)}
                className="p-2 bg-neutral-850 hover:bg-neutral-750 text-neutral-300 rounded-xl"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Panoramic Visual Canvas */}
          <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
            <img
              src={currentScene.image}
              alt={currentScene.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
              style={{
                transform: `scale(${isZoomed ? 1.35 : 1.05}) translateX(${panOffset}px)`,
              }}
            />

            {/* In-view Pan slider overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-4 text-white">
              <span className="text-xs font-mono text-neutral-400">PAN 360°</span>
              <input
                type="range"
                min="-120"
                max="120"
                value={panOffset}
                onChange={(e) => setPanOffset(Number(e.target.value))}
                className="w-48 accent-emerald-500"
              />
              <button
                onClick={() => setPanOffset(0)}
                className="text-xs font-mono px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
              >
                CENTER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL RIDE CONFIRMATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Cancel Live Ride?</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {graceSecondsLeft > 0
                ? `You are within the 2-minute grace period (${graceSecondsLeft}s remaining). Cancellation is free ($0 fee).`
                : 'The 2-minute grace period has elapsed. In accordance with Dominica Elite dispatch rules, a 15% cancellation fee applies.'}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold"
              >
                Keep Ride
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  onCancelRide();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENHANCED SOS EMERGENCY MODAL WITH LOCAL CONTACTS & RIDER COORDINATES */}
      {sosActivated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border-2 border-red-600/80 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-red-950/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-950 text-red-500 flex items-center justify-center border border-red-800 shrink-0">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">Dominica Emergency SOS</h3>
                  <span className="text-xs text-red-400 font-mono">Priority Emergency Responder Hub</span>
                </div>
              </div>
              <button
                onClick={() => setSosActivated(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rider's Current Live Coordinates Card */}
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Rider Current GPS Coordinates</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Live GPS Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 font-mono">
                <div className="p-2.5 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Latitude</span>
                  <span className="text-white font-bold text-sm">
                    {ride.driver.currentLat || 15.3014}° N
                  </span>
                </div>
                <div className="p-2.5 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Longitude</span>
                  <span className="text-white font-bold text-sm">
                    {ride.driver.currentLng || -61.3882}° W
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
                <span>Dominica Corridor: <strong>St. George Parish · Coastal Highway</strong></span>
                <span>Altitude: <strong>24m ASL</strong></span>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `EMERGENCY: Dominica Rider GPS coordinates: ${ride.driver.currentLat || 15.3014}° N, ${ride.driver.currentLng || -61.3882}° W. Vehicle: ${ride.driver.vehicleModel}, License Plate: ${ride.driver.licensePlate}. Driver: ${ride.driver.name}. Pickup: ${ride.pickupLabel}, Destination: ${ride.dropoffLabel}.`
                  );
                  setCopiedCoordsToast(true);
                  setTimeout(() => setCopiedCoordsToast(false), 3000);
                }}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-xl text-xs font-semibold border border-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedCoordsToast ? '✓ Exact GPS Coordinates Copied!' : 'Copy Exact Coordinates to Clipboard'}
              </button>
            </div>

            {/* Local Emergency Contact Numbers in Dominica */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                Local Dominica Emergency Contact Numbers:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:999"
                  className="p-3 bg-red-950/60 hover:bg-red-950 border border-red-800/80 rounded-xl flex items-center justify-between text-white transition-all group"
                >
                  <div>
                    <span className="font-bold text-red-300 block">Police Emergency Dispatch</span>
                    <span className="text-[11px] text-neutral-400">Toll-Free Dominica</span>
                  </div>
                  <span className="font-mono font-bold text-lg text-white group-hover:text-red-400">999</span>
                </a>

                <a
                  href="tel:7674482222"
                  className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between text-white transition-all"
                >
                  <div>
                    <span className="font-bold text-neutral-200 block">Police HQ (Roseau)</span>
                    <span className="text-[11px] text-neutral-400">Main Headquarters</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-400">(767) 448-2222</span>
                </a>

                <a
                  href="tel:999"
                  className="p-3 bg-red-950/60 hover:bg-red-950 border border-red-800/80 rounded-xl flex items-center justify-between text-white transition-all group"
                >
                  <div>
                    <span className="font-bold text-red-300 block">Fire &amp; Ambulance</span>
                    <span className="text-[11px] text-neutral-400">Emergency Rescue</span>
                  </div>
                  <span className="font-mono font-bold text-lg text-white group-hover:text-red-400">999</span>
                </a>

                <a
                  href="tel:7674485720"
                  className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between text-white transition-all"
                >
                  <div>
                    <span className="font-bold text-neutral-200 block">Princess Margaret Hospital</span>
                    <span className="text-[11px] text-neutral-400">Roseau Emergency ER</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-400">(767) 448-5720</span>
                </a>
              </div>
            </div>

            {/* Direct Actions */}
            <div className="flex gap-3 pt-2 border-t border-neutral-800">
              <a
                href="tel:999"
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
              >
                <Phone className="w-4 h-4" />
                <span>Call 999 Police Now</span>
              </a>
              <button
                onClick={() => setSosActivated(false)}
                className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REAL-TIME IN-APP CHAT MODAL WITH DRIVER (SIMULATED MESSAGING STATE) */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md h-[500px] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white text-sm">
                  {ride.driver.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{ride.driver.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {ride.driver.vehicleModel} · {ride.driver.licensePlate}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-950/40">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-neutral-950 font-medium'
                        : 'bg-neutral-800 text-neutral-100 border border-neutral-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-neutral-500 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}

              {/* Typing indicator */}
              {isDriverTyping && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 pl-1">
                  <div className="flex gap-1 items-center bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">{ride.driver.name.split(' ')[0]} is typing...</span>
                </div>
              )}
            </div>

            {/* Quick response chips */}
            <div className="px-3 py-2 bg-neutral-950/80 border-t border-neutral-800 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
              <span className="text-neutral-500 shrink-0 text-[10px]">Quick:</span>
              {[
                "I'm outside waiting",
                'I have 2 large bags',
                'What colour is your car?',
                'Take your time!',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendChatMessage(chip)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-neutral-300 text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="p-3 bg-neutral-950 border-t border-neutral-800 flex gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Message your driver..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-bold cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION CONTROLS */}
      {/* 1. Floating 'SOS' Emergency Button */}
      <button
        type="button"
        onClick={() => setSosActivated(true)}
        className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl shadow-2xl shadow-red-950/80 flex items-center gap-2.5 border-2 border-red-400 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
        title="24/7 Emergency SOS Police & Ambulance Dispatch"
      >
        <ShieldAlert className="w-5 h-5 text-white" />
        <span>SOS 999</span>
      </button>

      {/* 2. Floating Real-time Chat Launcher */}
      <button
        type="button"
        onClick={() => {
          setShowChatModal(true);
          setUnreadChatCount(0);
        }}
        className="fixed bottom-6 right-36 z-40 sm:bottom-8 sm:right-40 px-3.5 py-3 bg-neutral-900/95 hover:bg-neutral-800 text-white rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        title="Chat live with driver"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          )}
        </div>
        <span className="hidden sm:inline">Chat Driver</span>
        {unreadChatCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-bold">
            {unreadChatCount}
          </span>
        )}
      </button>
    </div>
  );
};
