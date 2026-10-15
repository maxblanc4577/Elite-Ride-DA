import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MapPin,
  Clock,
  Compass,
  Search,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Navigation,
  Camera,
  Layers,
  Sparkles,
  WifiOff,
  Wifi,
  X,
  Heart,
  Printer,
  ChevronRight,
  CheckCircle,
  FileText,
  FastForward,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import {
  ELITE_ESTIMATION_LOCATIONS_META,
  EliteEstimationLocationMeta,
  resolveEliteLocationMeta,
  DOMINICA_LOCATIONS,
} from '../data/dominicaData';
import { Currency } from '../types/booking';
import { formatFare } from '../utils/pricing';

interface RideEstimationWidgetProps {
  pickupId: string;
  dropoffId: string;
  onPickupChange: (id: string) => void;
  onDropoffChange: (id: string) => void;
  currency: Currency;
  fareTotalXCD: number;
  distanceMiles: number;
  isFareReset?: boolean;
  onResetRideAndFare?: () => void;
}

export const RideEstimationWidget: React.FC<RideEstimationWidgetProps> = ({
  pickupId,
  dropoffId,
  onPickupChange,
  onDropoffChange,
  currency,
  fareTotalXCD,
  distanceMiles,
  isFareReset = false,
  onResetRideAndFare,
}) => {
  // Current view mode: 'live-map' or 'hidden' (route-path view removed)
  const [viewMode, setViewMode] = useState<'live-map' | 'hidden'>('hidden');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Zoom scale state for Live Map (0.75x to 3.0x)
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Street View 360° Pan offset (-60 to +60)
  const [streetViewPan, setStreetViewPan] = useState(0);

  // Offline status & Cache
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineCachedData, setOfflineCachedData] = useState<any>(null);
  const [offlineSuccessNotice, setOfflineSuccessNotice] = useState<string | null>(null);

  // Favorite routes (Heart button state)
  const [pinnedFavorites, setPinnedFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eliteride_est_quick_favorite_routes') ||
        localStorage.getItem('eliteride_favorite_routes_v1');
      return saved ? JSON.parse(saved) : ['DOM', 'PORTSMOUTH', 'SOUFRIERE', 'CASTLE_BRUCE'];
    } catch {
      return ['DOM', 'PORTSMOUTH', 'SOUFRIERE', 'CASTLE_BRUCE'];
    }
  });

  // Print Trip Summary receipt state
  const [receiptNotice, setReceiptNotice] = useState<string | null>(null);

  // Current active destination metadata
  const currentMeta = useMemo(() => resolveEliteLocationMeta(dropoffId), [dropoffId]);
  const pickupLocationObj = useMemo(
    () => DOMINICA_LOCATIONS.find((l) => l.id === pickupId) || DOMINICA_LOCATIONS[0],
    [pickupId]
  );

  // Total journey seconds & Remaining seconds for countdown
  const totalJourneySeconds = (currentMeta?.minutesRemaining || 25) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalJourneySeconds);

  // Check if current destination is favorited
  const isCurrentFavorited = pinnedFavorites.includes(dropoffId);

  // Keep window global counters synced for external access
  useEffect(() => {
    (window as any)._estEtaTotalSeconds = totalJourneySeconds;
    (window as any)._estEtaRemainingSeconds = secondsRemaining;
  }, [totalJourneySeconds, secondsRemaining]);

  // Sync timer whenever destination changes or reset occurs
  useEffect(() => {
    if (isFareReset) {
      setSecondsRemaining(0);
    } else {
      setSecondsRemaining((currentMeta.minutesRemaining || 20) * 60);
    }
  }, [dropoffId, isFareReset, currentMeta.minutesRemaining]);

  // Live countdown tick (runs independently of secondsRemaining state)
  useEffect(() => {
    if (isFareReset) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isFareReset, dropoffId]);

  // Format countdown MM:SS
  const formatCountdown = (totalSeconds: number) => {
    if (isFareReset || totalSeconds <= 0) return '00:00';
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerText = isFareReset
    ? `0 mins remaining (00:00) • Reset`
    : `${currentMeta.travelTime} remaining (${formatCountdown(secondsRemaining)}) • ${currentMeta.shortName}`;

  // Journey progress calculations
  const totalSecs = totalJourneySeconds > 0 ? totalJourneySeconds : 1;
  const remSecs = isFareReset ? totalSecs : Math.min(totalSecs, Math.max(0, secondsRemaining));
  const completedPct = isFareReset
    ? 0
    : Math.min(100, Math.max(0, Math.round(((totalSecs - remSecs) / totalSecs) * 100)));
  const elapsedSecs = totalSecs - remSecs;
  const elapsedMinutes = Math.floor(elapsedSecs / 60);
  const remainingMinutes = Math.ceil(remSecs / 60);

  // Quick-step journey progress forward (+15%)
  const handleStepProgress = () => {
    if (isFareReset || secondsRemaining <= 0) return;
    const decrement = Math.round(totalSecs * 0.15);
    setSecondsRemaining((prev) => Math.max(0, prev - decrement));
  };

  // Toggle Favorite Heart
  const handleToggleFavorite = () => {
    setPinnedFavorites((prev) => {
      let updated: string[];
      if (prev.includes(dropoffId)) {
        updated = prev.filter((id) => id !== dropoffId);
      } else {
        updated = [dropoffId, ...prev];
      }
      try {
        localStorage.setItem('eliteride_est_quick_favorite_routes', JSON.stringify(updated));
        localStorage.setItem('eliteride_favorite_routes_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Cache estimation data for Service Worker & LocalStorage
  useEffect(() => {
    if (!isFareReset && fareTotalXCD > 0) {
      const cachePayload = {
        pickupId,
        pickupName: pickupLocationObj.name,
        dropoffId,
        destinationName: currentMeta.name,
        district: currentMeta.district,
        estimatedFare: `EC$ ${fareTotalXCD.toFixed(2)}`,
        fareXCD: fareTotalXCD,
        travelTime: currentMeta.travelTime,
        distance: `${distanceMiles} miles`,
        distanceMiles,
        corridor: currentMeta.highwayCorridor,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // 1. LocalStorage fallback
      try {
        localStorage.setItem('eliteride_offline_last_estimation', JSON.stringify(cachePayload));
        localStorage.setItem('elite_last_ride_estimation', JSON.stringify(cachePayload));
      } catch {
        // ignore
      }

      setOfflineCachedData((prev: any) => {
        if (
          prev &&
          prev.pickupId === pickupId &&
          prev.dropoffId === dropoffId &&
          prev.fareXCD === fareTotalXCD &&
          prev.distanceMiles === distanceMiles
        ) {
          return prev;
        }
        return cachePayload;
      });

      // 2. Service Worker CacheStorage
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_RIDE_ESTIMATION',
          payload: cachePayload,
        });
      }
      if ('caches' in window) {
        caches.open('elite-ride-estimation-cache-v1').then((cache) => {
          const res = new Response(JSON.stringify(cachePayload), {
            headers: { 'Content-Type': 'application/json' },
          });
          cache.put('/api/offline-estimation-cache', res).catch(() => {});
        }).catch(() => {});
      }
    }
  }, [
    pickupId,
    dropoffId,
    fareTotalXCD,
    distanceMiles,
    isFareReset,
    currentMeta.name,
    currentMeta.district,
    currentMeta.travelTime,
    currentMeta.highwayCorridor,
    pickupLocationObj.name,
  ]);

  // Restore cached estimation
  const handleRestoreCachedEstimate = () => {
    try {
      const raw = localStorage.getItem('eliteride_offline_last_estimation') ||
        localStorage.getItem('elite_last_ride_estimation');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.dropoffId) {
          onDropoffChange(parsed.dropoffId);
        }
        if (parsed.pickupId) {
          onPickupChange(parsed.pickupId);
        }
        setOfflineSuccessNotice(`Restored offline estimate: ${parsed.destinationName} (${parsed.estimatedFare})`);
        setTimeout(() => setOfflineSuccessNotice(null), 4000);
      }
    } catch {
      // ignore
    }
  };

  // Generate & Print Trip Summary Receipt with jsPDF
  const handlePrintTripSummary = useCallback(() => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header Banner
      doc.setFillColor(6, 78, 59); // Emerald-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('ELITE RIDE DOMINICA - TRIP ESTIMATION RECEIPT', 14, 15);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'italic');
      doc.text("Dominica's premier ride-sharing platform with real-time tracking", 14, 21);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Official Transit Authority · Commonwealth of Dominica · ${new Date().toLocaleDateString()}`, 14, 26);

      // Section: Route & Location Summary
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Route Summary', 14, 40);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Origin / Pickup: ${pickupLocationObj.name}`, 14, 48);
      doc.text(`Destination: ${currentMeta.name} (${currentMeta.district})`, 14, 55);
      doc.text(`Transit Corridor: ${currentMeta.highwayCorridor}`, 14, 62);
      doc.text(`Total Route Distance: ${distanceMiles} Miles`, 14, 69);

      // Section: ETA & Telemetry
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Estimated Travel Time (ETA)', 14, 82);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Base Estimated Travel Time: ${currentMeta.travelTime}`, 14, 90);
      doc.text(`Countdown Status: ${formatCountdown(secondsRemaining)} remaining (${completedPct}% completed)`, 14, 97);
      doc.text(`Compass Vector: ${currentMeta.compass} | Elevation: ${currentMeta.elevation}`, 14, 104);

      // Section: Fare Estimate Breakdown
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Fare Estimate Breakdown', 14, 117);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Estimated Total Fare: EC$ ${fareTotalXCD.toFixed(2)} (${(fareTotalXCD / 2.70).toFixed(2)} USD)`, 14, 125);
      doc.text('Includes: 15% Dominica VAT, Base Dispatch, and Mileage Surcharge', 14, 132);
      doc.text('Accepted Payments: NBD MoBanking, mPay Wallet, Visa/Mastercard, Cash EC$', 14, 139);

      // Footer note
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Elite Ride Dominica · Verified GPS Dispatch Matrix · 24/7 Roadside Assistance', 14, 155);

      // Save and print
      doc.autoPrint();
      doc.save(`EliteRide_TripSummary_${currentMeta.shortName}_${Date.now()}.pdf`);

      setReceiptNotice(`Generated PDF Trip Summary for ${currentMeta.shortName}!`);
      setTimeout(() => setReceiptNotice(null), 4000);
    } catch (err) {
      console.error('Failed to generate PDF summary:', err);
    }
  }, [
    pickupLocationObj.name,
    currentMeta,
    distanceMiles,
    secondsRemaining,
    completedPct,
    fareTotalXCD,
  ]);

  const onDropoffRef = useRef(onDropoffChange);
  useEffect(() => {
    onDropoffRef.current = onDropoffChange;
  }, [onDropoffChange]);

  // Expose global window helper for PDF printing
  useEffect(() => {
    (window as any).printEstTripSummaryPDF = handlePrintTripSummary;
    (window as any).resolveEliteLocationMeta = resolveEliteLocationMeta;
    (window as any).syncEstEtaCountdownTimer = (destId: string) => {
      if (onDropoffRef.current) {
        onDropoffRef.current(destId);
      }
    };
  }, [handlePrintTripSummary]);

  // Listen to online / offline network events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter destinations by name or district
  const filteredDestinations = ELITE_ESTIMATION_LOCATIONS_META.filter((dest) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dest.name.toLowerCase().includes(q) ||
      dest.district.toLowerCase().includes(q) ||
      dest.shortName.toLowerCase().includes(q) ||
      dest.highwayCorridor.toLowerCase().includes(q)
    );
  });

  const handleSelectDestination = (destId: string) => {
    onDropoffChange(destId);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleReset = () => {
    if (typeof window !== 'undefined' && (window as any).resetRideLocationAndFare) {
      (window as any).resetRideLocationAndFare();
    } else if (onResetRideAndFare) {
      onResetRideAndFare();
    }
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(3.0, parseFloat((prev + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.75, parseFloat((prev - 0.25).toFixed(2))));
  const handleZoomReset = () => setZoomLevel(1.0);

  // Wheel zoom handler on live map
  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <div className="space-y-5">
      {/* Search Bar & Destination Intelligence Bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="est-destination-search"
            className="text-xs font-bold text-white flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search Destination by Name or District</span>
          </label>
          <span className="text-[10px] font-mono text-neutral-400">
            Real-time District Filtering
          </span>
        </div>

        <div className="relative">
          <input
            id="est-destination-search"
            type="text"
            placeholder="Type district (e.g. St. Andrew, St. John, St. David, St. George, St. Paul, St. Mark)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Filter Dropdown Popup when typing or focused */}
        {isSearchFocused && (
          <div className="absolute z-40 left-0 right-0 mt-2 bg-neutral-900/98 backdrop-blur-md border border-neutral-700 rounded-2xl shadow-2xl max-h-80 overflow-y-auto p-2 space-y-1.5 divide-y divide-neutral-800">
            <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-neutral-400">
              <span>Matching Destinations ({filteredDestinations.length})</span>
              <button
                type="button"
                onClick={() => setIsSearchFocused(false)}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
              >
                Close List
              </button>
            </div>

            {filteredDestinations.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-400">
                No matching Dominica destinations in this district.
              </div>
            ) : (
              filteredDestinations.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelectDestination(dest.id)}
                  className="w-full text-left p-2.5 hover:bg-neutral-800/80 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate group-hover:text-emerald-300">
                        {dest.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-medium">
                          {dest.district}
                        </span>
                        <span className="truncate">{dest.highwayCorridor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      {dest.travelTime}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {dest.distanceMiles} mi
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          #est-route-map-card
          Contains View Mode Toggle, Route Path View, Live Map View, Progress Bar,
          Favorite Heart, Print PDF Receipt & Service Worker Offline Mode
          ========================================================================= */}
      <div
        id="est-route-map-card"
        data-view-mode={viewMode}
        className="bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Card Header: Mode Switcher, Favorite Button, Print Receipt & Reset CTA */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/80">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle Button */}
            <button
              id="est-toggle-map-view-btn"
              type="button"
              onClick={() => setViewMode((prev) => (prev === 'live-map' ? 'hidden' : 'live-map'))}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow"
              title="Toggle interactive Live GPS Map"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {viewMode === 'live-map' ? 'Hide Live Map' : 'Show Interactive Live Map'}
              </span>
            </button>

            {/* Current Destination Display inside card */}
            <div
              id="est-map-card-destination"
              className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2 text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
                {isFareReset ? 'Select Destination' : currentMeta.name}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-900">
                {currentMeta.district}
              </span>
            </div>

            {/* Pin/Favorite Heart Button */}
            <button
              id="est-favorite-heart-btn"
              type="button"
              data-favorited={isCurrentFavorited ? 'true' : 'false'}
              onClick={handleToggleFavorite}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isCurrentFavorited
                  ? 'bg-rose-950/80 border-rose-500/80 text-rose-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title={isCurrentFavorited ? 'Remove from Favorites' : 'Save as Favorite Route'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isCurrentFavorited ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`}
              />
              <span>{isCurrentFavorited ? '❤️ Pinned Favorite' : '🤍 Pin Favorite'}</span>
            </button>
          </div>

          {/* Action CTAs: Print Receipt & Reset Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="est-print-trip-summary-btn"
              type="button"
              onClick={handlePrintTripSummary}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-neutral-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print formatted PDF Trip Summary Receipt"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print Trip Summary</span>
            </button>

            <button
              id="est-reset-btn"
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-red-950/50 text-neutral-300 hover:text-red-300 border border-neutral-800 hover:border-red-800/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset Ride Location & Fare to EC$ 0.00"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
              <span>Reset</span>
            </button>

            <button
              id="vc-reset-fare-btn"
              type="button"
              onClick={handleReset}
              className="hidden sm:flex px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[11px] text-neutral-400 hover:text-white border border-neutral-800 rounded-xl font-mono cursor-pointer"
              title="Reset Fare to EC$ 0.00"
            >
              Reset Fare
            </button>
          </div>
        </div>

        {/* Quick-Access Favorite Routes Strip inside card */}
        <div
          id="est-favorite-routes-quickbar"
          className="bg-neutral-950 px-4 py-2 border-b border-neutral-900 flex flex-wrap items-center gap-2"
        >
          <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Quick-Access Favorites:</span>
          </span>
          {pinnedFavorites.map((favId) => {
            const meta = resolveEliteLocationMeta(favId);
            const isSelected = dropoffId === favId;
            return (
              <button
                key={favId}
                type="button"
                data-testid="est-favorite-route-chip"
                onClick={() => handleSelectDestination(favId)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                <span>{meta.shortName}</span>
                <span className="text-[10px] text-emerald-400 font-mono">({meta.travelTime})</span>
              </button>
            );
          })}
        </div>

        {/* Inline PDF Print Confirmation Preview */}
        {receiptNotice && (
          <div
            id="est-print-summary-receipt-preview"
            className="bg-emerald-950/90 border-b border-emerald-800 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between font-mono"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{receiptNotice}</span>
            </span>
            <span className="text-[10px] text-emerald-400">Downloaded PDF Receipt</span>
          </div>
        )}

        {/* ================= LIVE ETA COUNTDOWN TIMER BOX ================= */}
        <div
          id="est-eta-countdown-box"
          className="bg-neutral-900/90 px-4 sm:px-6 py-3 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block leading-tight">
                Live ETA Countdown &amp; Route Sync
              </span>
              <span
                id="est-eta-countdown-timer"
                data-destination={isFareReset ? '' : currentMeta.id}
                data-destination-name={isFareReset ? '' : currentMeta.name}
                data-travel-time={isFareReset ? '0 mins' : currentMeta.travelTime}
                data-minutes-remaining={isFareReset ? '0' : String(currentMeta.minutesRemaining)}
                data-eta-minutes={isFareReset ? '0' : String(currentMeta.minutesRemaining)}
                className="text-xs sm:text-sm font-mono font-bold text-white tracking-wide"
              >
                {timerText}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
              {isFareReset ? 'EC$ 0.00' : formatFare(fareTotalXCD, currency)}
            </span>
          </div>
        </div>

        {/* ================= VISUAL TRIP PROGRESS BAR SECTION ================= */}
        <div
          id="est-trip-progress-section"
          className="bg-neutral-950 px-4 sm:px-6 py-3 border-b border-neutral-800/80 space-y-2"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                Journey Completion
              </span>
              <span
                id="est-trip-progress-pct"
                className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-900 text-[11px]"
              >
                {completedPct}% Completed
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span id="est-trip-progress-elapsed" className="text-neutral-400">
                Elapsed: {elapsedMinutes}m
              </span>
              <span id="est-trip-progress-remaining" className="text-emerald-300 font-bold">
                Remaining: {remainingMinutes}m
              </span>
              <button
                id="est-trip-progress-step-btn"
                type="button"
                onClick={handleStepProgress}
                className="p-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Preview Journey Step (+15%)"
              >
                <FastForward className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Progress Track & Bar */}
          <div
            id="est-trip-progress-track"
            className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800"
          >
            <div
              id="est-trip-progress-bar"
              data-journey-completed-pct={completedPct}
              role="progressbar"
              aria-valuenow={completedPct}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(52,211,153,0.5)]"
              style={{ width: `${completedPct}%` }}
            />
          </div>
        </div>

        {/* ================= SERVICE WORKER OFFLINE MODE PANEL ================= */}
        <div
          id="est-offline-mode-panel"
          className="bg-neutral-900/40 px-4 py-2.5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs"
        >
          <div className="flex items-center gap-2">
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="text-neutral-300 font-mono text-[11px]">
              {isOffline ? 'Offline Mountain Mode Active' : 'Online · Service Worker Cached'}
            </span>
            {offlineCachedData && (
              <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
                (Last Cached: {offlineCachedData.timestamp || 'Active'})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="est-restore-cached-estimate-btn"
              type="button"
              onClick={handleRestoreCachedEstimate}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 rounded-lg text-[11px] font-mono cursor-pointer"
            >
              Restore Cached Estimate
            </button>
            <button
              id="est-offline-mode-toggle-btn"
              type="button"
              onClick={() => setIsOffline((prev) => !prev)}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-[11px] font-mono cursor-pointer"
            >
              {isOffline ? 'Go Online' : 'Simulate Offline'}
            </button>
          </div>
        </div>

        {offlineSuccessNotice && (
          <div className="bg-emerald-950 px-4 py-1.5 border-b border-emerald-800 text-[11px] text-emerald-300 font-mono">
            {offlineSuccessNotice}
          </div>
        )}



        {/* ================= VIEW 2: LIVE MAP VIEW WITH INTERACTIVE ZOOM ================= */}
        {viewMode === 'live-map' && (
          <div
            id="est-live-map-view"
            onWheel={handleWheelZoom}
            className="relative h-72 sm:h-96 bg-neutral-950 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {/* Interactive Zoom Controls Container */}
            <div
              id="est-map-zoom-controls"
              className="absolute top-4 right-4 z-20 bg-neutral-900/95 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 shadow-xl flex flex-col items-center gap-2"
            >
              <button
                id="est-map-zoom-in"
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                id="est-map-zoom-out"
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                id="est-map-zoom-reset"
                type="button"
                onClick={handleZoomReset}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4 text-neutral-300" />
              </button>

              {/* Zoom Slider */}
              <div className="pt-2 border-t border-neutral-800 flex flex-col items-center">
                <input
                  id="est-map-zoom-slider"
                  type="range"
                  min="0.75"
                  max="3.0"
                  step="0.05"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  className="w-16 accent-emerald-500 cursor-pointer h-1.5 bg-neutral-700 rounded-lg"
                />
                <span
                  id="est-map-zoom-level"
                  className="text-[10px] font-mono text-emerald-400 font-bold mt-1"
                >
                  {zoomLevel.toFixed(2)}x
                </span>
              </div>
            </div>

            {/* Scalable Live Map Canvas Artwork */}
            <div
              className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <svg viewBox="0 0 600 600" className="w-full h-full max-h-96" xmlns="http://www.w3.org/2000/svg">
                {/* Island shape */}
                <path
                  d="M 280,30 C 370,35 460,70 510,120 C 550,170 540,240 520,310 C 490,400 420,490 350,550 C 290,590 230,570 200,520 C 170,470 160,390 170,300 C 180,210 200,120 230,60 Z"
                  fill="#064e3b"
                  fillOpacity="0.4"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Primary Road Network */}
                <path
                  d="M 240,480 Q 220,380 200,290 T 190,150 T 440,80 T 490,110 T 440,310 T 330,540 Z"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                />

                {/* Central Cross Highway through Pont Casse */}
                <path
                  d="M 220,420 L 310,350 L 440,310"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* All Major Town GPS Nodes */}
                {ELITE_ESTIMATION_LOCATIONS_META.map((loc) => (
                  <circle
                    key={loc.id}
                    cx={loc.coordinates.x}
                    cy={loc.coordinates.y}
                    r={loc.id === dropoffId ? '7' : '3.5'}
                    fill={loc.id === dropoffId ? '#34d399' : '#047857'}
                    stroke="#ffffff"
                    strokeWidth={loc.id === dropoffId ? '2' : '0.5'}
                  />
                ))}

                {/* Origin GPS Pin */}
                <circle cx="240" cy="480" r="7" fill="#059669" stroke="#ffffff" strokeWidth="2" />

                {/* Destination GPS Pin */}
                <circle
                  cx={currentMeta.coordinates.x}
                  cy={currentMeta.coordinates.y}
                  r="8"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Moving Chauffeur Marker */}
                <g
                  transform={`translate(${
                    Math.round(240 + (currentMeta.coordinates.x - 240) * 0.45)
                  }, ${
                    Math.round(480 + (currentMeta.coordinates.y - 480) * 0.45)
                  })`}
                >
                  <circle r="10" fill="#047857" stroke="#34d399" strokeWidth="2" />
                  <polygon points="-4,-4 6,0 -4,4" fill="#ffffff" />
                </g>
              </svg>
            </div>

            {/* Bottom Live Telemetry Overlay */}
            <div className="absolute bottom-3 left-4 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-800 text-[10px] font-mono text-neutral-300">
              DOMINICA LIVE DISPATCH MATRIX · GPS PING: 100% RELIABLE
            </div>
          </div>
        )}

        {/* ================= DESTINATION STREET VIEW PANEL ================= */}
        <div
          id="est-street-view-panel"
          data-destination={isFareReset ? '' : currentMeta.id}
          data-district={currentMeta.district}
          className="border-t border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">
                Destination Street View Synced with Travel Time
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                {currentMeta.district}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                id="est-street-view-travel-time"
                className="text-xs font-mono font-bold text-emerald-400 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800"
              >
                {isFareReset ? '0 mins · 0.0 miles' : `${currentMeta.travelTime} · ${distanceMiles} miles`}
              </span>
            </div>
          </div>

          {/* Street View Visual Window with Interactive 360° Compass Pan */}
          <div className="relative h-44 sm:h-56 bg-black rounded-2xl overflow-hidden border border-neutral-800 group">
            <img
              id="est-street-view-img"
              src={currentMeta.streetViewImage}
              alt={`${currentMeta.name} Street View`}
              title={`${currentMeta.name} - ${currentMeta.highwayCorridor}`}
              data-destination={isFareReset ? '' : currentMeta.id}
              data-destination-id={isFareReset ? '' : currentMeta.id}
              data-destination-name={isFareReset ? '' : currentMeta.name}
              data-district={currentMeta.district}
              data-travel-time={isFareReset ? '0 mins' : currentMeta.travelTime}
              data-distance={isFareReset ? '0.0 miles' : `${distanceMiles} miles`}
              data-base-fare={isFareReset ? 'EC$ 0.00' : `EC$ ${fareTotalXCD.toFixed(2)}`}
              data-corridor={currentMeta.highwayCorridor}
              className="w-full h-full object-cover transition-transform duration-300 select-none"
              style={{
                transform: `scale(1.1) translateX(${streetViewPan}px)`,
              }}
            />

            {/* Subtle Gradient & Compass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Interactive Pan Controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setStreetViewPan((prev) => Math.min(50, prev + 15))}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[11px] font-mono cursor-pointer"
                title="Pan Left"
              >
                ◀ Pan
              </button>
              <button
                type="button"
                onClick={() => setStreetViewPan(0)}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] font-mono cursor-pointer"
                title="Center Pan"
              >
                Center
              </button>
              <button
                type="button"
                onClick={() => setStreetViewPan((prev) => Math.max(-50, prev - 15))}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[11px] font-mono cursor-pointer"
                title="Pan Right"
              >
                Pan ▶
              </button>
            </div>

            {/* Street View Telemetry Pill */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-white font-mono flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <Compass className="w-3.5 h-3.5" />
                <span>{currentMeta.compass}</span>
              </span>
              <span className="text-neutral-400 hidden sm:inline">|</span>
              <span className="text-neutral-300 hidden sm:inline">{currentMeta.elevation}</span>
              <span className="text-neutral-400 hidden sm:inline">|</span>
              <span className="text-neutral-300 hidden sm:inline">{currentMeta.speed} avg</span>
            </div>

            {/* Corridor Title Top Left */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-neutral-200">
              {currentMeta.highwayCorridor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
