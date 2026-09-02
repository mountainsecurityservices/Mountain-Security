import React, { useState } from 'react';
import { ShieldCheck, User, Lock, AlertCircle, ShieldAlert } from 'lucide-react';
import { MSSLogo } from '../branding/MSSLogo';
import { FormField, Input, PasswordInput } from '../common/FormComponents';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { useERP } from '../../context/ERPContext';

export const LoginView: React.FC = () => {
  const { login, users, roles, quickSwitchUser } = useERP();

  const [usernameOrEmail, setUsernameOrEmail] = useState('robert.vance');
  const [password, setPassword] = useState('mss_secure_pass');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim()) {
      setErrorMessage('Please provide your username or corporate email.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(usernameOrEmail, password, rememberMe);
      setIsLoading(false);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('A system authentication error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Background Grid & Security Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Banner Notice */}
      <div className="w-full bg-slate-900/80 border-b border-slate-800 px-4 py-2 text-center text-[11px] text-slate-400 font-medium tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>RESTRICTED ACCESS • MOUNTAIN SECURITY SERVICES AUTHORIZED PERSONNEL ONLY</span>
      </div>

      {/* Main Login Card Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md">
          {/* Card Frame */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
            {/* Logo and Identity */}
            <MSSLogo mode="login" light className="mb-6" />

            {/* Error / Alert Display */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5 shadow-sm animate-shake"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Username or Corporate Email
                </label>
                <Input
                  type="text"
                  placeholder="e.g. robert.vance or email@mountainsecurity.com"
                  value={usernameOrEmail}
                  onChange={(e) => {
                    setUsernameOrEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  leftIcon={<User className="w-4 h-4 text-slate-400" />}
                  className="bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-600 focus:ring-red-600/20"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <PasswordInput
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  className="bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-600 focus:ring-red-600/20"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-red-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-400">Remember session</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">TLS 256-bit Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-red-600/30 transition-all focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to MSS ERP</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Simulator Bar for Reviewers */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Quick Role Simulator (One-Click Sign In)
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-3">
                Click any profile to test specific role permissions and access control validations:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {users.slice(0, 9).map((u) => {
                  const role = roles.find((r) => r.id === u.primaryRoleId);
                  const isSuspended = u.status === 'suspended';
                  const isInactive = u.status === 'inactive';

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setUsernameOrEmail(u.username);
                        setPassword('mss_secure_pass');
                        quickSwitchUser(u.id);
                      }}
                      className={`text-left p-1.5 rounded-lg border text-[11px] transition-all flex flex-col ${
                        isSuspended
                          ? 'border-red-900/60 bg-red-950/30 text-red-300 hover:bg-red-950/60'
                          : isInactive
                          ? 'border-slate-700/60 bg-slate-800/30 text-slate-400 hover:bg-slate-800/60'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="font-semibold truncate text-white">{u.fullName.split(' ')[0]}</span>
                      <span className="text-[9px] text-slate-400 truncate">
                        {isSuspended ? '🚨 Suspended' : isInactive ? '⏸ Inactive' : role?.name || 'Staff'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer License & Copyright */}
      <div className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 z-10 bg-slate-950">
        <p>
          Mountain Security Services • PPO License PPO-99482-SEC • All Rights Reserved © {new Date().getFullYear()}
        </p>
      </div>

      {/* Forgot Password Flow */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </div>
  );
};
