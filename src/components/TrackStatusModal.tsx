import React, { useState } from 'react';
import { 
  Search, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Wallet, 
  Users, 
  Sparkles,
  Phone,
  Ticket,
  Mail,
  UserCheck
} from 'lucide-react';
import { DiwaliTicket } from '../types';
import { ReferralRecord, WithdrawalRecord } from './ReferAndEarn';

export interface UserSessionData {
  ticketId: string;
  fullName: string;
  mobile?: string;
  email?: string;
  walletBalance: number;
  referrals: ReferralRecord[];
  withdrawals: WithdrawalRecord[];
  ticket?: DiwaliTicket | null;
}

interface TrackStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionRestored: (userData: UserSessionData) => void;
  currentTicketId?: string;
  onNavigateToRegister: () => void;
}

export const TrackStatusModal: React.FC<TrackStatusModalProps> = ({
  isOpen,
  onClose,
  onSessionRestored,
  currentTicketId,
  onNavigateToRegister,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      setErrorMessage('Please enter your Mobile Number, Email, or Ticket ID (DWL-XXXXXX).');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    const cleanQuery = query.toLowerCase();
    const digitsOnly = query.replace(/\D/g, '');

    try {
      // 1. Search in localStorage user registry
      let registry: any[] = [];
      try {
        const raw = localStorage.getItem('dwl_user_registry');
        if (raw) registry = JSON.parse(raw);
      } catch (err) {
        // Registry parsing fallback
      }

      // Check in registry
      let matched = registry.find((u) => {
        const tId = (u.ticketId || '').toLowerCase();
        const uMobile = (u.mobile || '').replace(/\D/g, '');
        const uEmail = (u.email || '').toLowerCase();
        const uName = (u.fullName || '').toLowerCase();

        return (
          tId === cleanQuery ||
          tId.includes(cleanQuery) ||
          (digitsOnly.length >= 6 && uMobile.includes(digitsOnly)) ||
          (uEmail && uEmail === cleanQuery) ||
          uName.includes(cleanQuery)
        );
      });

      // 2. If not found in registry, search individual localStorage ticket keys
      if (!matched) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('dwl_ticket_') || key === 'dwl_latest_ticket')) {
            try {
              const ticketData = JSON.parse(localStorage.getItem(key) || '{}');
              const tId = (ticketData.ticketId || '').toLowerCase();
              const mNumber = (ticketData.maskedMobile || '').replace(/\D/g, '');
              const fName = (ticketData.fullName || '').toLowerCase();

              if (
                tId === cleanQuery ||
                (digitsOnly.length >= 6 && mNumber.includes(digitsOnly)) ||
                fName.includes(cleanQuery)
              ) {
                matched = {
                  ticketId: ticketData.ticketId,
                  fullName: ticketData.fullName,
                  mobile: ticketData.maskedMobile,
                  walletBalance: parseFloat(localStorage.getItem('dwl_user_wallet_balance') || '100'),
                  referrals: JSON.parse(localStorage.getItem('dwl_user_referrals') || '[]'),
                  withdrawals: JSON.parse(localStorage.getItem('dwl_user_withdrawals') || '[]'),
                  ticket: ticketData,
                };
                break;
              }
            } catch (e) {
              // Ignore invalid parse
            }
          }
        }
      }

      // 3. Fallback mock / demo accounts for quick testing if user enters known test identifiers
      if (!matched) {
        if (cleanQuery.includes('847291') || cleanQuery === 'dwl-847291') {
          matched = {
            ticketId: 'DWL-847291',
            fullName: 'Aarav Sharma',
            mobile: '+91 98765 43210',
            email: 'aarav.sharma@example.com',
            walletBalance: 7700,
            referrals: [
              {
                id: 'ref-demo-1',
                name: 'Kavita Verma',
                ticketId: 'DWL-912834',
                paidStars: true,
                passStatus: 'Verified',
                drawStatus: 'Winner',
                wonPrizeName: 'Festive Mega Reward (₹75,000)',
                wonPrizeValue: 75000,
                winnerCommissionEarned: 7500,
                rewardEarned: 100,
                date: '10 Oct 2026',
              },
              {
                id: 'ref-demo-2',
                name: 'Rohan Mehra',
                ticketId: 'DWL-492015',
                paidStars: true,
                passStatus: 'Verified',
                drawStatus: 'Entered',
                rewardEarned: 100,
                date: '11 Oct 2026',
              },
              {
                id: 'ref-demo-3',
                name: 'Neha Gupta',
                ticketId: 'DWL-783920',
                paidStars: false,
                passStatus: 'Pending',
                drawStatus: 'Entered',
                rewardEarned: 0,
                date: '12 Oct 2026',
              },
            ],
            withdrawals: [],
            ticket: {
              ticketId: 'DWL-847291',
              fullName: 'Aarav Sharma',
              maskedMobile: '+91 98765 43210',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              status: 'verified',
              feeStars: 100,
              feeInr: 199,
              telegramBotHandle: '@DriveYourLuckDiwaliBot',
              telegramBotUrl: 'https://t.me/DriveYourLuckDiwaliBot',
              createdAt: '2026-10-10T10:00:00.000Z',
            },
          };
        } else if (cleanQuery.includes('639104') || cleanQuery === 'dwl-639104') {
          matched = {
            ticketId: 'DWL-639104',
            fullName: 'Priya Patel',
            mobile: '+91 98200 98200',
            email: 'priya.patel@example.com',
            walletBalance: 1100,
            referrals: [
              {
                id: 'ref-demo-p1',
                name: 'Amit Trivedi',
                ticketId: 'DWL-301928',
                paidStars: true,
                rewardEarned: 100,
                date: '12 Oct 2026',
              },
            ],
            withdrawals: [],
            ticket: {
              ticketId: 'DWL-639104',
              fullName: 'Priya Patel',
              maskedMobile: '+91 98200 98200',
              city: 'Ahmedabad',
              state: 'Gujarat',
              pincode: '380001',
              status: 'verified',
              feeStars: 100,
              feeInr: 199,
              telegramBotHandle: '@DriveYourLuckDiwaliBot',
              telegramBotUrl: 'https://t.me/DriveYourLuckDiwaliBot',
              createdAt: '2026-10-11T12:00:00.000Z',
            },
          };
        }
      }

      // 4. Also check backend API verification endpoint if query looks like a Ticket ID
      if (!matched && cleanQuery.startsWith('dwl-')) {
        try {
          const res = await fetch(`/api/tickets/verify?id=${encodeURIComponent(query.toUpperCase())}`);
          if (res.ok) {
            const data = await res.json();
            if (data.found && data.ticket) {
              matched = {
                ticketId: data.ticket.ticketId,
                fullName: data.ticket.fullName,
                mobile: data.ticket.maskedMobile,
                walletBalance: 0,
                referrals: [],
                withdrawals: [],
                ticket: data.ticket,
              };
            }
          }
        } catch (apiErr) {
          // Ignore network errors
        }
      }

      if (matched) {
        setSuccessInfo(`Found account for ${matched.fullName} (${matched.ticketId})! Loading dashboard...`);
        setTimeout(() => {
          onSessionRestored({
            ticketId: matched.ticketId,
            fullName: matched.fullName,
            mobile: matched.mobile,
            email: matched.email,
            walletBalance: typeof matched.walletBalance === 'number' ? matched.walletBalance : 0,
            referrals: Array.isArray(matched.referrals) ? matched.referrals : [],
            withdrawals: Array.isArray(matched.withdrawals) ? matched.withdrawals : [],
            ticket: matched.ticket || null,
          });
          onClose();
        }, 600);
      } else {
        setErrorMessage(
          `No active registration found for "${query}". Please check your mobile or Ticket ID, or register a new Diwali Festive Pass below.`
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error looking up session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (val: string) => {
    setSearchInput(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#19092c] via-[#120520] to-[#0a0214] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto mb-3 shadow-lg shadow-amber-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#160626] rounded-[14px] flex items-center justify-center text-amber-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
            Existing User Session
          </span>
          <h3 className="text-2xl font-black text-white font-['Rozha_One'] mt-2">
            Track My Referral & Earnings
          </h3>
          <p className="text-xs text-amber-200/80 mt-1 max-w-sm mx-auto">
            Apna registered Mobile Number ya Ticket ID (DWL-XXXXXX) enter karke live wallet balance, Pass Status aur 10% Lucky Winner Commission track karein.
          </p>
        </div>

        {/* Active Session Info if any */}
        {currentTicketId && (
          <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200">Current Session:</span>
              <strong className="text-white font-mono">{currentTicketId}</strong>
            </div>
            <button
              type="button"
              onClick={() => handleQuickSelect(currentTicketId)}
              className="text-amber-400 hover:text-white text-[11px] underline font-semibold cursor-pointer"
            >
              Use This ID
            </button>
          </div>
        )}

        {/* Lookup Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1.5">
              Enter Mobile, Email, or Ticket ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. 9876543210 or DWL-847291"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-[#090214] border border-amber-500/40 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                autoFocus
              />
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToRegister();
                  }}
                  className="mt-1.5 text-amber-300 hover:text-white font-bold underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Register a New Festive Pass →</span>
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successInfo && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying & Loading Session...</span>
            ) : (
              <>
                <span>Access Referral & Wallet Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Test Helpers */}
        <div className="mt-5 pt-4 border-t border-amber-950/60 text-left">
          <span className="text-[11px] text-amber-300/70 font-semibold block mb-2">
            Quick Test Identifiers:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickSelect('DWL-847291')}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/20 cursor-pointer"
            >
              DWL-847291 (Aarav · ₹200)
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('DWL-639104')}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 border border-emerald-500/20 cursor-pointer"
            >
              DWL-639104 (Priya · ₹1,100)
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('9876543210')}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-200 border border-amber-500/20 cursor-pointer"
            >
              Mobile: 9876543210
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400">
            Don't have a ticket yet?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToRegister();
              }}
              className="text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
            >
              Claim your Festive Pass now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
