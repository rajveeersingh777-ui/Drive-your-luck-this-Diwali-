import React from 'react';
import { Star, Smartphone, ShieldCheck, CheckCircle2, HelpCircle, ArrowRight, Bot, Lock, CreditCard, ExternalLink } from 'lucide-react';
import { CAMPAIGN_INFO } from '../utils/constants';

interface TelegramStarsGuideProps {
  onStartRegistration?: (e?: React.MouseEvent) => void;
}

export const TelegramStarsGuide: React.FC<TelegramStarsGuideProps> = ({
  onStartRegistration,
}) => {
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
    if (onStartRegistration) {
      onStartRegistration(e);
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Official Payment Mechanism Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 font-['Rozha_One']">
          How Telegram Stars (⭐ XTR) Work
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 mt-1 leading-relaxed">
          Telegram Stars ek secure digital currency hai jo Telegram app ke andar seamless micro-transactions ke liye bani hai. 
          Jaaniye 100 Stars (₹199) kaise pay karein aur Festive Pass kaise unlock karein!
        </p>
      </div>

      {/* 4-Step Visual Journey */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#130724]/90 border border-amber-900/40 relative">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center mb-3">
            01
          </div>
          <h4 className="text-sm font-bold text-white mb-1.5">Register & Get DWL ID</h4>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            Website form bhariye aur apna unique <code className="text-amber-300 font-mono">DWL-XXXXXX</code> Ticket ID prapt karein.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#130724]/90 border border-amber-900/40 relative">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs flex items-center justify-center mb-3">
            02
          </div>
          <h4 className="text-sm font-bold text-white mb-1.5">Launch Telegram Bot</h4>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            Bot <code className="text-sky-300">@DriveYourLuckDiwaliBot</code> open karein. Bot aapko naam se greet karega.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#130724]/90 border border-amber-900/40 relative">
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-300 font-bold text-xs flex items-center justify-center mb-3">
            03
          </div>
          <h4 className="text-sm font-bold text-white mb-1.5">Pay 100 ⭐ (₹199)</h4>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            In-app invoice par 'Pay 100 Stars' click karein. Google Pay, PhonePe, Apple Pay ya Card se instant checkout karein.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#130724]/90 border border-amber-900/40 relative">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center mb-3">
            04
          </div>
          <h4 className="text-sm font-bold text-white mb-1.5">Verified Festive Entry</h4>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            Turant digital verified Festive Pass generate hoga aur aap Grand Diwali Celebration Rewards (10,000+ Slots) mein unlock ho jayenge!
          </p>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#160a28] to-[#0d0417] border border-amber-900/50 space-y-6">
        <h3 className="text-base font-bold text-amber-200 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Kyu Telegram Stars 100% Safe aur Asaan Hain?</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Native UPI & GPay Support</span>
            </div>
            <p className="text-amber-200/70 leading-relaxed">
              Telegram app se bahar kisi anjaan website par card details nahi deni padti. Apple App Store aur Google Play Store se direct payment hoti hai.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Bank-Grade Escrow Security</span>
            </div>
            <p className="text-amber-200/70 leading-relaxed">
              Har transaction ka instant digital receipt generate hota hai aur Telegram servers par verify hota hai.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CreditCard className="w-4 h-4 text-sky-400" />
              <span>Fixed Transparent Rate</span>
            </div>
            <p className="text-amber-200/70 leading-relaxed">
              100 Telegram Stars ki keemat lagbhag ₹199 hai. Koi hidden fee ya extra charges nahi.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Aksar Pooche Jaane Waale Sawaal (FAQ)</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-[#120722]/80 border border-amber-900/30">
            <h5 className="font-semibold text-amber-200 mb-1">
              Q: Kya main direct UPI se 100 Stars buy kar sakta hoon?
            </h5>
            <p className="text-amber-200/70 leading-relaxed">
              Haan bilkul! Jab Telegram par 'Pay 100 ⭐' dabayenge, Google Play ya Apple Pay modal aayega jisme aap Google Pay, PhonePe, Paytm UPI ID, ya Debit Card select kar sakte hain.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#120722]/80 border border-amber-900/30">
            <h5 className="font-semibold text-amber-200 mb-1">
              Q: Payment hone ke baad ticket kaise milega?
            </h5>
            <p className="text-amber-200/70 leading-relaxed">
              Payment confirm hote hi bot aapko verified ticket message bhejega, aur aap website ke 'Verify Ticket' tab par bhi apna DWL-XXXXXX code daalkar live confirmation check kar sakte hain.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#120722]/80 border border-amber-900/30">
            <h5 className="font-semibold text-amber-200 mb-1">
              Q: Festive rewards kaise claim honge?
            </h5>
            <p className="text-amber-200/70 leading-relaxed">
              Recipients ko unke verified registration mobile number par connect kiya jayega aur exclusive Diwali festive perks aur rewards seamlessly provide kiye jayenge.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-600/20 via-orange-500/20 to-amber-600/20 border border-amber-500/30 text-center space-y-4">
        <h4 className="text-lg font-bold text-white font-['Rozha_One']">
          Taiyaar Hain Apna Diwali Luck Drive Karne Ke Liye?
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleScrollToForm}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Claim Festive Pass & Get DWL ID</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://t.me/DriveYourLuckDiwaliBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-sky-950/60 border border-sky-500/40 text-sky-200 flex items-center gap-2 hover:bg-sky-900/60 transition-colors"
          >
            <Bot className="w-4 h-4 text-sky-400" />
            <span>Open @DriveYourLuckDiwaliBot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
