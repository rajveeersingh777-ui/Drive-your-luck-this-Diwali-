import React from 'react';
import { ShieldCheck, Flame, ExternalLink, Bot, Sparkles, Heart } from 'lucide-react';
import { CAMPAIGN_INFO } from '../utils/constants';
import { DiwaliDiya } from './DiwaliDiya';

interface FooterProps {
  onSelectTab: (tab: 'register' | 'verify' | 'stars-guide' | 'prizes' | 'referrals') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const handleScrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('registration-step-span') 
      || document.getElementById('register-form') 
      || document.querySelector('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 800, behavior: 'smooth' });
    }
    onSelectTab('register');
  };

  return (
    <footer className="mt-16 bg-[#0a0314] border-t border-amber-950/60 text-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-950 via-[#220716] to-[#0c0314] flex items-center justify-center border border-amber-400/40 shadow-lg p-1">
                <DiwaliDiya size={34} glow={true} />
              </div>
              <div>
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 font-['Cinzel']">
                  Drive Your Luck This Diwali
                </span>
                <p className="text-xs text-amber-400/80">
                  Official Festive Campaign on <span className="text-amber-200 font-semibold">{CAMPAIGN_INFO.host}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-amber-300/70 max-w-md leading-relaxed">
              Kismat Ki Roshni, Diwali Rewards Ki Barsaat! Secure your Festive Pass with 100 Telegram Stars (⭐ XTR) and unlock exclusive access to celebratory rewards on Diwali night.
            </p>

            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-300/80 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-amber-200">Strict Privacy Guarantee:</strong> Participant personal phone numbers and delivery addresses are encrypted and kept strictly confidential. No private details are exposed.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Contest Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={handleScrollToForm}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Enter Contest (Registration)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('verify')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Verify Ticket ID
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('referrals')}
                  className="hover:text-amber-200 transition-colors text-emerald-300 cursor-pointer"
                >
                  Refer & Earn Viral Perks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('stars-guide')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Telegram Stars (⭐ XTR) Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('prizes')}
                  className="hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Festive Rewards & Access
                </button>
              </li>
            </ul>
          </div>

          {/* Official Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Official Channels
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href={CAMPAIGN_INFO.botUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sky-300 hover:text-sky-200 p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40"
              >
                <Bot className="w-4 h-4 text-sky-400" />
                <span>{CAMPAIGN_INFO.botHandle}</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            </div>
            <p className="text-[11px] text-amber-400/60 pt-2">
              All transactions strictly processed through Telegram Stars official in-app payments.
            </p>
          </div>
        </div>

        {/* Meta Ad Policy Disclaimer & Transparency Notice */}
        <div className="border-t border-amber-950/60 pt-6 pb-2 text-[11px] text-amber-400/60 leading-relaxed text-center sm:text-left space-y-1.5">
          <p className="font-semibold text-amber-300/80">
            Official Campaign & Policy Safeguards:
          </p>
          <p>
            • Minimum withdrawal threshold remains strictly ₹1,000 INR via official UPI bank disbursement.
            • Direct referral bonus (₹100 INR) is unlocked only after valid 100 Telegram Stars (⭐ XTR) pass payment.
            • Festive winner commission (10%) is calculated on the official reward value following draw verification.
          </p>
          <p className="text-amber-300/70 italic pt-1">
            Disclaimer: This campaign is in no way sponsored, endorsed, or administered by Meta.
          </p>
        </div>

        {/* Bottom Bar - Completely removed any admin link */}
        <div className="border-t border-amber-950/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-400/60">
          <p>© 2026 Drive Your Luck This Diwali. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-300/80">
            <span>Shubh Deepavali 🪔 Apno Ke Saath Khushiyan Manao!</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
