import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GrandPrizeCountdown } from './components/GrandPrizeCountdown';
import { RegistrationForm } from './components/RegistrationForm';
import { TicketVerifier } from './components/TicketVerifier';
import { AdminTrackingView } from './components/AdminTrackingView';
import { TelegramStarsGuide } from './components/TelegramStarsGuide';
import { PrizePoolSection } from './components/PrizePoolSection';
import { DiwaliAiAssistant } from './components/DiwaliAiAssistant';
import { Footer } from './components/Footer';
import { DiwaliTicket } from './types';
import { Flame, Sparkles, Bot, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'verify' | 'stars-guide' | 'prizes' | 'admin'>('register');
  const [activeTicket, setActiveTicket] = useState<DiwaliTicket | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [stats, setStats] = useState<{
    totalEntries: number;
    verifiedEntries: number;
    grandPrizePool: string;
  }>({
    totalEntries: 1250,
    verifiedEntries: 982,
    grandPrizePool: '10,000+ Winning Slots',
  });

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.totalEntries) {
          setStats({
            totalEntries: data.totalEntries,
            verifiedEntries: data.verifiedEntries,
            grandPrizePool: data.grandPrizePool,
          });
        }
      })
      .catch((err) => console.warn('Could not fetch stats:', err));
  }, []);

  const handleTicketGenerated = (ticket: DiwaliTicket) => {
    setActiveTicket(ticket);
  };

  const handlePaymentVerified = (updatedTicket: DiwaliTicket) => {
    setActiveTicket(updatedTicket);
    setStats((prev) => ({
      ...prev,
      verifiedEntries: prev.verifiedEntries + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0b0414] text-amber-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400 selection:text-slate-950">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        onEnterClick={() => {
          setActiveTab('register');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onVerifyClick={() => {
          setActiveTab('verify');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        stats={stats}
      />

      {/* Dynamic Grand Prize Countdown Timer */}
      <GrandPrizeCountdown
        onEnterNow={() => {
          setActiveTab('register');
          window.scrollTo({ top: 450, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'register' && (
          <RegistrationForm
            onTicketGenerated={handleTicketGenerated}
          />
        )}

        {activeTab === 'verify' && (
          <TicketVerifier />
        )}

        {activeTab === 'stars-guide' && (
          <TelegramStarsGuide
            onStartRegistration={() => {
              setActiveTab('register');
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'prizes' && (
          <PrizePoolSection
            onRegisterClick={() => {
              setActiveTab('register');
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminTrackingView />
        )}
      </main>

      {/* Floating AI Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-slate-950 font-bold shadow-2xl shadow-amber-500/40 border border-amber-300/50 hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative">
            <Flame className="w-5 h-5 text-white animate-pulse" />
            <Sparkles className="w-3 h-3 text-yellow-200 absolute -top-1 -right-1" />
          </div>
          <span className="text-xs sm:text-sm text-white font-extrabold drop-shadow">
            Diwali AI Sahayak
          </span>
        </button>
      </div>

      {/* AI Assistant Drawer */}
      <DiwaliAiAssistant
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        activeTicket={activeTicket}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsAiChatOpen(false);
        }}
      />

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
