import React, { useState, useEffect } from 'react';
import { Clock, Flame, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

interface GrandPrizeCountdownProps {
  onEnterNow?: () => void;
  targetDate?: string; // Optional ISO string for custom target
}

export const GrandPrizeCountdown: React.FC<GrandPrizeCountdownProps> = ({
  onEnterNow,
  targetDate,
}) => {
  // Target Diwali 2026 Grand Draw Night (November 8, 2026 at 20:00:00 IST)
  // Fallback to 18 days 7 hours from current date if targetDate not passed
  const calculateTarget = (): number => {
    if (targetDate) {
      return new Date(targetDate).getTime();
    }
    // Diwali 2026 Mega Draw: 2026-11-08T14:30:00.000Z (20:00 IST)
    const diwaliDrawDate = new Date('2026-11-08T14:30:00.000Z').getTime();
    const now = Date.now();
    if (diwaliDrawDate > now) {
      return diwaliDrawDate;
    }
    // If past, show countdown for next 3 days for active urgency
    return now + (3 * 24 * 60 * 60 + 8 * 60 * 60 + 45 * 60) * 1000;
  };

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = calculateTarget();

    const updateTimer = () => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [targetDate]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#21000e] via-[#3d0216] to-[#21000e] border-2 border-[#ffd700] p-5 sm:p-7 shadow-[0_10px_35px_rgba(255,215,0,0.25)] text-center">
        {/* Decorative ambient glows */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#ffd700] uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full border border-[#ffd700]/40 shadow-sm animate-pulse">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>Limited-Time Festive Draw Alert</span>
          </div>
          <span className="text-xs text-amber-200/80 font-medium">
            · Mega Draw: Diwali Night · 8:00 PM IST Live
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-['Rozha_One'] tracking-tight">
          ₹5 Crore Mega Grand Jackpot Closes In:
        </h3>
        <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-xl mx-auto">
          Golden ticket slots are filling rapidly! Secure your <code className="text-[#ffd700] font-mono font-bold">DWL-XXXXXX</code> ticket to lock in your chance across the 10,000+ winning slots.
        </p>

        {/* Dynamic Countdown Flip Blocks */}
        <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
          {/* Days */}
          <div className="bg-black/60 border border-[#ffd700]/50 rounded-xl p-2.5 sm:p-3 text-center shadow-inner">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-[#ffd700] font-mono leading-none">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase mt-1 tracking-wider">
              Days
            </div>
          </div>

          {/* Hours */}
          <div className="bg-black/60 border border-[#ffd700]/50 rounded-xl p-2.5 sm:p-3 text-center shadow-inner">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-[#ffd700] font-mono leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase mt-1 tracking-wider">
              Hours
            </div>
          </div>

          {/* Minutes */}
          <div className="bg-black/60 border border-[#ffd700]/50 rounded-xl p-2.5 sm:p-3 text-center shadow-inner">
            <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-[#ffd700] font-mono leading-none">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase mt-1 tracking-wider">
              Mins
            </div>
          </div>

          {/* Seconds */}
          <div className="bg-black/60 border border-orange-500/70 rounded-xl p-2.5 sm:p-3 text-center shadow-inner relative overflow-hidden">
            <div className="text-2xl sm:text-4xl font-black text-orange-400 font-mono leading-none animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-orange-300 uppercase mt-1 tracking-wider">
              Secs
            </div>
          </div>
        </div>

        {/* Urgency Progress Bar */}
        <div className="mt-5 max-w-md mx-auto">
          <div className="flex items-center justify-between text-[11px] text-amber-200/90 mb-1 font-semibold">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              9,480 / 10,000+ Slots Claimed
            </span>
            <span className="text-orange-300 font-bold">94.8% Full</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-[#ffd700]/30 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 shadow-sm"
              style={{ width: '94.8%' }}
            />
          </div>
        </div>

        {/* Action Button */}
        {onEnterNow && (
          <div className="mt-5">
            <a
              href="#registration-form"
              onClick={(e) => {
                e.preventDefault();
                onEnterNow();
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-[#ffd700] via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Claim Festive Pass (100 ⭐ XTR)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
