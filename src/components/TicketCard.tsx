import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Flame, Star, Sparkles, AlertCircle, Bot } from 'lucide-react';
import { DiwaliTicket } from '../types';

interface TicketCardProps {
  ticket: DiwaliTicket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVerified = ticket.status === 'verified';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c0c30] via-[#150724] to-[#0d0417] border border-amber-500/40 p-6 shadow-2xl shadow-amber-950/50">
      {/* Decorative festive corner diya elements */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Band */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-200 tracking-wide font-['Cinzel']">
              Drive Your Luck This Diwali
            </h3>
            <p className="text-[11px] text-amber-400/80">Official Verified Lucky Draw Pass</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5">
          {isVerified ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/50 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ENTRY CONFIRMED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-black bg-[#ffcc00] px-3 py-1 rounded-full shadow-sm">
              <AlertCircle className="w-4 h-4 text-black" />
              <span>PENDING VERIFICATION</span>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Center Section */}
      <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Unique Ticket ID Display & Verification Security Key */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-amber-500/30">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest block">
              Ticket ID:
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#ffd700] font-mono">
                {ticket.ticketId}
              </span>
              <button
                onClick={handleCopy}
                title="Copy Ticket ID"
                className="p-1.5 rounded-lg bg-amber-900/30 hover:bg-amber-800/40 border border-amber-500/30 text-amber-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Verification Security Key Box */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs text-slate-300 font-medium">Verification Security Key:</div>
              {isVerified ? (
                <div className="text-sm font-mono font-bold text-amber-300 mt-0.5 tracking-wider flex items-center gap-2">
                  <span>{ticket.ticketId}-GOLD-CONFIRMED</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/50">
                    🟢 UNLOCKED
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <div
                    style={{ filter: 'blur(4px)', userSelect: 'none' }}
                    className="text-base font-mono font-bold text-amber-200 tracking-wider bg-black/40 px-2.5 py-1 rounded select-none pointer-events-none"
                  >
                    {ticket.ticketId}-CONFIRMED
                  </div>
                  <span className="text-[11px] text-amber-400/90 font-semibold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                    🔒 Locked
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Masked Participant Info for Strict Privacy */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-amber-400/70 block">Participant</span>
              <span className="text-white font-medium">{ticket.fullName}</span>
            </div>
            <div>
              <span className="text-amber-400/70 block">Protected Mobile</span>
              <span className="text-amber-200 font-mono">{ticket.maskedMobile}</span>
            </div>
            <div>
              <span className="text-amber-400/70 block">Location</span>
              <span className="text-white">{ticket.city}, {ticket.state}</span>
            </div>
            <div>
              <span className="text-amber-400/70 block">Entry Fee</span>
              <span className="text-amber-300 font-semibold">100 Telegram Stars (~₹199)</span>
            </div>
          </div>

          {isVerified && ticket.transactionRef && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Verified via {ticket.paymentMethod || 'Telegram Stars'} · Ref: <code className="font-mono text-white">{ticket.transactionRef}</code>
              </span>
            </div>
          )}
        </div>

        {/* Right: Golden Holographic Diwali Seal */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-amber-950/30 border border-amber-800/30 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 mb-2">
            <div className="w-full h-full rounded-full bg-[#160826] flex flex-col items-center justify-center">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-spin" style={{ animationDuration: '12s' }} />
              <span className="text-[9px] font-bold text-amber-300 uppercase tracking-tighter">DIWALI</span>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-200">10,000+ Winning Slots</span>
          <span className="text-[10px] text-amber-400/80">Draw: Diwali Night 8 PM</span>
        </div>
      </div>

      {/* Primary Unlock CTA for Pending Ticket */}
      {!isVerified && (
        <div className="my-3 p-4 rounded-xl bg-gradient-to-r from-amber-950/60 to-purple-950/60 border border-amber-400/40 text-center">
          <p className="text-xs sm:text-sm text-[#e0e0e0] mb-2.5">
            Unlock full ticket key & enter ₹5 Crore Grand Jackpot pool via Telegram Bot!
          </p>
          <a
            href={`https://t.me/DriveYourLuckDiwaliBot?start=${ticket.ticketId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-[#ffd700] hover:bg-yellow-400 text-black font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95"
          >
            <span>🚀 Unlock Ticket on Telegram</span>
            <ExternalLink className="w-4 h-4 text-black" />
          </a>
        </div>
      )}

      {/* Ticket Footer Call-to-Actions */}
      <div className="pt-4 border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] text-amber-300/70 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Keep this Ticket ID safe for the Diwali Cash Prize Draw!</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://t.me/DriveYourLuckDiwaliBot?start=${ticket.ticketId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all"
          >
            <span>Open @DriveYourLuckDiwaliBot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
