import React, { useState } from 'react';
import confetti from 'canvas-confetti';
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
  Send,
  Wallet,
  ArrowDownToLine,
  AlertTriangle,
  CheckCircle2,
  Clock,
  IndianRupee,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  Trophy,
  Award,
  Zap,
  HelpCircle,
  Car,
  Bike
} from 'lucide-react';
import { DiwaliTicket } from '../types';

export interface ReferralRecord {
  id: string;
  name: string;
  ticketId: string;
  paidStars: boolean;
  rewardEarned: number; // ₹100 if paidStars is true, ₹0 if false
  date: string;
  passStatus?: 'Pending' | 'Verified';
  drawStatus?: 'Entered' | 'Winner';
  wonPrizeName?: string;
  wonPrizeValue?: number;
  winnerCommissionEarned?: number; // 10% cash bonus
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  upiId: string;
  date: string;
  status: 'PROCESSING' | 'COMPLETED';
}

interface ReferAndEarnProps {
  activeTicket?: DiwaliTicket | null;
  onEnterContest?: (e?: React.MouseEvent) => void;
  walletBalance: number;
  referralCode: string;
  referrals: ReferralRecord[];
  withdrawals: WithdrawalRecord[];
  onWithdraw: (amount: number, upiId: string) => { success: boolean; error?: string };
  onSimulateStarPayment: (referralId: string) => void;
  onSimulateWinner?: (referralId: string, prizeName: string, prizeValue: number) => void;
  onAddReferral: (name: string) => void;
  onQuickSimulateGoal: () => void;
}

