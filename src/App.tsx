import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { GrandPrizeCountdown } from './components/GrandPrizeCountdown';
import { RegistrationForm } from './components/RegistrationForm';
import { TicketVerifier } from './components/TicketVerifier';
import { ReferAndEarn, ReferralRecord, WithdrawalRecord } from './components/ReferAndEarn';
import { TelegramStarsGuide } from './components/TelegramStarsGuide';
import { PrizePoolSection } from './components/PrizePoolSection';
import { DiwaliAiAssistant } from './components/DiwaliAiAssistant';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/admin/AdminPortal';
import { DiwaliDiya } from './components/DiwaliDiya';
import { CAMPAIGN_INFO } from './utils/constants';
import { DiwaliTicket } from './types';
import { 
  Sparkles, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Flame, 
  Wallet, 
  IndianRupee, 
  Gift 
} from 'lucide-react';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  });

  // 1. STATE MANAGEMENT FOR TABS / SECTIONS:
  // Clean state for active views, defaulting to 'register' (the main landing page registration view)
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

  // ========================================================
  // 1. USER WALLET & REFER & EARN STATE (EXACT BUSINESS RULES)
  // ========================================================
  // Rule 1: Visible Wallet showing user's current earnings balance in INR (₹0 initially)
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dwl_user_wallet_balance');
      if (saved !== null) {
        return parseFloat(saved) || 0;
      }
    }
    return 0; // ₹0 initially as specified
  });

  // Rule 2: Unique referral link / code generation
  const [referralCode, setReferralCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dwl_user_ref_code');
      if (saved) return saved;
    }
    return 'DWL-REF' + Math.floor(100000 + Math.random() * 900000);
  });

  // Rule 2: Referral list tracking who paid 100 Telegram Stars (⭐ XTR)
  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dwl_user_referrals');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // Fallback to default
        }
      }
    }
    return [
      {
        id: 'ref-1',
        name: 'Aarav Sharma',
        ticketId: 'DWL-847291',
        paidStars: false,
        rewardEarned: 0,
        date: '12 Oct 2026',
      },
      {
        id: 'ref-2',
        name: 'Priya Patel',
        ticketId: 'DWL-639104',
        paidStars: false,
        rewardEarned: 0,
        date: '12 Oct 2026',
      },
    ];
  });

  // Rule 3: Past withdrawals records
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dwl_user_withdrawals');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // Fallback to empty
        }
      }
    }
    return [];
  });

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('dwl_user_wallet_balance', String(walletBalance));
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('dwl_user_ref_code', referralCode);
  }, [referralCode]);

  useEffect(() => {
    localStorage.setItem('dwl_user_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('dwl_user_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

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
    // Align referral code with user's official generated Ticket ID
    if (ticket.ticketId) {
      setReferralCode(ticket.ticketId);
    }
  };

  // Robust smooth scroll handler ensuring register tab is active and scrolling to #registration-step-span
  const handleScrollToForm = (e?: React.MouseEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setActiveTab('register');
    setTimeout(() => {
      const targetSpan = document.getElementById('registration-step-span') 
        || document.querySelector('#registration-form-box div div span')
        || document.getElementById('registration-form-box')
        || document.getElementById('register-form') 
        || document.querySelector('form');
      if (targetSpan) {
        targetSpan.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 800, behavior: 'smooth' });
      }
    }, 50);
  };

  // Switch to Refer & Earn / Wallet tab smoothly
  const handleOpenWalletTab = () => {
    setActiveTab('referrals');
    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }, 50);
  };

  // ========================================================
  // REFERRAL BUSINESS LOGIC IMPLEMENTATION
  // ========================================================
  // Rule 2: Referral reward of ₹100 INR is added to referrer's wallet
  // ONLY AFTER the referred person successfully pays 100 Telegram Stars (⭐ XTR)
  const handleSimulateStarPayment = (referralId: string) => {
    setReferrals((prev) =>
      prev.map((item) => {
        if (item.id === referralId && !item.paidStars) {
          // Credit ₹100 INR to user's wallet
          setWalletBalance((curr) => curr + 100);
          return {
            ...item,
            paidStars: true,
            rewardEarned: 100, // ₹100 credited
          };
        }
        return item;
      })
    );
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Fallback
    }
  };

  const handleAddReferral = (name: string) => {
    const newRef: ReferralRecord = {
      id: 'ref-' + Date.now(),
      name,
      ticketId: 'DWL-' + Math.floor(100000 + Math.random() * 900000),
      paidStars: false, // Starts as pending stars payment
      rewardEarned: 0,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    };
    setReferrals((prev) => [newRef, ...prev]);
  };

  // Quick simulator for testing the ₹1,000 withdrawal milestone
  const handleQuickSimulateGoal = () => {
    const newItems: ReferralRecord[] = Array.from({ length: 10 }, (_, i) => ({
      id: 'ref-goal-' + Date.now() + '-' + i,
      name: `Diwali Friend ${i + 1}`,
      ticketId: 'DWL-' + Math.floor(100000 + Math.random() * 900000),
      paidStars: true,
      rewardEarned: 100,
      date: 'Just now',
    }));
    setReferrals((prev) => [...newItems, ...prev]);
    setWalletBalance((curr) => curr + 1000);
    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch (e) {
      // Fallback
    }
  };

  // Rule 3: Enforce strict minimum withdrawal threshold of ₹1000 INR
  const handleWithdraw = (amount: number, upiId: string): { success: boolean; error?: string } => {
    if (walletBalance < 1000) {
      return {
        success: false,
        error: 'Minimum withdrawal amount is ₹1000. Your current wallet balance is ₹' + walletBalance + '. Please refer more friends to reach the ₹1000 threshold.',
      };
    }

    if (amount < 1000) {
      return {
        success: false,
        error: 'Minimum withdrawal amount is ₹1000.',
      };
    }

    if (amount > walletBalance) {
      return {
        success: false,
        error: `Insufficient balance! Maximum available to withdraw is ₹${walletBalance}.`,
      };
    }

    setWalletBalance((curr) => curr - amount);
    const newWd: WithdrawalRecord = {
      id: 'wd-' + Date.now(),
      amount,
      upiId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'PROCESSING',
    };
    setWithdrawals((prev) => [newWd, ...prev]);
    return { success: true };
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
      {/* HEADER NAVIGATION BAR */}
      <Navbar
        activeTab={activeTab}
        walletBalance={walletBalance}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'register') {
            setTimeout(() => {
              const formEl = document.getElementById('registration-step-span') 
                || document.getElementById('register-form') 
                || document.querySelector('form');
              if (formEl) {
                formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 50);
          } else {
            setTimeout(() => {
              const mainElement = document.querySelector('main');
              if (mainElement) {
                mainElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }
            }, 50);
          }
        }}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Hero Section directly in parent component */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-amber-950/40">
        {/* Decorative festive ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-amber-600/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Official Campaign Logo & Diya Centerpiece */}
          <div className="flex flex-col items-center justify-center mb-5">
            <div className="relative p-2 rounded-2xl bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent border border-amber-400/30 shadow-[0_0_40px_rgba(245,158,11,0.25)] group hover:scale-105 transition-transform duration-300">
              <DiwaliDiya size={76} glow={true} className="drop-shadow-2xl" />
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-[11px] font-semibold text-amber-300 tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Official Diwali Campaign 2026</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-['Rozha_One'] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 leading-tight drop-shadow-sm">
            Drive Your Luck This Diwali
          </h1>

          <p className="mt-4 text-base sm:text-xl text-amber-200/90 max-w-2xl mx-auto font-medium leading-relaxed">
            Kismat Ki Roshni, Diwali Rewards Ki Barsaat! Secure your Exclusive Festive Pass with just{' '}
            <span className="text-amber-300 font-bold underline decoration-amber-500/50 underline-offset-4">
              100 Telegram Stars (⭐ XTR)
            </span>{' '}
            and unlock access to over{' '}
            <span className="text-white font-bold">{CAMPAIGN_INFO.totalPrizePool}</span>!
          </p>

          {/* Main CTA Buttons with Robust Scroll Handler */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('register');
                setTimeout(() => {
                  const targetSpan = document.getElementById('registration-step-span') 
                    || document.querySelector('#registration-form-box div div span')
                    || document.getElementById('registration-form-box')
                    || document.getElementById('register-form') 
                    || document.querySelector('form');
                  if (targetSpan) {
                    targetSpan.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.scrollTo({ top: 800, behavior: 'smooth' });
                  }
                }, 50);
              }}
              className="group px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Fill Registration Form →</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleOpenWalletTab}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-emerald-200 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-500/40 flex items-center gap-2 transition-all hover:text-white cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Wallet: ₹{walletBalance} (Refer & Earn)</span>
            </button>
          </div>

          {/* Key Highlights / Meta Ads Compliant Benefits Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Mega Grand Reward</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-white">₹5 Crore</p>
              <p className="text-[11px] text-amber-300/70 mt-0.5">+ Elite Diwali Honors</p>
            </div>

            <div className="p-4 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Festive Pass Access</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-300">100 ⭐ XTR</p>
              <p className="text-[11px] text-amber-300/70 mt-0.5">Approx ₹199 only</p>
            </div>

            <div className="p-4 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Exclusive Access</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-300">
                Instant Pass
              </p>
              <p className="text-[11px] text-emerald-400/70 mt-0.5">Unique DWL-XXXXXX</p>
            </div>

            <div className="p-4 rounded-xl bg-[#140824]/80 border border-amber-900/40 text-left">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Grand Celebration</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-purple-200">Diwali Night</p>
              <p className="text-[11px] text-purple-300/70 mt-0.5">8:00 PM IST Celebration</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PROMINENT USER WALLET STATUS BANNER (ALWAYS VISIBLE)
         ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 pt-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#101e2b] to-emerald-950/70 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Festive Earnings Wallet
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Min. Withdrawal: ₹1,000 INR
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-200/70">
                  (Earn ₹100 per friend who pays 100 ⭐ XTR)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenWalletTab}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Manage Wallet & Referrals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Grand Prize Countdown Timer */}
      <GrandPrizeCountdown
        onEnterNow={handleScrollToForm}
      />

      {/* Main Content Area: DIRECTLY RENDERED ON MAIN PAGE DOM */}
      <main className="flex-1 space-y-10">
        {/* Secondary tab views if user clicked tab navigation */}
        {activeTab === 'verify' && (
          <div className="animate-in fade-in duration-300">
            <TicketVerifier />
          </div>
        )}

        {activeTab === 'stars-guide' && (
          <div className="animate-in fade-in duration-300">
            <TelegramStarsGuide
              onStartRegistration={handleScrollToForm}
            />
          </div>
        )}

        {activeTab === 'prizes' && (
          <div className="animate-in fade-in duration-300">
            <PrizePoolSection
              onRegisterClick={handleScrollToForm}
            />
          </div>
        )}

        {/* ========================================================
            WALLET & REFER & EARN DASHBOARD (WHEN TAB IS 'REFERRALS')
           ======================================================== */}
        {activeTab === 'referrals' && (
          <div className="animate-in fade-in duration-300">
            <ReferAndEarn
              activeTicket={activeTicket}
              onEnterContest={handleScrollToForm}
              walletBalance={walletBalance}
              referralCode={referralCode}
              referrals={referrals}
              withdrawals={withdrawals}
              onWithdraw={handleWithdraw}
              onSimulateStarPayment={handleSimulateStarPayment}
              onAddReferral={handleAddReferral}
              onQuickSimulateGoal={handleQuickSimulateGoal}
            />
          </div>
        )}

        {/* 1. EXPLICIT FORM ID: Container section where the Registration Form is rendered with id="register-form" */}
        <section
          id="register-form"
          data-testid="registration-form"
          className="scroll-mt-20 w-full"
        >
          <div id="registration-form-section" className="w-full">
            <div id="registration-form" className="w-full">
              <RegistrationForm
                onTicketGenerated={handleTicketGenerated}
                onNavigateToReferrals={() => {
                  setActiveTab('referrals');
                  setTimeout(() => {
                    const mainElement = document.querySelector('main');
                    if (mainElement) {
                      mainElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }
                  }, 50);
                }}
              />
            </div>
          </div>
        </section>
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
          setActiveTab(tab);
          if (tab === 'register') {
            handleScrollToForm();
          } else {
            setTimeout(() => {
              const mainElement = document.querySelector('main');
              if (mainElement) {
                mainElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }
            }, 50);
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
