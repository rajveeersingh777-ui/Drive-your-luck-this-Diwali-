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
  FileSpreadsheet
} from 'lucide-react';
import { DiwaliTicket } from '../types';

export const AdminTrackingView: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTsv, setCopiedTsv] = useState(false);

  // Fetch from server and merge with client localStorage
  const loadRegistrations = async () => {
    setIsLoading(true);
    const combinedMap = new Map<string, any>();

    // 1. Fetch from server
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
      console.warn('Backend admin fetch error:', err);
    }

    // 2. Scan localStorage for client-side registrations
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
    setIsLoading(false);
  };

  useEffect(() => {
    loadRegistrations();
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

  // Copy TSV for 1-Click Paste into Google Sheets
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#1c0c30] via-[#150724] to-[#0d0417] p-6 rounded-2xl border border-amber-500/40 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Campaign Participant Tracking Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Rozha_One']">
            Admin Tracking & Registrations Registry
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
            Real-time tracking of all users who submitted the registration form, their Ticket IDs, and Telegram Stars status.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadRegistrations}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={copyForGoogleSheets}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-400/50 text-purple-200 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedTsv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTsv ? 'Copied for Sheets!' : 'Copy for Google Sheets'}</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV (Google Sheets)</span>
          </button>

          <a
            href="https://sheets.new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:brightness-110"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Open Google Sheets</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#140824]/90 border border-amber-900/40">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Total Registered</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{registrations.length}</p>
          <p className="text-[11px] text-amber-300/70 mt-0.5">Forms Submitted</p>
        </div>

        <div className="p-4 rounded-xl bg-[#140824]/90 border border-emerald-900/40">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Entries</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-300">{verifiedCount}</p>
          <p className="text-[11px] text-emerald-400/70 mt-0.5">100 Stars Confirmed</p>
        </div>

        <div className="p-4 rounded-xl bg-[#140824]/90 border border-amber-900/40">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Pending Payment</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-300">{pendingCount}</p>
          <p className="text-[11px] text-amber-300/70 mt-0.5">Awaiting 100 Stars</p>
        </div>

        <div className="p-4 rounded-xl bg-[#140824]/90 border border-purple-900/40">
          <div className="flex items-center gap-2 text-xs text-purple-300 font-semibold mb-1">
            <FileSpreadsheet className="w-4 h-4 text-purple-300" />
            <span>Export Compatibility</span>
          </div>
          <p className="text-lg font-bold text-white mt-1">Google Sheets & Excel</p>
          <p className="text-[11px] text-purple-300/70 mt-0.5">Instant CSV / TSV sync</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#120722]/80 p-4 rounded-xl border border-amber-900/40">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-amber-400/60 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Ticket ID, City, Mobile..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0d0517] border border-amber-900/60 text-white placeholder-amber-400/40 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-amber-300/80 font-medium">Status Filter:</span>
          <div className="flex items-center gap-1 bg-[#0d0517] p-1 rounded-lg border border-amber-900/60 text-xs">
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
      </div>

      {/* Registrations Data Table */}
      <div className="bg-[#120722]/90 rounded-2xl border border-amber-900/40 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-amber-200/90">
            <thead className="bg-[#0b0414] text-amber-400 uppercase tracking-wider text-[10px] border-b border-amber-900/60">
              <tr>
                <th className="px-4 py-3.5">Ticket ID</th>
                <th className="px-4 py-3.5">Participant Name</th>
                <th className="px-4 py-3.5">Mobile Number</th>
                <th className="px-4 py-3.5">Address & Location</th>
                <th className="px-4 py-3.5">Contest Status</th>
                <th className="px-4 py-3.5">Registration Time</th>
                <th className="px-4 py-3.5">Reference / Bot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-950/60">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-amber-400/60">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-amber-500/40" />
                    No registrations found matching your query.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.ticketId || index} className="hover:bg-amber-950/20 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-amber-300 text-sm bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                        {item.ticketId}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">
                      {item.fullName || 'Anonymous Participant'}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-amber-200 whitespace-nowrap">
                      {item.mobile || item.maskedMobile || '—'}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate">
                      <div className="text-white truncate">{item.address || 'Standard Address'}</div>
                      <div className="text-[10px] text-amber-400/70">
                        {item.city}, {item.state} - {item.pincode}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {item.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          VERIFIED (100 ⭐)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-black bg-[#ffcc00] px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-black" />
                          PENDING STARS
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-slate-300 whitespace-nowrap">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}
                    </td>
                    <td className="px-4 py-3.5 text-[11px] whitespace-nowrap">
                      {item.transactionRef ? (
                        <code className="text-emerald-300 font-mono">{item.transactionRef}</code>
                      ) : (
                        <a
                          href={`https://t.me/DriveYourLuckDiwaliBot?start=${item.ticketId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:text-sky-300 underline flex items-center gap-1"
                        >
                          <span>Open in Bot</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-[#0b0414] p-3.5 border-t border-amber-900/60 text-xs text-amber-400/80 flex flex-wrap items-center justify-between gap-2">
          <span>Showing {filteredList.length} of {registrations.length} total participant records</span>
          <span className="text-[11px] text-amber-300/60">
            Real Telegram Bot: <strong className="text-sky-400">@DriveYourLuckDiwaliBot</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