export const ReferAndEarn: React.FC<ReferAndEarnProps> = ({
  activeTicket,
  onEnterContest,
  walletBalance,
  referralCode,
  referrals,
  withdrawals,
  onWithdraw,
  onSimulateStarPayment,
  onSimulateWinner,
  onAddReferral,
  onQuickSimulateGoal,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newFriendName, setNewFriendName] = useState<string>('');

  const referralLink = `https://drive-your-luck-this-diwali.vercel.app?ref=${referralCode}`;
  const shareText = `🪔 Shubh Deepavali! Secure your exclusive Diwali Festive Pass for 100 Telegram Stars (⭐ XTR) and unlock access to the ₹5 Crore Mega Pool! Use my referral code ${referralCode} or claim here: ${referralLink}`;

  const verifiedReferralsCount = referrals.filter((r) => r.paidStars || r.passStatus === 'Verified').length;
  const pendingReferralsCount = referrals.filter((r) => !r.paidStars && r.passStatus !== 'Verified').length;
  const totalCommissionWon = referrals.reduce((sum, r) => sum + (r.winnerCommissionEarned || 0), 0);
  const winnersCount = referrals.filter((r) => r.drawStatus === 'Winner').length;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('🪔 Claim your Diwali Festive Pass (100 ⭐ XTR) & join the ₹5 Crore celebration!')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    const amountNum = parseFloat(withdrawAmount) || walletBalance;

    // RULE: Strict minimum withdrawal threshold of ₹1000 INR
    if (walletBalance < 1000) {
      setValidationError('Minimum withdrawal amount is ₹1000. Your current wallet balance is ₹' + walletBalance + '. Please refer more friends to reach the ₹1000 threshold.');
      return;
    }

    if (amountNum < 1000) {
      setValidationError('Minimum withdrawal amount is ₹1000.');
      return;
    }

    if (amountNum > walletBalance) {
      setValidationError(`Cannot withdraw ₹${amountNum}. Your maximum available wallet balance is ₹${walletBalance}.`);
      return;
    }

    const cleanUpi = upiId.trim();
    if (!cleanUpi || !cleanUpi.includes('@')) {
      setValidationError('Please enter a valid UPI ID (e.g., yourname@okhdfcbank or 9876543210@paytm).');
      return;
    }

    const res = onWithdraw(amountNum, cleanUpi);
    if (!res.success) {
      setValidationError(res.error || 'Withdrawal failed.');
    } else {
      setSuccessMessage(`₹${amountNum} withdrawal request submitted successfully to ${cleanUpi}. Amount will be credited to your account within 24 hours!`);
      setWithdrawAmount('');
      setUpiId('');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {
        // Confetti fallback
      }
    }
  };

  const handleAddNewReferralClick = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFriendName.trim() || `Friend #${referrals.length + 1}`;
    onAddReferral(name);
    setNewFriendName('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* ========================================================
          1. HIGH-VISIBILITY 10% GRAND PRIZE REFERRAL REWARD RULE BANNER
         ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-1 shadow-[0_10px_40px_rgba(245,158,11,0.35)] animate-pulse-subtle">
        <div className="relative rounded-[22px] bg-gradient-to-r from-[#20070b] via-[#2f0e05] to-[#1d0611] p-5 sm:p-6 text-white border border-amber-400/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 p-0.5 flex-shrink-0 shadow-lg shadow-amber-500/40">
                <div className="w-full h-full bg-[#1e070d] rounded-[14px] flex items-center justify-center text-amber-300">
                  <Trophy className="w-6 h-6 animate-bounce" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-black tracking-widest text-amber-300 uppercase">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                  <span>Exclusive 10% Winner Commission Rule</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 font-['Rozha_One'] leading-tight">
                  Referral Bonus: 10% Cash Bonus on Festive Mega Rewards!
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-2xl font-medium">
                  "Referral Bonus: If any user registered through your referral link wins a Mega Reward in the Diwali Festive Draw, <strong className="text-yellow-300 font-extrabold underline decoration-yellow-400 underline-offset-2">YOU get an EXTRA 10% cash bonus</strong> of their official reward value credited directly to your wallet/bank!"
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 self-center md:self-auto">
              <div className="px-4 py-2.5 rounded-2xl bg-amber-950/80 border border-amber-400/50 text-center shadow-inner">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                  Winner Commission
                </span>
                <span className="text-2xl font-black text-yellow-300 font-mono">
                  10% FLAT
                </span>
                <span className="text-[10px] text-amber-200/70 block">
                  On Every Draw Win
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. USER WALLET DISPLAY SECTION & WITHDRAWAL FORM
         ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b052e] via-[#2a083d] to-[#0c0316] border-2 border-emerald-500/60 p-6 sm:p-8 shadow-[0_12px_45px_rgba(16,185,129,0.25)]">
        {/* Ambient decorative glowing backdrops */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Wallet Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/40 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-300/40">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Rozha_One'] tracking-tight">
                  Festive Earnings Wallet
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  Live Balance
                </span>
              </div>
              <p className="text-xs text-emerald-200/70 mt-0.5">
                Earn ₹100 per verified friend + 10% Cash Bonus if any referred friend wins a Grand Prize!
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Instant UPI Payouts</span>
          </div>
        </div>

        {/* Balance Display Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main INR Balance Card */}
          <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-black/60 border border-emerald-500/40 flex flex-col justify-between shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                Current Earnings Balance (INR)
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Direct: ₹100 / pass
                </span>
                <span className="font-mono text-yellow-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  Winner: +10% Prize
                </span>
              </div>
            </div>

            <div className="my-3 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-300 font-mono tracking-tight">
                ₹{walletBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-emerald-200/70">INR</span>
            </div>

            {/* Threshold Progress Bar towards ₹1000 minimum withdrawal */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-emerald-200/80">
                <span>
                  Withdrawal Goal: <strong className="text-white">₹1,000 INR</strong>
                </span>
                <span className={walletBalance >= 1000 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-medium'}>
                  {walletBalance >= 1000 
                    ? '🎉 Threshold reached! Ready to withdraw' 
                    : `₹${Math.max(0, 1000 - walletBalance)} more needed`}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-emerald-500/30 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (walletBalance / 1000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Column */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-900/50 flex flex-col justify-center">
              <span className="text-[11px] text-emerald-300/80 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified Referrals
              </span>
              <p className="text-xl sm:text-2xl font-bold text-white font-mono mt-0.5">
                {verifiedReferralsCount}
                <span className="text-xs font-normal text-emerald-400 ml-1.5">
                  (+₹{verifiedReferralsCount * 100})
                </span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-amber-900/50 flex flex-col justify-center">
              <span className="text-[11px] text-yellow-300 font-medium flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                10% Winner Bonuses
              </span>
              <p className="text-xl sm:text-2xl font-bold text-yellow-300 font-mono mt-0.5">
                {winnersCount} {winnersCount === 1 ? 'Winner' : 'Winners'}
                {totalCommissionWon > 0 && (
                  <span className="text-xs font-bold text-emerald-400 ml-1.5">
                    (+₹{totalCommissionWon.toLocaleString('en-IN')})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. MINIMUM WITHDRAWAL FORM UNDER WALLET SECTION
           ======================================================== */}
        <div className="mt-6 pt-6 border-t border-emerald-900/40">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
              <span>Withdraw Earnings to Bank via UPI</span>
            </h3>
            <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
              🔒 Minimum Withdrawal: ₹1,000 INR
            </span>
          </div>

          {/* Validation Alert for Rule */}
          {validationError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">
                {validationError}
              </div>
            </div>
          )}

          {/* Success Notification */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">
                {successMessage}
              </div>
            </div>
          )}

          {/* Withdrawal Form */}
          <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-200/90 mb-1">
                  UPI ID (GPay / PhonePe / Paytm / BHIM)
                </label>
                <input
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-emerald-500/40 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-emerald-200/90">
                    Withdrawal Amount (Min ₹1,000)
                  </label>
                  {walletBalance >= 1000 && (
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(String(walletBalance))}
                      className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold"
                    >
                      Withdraw All (₹{walletBalance})
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1000"
                    placeholder={walletBalance >= 1000 ? String(walletBalance) : '1000'}
                    value={withdrawAmount}
                    onChange={(e) => {
                      setWithdrawAmount(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/70 border border-emerald-500/40 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="text-[11px] text-emerald-300/70 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero processing fees · Direct UPI bank transfer</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                    walletBalance >= 1000
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer'
                      : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 cursor-pointer'
                  }`}
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>
                    {walletBalance >= 1000 ? 'Submit UPI Withdrawal' : 'Check ₹1,000 Withdrawal Rule'}
                  </span>
                </button>
              </div>
            </div>
          </form>

          {/* Past Withdrawals Log */}
          {withdrawals.length > 0 && (
            <div className="mt-5 pt-4 border-t border-emerald-900/30 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Recent Withdrawal Requests
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-emerald-900/40 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">₹{w.amount}</span>
                      <span className="text-emerald-200/70 font-mono text-[11px]">➔ {w.upiId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{w.date}</span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/30">
                        {w.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          4. TWO EARNING STREAMS EXPLAINED SECTION
         ======================================================== */}
      <section className="rounded-3xl bg-gradient-to-br from-[#180829] via-[#240c3c] to-[#120520] border border-amber-500/40 p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dual Revenue Streams for Every Referrer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Rozha_One']">
            How You Earn: 2 Powerful Referral Streams
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80">
            Har ek referral se do taraf se kamaai: Entry pass kharidte hi instant cash, aur lucky draw jeetne par grand 10% commission!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stream 1 Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/50 border border-emerald-500/40 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-500/30">
                1. Direct Referral Bonus
              </span>
              <span className="text-xl font-mono font-black text-emerald-300">₹100 INR</span>
            </div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Direct Referral Bonus: ₹100 INR</span>
            </h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Credited upon friend's successful <strong>100 Telegram Stars (⭐ XTR)</strong> pass purchase and verification.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono">
              Formula: 10 Verified Friends × ₹100 = ₹1,000 (Instant Minimum Withdrawal Milestone)
            </div>
          </div>

          {/* Stream 2 Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/50 border border-amber-500/40 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-yellow-400 uppercase tracking-wider bg-amber-950 px-2.5 py-1 rounded-md border border-amber-500/30">
                2. Festive Winner Commission
              </span>
              <span className="text-xl font-mono font-black text-yellow-300">10% BONUS</span>
            </div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Festive Winner Commission: 10% Cash Bonus</span>
            </h4>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              10% cash bonus of the winning reward value if your referred friend wins a festive draw reward in the official Diwali draw.
            </p>
            <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/20 text-[11px] text-yellow-200 font-mono">
              Reward Commission: 10% cash bonus credited directly to your earnings wallet/bank upon draw verification!
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. REFER & EARN LINK GENERATOR & SOCIAL SHARE
         ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c0022] via-[#330030] to-[#1a001a] border-2 border-emerald-500/50 p-6 sm:p-8 text-center shadow-[0_10px_35px_rgba(16,185,129,0.2)]">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider bg-black/40 px-3.5 py-1 rounded-full border border-emerald-500/40 mb-3 shadow-sm">
          <Gift className="w-4 h-4 text-emerald-400" />
          <span>Diwali Viral Rewards · Double Earning Engine</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Rozha_One'] tracking-tight">
          🪔 Share Festive Joy & Generate Your Rewards
        </h2>

        {/* Dynamic Referral Link & Code Box */}
        <div className="mt-6 max-w-2xl mx-auto bg-black/60 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Your Unique Referral Link & Code
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-200 font-mono bg-black/60 px-2 py-0.5 rounded border border-amber-500/40">
                Code: <strong>{referralCode}</strong>
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[11px] text-emerald-300 hover:text-white underline font-semibold cursor-pointer"
              >
                {copiedCode ? 'Code Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 bg-[#090312] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-200 select-all overflow-x-auto whitespace-nowrap">
              {referralLink}
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="px-4 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleTelegramShare}
              className="px-4 py-2 bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/50 text-[#229ED9] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Share on Telegram</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. DETAILED STAGE INDICATORS & REFERRALS TABLE
         ======================================================== */}
      <section className="bg-[#120722]/90 border border-amber-900/40 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/40 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Detailed Stage Tracking & Verification</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Rozha_One']">
              Your Referred Friends & Stages
            </h3>
            <p className="text-xs text-amber-200/70 mt-0.5">
              Live tracking for both <strong>Pass Status</strong> (100 Stars) and <strong>Draw Status</strong> (Entered / Winner 10% Bonus).
            </p>
          </div>

          {/* Interactive Fast Test Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onQuickSimulateGoal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              title="Simulates 10 friends paying 100 Stars to reach the ₹1,000 withdrawal milestone instantly"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>⚡ Fast-Test ₹1,000 Goal</span>
            </button>
          </div>
        </div>

        {/* Add Demo Referral Input Form */}
        <form onSubmit={handleAddNewReferralClick} className="flex flex-wrap items-center gap-2 bg-black/40 p-3 rounded-xl border border-amber-900/40">
          <span className="text-xs font-semibold text-amber-300">Invite Test Friend:</span>
          <input
            type="text"
            placeholder="Friend's Name (e.g. Vikram Singhania)"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-black/80 border border-amber-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Referral Entry</span>
          </button>
        </form>

        {/* Referral Tracking Table */}
        <div className="overflow-x-auto rounded-xl border border-amber-900/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 text-amber-300/80 uppercase font-semibold border-b border-amber-900/40">
              <tr>
                <th className="py-3 px-4">Friend Name</th>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Pass Status (100 ⭐ XTR)</th>
                <th className="py-3 px-4">Draw Status (10% Bonus)</th>
                <th className="py-3 px-4">Total Earned</th>
                <th className="py-3 px-4 text-right">Actions / Demo Sim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/30 bg-[#0d0417]/60">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-slate-400">
                    No referrals yet. Share your link above or click "Invite Test Friend" to test!
                  </td>
                </tr>
              ) : (
                referrals.map((ref) => {
                  const isVerifiedPass = ref.paidStars || ref.passStatus === 'Verified';
                  const isWinner = ref.drawStatus === 'Winner';
                  const totalLineEarned = (ref.rewardEarned || 0) + (ref.winnerCommissionEarned || 0);

                  return (
                    <tr key={ref.id} className="hover:bg-amber-950/20 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        {ref.name}
                        <span className="block text-[10px] text-slate-400 font-normal">{ref.date}</span>
                      </td>

                      <td className="py-3 px-4 font-mono text-amber-300">
                        {ref.ticketId}
                      </td>

                      {/* Pass Status Column */}
                      <td className="py-3 px-4">
                        {isVerifiedPass ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Verified (₹100 Earned)
                            </span>
                            <span className="block text-[10px] text-emerald-400/80 font-medium">
                              100 Stars payment completed & verified
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                              <Clock className="w-3 h-3 text-amber-400" />
                              Pending (Awaiting Stars)
                            </span>
                            <span className="block text-[10px] text-amber-200/70">
                              Joined via link, 100 ⭐ payment pending
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Draw Status Column */}
                      <td className="py-3 px-4">
                        {isWinner ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm">
                              <Trophy className="w-3 h-3 text-slate-950" />
                              Winner (10% Bonus Earned)
                            </span>
                            <span className="block text-[10px] text-yellow-300 font-bold">
                              Won {ref.wonPrizeName || 'Festive Grand Prize'} (+₹{(ref.winnerCommissionEarned || 0).toLocaleString('en-IN')})
                            </span>
                          </div>
                        ) : isVerifiedPass ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-500/40">
                              <Check className="w-3 h-3 text-sky-400" />
                              Entered in Draw Pool
                            </span>
                            <span className="block text-[10px] text-sky-200/70">
                              Eligible for 10% commission on win
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-700">
                              Not Entered Yet
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              Pending pass verification
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Total Earned Column */}
                      <td className="py-3 px-4">
                        <div>
                          <span className={`font-mono text-sm font-extrabold block ${totalLineEarned > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                            ₹{totalLineEarned.toLocaleString('en-IN')} INR
                          </span>
                          {ref.winnerCommissionEarned ? (
                            <span className="text-[10px] text-yellow-300">
                              ₹100 + ₹{ref.winnerCommissionEarned.toLocaleString('en-IN')} (10%)
                            </span>
                          ) : isVerifiedPass ? (
                            <span className="text-[10px] text-emerald-300/80">Direct pass reward</span>
                          ) : (
                            <span className="text-[10px] text-amber-300/60">Locked (Pending)</span>
                          )}
                        </div>
                      </td>

                      {/* Action / Simulation Column */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          {!isVerifiedPass && (
                            <button
                              type="button"
                              onClick={() => onSimulateStarPayment(ref.id)}
                              className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-[11px] rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
                            >
                              Simulate 100 ⭐ Paid (+₹100)
                            </button>
                          )}

                          {isVerifiedPass && !isWinner && onSimulateWinner && (
                            <button
                              type="button"
                              onClick={() => onSimulateWinner(ref.id, 'Festive Mega Reward', 100000)}
                              className="px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-extrabold text-[11px] rounded-lg shadow-md transition-transform active:scale-95 cursor-pointer"
                              title="Simulate friend winning Festive Mega Reward -> You get 10% cash bonus!"
                            >
                              🎉 Simulate Winner (+10% Bonus)
                            </button>
                          )}

                          {isWinner && (
                            <span className="text-[11px] text-emerald-400 font-bold">
                              ✓ 10% Commission Credited
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          7. UPDATED RULES & POLICY DISPLAY (META AD COMPLIANT)
         ======================================================== */}
      <section className="rounded-2xl bg-black/60 border border-amber-900/50 p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 text-amber-300 text-sm font-bold border-b border-amber-900/40 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Official Referral Policy & Guidelines (Meta Ad Compliant)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-200/80 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#140624] border border-amber-900/40 space-y-1">
            <strong className="text-white block font-bold text-xs">
              1. Minimum Withdrawal Threshold
            </strong>
            <p>
              Withdrawals remain strictly subject to a minimum wallet balance of <span className="text-amber-300 font-bold">₹1000 INR</span>. Balances below ₹1000 cannot be disbursed and roll over until the threshold is met.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#140624] border border-amber-900/40 space-y-1">
            <strong className="text-white block font-bold text-xs">
              2. Direct ₹100 Referral Reward
            </strong>
            <p>
              Direct <span className="text-emerald-300 font-bold">₹100 INR</span> reward is unlocked and credited <span className="underline decoration-emerald-400 font-semibold">only after</span> valid 100 Telegram Stars (⭐ XTR) festive pass payment is verified by official bot/admin.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#140624] border border-amber-900/40 space-y-1">
            <strong className="text-white block font-bold text-xs">
              3. Festive Winner Commission (10%)
            </strong>
            <p>
              The <span className="text-yellow-300 font-bold">10% Festive Winner Commission</span> is calculated on the official reward value of any festive draw reward won by your referred user, following verification by Campaign Administrators.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-amber-900/30">
          *Note: Anti-fraud & spam monitoring active. Self-referrals and fictitious mobile entries will be disqualified. Payments processed via official UPI within 24 working hours.
        </p>
      </section>
    </div>
  );
};
