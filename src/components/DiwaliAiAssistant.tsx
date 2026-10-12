import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Flame, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';
import { ChatMessage, DiwaliTicket } from '../types';
import { CAMPAIGN_INFO } from '../utils/constants';

interface DiwaliAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  activeTicket?: DiwaliTicket | null;
  onNavigateToTab?: (tab: 'register' | 'verify' | 'stars-guide' | 'prizes' | 'referrals') => void;
}

export const DiwaliAiAssistant: React.FC<DiwaliAiAssistantProps> = ({
  isOpen,
  onClose,
  activeTicket,
  onNavigateToTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste ji! Shubh Deepavali! 🪔✨\n\nMain hoon aapka **Diwali Kismat Sahayak**! 'Drive Your Luck This Diwali' contest mein aapka swagat hai.\n\nMain aapko contest registration, **100 Telegram Stars (⭐ XTR)** payment, aur ticket verification mein guide karne ke liye taiyaar hoon. Aap mujhse kuch bhi pooch sakte hain!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Stars kaise khareedein?',
    'Ticket verify kaise karein?',
    'Prize pool aur draw kab hai?',
    'Registration steps kya hain?',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          currentTicketId: activeTicket?.ticketId,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Namaste! Shubh Deepavali! Kripya thodi der baad dobara poochiye.';

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: `Namaste! Abhi connection mein thoda vilamb hai, par aap humare official bot **${CAMPAIGN_INFO.botHandle}** par 100 Telegram Stars se apni entry confirm kar sakte hain! 🪔✨`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#130722] border-l border-amber-900/50 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Assistant Header */}
        <div className="p-4 bg-[#1b0a30] border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow border border-amber-400/40">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-amber-200">Diwali Kismat Sahayak</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                  AI Core
                </span>
              </div>
              <p className="text-[11px] text-amber-400/70">Enthusiastic Hinglish Campaign Guide</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-amber-950/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Context Banner */}
        {activeTicket && (
          <div className="px-4 py-2 bg-amber-950/40 border-b border-amber-900/30 flex items-center justify-between text-[11px] text-amber-300">
            <span>
              Active Ticket: <strong className="font-mono text-white">{activeTicket.ticketId}</strong>
            </span>
            <span className="text-[10px] text-amber-400/70">
              {activeTicket.status === 'verified' ? '✅ Verified' : '⏳ Awaiting 100 Stars'}
            </span>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-[#1e0e36] text-amber-100/90 rounded-tl-none border border-amber-900/40 shadow'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <span
                  className={`text-[9px] block mt-1 text-right ${
                    msg.sender === 'user' ? 'text-amber-950/70' : 'text-amber-400/60'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Diwali Sahayak soch raha hai...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 border-t border-amber-900/30 bg-[#0e0417] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 whitespace-nowrap rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 hover:text-white hover:bg-amber-900/60 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-[#150726] border-t border-amber-900/40 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Poochiye (e.g. 100 Stars kaise pay karein?)..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0a0312] border border-amber-900/50 text-white placeholder-amber-400/30 text-xs focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold disabled:opacity-40 hover:scale-105 active:scale-95 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
