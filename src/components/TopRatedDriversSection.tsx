import React, { useState } from 'react';
import { Star, ShieldCheck, Award, Car, MapPin, ThumbsUp, MessageSquare } from 'lucide-react';
import { Currency } from '../types/booking';

interface TopRatedDriversSectionProps {
  onSelectTier?: (tierId: string) => void;
  onBookNow?: () => void;
}

export const TopRatedDriversSection: React.FC<TopRatedDriversSectionProps> = ({
  onSelectTier,
  onBookNow,
}) => {
  const [selectedReviewDriver, setSelectedReviewDriver] = useState<string | null>(null);

  const topDrivers = [
    {
      id: 'drv-505',
      name: 'Gabriel Joseph',
      tier: 'Airport VIP Transfer',
      tierId: 'airport-vip-transfer',
      rating: 4.98,
      tripsCount: 980,
      experienceYears: '9 yrs in Dominica',
      vehicle: 'Mercedes-Benz VIP Executive Lounge (Jet Black)',
      plate: 'DA-0044',
      location: 'Douglas-Charles Airport (DOM)',
      avatar: 'GJ',
      badge: 'Airport Chauffeur Master',
      endorsements: ['English', 'French (Kweyol)', 'Flight Punctuality 100%'],
      recentReview: {
        rider: 'Dr. Evelyn St. Rose',
        date: 'Oct 11, 2026',
        rating: 5,
        text: 'Gabriel met me right at arrivals with chilled Dominica sparkling water. The ride across the rainforest pass was smooth and luxurious.',
      },
    },
    {
      id: 'drv-491',
      name: 'Jean-Pierre Bruno',
      tier: 'Elite 4WD Mountain SUV',
      tierId: 'mountain-4wd-suv',
      rating: 4.96,
      tripsCount: 1420,
      experienceYears: '12 yrs in Dominica',
      vehicle: 'Toyota Land Cruiser Prado 4WD',
      plate: 'DA-4912',
      location: 'Roseau Bayfront & Ferry Terminal',
      avatar: 'JB',
      badge: 'Mountain Safety Specialist',
      endorsements: ['Mountain Switchback Certified', 'First Aid Certified', 'Kweyol Fluent'],
      recentReview: {
        rider: 'Marcus Vance',
        date: 'Oct 12, 2026',
        rating: 5,
        text: 'Jean-Pierre navigated the steep curves of Pont Cassé in heavy rain with total mastery. I felt 100% safe the entire ride.',
      },
    },
    {
      id: 'drv-203',
      name: 'Althea Fontaine',
      tier: 'Elite Standard Sedan',
      tierId: 'standard-sedan',
      rating: 4.92,
      tripsCount: 518,
      experienceYears: '6 yrs in Dominica',
      vehicle: 'Toyota Corolla Sedan (Silver Metallic)',
      plate: 'DA-1893',
      location: 'Portsmouth & Prince Rupert Bay',
      avatar: 'AF',
      badge: 'Hospitality & Tour Ambassador',
      endorsements: ['Eco-Tourism Guide', 'Spanish Speaker', 'Child-Seat Certified'],
      recentReview: {
        rider: 'Camille & Antoine Dupuis',
        date: 'Oct 10, 2026',
        rating: 5,
        text: 'Althea is delightful! She gave wonderful tips on Cabrits National Park and Portsmouth seafood spots.',
      },
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Vetted Dominica Chauffeurs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Top Rated Dominica Drivers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Verified commercial chauffeurs with clean police records, comprehensive passenger liability coverage, and outstanding ratings from Dominica visitors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">
              Fleet Average: <strong className="text-emerald-400 font-mono text-sm">★ 4.95 / 5.0</strong>
            </span>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-neutral-950/90 border border-neutral-800/80 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-emerald-950/20 group"
            >
              <div className="space-y-4">
                {/* Header with avatar & rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                      {driver.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                        {driver.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{driver.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{driver.rating}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 block mt-0.5 font-mono">
                      {driver.tripsCount} rides
                    </span>
                  </div>
                </div>

                {/* Badge & Vehicle Info */}
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-[11px]">Specialty:</span>
                    <span className="font-semibold text-emerald-400 text-[11px]">{driver.badge}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-[11px]">Vehicle:</span>
                    <span className="text-white text-[11px] font-medium truncate max-w-[170px]">{driver.vehicle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-[11px]">Plate #:</span>
                    <span className="font-mono text-neutral-300 text-[11px] font-bold">{driver.plate}</span>
                  </div>
                </div>

                {/* Endorsement Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {driver.endorsements.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Verified Rider Review Snippet */}
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-neutral-300">{driver.recentReview.rider}</span>
                    <span className="text-neutral-500 text-[10px]">{driver.recentReview.date}</span>
                  </div>
                  <p className="text-neutral-400 italic text-[11px] line-clamp-2">
                    "{driver.recentReview.text}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectTier) onSelectTier(driver.tierId);
                    if (onBookNow) onBookNow();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 font-bold text-xs transition-all border border-neutral-700 hover:border-emerald-500 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Book with {driver.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
