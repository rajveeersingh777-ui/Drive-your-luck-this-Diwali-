import React from 'react';
import { Trophy, Gift, Award, Sparkles, CheckCircle2, ShieldCheck, Flame, Calendar, Clock } from 'lucide-react';
import { CAMPAIGN_INFO } from '../utils/constants';
import { DiwaliPrizeBreakdownCard } from './DiwaliPrizeBreakdownCard';

interface PrizePoolSectionProps {
  onRegisterClick?: (e?: React.MouseEvent) => void;
}

export const PrizePoolSection: React.FC<PrizePoolSectionProps> = ({ onRegisterClick }) => {
  const handleScrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('registration-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback if ID is missing: search for form tag or input
      const formElement = document.querySelector('form') || document.querySelector('input');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    if (onRegisterClick) {
      onRegisterClick(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Official 10,000+ Winners Prize Breakdown Section Banner */}
      <DiwaliPrizeBreakdownCard />

      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>Mega Diwali Cash Rewards</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 font-['Rozha_One']">
          Grand Prize Pool: {CAMPAIGN_INFO.totalPrizePool}
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 mt-1 leading-relaxed">
          Is Diwali, kismat badalne ka mauka! Parivarik dhoom-dhaam ke sath cash prizes jeetiye direct bank account transfer ke zariye.
        </p>
      </div>

      {/* Prize Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1st Runner-Up (₹50 Lakhs) */}
        <div className="order-2 md:order-1 p-6 rounded-2xl bg-gradient-to-b from-[#1b1529] to-[#0e0717] border border-slate-500/30 text-center relative overflow-hidden shadow-lg self-end">
          <div className="w-12 h-12 rounded-xl bg-slate-400/20 text-slate-300 mx-auto flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-slate-300" />
          </div>
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest block">
            1st Runner-Up Slots
          </span>
          <p className="text-3xl font-black text-white mt-2">₹50,00,000</p>
          <p className="text-xs text-slate-300/80 mt-1">₹50 Lakhs Mega Cash Prize Each</p>
          <div className="mt-4 pt-4 border-t border-slate-700/30 text-[11px] text-slate-400">
            Multiple High-Tier Lucky Winners
          </div>
        </div>

        {/* Mega Grand Jackpot (₹5 Crore) (Center / Prominent) */}
        <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-[#2a1340] via-[#1c0c30] to-[#120621] border-2 border-amber-400/60 text-center relative overflow-hidden shadow-2xl shadow-amber-500/20 transform md:-translate-y-2">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow">
            Mega Jackpot
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <div className="w-full h-full bg-[#180829] rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
            Ultimate Diwali Jackpot
          </span>
          <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 mt-2">
            ₹5,00,00,000
          </p>
          <p className="text-xs text-amber-200 font-semibold mt-1">
            ₹5 Crore Grand Cash Jackpot
          </p>
          <div className="mt-6 pt-4 border-t border-amber-900/40 text-xs text-amber-300/80">
            Life-Changing Crorepati Mega Draw
          </div>
        </div>

        {/* 2nd Runner-Up (₹10 Lakhs) */}
        <div className="order-3 p-6 rounded-2xl bg-gradient-to-b from-[#24131e] to-[#0e0717] border border-amber-800/40 text-center relative overflow-hidden shadow-lg self-end">
          <div className="w-12 h-12 rounded-xl bg-amber-700/20 text-amber-500 mx-auto flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-amber-500" />
          </div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
            2nd Runner-Up Slots
          </span>
          <p className="text-3xl font-black text-white mt-2">₹10,00,000</p>
          <p className="text-xs text-amber-300/80 mt-1">₹10 Lakhs Golden Cash Prize Each</p>
          <div className="mt-4 pt-4 border-t border-amber-900/30 text-[11px] text-amber-400/70">
            Diamond Tier Lucky Draw Winners
          </div>
        </div>
      </div>

      {/* Festive Gold Rewards Banner (₹1,00,000 & ₹50,000) */}
      <div className="p-6 rounded-2xl bg-[#140824]/90 border border-amber-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Festive Gold & Dhan Rewards</h4>
            <p className="text-xs text-purple-200/80">
              ₹1,00,000 & ₹50,000 frequent lucky draws for participants across all verified DWL tickets!
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-amber-300">₹1,00,000 & ₹50k</span>
          <span className="text-[10px] text-purple-200/60 block">Frequent Draw Tier</span>
        </div>
      </div>

      {/* Official Draw Schedule & Rules */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#100720]/90 border border-amber-900/50 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-900/40 pb-4">
          <h3 className="text-base font-bold text-amber-200 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Official Contest Guidelines & Fair Play Rules</span>
          </h3>
          <div className="flex items-center gap-3 text-xs text-amber-300/80">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Diwali Night
            </span>
            <span aria-hidden="true" className="text-amber-500/50">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              8:00 PM IST
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-amber-200/80">
          <div className="space-y-1">
            <strong className="text-white block">1. Eligibility</strong>
            <p>Contest is open to all Indian citizens aged 18 years or above with a valid Indian Mobile Number and Correspondence Address.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">2. Single Verified Entry Per Ticket</strong>
            <p>Har DWL ticket ID tabhi lucky draw pool mein add hota hai jab official 100 Telegram Stars (⭐ XTR) payment verified ho jaye.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">3. Transparent Random Generator</strong>
            <p>Live stream par cryptographic random selection algorithm ke jariye sabhi verified Ticket IDs me se winners chune jayenge.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">4. Privacy & Data Protection</strong>
            <p>Personal mobile number aur correspondence address 100% confidential rahenge; public board par keval masked Ticket ID display hoga.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-amber-900/40 text-center">
          <button
            onClick={handleScrollToForm}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
          >
            Claim Your Ticket Before Entries Close
          </button>
        </div>
      </div>
    </div>
  );
};
