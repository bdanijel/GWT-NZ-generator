/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from './types/game';
import { SetupView } from './components/SetupView';
import { ScoringCalculatorView } from './components/ScoringCalculatorView';
import { RulesEncyclopedia } from './components/RulesEncyclopedia';
import { SoloSarahView } from './components/SoloSarahView';
import { GameHistoryView } from './components/GameHistoryView';
import { SheepIcon, CompassIcon, PoundCoinIcon } from './components/CustomIcons';
import {
  Dices,
  Calculator,
  BookOpen,
  Bot,
  Trophy,
  Github,
  Globe,
  Sparkles,
  Info,
  Menu,
  X,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('sr');
  const [activeTab, setActiveTab] = useState<'setup' | 'scoring' | 'rules' | 'solo' | 'history'>('setup');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'sr' ? 'en' : 'sr'));
  };

  const navItems = [
    {
      id: 'setup',
      label: lang === 'sr' ? 'Generator Setup-a' : 'Setup Generator',
      icon: Dices,
    },
    {
      id: 'scoring',
      label: lang === 'sr' ? 'Kalkulator Poena (12 Kat.)' : 'Scoring Pad (12 Cat.)',
      icon: Calculator,
    },
    {
      id: 'rules',
      label: lang === 'sr' ? 'Pravila & Enciklopedija' : 'Rules & Encyclopedia',
      icon: BookOpen,
    },
    {
      id: 'solo',
      label: lang === 'sr' ? 'Solo (Sarah Automa)' : 'Solo (Sarah Automa)',
      icon: Bot,
    },
    {
      id: 'history',
      label: lang === 'sr' ? 'Istorijat Partija' : 'Match History',
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a1b16] text-[#e8f1ec] flex flex-col selection:bg-[#c99738] selection:text-[#0c1f1a]">
      {/* VINTAGE TOP HEADER */}
      <header className="sticky top-0 z-50 bg-[#0d221c]/95 backdrop-blur-md border-b border-[#c99738]/30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Title */}
            <div
              onClick={() => setActiveTab('setup')}
              className="flex items-center gap-3.5 cursor-pointer group select-none"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-950/50 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-[#0d221c] rounded-[14px] flex items-center justify-center text-amber-300">
                  <SheepIcon className="w-7 h-7" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-amber-400 font-serif-vintage">
                    Alexander Pfister
                  </span>
                  <span className="text-[9px] bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-700/60 text-emerald-300">
                    New Zealand
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black font-serif-vintage tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors">
                  GREAT WESTERN TRAIL
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-[#091713] p-1.5 rounded-2xl border border-emerald-800/40">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0c1f1a] font-extrabold shadow-md'
                        : 'text-emerald-200/90 hover:text-white hover:bg-[#132c25]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls (Language, GitHub, Mobile Menu) */}
            <div className="flex items-center gap-2.5">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#132c25] hover:bg-[#1a3d34] border border-emerald-700/50 text-xs font-bold text-amber-200 transition-all cursor-pointer"
                title="Promeni jezik / Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang.toUpperCase()}</span>
              </button>

              {/* GitHub Link */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#132c25] hover:bg-[#1a3d34] border border-emerald-700/50 text-emerald-200 hover:text-white transition-all cursor-pointer hidden sm:flex"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#132c25] border border-emerald-700/50 text-emerald-200 lg:hidden cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#091713] border-t border-emerald-800/60 px-4 pt-2 pb-4 space-y-1.5 shadow-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0c1f1a] font-bold shadow'
                      : 'text-emerald-200 hover:bg-[#132c25]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN BODY VIEW */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-28 lg:pb-16">
        {activeTab === 'setup' && <SetupView lang={lang} onNavigateToScoring={() => setActiveTab('scoring')} />}
        {activeTab === 'scoring' && <ScoringCalculatorView lang={lang} />}
        {activeTab === 'rules' && <RulesEncyclopedia lang={lang} />}
        {activeTab === 'solo' && <SoloSarahView lang={lang} />}
        {activeTab === 'history' && <GameHistoryView lang={lang} />}
      </main>

      {/* MOBILE / TABLET THUMB-FRIENDLY BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#091713]/95 backdrop-blur-xl border-t border-[#c99738]/30 shadow-2xl px-1.5 py-1.5 flex justify-around items-center safe-area-pb"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
                isActive
                  ? 'bg-amber-400 text-[#0c1f1a] font-bold shadow-md'
                  : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-[#132c25]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#0c1f1a]' : 'text-emerald-300'}`} />
              <span className="text-[10px] mt-0.5 font-serif-vintage tracking-tight truncate max-w-[64px]">
                {item.id === 'setup'
                  ? (lang === 'sr' ? 'Setup' : 'Setup')
                  : item.id === 'scoring'
                  ? (lang === 'sr' ? 'Poeni' : 'Score')
                  : item.id === 'rules'
                  ? (lang === 'sr' ? 'Pravila' : 'Rules')
                  : item.id === 'solo'
                  ? (lang === 'sr' ? 'Solo' : 'Solo')
                  : (lang === 'sr' ? 'Istorija' : 'History')}
              </span>
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <footer className="mt-auto bg-[#071410] border-t border-emerald-900/60 py-8 text-xs text-emerald-400/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SheepIcon className="w-4 h-4 text-amber-500" />
            <span>
              Great Western Trail: New Zealand Companion & Scoring App — Alexander Pfister (Plan B Games / Eggertspiele).
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-300/80">
            <span>Open Source Companion</span>
            <span>•</span>
            <span>React + Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
