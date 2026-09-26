/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, PlayerScoreData } from './types/game';
import { SetupView } from './components/SetupView';
import { ScoringCalculatorView } from './components/ScoringCalculatorView';
import { RulesEncyclopedia } from './components/RulesEncyclopedia';
import { EndgameGuideView } from './components/EndgameGuideView';
import { SoloSarahView } from './components/SoloSarahView';
import { GameHistoryView } from './components/GameHistoryView';
import { parseUrlPlayerConfig, ParsedUrlGameConfig } from './utils/urlParams';
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
  Flag,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('sr');
  const [activeTab, setActiveTab] = useState<'setup' | 'scoring' | 'endgame' | 'rules' | 'solo' | 'history'>('setup');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [urlToast, setUrlToast] = useState<string | null>(null);
  const [urlConfig, setUrlConfig] = useState<ParsedUrlGameConfig | null>(null);

  // Check URL query params on initial load
  useEffect(() => {
    const config = parseUrlPlayerConfig();
    if (config) {
      setUrlConfig(config);

      // Check if tab is requested in URL
      if (config.tab) {
        setActiveTab(config.tab as any);
      }

      // Check if players were provided in URL
      if (config.players && config.players.length > 0) {
        const loadedPlayers: PlayerScoreData[] = config.players.map((p, idx) => ({
          id: `player-url-${idx}-${Date.now()}`,
          name: p.name,
          color: p.color,
          cat1_money: 0,
          cat2_privateBuildingsVP: 0,
          cat3_tradingPostsVP: 0,
          cat4_harboursVP: 0,
          cat5_pathfinderVP: 0,
          cat6_hazardsAndBonusTilesVP: 0,
          cat7_deckCardsVP: 0,
          cat8_objectiveCardsVP: 0,
          cat9_harbourmastersVP: 0,
          cat10_handLimitDiscVP: 0,
          cat11_workersAndStorehousesVP: 0,
          cat12_endGameTokenVP: 0,
          totalScore: 0,
        }));

        localStorage.setItem('gwt_nz_current_scoring', JSON.stringify(loadedPlayers));

        const namesList = config.players.map((p) => `${p.name} (${p.color})`).join(', ');
        setUrlToast(
          lang === 'sr'
            ? `Učitana konfiguracija za ${config.players.length} igrača iz linka: ${namesList}`
            : `Loaded config for ${config.players.length} players from URL: ${namesList}`
        );

        setTimeout(() => setUrlToast(null), 6000);
      }
    }
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'sr' ? 'en' : 'sr'));
  };

  const navItems = [
    {
      id: 'setup',
      label: lang === 'sr' ? 'Setup' : 'Setup',
      fullLabel: lang === 'sr' ? 'Generator Setup-a' : 'Setup Generator',
      icon: Dices,
    },
    {
      id: 'scoring',
      label: lang === 'sr' ? 'Kalkulator' : 'Scoring',
      fullLabel: lang === 'sr' ? 'Kalkulator Poena (12 Kat.)' : 'Scoring Pad (12 Cat.)',
      icon: Calculator,
    },
    {
      id: 'endgame',
      label: lang === 'sr' ? 'Kraj Igre' : 'End Game',
      fullLabel: lang === 'sr' ? 'Kraj Igre (Triger & Pravila)' : 'End of Game (Rules & Trigger)',
      icon: Flag,
    },
    {
      id: 'rules',
      label: lang === 'sr' ? 'Pravila' : 'Rules',
      fullLabel: lang === 'sr' ? 'Pravila & Enciklopedija' : 'Rules & Encyclopedia',
      icon: BookOpen,
    },
    {
      id: 'solo',
      label: lang === 'sr' ? 'Solo' : 'Solo',
      fullLabel: lang === 'sr' ? 'Solo (Sarah Automa)' : 'Solo (Sarah Automa)',
      icon: Bot,
    },
    {
      id: 'history',
      label: lang === 'sr' ? 'Istorijat' : 'History',
      fullLabel: lang === 'sr' ? 'Istorijat Partija' : 'Match History',
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a1b16] text-[#e8f1ec] flex flex-col selection:bg-[#c99738] selection:text-[#0c1f1a]">
      {/* VINTAGE TOP HEADER */}
      <header className="sticky top-0 z-50 bg-[#0d221c]/95 backdrop-blur-md border-b border-[#c99738]/30 shadow-xl">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Title */}
            <div
              onClick={() => setActiveTab('setup')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-950/50 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#0d221c] rounded-[14px] flex items-center justify-center text-amber-300">
                  <SheepIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-amber-400 font-serif-vintage">
                    Alexander Pfister
                  </span>
                  <span className="text-[9px] bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-700/60 text-emerald-300 font-semibold">
                    New Zealand
                  </span>
                </div>
                <h1 className="text-base sm:text-xl font-black font-serif-vintage tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors">
                  GREAT WESTERN TRAIL
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#091713] p-1.5 rounded-2xl border border-emerald-800/40">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0c1f1a] font-extrabold shadow-md'
                        : 'text-emerald-200/90 hover:text-white hover:bg-[#132c25]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.fullLabel}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls (Language, GitHub, Mobile Menu) */}
            <div className="flex items-center gap-2">
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
                className="p-2.5 rounded-xl bg-[#132c25] border border-emerald-700/50 text-emerald-200 lg:hidden cursor-pointer"
                aria-label="Meni"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#091713] border-t border-emerald-800/60 px-4 pt-2 pb-4 space-y-1.5 shadow-2xl animate-in slide-in-from-top-2">
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
                  <span>{item.fullLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* URL PARAMS TOAST BANNER */}
      {urlToast && (
        <div className="bg-amber-400 text-[#0c1f1a] px-4 py-2.5 shadow-lg flex items-center justify-between border-b border-amber-500 sticky top-20 z-40 animate-in fade-in">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0c1f1a]" />
            <span className="truncate">{urlToast}</span>
          </div>
          <button
            onClick={() => setUrlToast(null)}
            className="p-1 hover:bg-black/10 rounded font-bold text-sm cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* MAIN BODY VIEW */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-28 lg:pb-16">
        {activeTab === 'setup' && (
          <SetupView
            lang={lang}
            initialPlayerCount={(urlConfig?.playerCount as any) || undefined}
            onNavigateToScoring={() => setActiveTab('scoring')}
          />
        )}
        {activeTab === 'scoring' && (
          <ScoringCalculatorView
            lang={lang}
            onNavigateToEndgame={() => setActiveTab('endgame')}
          />
        )}
        {activeTab === 'endgame' && (
          <EndgameGuideView
            lang={lang}
            onNavigateToScoring={() => setActiveTab('scoring')}
          />
        )}
        {activeTab === 'rules' && (
          <RulesEncyclopedia
            lang={lang}
            initialSubtab={urlConfig?.subtab || undefined}
            onNavigateToScoring={() => setActiveTab('scoring')}
          />
        )}
        {activeTab === 'solo' && <SoloSarahView lang={lang} />}
        {activeTab === 'history' && <GameHistoryView lang={lang} />}
      </main>

      {/* MOBILE / TABLET THUMB-FRIENDLY BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#091713]/98 backdrop-blur-xl border-t border-[#c99738]/30 shadow-2xl px-1 py-1.5 flex justify-around items-center"
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
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer min-h-[48px] ${
                isActive
                  ? 'bg-amber-400 text-[#0c1f1a] font-bold shadow-md'
                  : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-[#132c25]'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-[#0c1f1a]' : 'text-emerald-300'}`} />
              <span className="text-[9px] sm:text-[10px] mt-0.5 font-serif-vintage tracking-tight truncate max-w-[56px] text-center font-bold">
                {item.label}
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
              Great Western Trail: New Zealand Companion & Scoring Pad — Alexander Pfister (Plan B Games / Eggertspiele).
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
