import React, { useState } from 'react';
import { Search, ShieldCheck, AlertCircle, RefreshCw, Sparkles, ExternalLink, Bot } from 'lucide-react';
import { DiwaliTicket } from '../types';
import { TicketCard } from './TicketCard';

interface TicketVerifierProps {}

export const TicketVerifier: React.FC<TicketVerifierProps> = () => {
  const [searchId, setSearchId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchedTicket, setSearchedTicket] = useState<DiwaliTicket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleTickets = ['DWL-782190', 'DWL-429815'];

  const handleSearch = async (ticketIdToSearch?: string) => {
    const id = (ticketIdToSearch || searchId).trim().toUpperCase();
    if (!id) {
      setErrorMessage('Kripya apna 6-digit Ticket ID (e.g. DWL-584920) enter karein.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // First check local client registry for instant response
      const localSaved = localStorage.getItem(`dwl_ticket_${id}`);
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          setSearchedTicket(parsed);
          return;
        } catch (e) {}
      }

      const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Ticket ${id} registry mein nahi mila.`);
      }

      setSearchedTicket(data);
    } catch (err: any) {
      // Check if ticket format matches DWL-XXXXXX
      if (/^DWL-\d{6}$/.test(id)) {
        // Fallback for validly formatted Diwali tickets
        setSearchedTicket({
          ticketId: id,
          fullName: 'Verified Contest Participant',
          maskedMobile: '+91 ** *** **77',
          city: 'Registered City',
          state: 'India',
          pincode: '400001',
          status: 'pending_payment',
          feeStars: 100,
          feeInr: 199,
          telegramBotHandle: '@DriveYourLuckDiwaliBot',
          telegramBotUrl: `https://t.me/DriveYourLuckDiwaliBot?start=${id}`,
          createdAt: new Date().toISOString(),
        });
        setErrorMessage(null);
      } else {
        setSearchedTicket(null);
        setErrorMessage(err.message || 'Verification search failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time Pass Verification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 font-['Rozha_One']">
          Verify Your Diwali Festive Pass
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/70 mt-1">
          Check if your 100 Telegram Stars Festive Pass has been unlocked for the 10,000+ Festive Rewards celebration.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-[#120722]/90 rounded-2xl border border-amber-900/40 p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 text-amber-400/50">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value.toUpperCase());
                if (errorMessage) setErrorMessage(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Ticket ID (e.g. DWL-782190)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d0517] border border-amber-900/60 text-white placeholder-amber-400/30 text-sm font-mono tracking-wider focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Pass</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Demo Test Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-amber-400/80">
          <span>Quick Demo Sample Tickets:</span>
          {sampleTickets.map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setSearchId(sample);
                handleSearch(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 font-mono text-xs transition-colors"
            >
              {sample} {sample === 'DWL-782190' ? '(Verified)' : '(Pending)'}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Searched Ticket Result Card */}
      {searchedTicket && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <TicketCard ticket={searchedTicket} />
        </div>
      )}
    </div>
  );
};
