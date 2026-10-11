import React, { useState } from 'react';
import { 
  Gift, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Sparkles, 
  Flame, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  MessageCircle,
  Send
} from 'lucide-react';
import { DiwaliTicket } from '../types';

interface ReferAndEarnProps {
  activeTicket?: DiwaliTicket | null;
  onEnterContest?: (e?: React.MouseEvent) => void;
}

export const ReferAndEarn: React.FC<ReferAndEarnProps> = ({ activeTicket, onEnterContest }) => {
  const [ticketInput, setTicketInput] = useState(activeTicket?.ticketId || '');
  const [copied, setCopied] = useState(false);

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
    if (onEnterContest) {
      onEnterContest(e);
    }
  };

  const currentTicketId = activeTicket?.ticketId || ticketInput.trim() || 'DWL-DIWALI';
  const referralLink = `https://drive-your-luck-this-diwali.vercel.app?ref=${currentTicketId}`;

  const shareText = `🪔 Shubh Deepavali! Claim your exclusive Diwali Festive Pass & unlock grand celebration rewards! Claim your pass with my link: ${referralLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('🪔 Claim your Diwali Celebration Access & Festive Rewards!')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1c0022] via-[#330030] to-[#1a001a] border-2 border-emerald-500/50 p-6 sm:p-8 text-center shadow-[0_10px_35px_rgba(16,185,129,0.2)]">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider bg-black/40 px-3.5 py-1 rounded-full border border-emerald-500/40 mb-3 shadow-sm">
          <Gift className="w-4 h-4 text-emerald-400" />
          <span>Viral Festive Rewards · Refer & Earn Perks</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Rozha_One'] tracking-tight">
          🪔 Share Festive Joy & Unlock Bonus Perks!
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 max-w-xl mx-auto leading-relaxed">
          Invite friends & family to claim their <strong>Diwali Celebration Access</strong>. Every friend who verifies their Festive Pass unlocks exclusive bonus rewards and milestone celebration perks for you!
        </p>

        {/* Dynamic Referral Link Box */}
        <div className="mt-6 max-w-2xl mx-auto bg-black/60 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Your Personalized Referral Link
            </span>
            {!activeTicket && (
              <span className="text-[11px] text-amber-300">
                Tip: Enter your DWL Ticket ID below for personalized attribution!
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 bg-[#090312] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-200 select-all overflow-x-auto whitespace-nowrap">
              {referralLink}
            </div>

            <button
              onClick={handleCopy}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/30 transition-transform active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleTelegramShare}
              className="px-4 py-2 bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/50 text-[#229ED9] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Share on Telegram</span>
            </button>

            {!activeTicket && (
              <div className="w-full sm:w-auto mt-1 sm:mt-0 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Ticket ID (e.g. DWL-584920)"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                  className="px-3 py-1.5 bg-black/60 border border-emerald-500/30 rounded-lg text-xs font-mono text-white placeholder-slate-500 w-48 focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={handleScrollToForm}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Fill Registration Form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Referral Milestone Rewards Ladder */}
      <div className="bg-[#120722]/90 border border-amber-900/40 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-amber-900/40 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Milestone Celebration Perks</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-['Rozha_One']">
            Referral Tier Rewards Ladder
          </h3>
          <p className="text-xs text-amber-200/70 mt-1">
            The more friends who claim their Diwali Celebration Pass, the higher your celebration reward status!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tier 1 */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-amber-950/40 to-black/60 border border-amber-700/40 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Bronze Festive Booster</h4>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Invite 1 friend who claims pass ➔ Extra Lucky Slot entry added to your verified profile.
            </p>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/50 block w-fit">
              1 Verified Friend
            </span>
          </div>

          {/* Tier 2 */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900/40 to-black/60 border border-slate-500/40 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-400/20 text-slate-300 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="text-sm font-bold text-white">Silver Celebration Pass</h4>
            <p className="text-xs text-slate-200/80 leading-relaxed">
              Invite 3 friends ➔ +25 Bonus Festive Credits & priority customer support channel.
            </p>
            <span className="text-[10px] font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700/50 block w-fit">
              3 Verified Friends
            </span>
          </div>

          {/* Tier 3 */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-yellow-950/40 to-black/60 border border-yellow-500/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold text-sm">
              5
            </div>
            <h4 className="text-sm font-bold text-white">Golden Star Status</h4>
            <p className="text-xs text-yellow-100/80 leading-relaxed">
              Invite 5 friends ➔ Top Tier draw multiplier + exclusive VIP Diwali greeting badge.
            </p>
            <span className="text-[10px] font-bold text-yellow-300 bg-yellow-950 px-2 py-0.5 rounded border border-yellow-700/50 block w-fit">
              5 Verified Friends
            </span>
          </div>

          {/* Tier 4 */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-purple-950/40 to-black/60 border border-purple-500/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-400/20 text-purple-300 flex items-center justify-center font-bold text-sm">
              10+
            </div>
            <h4 className="text-sm font-bold text-white">Diamond Mega Booster</h4>
            <p className="text-xs text-purple-100/80 leading-relaxed">
              Invite 10+ friends ➔ ₹5,000 Milestone Festive Reward eligibility + Special Diwali Hamper!
            </p>
            <span className="text-[10px] font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-700/50 block w-fit">
              10+ Verified Friends
            </span>
          </div>
        </div>
      </div>

      {/* How it Works 3 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left space-y-2">
          <div className="text-xs font-bold text-amber-400 uppercase">Step 1</div>
          <h5 className="font-bold text-white text-sm">Get Your Pass & Link</h5>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            Register on the site to get your unique <code className="text-amber-300 font-mono">DWL-XXXXXX</code> Ticket ID. Your referral link is created instantly.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left space-y-2">
          <div className="text-xs font-bold text-amber-400 uppercase">Step 2</div>
          <h5 className="font-bold text-white text-sm">Share on Social Channels</h5>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            Share via WhatsApp, Telegram, or social media. When friends click, your referral code is automatically attached to their festive registration.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left space-y-2">
          <div className="text-xs font-bold text-amber-400 uppercase">Step 3</div>
          <h5 className="font-bold text-white text-sm">Unlock Milestone Perks</h5>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            As your invited friends confirm their entry pass via 100 Telegram Stars (⭐ XTR), your celebration tier upgrades automatically!
          </p>
        </div>
      </div>
    </div>
  );
};
