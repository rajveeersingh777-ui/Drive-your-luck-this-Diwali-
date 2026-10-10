import React from 'react';

export const DiwaliPrizeBreakdownCard: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-[#1a000c] to-[#4a001a] text-white p-6 sm:p-8 rounded-2xl mx-auto max-w-3xl text-center border-2 border-[#ffd700] shadow-[0_10px_30px_rgba(255,215,0,0.3)] my-6">
      <h2 className="text-[#ffd700] text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 font-['Cinzel'] drop-shadow">
        🪔 Drive Your Luck This Diwali - Grand Cash Prize Pool 🪔
      </h2>
      <p className="text-sm sm:text-base text-[#fff8dc] mb-6 font-medium">
        Over <strong className="text-white font-bold">10,000+ Winners</strong> Will Be Rewarded! Enter now and secure your lucky winning ticket!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5 text-left">
        {/* Mega Grand Jackpot */}
        <div className="bg-[rgba(255,215,0,0.15)] border-2 border-[#ffd700] p-4 sm:p-5 rounded-xl col-span-1 sm:col-span-2 text-center shadow-lg shadow-amber-500/10">
          <span className="text-xs sm:text-sm text-[#ffd700] uppercase font-bold tracking-wider block">
            👑 Mega Grand Jackpot
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white my-1 tracking-tight font-mono">
            ₹5,00,00,000 <span className="text-base sm:text-xl text-[#ffd700] font-sans font-bold">(₹5 Crore)</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#e0e0e0] m-0 font-medium">
            1 Lucky Winner • Guaranteed Diwali Jackpot
          </p>
        </div>

        {/* 1st Prize */}
        <div className="bg-[rgba(255,255,255,0.05)] border border-[#ffb700] p-3.5 rounded-xl hover:bg-[rgba(255,255,255,0.08)] transition-colors">
          <div className="text-[#ffb700] font-bold text-xs sm:text-sm uppercase">🥇 1st Prize Pool</div>
          <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
            ₹50,00,000 <span className="text-xs text-amber-200 font-normal">(₹50 Lakhs)</span>
          </div>
          <div className="text-xs text-slate-300 mt-0.5">10 Lucky Winners</div>
        </div>

        {/* 2nd Prize */}
        <div className="bg-[rgba(255,255,255,0.05)] border border-[#ffb700] p-3.5 rounded-xl hover:bg-[rgba(255,255,255,0.08)] transition-colors">
          <div className="text-[#ffb700] font-bold text-xs sm:text-sm uppercase">🥈 2nd Prize Pool</div>
          <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
            ₹10,00,00,000 <span className="text-xs text-amber-200 font-normal">(₹10 Lakhs Each)</span>
          </div>
          <div className="text-xs text-slate-300 mt-0.5">50 Lucky Winners</div>
        </div>

        {/* 3rd Prize */}
        <div className="bg-[rgba(255,255,255,0.05)] border border-[#ffb700] p-3.5 rounded-xl hover:bg-[rgba(255,255,255,0.08)] transition-colors">
          <div className="text-[#ffb700] font-bold text-xs sm:text-sm uppercase">🥉 3rd Prize Pool</div>
          <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
            ₹1,00,000 <span className="text-xs text-amber-200 font-normal">(₹1 Lakh)</span>
          </div>
          <div className="text-xs text-slate-300 mt-0.5">500 Lucky Winners</div>
        </div>

        {/* Festive Rewards */}
        <div className="bg-[rgba(255,255,255,0.05)] border border-[#ffb700] p-3.5 rounded-xl hover:bg-[rgba(255,255,255,0.08)] transition-colors">
          <div className="text-[#ffb700] font-bold text-xs sm:text-sm uppercase">🎁 Festive Reward Slots</div>
          <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
            ₹10,000
          </div>
          <div className="text-xs text-slate-300 mt-0.5">2,000 Lucky Winners</div>
        </div>
      </div>

      <div className="mt-5 bg-[#ffd700] text-slate-950 p-3 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5">
        <span>⚡ Guaranteed Festive Cashback:</span>
        <span className="font-semibold">10,000+ Participants will receive ₹1,000 - ₹5,000 Instant Rewards!</span>
      </div>
    </section>
  );
};
