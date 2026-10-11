import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GrandPrizeCountdown } from './components/GrandPrizeCountdown';
import { RegistrationForm } from './components/RegistrationForm';
import { TicketVerifier } from './components/TicketVerifier';
import { ReferAndEarn } from './components/ReferAndEarn';
import { TelegramStarsGuide } from './components/TelegramStarsGuide';
import { PrizePoolSection } from './components/PrizePoolSection';
import { DiwaliAiAssistant } from './components/DiwaliAiAssistant';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/admin/AdminPortal';
import { DiwaliTicket } from './types';
import { Flame, Sparkles } from 'lucide-react';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  });

  const [activeTab, setActiveTab] = useState<'register' | 'verify' | 'stars-guide' | 'prizes' | 'referrals'>('register');
  const [activeTicket, setActiveTicket] = useState<DiwaliTicket | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [stats, setStats] = useState<{
    totalEntries: number;
    verifiedEntries: number;
    grandPrizePool: string;
  }>({
    totalEntries: 1250,
    verifiedEntries: 982,
    grandPrizePool: '10,000+ Festive Slots',
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

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

  // Robust smooth scroll to registration form element
  const scrollToRegistrationForm = () => {
    setActiveTab('register');
    setTimeout(() => {
      const el = document.getElementById('registration-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const box = document.getElementById('registration-form-box');
        if (box) {
          box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 50);
  };

  // If on /admin route: render protected Admin Portal directly
  if (isAdminRoute) {
    return (
      <AdminPortal
        onBackToPublic={() => {
          setIsAdminRoute(false);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0414] text-amber-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400 selection:text-slate-950">
      {/* Navbar (Clean Public UI Only) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'register') {
            scrollToRegistrationForm();
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }
        }}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Hero Section with fixed smooth scroll CTA */}
      <HeroSection
        onEnterClick={scrollToRegistrationForm}
        onVerifyClick={() => {
          setActiveTab('verify');
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
      />

      {/* Dynamic Grand Prize Countdown Timer */}
      <GrandPrizeCountdown
        onEnterNow={scrollToRegistrationForm}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'register' && (
          <RegistrationForm
            onTicketGenerated={handleTicketGenerated}
            onNavigateToReferrals={() => {
              setActiveTab('referrals');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'verify' && (
          <TicketVerifier />
        )}

        {activeTab === 'stars-guide' && (
          <TelegramStarsGuide
            onStartRegistration={scrollToRegistrationForm}
          />
        )}

        {activeTab === 'prizes' && (
          <PrizePoolSection
            onRegisterClick={scrollToRegistrationForm}
          />
        )}

        {activeTab === 'referrals' && (
          <ReferAndEarn
            activeTicket={activeTicket}
            onEnterContest={scrollToRegistrationForm}
          />
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
          if (tab === 'admin') {
            setIsAdminRoute(true);
            window.history.pushState({}, '', '/admin');
          } else {
            setActiveTab(tab);
          }
          setIsAiChatOpen(false);
        }}
      />

      {/* Footer with Discrete Admin Portal Access */}
      <Footer
        onSelectTab={(tab) => {
          if (tab === 'register') {
            scrollToRegistrationForm();
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }
        }}
        onOpenAdmin={() => {
          setIsAdminRoute(true);
          window.history.pushState({}, '', '/admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
