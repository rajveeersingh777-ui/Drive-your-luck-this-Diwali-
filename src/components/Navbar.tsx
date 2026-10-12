import React from 'react';
import { Sparkles, ShieldCheck, Flame, ExternalLink, Bot, Users } from 'lucide-react';
import { CAMPAIGN_INFO } from '../utils/constants';
import { DiwaliDiya } from './DiwaliDiya';

interface NavbarProps {
  activeTab: 'register' | 'verify' | 'stars-guide' | 'prizes' | 'referrals';
  onSelectTab: (tab: 'register' | 'verify' | 'stars-guide' | 'prizes' | 'referrals') => void;
  onOpenAiChat: () => void;
  walletBalance?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onOpenAiChat, walletBalance = 0 }) => {
  const handleScrollToForm = (e?: React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    onSelectTab('register');
    setTimeout(() => {
      const element = document.getElementById('registration-step-span')
        || document.querySelector('#registration-form-box div div span')
        || document.getElementById('registration-form-box')
        || document.getElementById('register-form')
        || document.querySelector('form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 800, behavior: 'smooth' });
      }
    }, 50);
  };
  return (
    <header className="sticky top-0 z-40 bg-[#0e0618]/90 backdrop-blur-md border-b border-amber-900/30">
      {/* Top Festive Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-950/80 via-amber-800/60 to-purple-950/80 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <DiwaliDiya size={18} glow={false} />
            <span className="font-semibold text-amber-300">Diwali 2026 Celebration</span>
            <span aria-hidden="true" className="text-amber-500/50">·</span>
            <span>Grand Rewards Pool: <strong className="text-white">{CAMPAIGN_INFO.totalPrizePool}</strong></span>
            <span aria-hidden="true" className="text-amber-500/50">·</span>
            <span>Festive Pass: <strong className="text-amber-300">100 Telegram Stars (⭐ XTR)</strong></span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-amber-300/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Official Festive Pass Portal
            </span>
            <span aria-hidden="true" className="text-amber-500/50">·</span>
            <span className="text-amber-300 font-medium">
              Celebration Access
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo with Diwali Diya Official Campaign Logo */}
        <div 
          onClick={() => onSelectTab('register')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-950 via-[#220716] to-[#0c0314] flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform border border-amber-400/40 p-1">
            <DiwaliDiya size={34} glow={true} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 font-['Cinzel'] tracking-wide">
                Drive Your Luck
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-amber-300 uppercase bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40">
                Diwali 🪔
              </span>
            </div>
            <p className="text-[11px] text-amber-400/80 font-medium flex items-center gap-1">
              <span>Official Festive Campaign</span>
            </p>
          </div>
        </div>

        {/* Desktop Nav Controls */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-amber-950/40 border border-amber-900/40 rounded-xl">
          <a
            href="#register-form"
            onClick={handleScrollToForm}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all inline-flex items-center justify-center cursor-pointer ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/30'
            }`}
          >
            Claim Pass
          </a>
          <button
            onClick={() => onSelectTab('verify')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'verify'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/30'
            }`}
          >
            Verify Pass
          </button>
          <button
            onClick={() => onSelectTab('stars-guide')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'stars-guide'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/30'
            }`}
          >
            Stars (⭐ XTR) Guide
          </button>
          <button
            onClick={() => onSelectTab('prizes')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'prizes'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
                : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/30'
            }`}
          >
            Festive Rewards
          </button>
          <button
            onClick={() => onSelectTab('referrals')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'referrals'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 font-bold'
                : 'text-emerald-300 hover:text-emerald-100 hover:bg-emerald-950/40 border border-emerald-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Refer & Earn</span>
            <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-950/90 text-emerald-300 font-mono text-[10px] rounded-full border border-emerald-400/30">
              ₹{walletBalance}
            </span>
          </button>
        </nav>

        {/* Action Button: AI Assistant */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiChat}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-900/40 border border-amber-400/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Diwali AI Sahayak</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-amber-900/30 gap-1.5 bg-[#0b0414]">
        <a
          href="#register-form"
          onClick={handleScrollToForm}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg inline-flex items-center justify-center cursor-pointer ${
            activeTab === 'register' ? 'bg-amber-500 text-black font-bold' : 'text-amber-200/70'
          }`}
        >
          Claim Pass
        </a>
        <button
          onClick={() => onSelectTab('verify')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg ${
            activeTab === 'verify' ? 'bg-amber-500 text-black font-bold' : 'text-amber-200/70'
          }`}
        >
          Verify Pass
        </button>
        <button
          onClick={() => onSelectTab('stars-guide')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg ${
            activeTab === 'stars-guide' ? 'bg-amber-500 text-black font-bold' : 'text-amber-200/70'
          }`}
        >
          Stars Guide
        </button>
        <button
          onClick={() => onSelectTab('prizes')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg ${
            activeTab === 'prizes' ? 'bg-amber-500 text-black font-bold' : 'text-amber-200/70'
          }`}
        >
          Rewards
        </button>
        <button
          onClick={() => onSelectTab('referrals')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg flex items-center gap-1 ${
            activeTab === 'referrals' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-300'
          }`}
        >
          <span>Refer & Earn</span>
          <span className="text-[10px] font-mono text-emerald-200">
            (₹{walletBalance})
          </span>
        </button>
      </div>
    </header>
  );
};
