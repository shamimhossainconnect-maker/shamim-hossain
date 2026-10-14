import React from 'react';
import { ActivePanel, Language } from '../types';
import { translations } from '../utils/i18n';
import { ShieldCheck, ShieldAlert, Sparkles, Globe, LogOut } from 'lucide-react';

interface NavbarProps {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  isAdminAuth: boolean;
  onLogoutAdmin: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  totalItems: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePanel,
  setActivePanel,
  isAdminAuth,
  onLogoutAdmin,
  language,
  setLanguage,
  totalItems,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Brand Wordmark (Single line, no clutter) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20 text-white font-bold text-lg">
            SH
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              {t.brandName}
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:block whitespace-nowrap">
              {t.brandTagline}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Panel Switchers */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* User Panel Button */}
          <button
            type="button"
            onClick={() => setActivePanel('user')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              activePanel === 'user'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{t.userPanelTab}</span>
          </button>

          {/* Admin Panel Button */}
          <button
            type="button"
            onClick={() => setActivePanel('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              activePanel === 'admin'
                ? 'bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {isAdminAuth ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            )}
            <span>{t.adminPanelTab}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Language & Auth Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="ভাষা পরিবর্তন করুন / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold uppercase">{language === 'bn' ? 'বাংলা' : 'English'}</span>
          </button>

          {/* Admin Auth Indicator & Action */}
          {activePanel === 'admin' && isAdminAuth ? (
            <button
              type="button"
              onClick={onLogoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-medium text-red-300 hover:bg-red-500/20 transition-colors whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.logoutAdmin}</span>
            </button>
          ) : (
            activePanel === 'user' && (
              <button
                type="button"
                onClick={() => setActivePanel('admin')}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-colors whitespace-nowrap"
              >
                <span>{language === 'bn' ? 'অ্যাডমিন আপলোড' : 'Admin Upload'}</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
