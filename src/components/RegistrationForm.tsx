import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Shield, Send, ArrowRight, CheckCircle2, AlertCircle, Bot, ExternalLink, HelpCircle } from 'lucide-react';
import { INDIAN_STATES, CAMPAIGN_INFO } from '../utils/constants';
import { DiwaliTicket } from '../types';
import { TicketCard } from './TicketCard';
import { DiwaliPrizeBreakdownCard } from './DiwaliPrizeBreakdownCard';

interface RegistrationFormProps {
  onTicketGenerated: (ticket: DiwaliTicket) => void;
  onNavigateToReferrals?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onTicketGenerated, onNavigateToReferrals }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<DiwaliTicket | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Kripya apna poora naam (Full Name) enter karein.');
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Kripya valid 10-digit Mobile number enter karein.');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage('Delivery/Correspondence Address enter karna zaroori hai.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage('Kripya City enter karein.');
      return;
    }

    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setErrorMessage('Kripya 6-digit valid Indian Pincode enter karein.');
      return;
    }

    setIsLoading(true);

    try {
      // Instant Client-side Ticket ID generation (DWL-XXXXXX with 6 random digits)
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const ticketId = `DWL-${randomNum}`;
      const telegramBotUrl = `https://t.me/DriveYourLuckDiwaliBot?start=${ticketId}`;

      const maskedMobile =
        cleanMobile.length === 10
          ? `+91 ${cleanMobile.slice(0, 2)}*** ***${cleanMobile.slice(-2)}`
          : `+91 ******${cleanMobile.slice(-4)}`;

      const newTicket: DiwaliTicket = {
        ticketId,
        fullName: formData.fullName.trim(),
        maskedMobile,
        city: formData.city.trim(),
        state: formData.state,
        pincode: cleanPin,
        status: 'pending_payment',
        feeStars: 100,
        feeInr: 199,
        telegramBotHandle: '@DriveYourLuckDiwaliBot',
        telegramBotUrl,
        createdAt: new Date().toISOString(),
      };

      // Persist in localStorage for instant offline/verifier access
      try {
        localStorage.setItem(`dwl_ticket_${ticketId}`, JSON.stringify(newTicket));
        localStorage.setItem('dwl_latest_ticket', JSON.stringify(newTicket));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }

      // Also silently register to backend if available (non-blocking)
      try {
        fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName.trim(),
            mobile: cleanMobile,
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state,
            pincode: cleanPin,
          }),
        }).catch(() => {});
      } catch (e) {
        // Non-blocking background sync
      }

      // Trigger Festive Confetti
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F97316', '#EAB308', '#FFFFFF'],
      });

      // Show confirmation box without automatic redirect
      setCreatedTicket(newTicket);
      onTicketGenerated(newTicket);
    } catch (err: any) {
      setErrorMessage('Ticket generation error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="registration-form" className="max-w-4xl mx-auto px-4 py-8 scroll-mt-24">
      {/* If Ticket has already been generated: Show Confirmation Box */}
      {createdTicket ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Prominent Confirmation Box */}
          <div className="bg-gradient-to-br from-[#1a000c] via-[#2d0218] to-[#12000b] border-2 border-[#ffd700] rounded-2xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(255,215,0,0.3)] text-center relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ffd700] uppercase tracking-wider bg-black/40 px-3.5 py-1 rounded-full border border-[#ffd700]/40 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Registration Successful · Festive Pass Generated</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Rozha_One'] tracking-tight">
              🪔 Aapka Diwali Festive Pass Taiyaar Hai!
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-xl mx-auto">
              Neeche diye gaye button par click karke Telegram bot par apna ticket unlock karein aur Festive Pass verification complete karein!
            </p>

            {/* Ticket ID & Customer Details Grid */}
            <div className="mt-6 max-w-xl mx-auto bg-black/50 border border-amber-500/30 rounded-xl p-5 text-left space-y-4">
              {/* Highlighted Ticket ID */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-900/40">
                <div>
                  <span className="text-[11px] text-amber-300/80 font-bold uppercase tracking-wider block">
                    Your Unique Ticket ID
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#ffd700] font-mono tracking-wider mt-0.5">
                    {createdTicket.ticketId}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-black bg-[#ffcc00] px-2.5 py-1 rounded-full shadow-sm">
                    ⏳ PENDING VERIFICATION
                  </span>
                  <span className="text-[10px] text-amber-200/70 block mt-1">100 Telegram Stars (⭐ XTR)</span>
                </div>
              </div>

              {/* Customer Details Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-amber-400/70 block">Customer Name:</span>
                  <span className="text-white font-semibold text-sm">{createdTicket.fullName}</span>
                </div>
                <div>
                  <span className="text-amber-400/70 block">Mobile Number:</span>
                  <span className="text-amber-200 font-mono font-medium">{createdTicket.maskedMobile}</span>
                </div>
                <div>
                  <span className="text-amber-400/70 block">City & State:</span>
                  <span className="text-white">{createdTicket.city}, {createdTicket.state}</span>
                </div>
                <div>
                  <span className="text-amber-400/70 block">Pincode:</span>
                  <span className="text-white font-mono">{createdTicket.pincode}</span>
                </div>
              </div>
            </div>

            {/* Prominent Unlock Ticket Button */}
            <div className="mt-6 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://t.me/DriveYourLuckDiwaliBot?start=${createdTicket.ticketId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ffd700] via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg rounded-xl shadow-2xl shadow-amber-500/40 transition-transform transform hover:scale-105 active:scale-95 border border-yellow-200"
              >
                <span>🚀 Unlock Ticket on Telegram</span>
                <ExternalLink className="w-5 h-5 text-slate-950" />
              </a>

              {onNavigateToReferrals && (
                <button
                  type="button"
                  onClick={onNavigateToReferrals}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-sm rounded-xl transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Refer Friends & Earn Perks</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-amber-300/70 mt-2.5">
              Telegram app automatically opens with your Ticket ID ({createdTicket.ticketId}) payload.
            </p>
          </div>

          {/* Ticket Card Preview */}
          <TicketCard ticket={createdTicket} />

          {/* Seamless Telegram Bot Action Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/60 via-[#101b33] to-sky-950/60 border border-sky-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    Proceed to Official Telegram Bot
                    <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30 font-normal">
                      Verified
                    </span>
                  </h4>
                  <p className="text-xs text-sky-200/80 mt-0.5">
                    Payload: <code className="text-sky-300 font-mono font-bold">?start={createdTicket.ticketId}</code>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`https://t.me/DriveYourLuckDiwaliBot?start=${createdTicket.ticketId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-transform hover:scale-105 active:scale-95"
                >
                  <span>Launch @DriveYourLuckDiwaliBot</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Reset / Register Another Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setCreatedTicket(null);
                setFormData({
                  fullName: '',
                  mobile: '',
                  address: '',
                  city: '',
                  state: 'Maharashtra',
                  pincode: '',
                });
              }}
              className="text-xs text-amber-400/80 hover:text-amber-200 underline underline-offset-4"
            >
              + Register another ticket entry
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Grand Cash Prize Breakdown Banner */}
          <DiwaliPrizeBreakdownCard />

          {/* Registration Form Container */}
          <div id="registration-form-box" className="bg-[#120722]/90 rounded-2xl border border-amber-900/40 p-6 sm:p-8 shadow-2xl relative scroll-mt-24">
          <div className="border-b border-amber-900/40 pb-5 mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Step 1 of 2: Registration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Rozha_One']">
              🪔 Register for Diwali Festive Pass
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70 mt-1">
              Apni details bhariye aur instant unique <span className="text-amber-300 font-mono">DWL-XXXXXX</span> Festive Pass ID paayein.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-amber-200 mb-1.5">
                  Full Name (Poora Naam) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0517] border border-amber-900/50 text-white placeholder-amber-400/30 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-200 mb-1.5">
                  Mobile Number (10 Digits) <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-amber-400/60 font-mono">+91</span>
                  <input
                    type="tel"
                    name="mobile"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter 10-digit number"
                    required
                    className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-[#0d0517] border border-amber-900/50 text-white placeholder-amber-400/30 text-sm font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
                <span className="text-[10px] text-amber-400/60 mt-1 block">
                  Strictly confidential; never made public.
                </span>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-amber-200 mb-1.5">
                Delivery / Correspondence Address <span className="text-amber-500">*</span>
              </label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="House/Flat No., Street, Landmark"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0517] border border-amber-900/50 text-white placeholder-amber-400/30 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-amber-200 mb-1.5">
                  City (Shehar) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Jaipur"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0517] border border-amber-900/50 text-white placeholder-amber-400/30 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-200 mb-1.5">
                  State (Rajya) <span className="text-amber-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0517] border border-amber-900/50 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                >
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state} className="bg-[#100720] text-white">
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-200 mb-1.5">
                  Pincode (6 Digits) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="302001"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0517] border border-amber-900/50 text-white placeholder-amber-400/30 text-sm font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Information Notice */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/30 flex items-start gap-3 text-xs text-amber-300/80">
              <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200">Payment & Verification Notice:</strong> Form submit karne par aapko unique{' '}
                <span className="text-white font-mono">DWL-XXXXXX</span> Ticket ID milega. Ticket ko activate karne ke liye official bot{' '}
                <strong className="text-white">{CAMPAIGN_INFO.botHandle}</strong> par{' '}
                <strong className="text-amber-300">100 Telegram Stars (approx ₹199)</strong> pay karna zaroori hai.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Generating DWL Ticket ID...</span>
                </>
              ) : (
                <>
                  <span>Generate My Diwali Ticket</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      )}
    </section>
  );
};
