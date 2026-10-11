import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, ArrowLeft, Flame, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, adminUser: any) => void;
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToPublic }) => {
  const [email, setEmail] = useState('admin@driveyourluck.com');
  const [password, setPassword] = useState('Diwali2026Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      // Store session token
      sessionStorage.setItem('dwl_admin_session', data.token);
      sessionStorage.setItem('dwl_admin_user', JSON.stringify(data.admin));

      onLoginSuccess(data.token, data.admin);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07010f] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Site</span>
        </button>
        <span className="text-[11px] font-mono text-slate-500">Security Gate v2.4</span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#160829] to-[#0c0317] border-2 border-amber-500/40 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-purple-950/60 relative">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 p-0.5 mx-auto mb-3 shadow-lg shadow-amber-500/30">
            <div className="w-full h-full bg-[#120522] rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-amber-300" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white font-['Rozha_One'] tracking-tight">
            Admin Access Portal
          </h2>
          <p className="text-xs text-amber-200/70 mt-1">
            "Drive Your Luck This Diwali" Management Console
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-400/50 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@driveyourluck.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08020f] border border-amber-900/60 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-amber-400/50 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08020f] border border-amber-900/60 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Quick Credential Hint */}
          <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 text-[11px] text-amber-300/80">
            <span className="font-bold text-amber-400">Default Authorized Admin:</span>{' '}
            <code className="text-white">admin@driveyourluck.com</code> /{' '}
            <code className="text-white">Diwali2026Admin</code>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-60"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-amber-900/40 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Session · Token Authorized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
