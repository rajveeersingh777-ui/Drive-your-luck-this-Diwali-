import React from 'react';
import { Sparkles, Trophy, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { CAMPAIGN_INFO } from '../utils/constants';

interface HeroSectionProps {
  onEnterClick: () => void;
  onVerifyClick: () => void;
  stats?: {
    totalEntries: number;
    verifiedEntries: number;
    grandPrizePool: string;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterClick, onVerifyClick, stats }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-amber-950/40">
      {/* Decorative festive ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-amber-600/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Top unboxed subtle metadata header */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300/90 mb-4 tracking-wide uppercase">
          <span>Official Exclusive Contest</span>
          <span aria-hidden="true" className="text-amber-500/50">·</span>
          <span className="flex items-center gap-1 text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Diwali 2026 Special
          </span>
          <span aria-hidden="true" className="text-amber-500/50">·</span>
          <span>Official Bot @DriveYourLuckDiwaliBot</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-['Rozha_One'] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 leading-tight drop-shadow-sm">
          Drive Your Luck This Diwali
        </h1>

        <p className="mt-4 text-base sm:text-xl text-amber-200/90 max-w-2xl mx-auto font-medium leading-relaxed">
          Kismat Ki Roshni, Cash Prizes Ki Barsaat! Participate with just{' '}
          <span className="text-amber-300 font-bold underline decoration-amber-500/50 underline-offset-4">
            100 Telegram Stars (⭐ XTR)
          </span>{' '}
          and stand a chance to win from the{' '}
          <span className="text-white font-bold">{CAMPAIGN_INFO.totalPrizePool}</span> prize pool!
        </p>

        {/* Main CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onEnterClick}
            className="group px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Fill Registration Form</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onVerifyClick}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/30 flex items-center gap-2 transition-all hover:text-white"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Verify Existing Ticket</span>
          </button>
        </div>

        {/* Key Highlights / Stats Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Mega Grand Prize</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white">₹5 Crore</p>
            <p className="text-[11px] text-amber-300/70 mt-0.5">+ Elite Diwali Trophy</p>
          </div>

          <div className="p-4 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Entry Security Fee</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-300">100 ⭐ XTR</p>
            <p className="text-[11px] text-amber-300/70 mt-0.5">Approx ₹199 only</p>
          </div>

          <div className="p-4 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Entries</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-300">
              {stats ? stats.verifiedEntries.toLocaleString() : '1,024+'}
            </p>
            <p className="text-[11px] text-emerald-400/70 mt-0.5">Live Contest Pool</p>
          </div>

          <div className="p-4 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Mega Draw</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-200">Diwali Night</p>
            <p className="text-[11px] text-purple-300/70 mt-0.5">8:00 PM IST Live Stream</p>
          </div>
        </div>
      </div>
    </div>
  );
};
