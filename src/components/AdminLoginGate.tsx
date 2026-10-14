import React, { useState } from 'react';
import { ADMIN_PASSWORD } from '../utils/storage';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface AdminLoginGateProps {
  onSuccess: () => void;
  onCancel: () => void;
  language: Language;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  onSuccess,
  onCancel,
  language,
}) => {
  const t = translations[language];
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError(null);
      onSuccess();
    } else {
      setError(t.wrongPassword);
    }
  };

  const handleKeyPress = (num: string) => {
    if (password.length < 8) {
      setPassword(prev => prev + num);
      setError(null);
    }
  };

  const handleDeleteChar = () => {
    setPassword(prev => prev.slice(0, -1));
    setError(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Top Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white tracking-tight">
            {t.enterPasswordTitle}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
            {t.enterPasswordDesc}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder={t.passwordPlaceholder}
              autoFocus
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-center text-lg tracking-widest font-mono text-white placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-sans focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-xs text-red-400 font-medium animate-pulse">
              {error}
            </div>
          )}

          {/* Numeric Pin Pad for touch or desktop */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="h-11 rounded-lg border border-slate-800 bg-slate-950 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-white active:scale-95 transition-all"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDeleteChar}
              className="h-11 rounded-lg border border-slate-800 bg-slate-950 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 active:scale-95 transition-all"
            >
              DEL
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-11 rounded-lg border border-slate-800 bg-slate-950 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-white active:scale-95 transition-all"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setPassword('')}
              className="h-11 rounded-lg border border-slate-800 bg-slate-950 text-xs font-medium text-red-400 hover:bg-slate-800 active:scale-95 transition-all"
            >
              CLR
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.99] transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.unlockButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ইউজার প্যানেলে ফিরে যান' : 'Back to User Panel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
