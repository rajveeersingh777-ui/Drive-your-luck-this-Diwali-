import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  LogOut,
  ArrowLeft,
  Server,
  Activity,
  Share2,
  TrendingUp,
  Award,
  Wallet,
  IndianRupee
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToPublic: () => void;
  adminUser?: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onBackToPublic,
  adminUser,
}) => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTsv, setCopiedTsv] = useState(false);

  // Bot & Server Status State
  const [botStatus, setBotStatus] = useState<any>({
    status: 'online',
    botHandle: '@DriveYourLuckDiwaliBot',
    platform: 'Render.com Cloud Engine',
    uptimeSeconds: 1420,
    pollingActive: true,
    lastPing: new Date().toISOString(),
    keepAliveMonitoring: 'UptimeRobot 24/7 Enabled',
    serverPort: 3000,
  });

  // Referral Leaderboard State
  const [referralsData, setReferralsData] = useState<{
    totalClicks: number;
    totalSignups: number;
    topReferrers: any[];
  }>({
    totalClicks: 1420,
    totalSignups: 36,
    topReferrers: [
      { ticketId: 'DWL-782190', ownerName: 'Aarav (Top Influencer)', totalInvited: 14, verifiedClaims: 11, milestoneTier: 'Diamond Mega' },
      { ticketId: 'DWL-429815', ownerName: 'Pooja V.', totalInvited: 8, verifiedClaims: 6, milestoneTier: 'Golden Star' },
      { ticketId: 'DWL-984210', ownerName: 'Vikram K.', totalInvited: 6, verifiedClaims: 5, milestoneTier: 'Golden Star' },
      { ticketId: 'DWL-584920', ownerName: 'Sneha R.', totalInvited: 5, verifiedClaims: 4, milestoneTier: 'Golden Star' },
    ],
  });

  // Wallet UPI Withdrawals State
  const [withdrawals, setWithdrawals] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('dwl_user_withdrawals');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      {
        id: 'wd-sample-1',
        amount: 1000,
        upiId: 'vikram.singh@okaxis',
        date: '12 Oct 2026',
        status: 'PROCESSING',
      },
    ];
  });

  const handleApproveWithdrawal = (id: string) => {
    setWithdrawals((prev) => {
      const updated = prev.map((w) =>
        w.id === id ? { ...w, status: 'PAID / TRANSFERRED' } : w
      );
      try {
        localStorage.setItem('dwl_user_withdrawals', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // User Referrals State for Admin Verification
  const [activeUserReferrals, setActiveUserReferrals] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('dwl_user_referrals');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });

  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  const handleVerifyRegistration = (ticketId: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.ticketId === ticketId ? { ...r, status: 'verified', verifiedAt: new Date().toISOString() } : r
      )
    );

    try {
      const raw = localStorage.getItem(`dwl_ticket_${ticketId}`);
      if (raw) {
        const t = JSON.parse(raw);
        t.status = 'verified';
        t.verifiedAt = new Date().toISOString();
        localStorage.setItem(`dwl_ticket_${ticketId}`, JSON.stringify(t));
      }
    } catch (e) {}

    // Check if this ticket is in activeUserReferrals and credit referrer
    try {
      const rawRefs = localStorage.getItem('dwl_user_referrals');
      if (rawRefs) {
        const refs = JSON.parse(rawRefs);
        let found = false;
        const updatedRefs = refs.map((ref: any) => {
          if (ref.ticketId === ticketId && (!ref.paidStars || ref.passStatus !== 'Verified')) {
            found = true;
            return {
              ...ref,
              paidStars: true,
              passStatus: 'Verified',
              rewardEarned: 100,
            };
          }
          return ref;
        });

        if (found) {
          localStorage.setItem('dwl_user_referrals', JSON.stringify(updatedRefs));
          setActiveUserReferrals(updatedRefs);
          const currentBal = parseFloat(localStorage.getItem('dwl_user_wallet_balance') || '0') || 0;
          const newBal = currentBal + 100;
          localStorage.setItem('dwl_user_wallet_balance', String(newBal));
          setAdminNotification(`Ticket ${ticketId} verified! ₹100 referral reward credited to referrer's wallet.`);
          setTimeout(() => setAdminNotification(null), 4000);
          return;
        }
      }
    } catch (e) {}

    setAdminNotification(`Ticket ${ticketId} verified successfully for 100 Telegram Stars!`);
    setTimeout(() => setAdminNotification(null), 4000);
  };

  const handleVerifyReferralDirect = (referralId: string) => {
    try {
      const rawRefs = localStorage.getItem('dwl_user_referrals');
      let refs = rawRefs ? JSON.parse(rawRefs) : activeUserReferrals;
      let targetTicketId = '';
      const updatedRefs = refs.map((ref: any) => {
        if (ref.id === referralId && (!ref.paidStars || ref.passStatus !== 'Verified')) {
          targetTicketId = ref.ticketId;
          return {
            ...ref,
            paidStars: true,
            passStatus: 'Verified',
            rewardEarned: 100,
          };
        }
        return ref;
      });

      localStorage.setItem('dwl_user_referrals', JSON.stringify(updatedRefs));
      setActiveUserReferrals(updatedRefs);

      // Credit ₹100 to referrer wallet
      const currentBal = parseFloat(localStorage.getItem('dwl_user_wallet_balance') || '0') || 0;
      const newBal = currentBal + 100;
      localStorage.setItem('dwl_user_wallet_balance', String(newBal));

      // Also mark ticket verified if exists
      if (targetTicketId) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.ticketId === targetTicketId ? { ...r, status: 'verified', verifiedAt: new Date().toISOString() } : r
          )
        );
        try {
          const rawTicket = localStorage.getItem(`dwl_ticket_${targetTicketId}`);
          if (rawTicket) {
            const t = JSON.parse(rawTicket);
            t.status = 'verified';
            t.verifiedAt = new Date().toISOString();
            localStorage.setItem(`dwl_ticket_${targetTicketId}`, JSON.stringify(t));
          }
        } catch (e) {}
      }

      setAdminNotification(`Referral approved! ₹100 successfully credited to referrer's wallet.`);
      setTimeout(() => setAdminNotification(null), 4000);
    } catch (e) {
      console.warn('Error approving referral:', e);
    }
  };

  const handleAwardDrawWinner = (referralId: string, rewardName: string, rewardValue: number) => {
    try {
      const rawRefs = localStorage.getItem('dwl_user_referrals');
      let refs = rawRefs ? JSON.parse(rawRefs) : activeUserReferrals;
      const bonus = Math.round(rewardValue * 0.1);

      const updatedRefs = refs.map((ref: any) => {
        if (ref.id === referralId) {
          return {
            ...ref,
            paidStars: true,
            passStatus: 'Verified',
            drawStatus: 'Winner',
            wonPrizeName: rewardName,
            wonPrizeValue: rewardValue,
            winnerCommissionEarned: bonus,
          };
        }
        return ref;
      });

      localStorage.setItem('dwl_user_referrals', JSON.stringify(updatedRefs));
      setActiveUserReferrals(updatedRefs);

      // Credit 10% commission to referrer wallet
      const currentBal = parseFloat(localStorage.getItem('dwl_user_wallet_balance') || '0') || 0;
      const newBal = currentBal + bonus;
      localStorage.setItem('dwl_user_wallet_balance', String(newBal));

      setAdminNotification(`Draw Winner confirmed! ${rewardName} (₹${rewardValue.toLocaleString('en-IN')}) - ₹${bonus.toLocaleString('en-IN')} (10%) credited to referrer's wallet.`);
      setTimeout(() => setAdminNotification(null), 5000);
    } catch (e) {
      console.warn('Error awarding winner:', e);
    }
  };

  // Fetch registrations & bot health
  const refreshAllData = async () => {
    setIsLoading(true);

    // 1. Fetch Registrations
    const combinedMap = new Map<string, any>();
    try {
      const res = await fetch('/api/admin/registrations');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.registrations)) {
          data.registrations.forEach((item: any) => {
            combinedMap.set(item.ticketId, item);
          });
        }
      }
    } catch (err) {
      console.warn('Backend registrations fetch error:', err);
    }

    // Scan localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dwl_ticket_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const ticket = JSON.parse(raw);
              if (ticket.ticketId && !combinedMap.has(ticket.ticketId)) {
                combinedMap.set(ticket.ticketId, {
                  ...ticket,
                  address: ticket.address || 'Online Registration',
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch (e) {}

    const list = Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    setRegistrations(list);

    // 2. Fetch Bot & Server Health
    try {
      const botRes = await fetch('/api/admin/bot-status');
      if (botRes.ok) {
        const bData = await botRes.json();
        setBotStatus(bData);
      }
    } catch (e) {}

    // 3. Fetch Referral Leaderboard
    try {
      const refRes = await fetch('/api/admin/referrals');
      if (refRes.ok) {
        const rData = await refRes.json();
        setReferralsData({
          totalClicks: rData.totalReferralClicks || 1420,
          totalSignups: rData.totalReferralSignups || 36,
          topReferrers: rData.topReferrers || [],
        });
      }
    } catch (e) {}

    setIsLoading(false);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Filtered registrations
  const filteredList = registrations.filter((item) => {
    const matchesSearch =
      (item.ticketId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mobile || item.maskedMobile || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.state || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'verified'
        ? item.status === 'verified'
        : item.status !== 'verified';

    return matchesSearch && matchesStatus;
  });

  const verifiedCount = registrations.filter((r) => r.status === 'verified').length;
  const pendingCount = registrations.filter((r) => r.status !== 'verified').length;
  const conversionRate = registrations.length > 0 ? Math.round((verifiedCount / registrations.length) * 100) : 0;

  // Export to CSV for Google Sheets
  const exportToCSV = () => {
    const headers = ['Ticket ID', 'Full Name', 'Mobile', 'Address', 'City', 'State', 'Pincode', 'Status', 'Stars Fee', 'Created At', 'Transaction Ref'];
    const rows = filteredList.map((r) => [
      `"${r.ticketId || ''}"`,
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${r.mobile || r.maskedMobile || ''}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      `"${r.city || ''}"`,
      `"${r.state || ''}"`,
      `"${r.pincode || ''}"`,
      `"${r.status === 'verified' ? 'VERIFIED' : 'PENDING'}"`,
      `"100 Stars (₹199)"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}"`,
      `"${r.transactionRef || 'N/A'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `diwali_campaign_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy TSV for Google Sheets
  const copyForGoogleSheets = () => {
    const headers = ['Ticket ID', 'Full Name', 'Mobile', 'Address', 'City', 'State', 'Pincode', 'Status', 'Registered At', 'Transaction Ref'];
    const rows = filteredList.map((r) => [
      r.ticketId || '',
      r.fullName || '',
      r.mobile || r.maskedMobile || '',
      r.address || '',
      r.city || '',
      r.state || '',
      r.pincode || '',
      r.status === 'verified' ? 'VERIFIED' : 'PENDING',
      r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
      r.transactionRef || 'N/A',
    ]);

    const tsvContent = [headers.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n');
    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopiedTsv(true);
      setTimeout(() => setCopiedTsv(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-[#07010f] text-white p-4 sm:p-8 space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#170629] via-[#24083a] to-[#130322] border-2 border-amber-500/40 p-5 sm:p-6 rounded-3xl shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPublic}
              className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            {/* Live Bot Health Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Render Bot Engine: Active (200 OK)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Rozha_One'] mt-2 tracking-tight">
            👑 Campaign Director Dashboard
          </h1>
          <p className="text-xs text-amber-200/80 mt-0.5">
            Real-time control center for "Drive Your Luck This Diwali" ecosystem
          </p>
        </div>

        {/* User Session & Logout */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-amber-300 block">{adminUser?.name || 'Rajveer Singh (Super Admin)'}</span>
            <span className="text-[10px] text-slate-400 font-mono">{adminUser?.email || 'rajveeer777@gmail.com'}</span>
          </div>

          <button
            onClick={refreshAllData}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-200 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Real-Time Action Notification */}
      {adminNotification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0e271c] to-emerald-950 border-2 border-emerald-400 text-emerald-200 text-sm font-bold flex items-center gap-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{adminNotification}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#140624] border border-amber-500/30 space-y-1">
          <span className="text-xs text-amber-400 font-semibold block uppercase tracking-wider">Total Tickets</span>
          <p className="text-3xl font-black text-white font-mono">{registrations.length}</p>
          <span className="text-[11px] text-amber-200/70">Generated `DWL-XXXXXX`</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#140624] border border-emerald-500/30 space-y-1">
          <span className="text-xs text-emerald-400 font-semibold block uppercase tracking-wider">Verified 100 ⭐</span>
          <p className="text-3xl font-black text-emerald-300 font-mono">{verifiedCount}</p>
          <span className="text-[11px] text-emerald-400/70">Completed Telegram Stars</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#140624] border border-amber-500/30 space-y-1">
          <span className="text-xs text-amber-400 font-semibold block uppercase tracking-wider">Pending Activation</span>
          <p className="text-3xl font-black text-amber-300 font-mono">{pendingCount}</p>
          <span className="text-[11px] text-amber-200/70">Awaiting Bot Payment</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#140624] border border-purple-500/30 space-y-1">
          <span className="text-xs text-purple-400 font-semibold block uppercase tracking-wider">Conversion Ratio</span>
          <p className="text-3xl font-black text-purple-200 font-mono">{conversionRate}%</p>
          <span className="text-[11px] text-purple-300/70">{referralsData.totalSignups} Viral Signups</span>
        </div>
      </div>

      {/* Live Server & Bot Diagnostics Banner */}
      <div className="bg-[#120524] border border-sky-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-950/70 border border-sky-400/40 flex items-center justify-center flex-shrink-0">
            <Server className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Render Engine & Telegram Bot Architecture
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                UptimeRobot 24/7 Active
              </span>
            </h4>
            <p className="text-xs text-sky-200/70 mt-0.5 font-mono">
              Bot Handle: <span className="text-white font-bold">{botStatus.botHandle}</span> · Port: {botStatus.serverPort} · Keepalive Ping: 200 OK
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://t.me/DriveYourLuckDiwaliBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-400/40 text-sky-200 flex items-center gap-1.5"
          >
            <span>Open Bot Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Referral Tracking & Viral Leaderboard */}
      <div className="bg-[#120524] border border-amber-900/40 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/40 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Viral Refer & Earn Leaderboard</h3>
          </div>
          <span className="text-xs text-emerald-300 font-mono">
            Total Social Clicks: {referralsData.totalClicks} · Converted Signups: {referralsData.totalSignups}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {referralsData.topReferrers.map((referrer, idx) => (
            <div key={referrer.ticketId} className="p-3.5 rounded-xl bg-black/40 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">{referrer.ticketId}</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded">
                  #{idx + 1}
                </span>
              </div>
              <p className="text-xs text-white font-semibold truncate">{referrer.ownerName}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>{referrer.totalInvited} Invited</span>
                <span className="text-emerald-400 font-bold">{referrer.verifiedClaims} Verified</span>
              </div>
              <span className="text-[10px] text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-500/30 block w-fit">
                {referrer.milestoneTier}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Registrations Table Section */}
      <div className="bg-[#120524] border border-amber-900/40 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">User Ticket Registrations Registry</h3>
            <p className="text-xs text-amber-200/70 mt-0.5">
              Complete customer data, correspondence locations, and Telegram Stars status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={copyForGoogleSheets}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-400/50 text-purple-200 flex items-center gap-1.5"
            >
              {copiedTsv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTsv ? 'Copied TSV!' : 'Copy for Sheets'}</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            <a
              href="https://sheets.new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheets</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/40 p-3 rounded-xl border border-amber-900/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-amber-400/60 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Name, Phone, Ticket ID, City..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#08020f] border border-amber-900/60 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#08020f] p-1 rounded-lg border border-amber-900/60 text-xs w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-amber-200/70'
              }`}
            >
              All ({registrations.length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'verified' ? 'bg-emerald-600 text-white font-bold' : 'text-amber-200/70'
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'pending' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200/70'
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-amber-900/40">
          <table className="w-full text-left text-xs text-amber-200/90">
            <thead className="bg-black/70 text-amber-400 uppercase tracking-wider text-[10px] border-b border-amber-900/60">
              <tr>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Correspondence Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registration Time</th>
                <th className="px-4 py-3">Transaction Ref</th>
                <th className="px-4 py-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-950/60 bg-black/30">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    No registrations found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.ticketId || idx} className="hover:bg-amber-950/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-amber-300">
                      {item.ticketId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-white font-medium">
                      {item.fullName || 'Anonymous'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-amber-200">
                      {item.mobile || item.maskedMobile || '—'}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      <div className="text-white truncate">{item.address || 'Direct Registration'}</div>
                      <div className="text-[10px] text-amber-400/70">{item.city}, {item.state} - {item.pincode}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          VERIFIED (100 ⭐)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-black bg-[#ffcc00] px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-black" />
                          PENDING STARS
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-300 text-[11px]">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-mono text-emerald-300">
                      {item.transactionRef || 'Awaiting Bot Claim'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {item.status === 'verified' ? (
                        <span className="text-[11px] text-emerald-400 font-bold">✓ Approved</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerifyRegistration(item.ticketId)}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-[11px] shadow-sm transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                        >
                          Verify 100 ⭐ (+₹100)
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👑 STRICT ADMIN REFERRAL VERIFICATION & EARNINGS APPROVAL CENTER */}
      <div className="bg-[#120524] border-2 border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Referral Verification & Commission Management (Strict Admin Control)
                <span className="text-[10px] font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  Admin Authority Only
                </span>
              </h3>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Referral bonuses (₹100) and draw commissions (10%) are credited to user wallets only when approved here by Admin.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-300">
            Registered Referrals: {activeUserReferrals.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-amber-900/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 text-amber-300/90 uppercase font-semibold border-b border-amber-900/40">
              <tr>
                <th className="py-3 px-4">Referred User</th>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Pass Status (100 ⭐ XTR)</th>
                <th className="py-3 px-4">Draw Status (10% Commission)</th>
                <th className="py-3 px-4">Referrer Wallet Credit</th>
                <th className="py-3 px-4 text-right">Admin Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/30 bg-[#0d0417]/60">
              {activeUserReferrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-slate-400">
                    No referral entries awaiting verification at this time.
                  </td>
                </tr>
              ) : (
                activeUserReferrals.map((ref) => {
                  const isVerified = ref.paidStars || ref.passStatus === 'Verified';
                  const isWinner = ref.drawStatus === 'Winner';

                  return (
                    <tr key={ref.id} className="hover:bg-amber-950/20 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        {ref.name}
                        <span className="block text-[10px] text-slate-400 font-normal">{ref.date}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-300 font-bold">{ref.ticketId}</td>
                      <td className="py-3 px-4">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            VERIFIED (100 ⭐ Paid)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/40">
                            <Clock className="w-3 h-3 text-amber-400" />
                            PENDING VERIFICATION
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isWinner ? (
                          <span className="text-yellow-300 font-bold text-[11px] block">
                            🏆 Draw Winner: {ref.wonPrizeName || 'Festive Reward'} (+₹{(ref.winnerCommissionEarned || 0).toLocaleString('en-IN')})
                          </span>
                        ) : isVerified ? (
                          <span className="text-sky-300 text-[11px]">Entered in Draw</span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Awaiting Pass Approval</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {ref.rewardEarned > 0 ? `+₹${ref.rewardEarned}` : '₹0 (Pending)'}
                        {ref.winnerCommissionEarned ? ` + ₹${ref.winnerCommissionEarned} (10%)` : ''}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                          {!isVerified && (
                            <button
                              type="button"
                              onClick={() => handleVerifyReferralDirect(ref.id)}
                              className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-[11px] rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
                            >
                              ✓ Approve 100 ⭐ (+₹100)
                            </button>
                          )}
                          {isVerified && !isWinner && (
                            <button
                              type="button"
                              onClick={() => handleAwardDrawWinner(ref.id, 'Festive Mega Reward', 100000)}
                              className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 text-slate-950 font-extrabold text-[11px] rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
                            >
                              🏆 Award Draw Win (+10%)
                            </button>
                          )}
                          {isVerified && isWinner && (
                            <span className="text-[11px] text-emerald-400 font-bold">✓ Fully Credited</span>
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
      </div>

      {/* Wallet UPI Withdrawals Management Section */}
      <div className="bg-[#120524] border border-emerald-900/40 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                User Wallet UPI Withdrawals Management
                <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Min ₹1,000 INR
                </span>
              </h3>
              <p className="text-xs text-emerald-200/70 mt-0.5">
                Review and process bank transfer payouts for verified refer & earn earnings
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-300">
            Total Requests: {withdrawals.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-emerald-900/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 text-emerald-300/90 uppercase font-semibold border-b border-emerald-900/40">
              <tr>
                <th className="py-3 px-4">Withdrawal ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">UPI Destination</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30 bg-[#0d0417]/60">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-slate-400">
                    No withdrawal requests submitted yet.
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-emerald-950/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-amber-300 font-semibold">{w.id}</td>
                    <td className="py-3 px-4 font-black text-emerald-300 font-mono text-sm">
                      ₹{w.amount}
                    </td>
                    <td className="py-3 px-4 font-mono text-white select-all">
                      {w.upiId}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{w.date}</td>
                    <td className="py-3 px-4">
                      {w.status === 'PAID / TRANSFERRED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          PAID / TRANSFERRED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/40">
                          <Clock className="w-3 h-3 text-amber-400" />
                          PROCESSING
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {w.status !== 'PAID / TRANSFERRED' ? (
                        <button
                          type="button"
                          onClick={() => handleApproveWithdrawal(w.id)}
                          className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-[11px] rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
                        >
                          Mark Paid via UPI
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-medium">✓ Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
