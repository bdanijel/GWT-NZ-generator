import React, { useState, useEffect, useMemo } from 'react';
import { Language, PlayerColor, PlayerScoreData, SavedGameHistory } from '../types/game';
import { SCORING_CATEGORIES_METADATA, HARBOURMASTER_TILES, SHEEP_BREEDS } from '../data/gwtData';
import { parseUrlPlayerConfig, buildShareableUrl } from '../utils/urlParams';
import {
  PoundCoinIcon,
  SheepIcon,
  CertificateIcon,
  StorehouseIcon,
  PathfinderIcon,
  HazardRockfallIcon,
  HazardFloodIcon,
  CompassIcon,
} from './CustomIcons';
import {
  Trophy,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  HelpCircle,
  BarChart3,
  Sliders,
  Sparkles,
  Calculator,
  User,
  Palette,
  Link2,
  Flag,
  Copy,
  ExternalLink,
  X,
} from 'lucide-react';

interface ScoringCalculatorViewProps {
  lang: Language;
  initialPlayers?: PlayerScoreData[];
  onNavigateToEndgame?: () => void;
}

const DEFAULT_PLAYERS: PlayerScoreData[] = [
  {
    id: 'player-1',
    name: 'Igrač 1',
    color: 'red',
    cat1_money: 15,
    cat2_privateBuildingsVP: 12,
    cat3_tradingPostsVP: 18,
    cat4_harboursVP: 8,
    cat5_pathfinderVP: 7,
    cat6_hazardsAndBonusTilesVP: 9,
    cat7_deckCardsVP: 14,
    cat8_objectiveCardsVP: 6,
    cat9_harbourmastersVP: 5,
    cat10_handLimitDiscVP: 3,
    cat11_workersAndStorehousesVP: 8,
    cat12_endGameTokenVP: 5,
    totalScore: 98,
  },
  {
    id: 'player-2',
    name: 'Igrač 2',
    color: 'blue',
    cat1_money: 22,
    cat2_privateBuildingsVP: 16,
    cat3_tradingPostsVP: 14,
    cat4_harboursVP: 12,
    cat5_pathfinderVP: 10,
    cat6_hazardsAndBonusTilesVP: 6,
    cat7_deckCardsVP: 18,
    cat8_objectiveCardsVP: 8,
    cat9_harbourmastersVP: 4,
    cat10_handLimitDiscVP: 0,
    cat11_workersAndStorehousesVP: 4,
    cat12_endGameTokenVP: 0,
    totalScore: 96,
  },
  {
    id: 'player-3',
    name: 'Igrač 3',
    color: 'green',
    cat1_money: 10,
    cat2_privateBuildingsVP: 8,
    cat3_tradingPostsVP: 22,
    cat4_harboursVP: 6,
    cat5_pathfinderVP: 4,
    cat6_hazardsAndBonusTilesVP: 11,
    cat7_deckCardsVP: 12,
    cat8_objectiveCardsVP: 3,
    cat9_harbourmastersVP: 6,
    cat10_handLimitDiscVP: 3,
    cat11_workersAndStorehousesVP: 6,
    cat12_endGameTokenVP: 0,
    totalScore: 83,
  },
];

// Calculate total score for any player across all 12 categories
export const calculatePlayerTotal = (p: PlayerScoreData): number => {
  const moneyVP = Math.floor(Math.max(0, p.cat1_money || 0) / 5);
  return (
    moneyVP +
    (Number(p.cat2_privateBuildingsVP) || 0) +
    (Number(p.cat3_tradingPostsVP) || 0) +
    (Number(p.cat4_harboursVP) || 0) +
    (Number(p.cat5_pathfinderVP) || 0) +
    (Number(p.cat6_hazardsAndBonusTilesVP) || 0) +
    (Number(p.cat7_deckCardsVP) || 0) +
    (Number(p.cat8_objectiveCardsVP) || 0) +
    (Number(p.cat9_harbourmastersVP) || 0) +
    (Number(p.cat10_handLimitDiscVP) || 0) +
    (Number(p.cat11_workersAndStorehousesVP) || 0) +
    (Number(p.cat12_endGameTokenVP) || 0)
  );
};

export const ScoringCalculatorView: React.FC<ScoringCalculatorViewProps> = ({
  lang,
  initialPlayers,
  onNavigateToEndgame,
}) => {
  const [players, setPlayers] = useState<PlayerScoreData[]>(() => {
    // 1. If explicit initialPlayers provided from App
    if (initialPlayers && initialPlayers.length > 0) {
      return initialPlayers.map((p) => ({
        ...p,
        totalScore: calculatePlayerTotal(p),
      }));
    }

    // 2. Check URL parameters
    const urlConfig = parseUrlPlayerConfig();
    if (urlConfig && urlConfig.players && urlConfig.players.length > 0) {
      return urlConfig.players.map((p, idx) => ({
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
    }

    // 3. Check localStorage
    const saved = localStorage.getItem('gwt_nz_current_scoring');
    if (saved) {
      try {
        const parsed: PlayerScoreData[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            totalScore: calculatePlayerTotal(p),
          }));
        }
      } catch (e) {
        console.error('Error loading saved scores:', e);
      }
    }

    return DEFAULT_PLAYERS.map((p) => ({
      ...p,
      totalScore: calculatePlayerTotal(p),
    }));
  });

  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [activeCategoryModal, setActiveCategoryModal] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Keep active index within bounds
  useEffect(() => {
    if (activePlayerIndex >= players.length) {
      setActivePlayerIndex(Math.max(0, players.length - 1));
    }
  }, [players.length, activePlayerIndex]);

  // Sync total scores and save to localStorage on mount and updates
  const syncAndSavePlayers = (updatedList: PlayerScoreData[]) => {
    const recalculated = updatedList.map((p) => ({
      ...p,
      totalScore: calculatePlayerTotal(p),
    }));
    setPlayers(recalculated);
    localStorage.setItem('gwt_nz_current_scoring', JSON.stringify(recalculated));
  };

  const updatePlayerField = (playerIndex: number, field: keyof PlayerScoreData, value: any) => {
    setPlayers((prev) => {
      const copy = [...prev];
      const target = { ...copy[playerIndex], [field]: value };
      target.totalScore = calculatePlayerTotal(target);
      copy[playerIndex] = target;
      localStorage.setItem('gwt_nz_current_scoring', JSON.stringify(copy));
      return copy;
    });
  };

  // Specific handler for Category 12 (End Game Token) - ONLY 1 player can have it!
  const handleToggleEndGameToken = (targetIndex: number) => {
    setPlayers((prev) => {
      const isCurrentlyHeld = prev[targetIndex]?.cat12_endGameTokenVP === 5;
      const updated = prev.map((p, idx) => {
        // If toggling off, nobody has it (0 VP)
        // If toggling on, only this player gets 5 VP, everyone else gets 0 VP
        const newTokenVP = idx === targetIndex ? (isCurrentlyHeld ? 0 : 5) : 0;
        const modified = { ...p, cat12_endGameTokenVP: newTokenVP };
        modified.totalScore = calculatePlayerTotal(modified);
        return modified;
      });
      localStorage.setItem('gwt_nz_current_scoring', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddPlayer = () => {
    if (players.length >= 5) return;
    const colors: PlayerColor[] = ['red', 'blue', 'green', 'yellow', 'black'];
    const usedColors = players.map((p) => p.color);
    const availableColor = colors.find((c) => !usedColors.includes(c)) || 'yellow';

    const newPlayer: PlayerScoreData = {
      id: `player-${Date.now()}`,
      name: `${lang === 'sr' ? 'Igrač' : 'Player'} ${players.length + 1}`,
      color: availableColor,
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
    };

    const nextList = [...players, newPlayer];
    syncAndSavePlayers(nextList);
    setActivePlayerIndex(nextList.length - 1);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 1) return;
    const nextList = players.filter((_, idx) => idx !== index);
    syncAndSavePlayers(nextList);
    if (activePlayerIndex >= nextList.length) {
      setActivePlayerIndex(nextList.length - 1);
    }
  };

  const handleResetAll = () => {
    const msg =
      lang === 'sr'
        ? 'Da li ste sigurni da želite da resetujete sve poene za sve igrače na 0?'
        : 'Are you sure you want to reset all scores for all players to 0?';
    if (window.confirm(msg)) {
      const reset = players.map((p) => ({
        ...p,
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
      syncAndSavePlayers(reset);
    }
  };

  const handlePrevPlayer = () => {
    setActivePlayerIndex((prev) => (prev > 0 ? prev - 1 : players.length - 1));
  };

  const handleNextPlayer = () => {
    setActivePlayerIndex((prev) => (prev < players.length - 1 ? prev + 1 : 0));
  };

  const handleSaveToHistory = () => {
    const sorted = [...players]
      .map((p) => {
        const total = calculatePlayerTotal(p);
        return { ...p, totalScore: total };
      })
      .sort((a, b) => b.totalScore - a.totalScore);

    const winner = sorted[0];

    const historyItem: SavedGameHistory = {
      id: `game-${Date.now()}`,
      date: new Date().toISOString(),
      playerCount: players.length,
      winnerName: winner.name,
      winnerScore: winner.totalScore,
      players: sorted,
    };

    const existingStr = localStorage.getItem('gwt_nz_game_history');
    const existing: SavedGameHistory[] = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift(historyItem);
    localStorage.setItem('gwt_nz_game_history', JSON.stringify(existing));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Ranked players - Always dynamically calculated to guarantee 100% exact match
  const rankedPlayers = useMemo(() => {
    return [...players]
      .map((p, originalIdx) => {
        const total = calculatePlayerTotal(p);
        return {
          ...p,
          originalIdx,
          calculatedTotal: total,
          totalScore: total,
        };
      })
      .sort((a, b) => b.calculatedTotal - a.calculatedTotal);
  }, [players]);

  const activePlayer = players[activePlayerIndex] || players[0];

  // Helper component for touch-friendly mobile/tablet stepper
  const TouchStepper: React.FC<{
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number;
    quickSteps?: number[];
    unit?: string;
    allowNegative?: boolean;
  }> = ({ value, onChange, min = 0, max = 999, step = 1, quickSteps = [2, 5], unit, allowNegative = false }) => {
    const effectiveMin = allowNegative ? -99 : min;

    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-1.5 w-full">
          <button
            type="button"
            onClick={() => onChange(Math.max(effectiveMin, (value || 0) - step))}
            className="w-11 h-11 rounded-xl bg-[#143028] hover:bg-[#1a3d33] border border-emerald-700/60 text-amber-300 font-black text-lg flex items-center justify-center active:scale-95 transition-transform shrink-0 cursor-pointer shadow-sm select-none"
            aria-label="Smanji vrednost"
          >
            -
          </button>

          <div className="flex-1 bg-[#0b1b15] border border-emerald-800/80 rounded-xl px-2 py-1.5 flex items-center justify-center gap-1 shadow-inner min-h-[44px]">
            <input
              type="number"
              value={isNaN(value) ? '' : value}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                onChange(isNaN(parsed) ? 0 : parsed);
              }}
              className="w-16 bg-transparent text-center font-serif-vintage font-black text-xl text-amber-200 focus:outline-none"
            />
            {unit && <span className="text-xs font-bold text-emerald-400/80 uppercase">{unit}</span>}
          </div>

          <button
            type="button"
            onClick={() => onChange(Math.min(max, (value || 0) + step))}
            className="w-11 h-11 rounded-xl bg-[#143028] hover:bg-[#1a3d33] border border-emerald-700/60 text-amber-300 font-black text-lg flex items-center justify-center active:scale-95 transition-transform shrink-0 cursor-pointer shadow-sm select-none"
            aria-label="Povećaj vrednost"
          >
            +
          </button>
        </div>

        {/* Quick Add Buttons for Mobile Thumb Usability */}
        {quickSteps && quickSteps.length > 0 && (
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-[10px] text-emerald-400/60 uppercase font-semibold mr-1">
              {lang === 'sr' ? 'Brzi unos:' : 'Quick:'}
            </span>
            {quickSteps.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onChange(Math.min(max, (value || 0) + q))}
                className="px-2.5 py-1 rounded-lg bg-[#143028] hover:bg-[#1b4136] border border-emerald-800/60 text-[11px] font-bold text-amber-300 active:scale-95 transition-transform cursor-pointer"
              >
                +{q}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getColorClasses = (color: PlayerColor) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-600',
          border: 'border-red-500',
          text: 'text-red-300',
          badge: 'bg-red-950 border-red-700 text-red-200',
          nameSr: 'Crvena',
          nameEn: 'Red',
          hex: '#dc2626',
        };
      case 'blue':
        return {
          bg: 'bg-blue-600',
          border: 'border-blue-500',
          text: 'text-blue-300',
          badge: 'bg-blue-950 border-blue-700 text-blue-200',
          nameSr: 'Plava',
          nameEn: 'Blue',
          hex: '#2563eb',
        };
      case 'green':
        return {
          bg: 'bg-emerald-600',
          border: 'border-emerald-500',
          text: 'text-emerald-300',
          badge: 'bg-emerald-950 border-emerald-700 text-emerald-200',
          nameSr: 'Zelena',
          nameEn: 'Green',
          hex: '#16a34a',
        };
      case 'yellow':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-400',
          text: 'text-amber-300',
          badge: 'bg-amber-950 border-amber-600 text-amber-200',
          nameSr: 'Žuta',
          nameEn: 'Yellow',
          hex: '#ca8a04',
        };
      case 'black':
        return {
          bg: 'bg-stone-700',
          border: 'border-stone-500',
          text: 'text-stone-300',
          badge: 'bg-stone-900 border-stone-600 text-stone-200',
          nameSr: 'Crna',
          nameEn: 'Black',
          hex: '#292524',
        };
    }
  };

  const activeColorMeta = getColorClasses(activePlayer.color);

  // Share URL generation
  const shareableUrl = buildShareableUrl(
    players.map((p) => ({ name: p.name, color: p.color })),
    'scoring'
  );

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* HEADER SECTION */}
      <div className="parchment-card p-5 sm:p-7 rounded-2xl border border-[#c99738]/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Calculator className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-extrabold font-serif-vintage">
                {lang === 'sr' ? 'Zvanični Blokčić Za Bodovanje' : 'Official Scoring Pad'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif-vintage text-amber-100">
              {lang === 'sr' ? 'Kalkulator Poena (12 Kategorija)' : 'Score Calculator (12 Categories)'}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              {lang === 'sr'
                ? 'Unesite poene za svih 12 zvaničnih kategorija sa strane 19 pravilnika. Bodovi se automatski sabiraju i uvek su 100% usklađeni sa poretkom.'
                : 'Enter points across all 12 official categories from page 19 of the rulebook. Points are dynamically synced.'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Share / URL Params Button for 'Šta igramo?' Android app */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#143028] hover:bg-[#1c4238] text-amber-300 border border-amber-500/50 transition-all cursor-pointer shadow-sm active:scale-95"
              title={lang === 'sr' ? 'Generiši link za Android app Šta igramo?' : 'Generate URL for Android app'}
            >
              <Link2 className="w-4 h-4 text-amber-400" />
              <span>{lang === 'sr' ? 'Link za "Šta igramo?"' : 'Share Link'}</span>
            </button>

            {/* Save Match Button */}
            <button
              onClick={handleSaveToHistory}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[#0c1f1a] bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span className="text-sm">
                {savedSuccess ? (lang === 'sr' ? 'Sačuvano!' : 'Saved!') : (lang === 'sr' ? 'Sačuvaj Igru' : 'Save Match')}
              </span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetAll}
              className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#152e27] hover:bg-[#1d3d34] text-red-300 border border-red-900/50 transition-all cursor-pointer"
              title="Resetuj sve poene na 0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'sr' ? 'Resetuj' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Live Leaderboard Podium Bar */}
        <div className="mt-6 pt-5 border-t border-emerald-800/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              {lang === 'sr' ? 'Trenutni Poredak (Live Leaderboard)' : 'Live Standings'}
            </span>
            <span className="text-xs text-emerald-300/70">
              {lang === 'sr' ? 'Bodovi u tabeli i poretku su uvek identični!' : 'Standings and total points are perfectly synced!'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rankedPlayers.map((player, rank) => {
              const colors = getColorClasses(player.color);
              const isWinner = rank === 0 && player.calculatedTotal > 0;

              return (
                <div
                  key={player.id}
                  onClick={() => setActivePlayerIndex(player.originalIdx)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    activePlayerIndex === player.originalIdx
                      ? 'ring-2 ring-amber-400 bg-[#193a30] shadow-md'
                      : 'bg-[#122822] hover:bg-[#16332b]'
                  } ${colors.border}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow ${
                        isWinner
                          ? 'bg-amber-400 text-[#0c1f1a] font-serif-vintage'
                          : 'bg-[#0d221c] text-emerald-300 border border-emerald-700/60'
                      }`}
                    >
                      {rank + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                        <span className="text-xs sm:text-sm font-bold text-amber-100 truncate max-w-[120px]">
                          {player.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-300/70">
                        {lang === 'sr' ? colors.nameSr : colors.nameEn}
                        {player.cat12_endGameTokenVP === 5 && (
                          <span className="ml-1 text-amber-300 font-bold">🏆 +5</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black font-serif-vintage text-amber-300">
                      {player.calculatedTotal} VP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PLAYER TABS & ADD / REMOVE BAR */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {players.map((p, idx) => {
            const colors = getColorClasses(p.color);
            const isActive = activePlayerIndex === idx;
            const total = calculatePlayerTotal(p);

            return (
              <button
                key={p.id}
                onClick={() => setActivePlayerIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[46px] ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0c1f1a] border-amber-300 shadow-md scale-102'
                    : 'bg-[#10241e] text-emerald-200 border-emerald-800/80 hover:bg-[#16362e]'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border border-white/50 ${colors.bg}`} />
                <span className="truncate max-w-[110px]">{p.name}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-md font-serif-vintage ${
                    isActive ? 'bg-[#0c1f1a]/25 text-[#0c1f1a]' : 'bg-[#0a1a15] text-amber-300'
                  }`}
                >
                  {total} VP
                </span>
              </button>
            );
          })}

          {players.length < 5 && (
            <button
              onClick={handleAddPlayer}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#132c25] hover:bg-[#1c3e34] border border-dashed border-emerald-600/70 text-xs font-semibold text-emerald-300 cursor-pointer min-h-[46px]"
              title={lang === 'sr' ? 'Dodaj igrača (maksimalno 5)' : 'Add player (max 5)'}
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{lang === 'sr' ? 'Dodaj igrača' : 'Add Player'}</span>
            </button>
          )}
        </div>

        {players.length > 1 && (
          <button
            onClick={() => handleRemovePlayer(activePlayerIndex)}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-3 py-2.5 rounded-xl bg-red-950/40 border border-red-900/60 cursor-pointer shrink-0 min-h-[46px]"
            title={lang === 'sr' ? 'Ukloni trenutnog igrača' : 'Remove active player'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'sr' ? 'Ukloni' : 'Remove'}</span>
          </button>
        )}
      </div>

      {/* ACTIVE PLAYER DETAILS & INPUT FORM */}
      <div className="parchment-card rounded-2xl p-4 sm:p-6 border border-[#c99738]/40 shadow-xl space-y-6">
        {/* MOBILE-FRIENDLY PLAYER NAME & COLOR EDITOR */}
        <div className="bg-[#0f251f] p-4 sm:p-5 rounded-2xl border border-emerald-700/60 shadow-lg space-y-4">
          {/* Top Row: Chevrons, Name Input, and Total Score */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Name Input with Navigation Chevrons */}
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={handlePrevPlayer}
                className="w-11 h-11 rounded-xl bg-[#143028] hover:bg-[#1a3d33] border border-emerald-700/60 text-amber-300 font-bold flex items-center justify-center active:scale-95 transition-transform shrink-0 cursor-pointer shadow-sm"
                title={lang === 'sr' ? 'Prethodni igrač' : 'Previous player'}
                aria-label="Prethodni igrač"
              >
                ‹
              </button>

              <div className="flex-1">
                <label className="block text-[11px] uppercase font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'sr' ? 'Ime / Naziv Igrača (klikni za promenu):' : 'Player Name (tap to edit):'}</span>
                </label>
                <input
                  type="text"
                  value={activePlayer.name}
                  onChange={(e) => updatePlayerField(activePlayerIndex, 'name', e.target.value)}
                  className="w-full bg-[#091713] border-2 border-emerald-600/80 focus:border-amber-400 rounded-xl px-3.5 py-2.5 font-serif-vintage font-bold text-base sm:text-lg text-amber-200 focus:outline-none transition-colors shadow-inner"
                  placeholder={lang === 'sr' ? 'Upiši ime igrača...' : 'Enter player name...'}
                />
              </div>

              <button
                type="button"
                onClick={handleNextPlayer}
                className="w-11 h-11 rounded-xl bg-[#143028] hover:bg-[#1a3d33] border border-emerald-700/60 text-amber-300 font-bold flex items-center justify-center active:scale-95 transition-transform shrink-0 cursor-pointer shadow-sm"
                title={lang === 'sr' ? 'Sledeći igrač' : 'Next player'}
                aria-label="Sledeći igrač"
              >
                ›
              </button>
            </div>

            {/* Total Score Display for Active Player */}
            <div className="flex items-center justify-between sm:justify-center gap-3 bg-[#0a1b16] px-5 py-3 rounded-xl border-2 border-amber-500/60 shadow-md shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-extrabold text-emerald-300 tracking-wider">
                  {lang === 'sr' ? 'Ukupno Poena:' : 'Total Score:'}
                </span>
                <span className="text-xs font-bold text-amber-200/90 truncate max-w-[120px]">
                  {activePlayer.name}
                </span>
              </div>
              <span className="text-3xl font-black text-amber-300 font-serif-vintage tracking-tight">
                {calculatePlayerTotal(activePlayer)} VP
              </span>
            </div>
          </div>

          {/* COLOR SELECTOR - PROMINENT & ALWAYS VISIBLE ON MOBILE, TABLET & DESKTOP */}
          <div className="pt-3 border-t border-emerald-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'sr' ? 'Izaberi boju igrača:' : 'Choose player color:'}
              </span>
              <span className="text-[11px] text-emerald-300 font-medium">
                {lang === 'sr' ? 'Trenutna boja:' : 'Current color:'}{' '}
                <strong className="text-amber-200">
                  {lang === 'sr' ? activeColorMeta.nameSr : activeColorMeta.nameEn}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {(['red', 'blue', 'green', 'yellow', 'black'] as PlayerColor[]).map((c) => {
                const isSelected = activePlayer.color === c;
                const meta = getColorClasses(c);

                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updatePlayerField(activePlayerIndex, 'color', c)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer min-h-[52px] ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 ring-2 ring-amber-400 shadow-md scale-102'
                        : 'bg-[#0a1b16] border-emerald-800/80 hover:bg-[#143028] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="relative">
                      <span
                        className="w-6 h-6 rounded-full block border-2 border-white/50 shadow-sm"
                        style={{ backgroundColor: meta.hex }}
                      />
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto drop-shadow-md stroke-[3]" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-emerald-100 truncate w-full text-center">
                      {lang === 'sr' ? meta.nameSr : meta.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 12 OFFICIAL SCORING CATEGORIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CAT 1: MONEY */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <PoundCoinIcon className="w-4 h-4" />
                  1. {lang === 'sr' ? 'Novac (£)' : 'Money (£)'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {Math.floor(Math.max(0, activePlayer.cat1_money) / 5)} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr' ? '1 poen za svakih 5 funti (£) na kraju igre' : '1 VP for every 5 pounds (£)'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat1_money}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat1_money', val)}
              unit="£"
              quickSteps={[5, 10]}
            />
          </div>

          {/* CAT 2: PRIVATE BUILDINGS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  2. {lang === 'sr' ? 'Privatne zgrade' : 'Private Buildings'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat2_privateBuildingsVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr' ? 'Zbir VP odštampanih na tvojim postavljenim zgradama' : 'Sum of VPs on placed private buildings'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat2_privateBuildingsVP}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat2_privateBuildingsVP', val)}
              unit="VP"
              quickSteps={[2, 5]}
            />
          </div>

          {/* CAT 3: TRADING POSTS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  3. {lang === 'sr' ? 'Trgovačke stanice' : 'Trading Posts'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat3_tradingPostsVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr'
                  ? 'Grbovi stanica (lokalne, strane, vuna) -8 VP za polje 0, susedni bonusi'
                  : 'Trading crests (local, foreign, wool) -8 VP per disc on 0, adjacent bonuses'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat3_tradingPostsVP}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat3_tradingPostsVP', val)}
              unit="VP"
              allowNegative={true}
              quickSteps={[2, 5]}
            />
          </div>

          {/* CAT 4: HARBOURS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  4. {lang === 'sr' ? 'Luke i pristaništa' : 'Harbours'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat4_harboursVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr' ? 'VP odštampani na poljima luka gde imaš postavljen disk' : 'VP printed on harbour spaces with discs'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat4_harboursVP}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat4_harboursVP', val)}
              unit="VP"
              quickSteps={[2, 5]}
            />
          </div>

          {/* CAT 5: PATHFINDER / TILES */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <PathfinderIcon className="w-4 h-4" />
                  5. {lang === 'sr' ? 'Pločice pionira' : 'Pathfinder Tiles'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat5_pathfinderVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr' ? 'Zbir VP sa sakupljenih pločica pionira (Pathfinder)' : 'Sum of VPs on collected pathfinder tiles'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat5_pathfinderVP}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat5_pathfinderVP', val)}
              unit="VP"
              quickSteps={[2, 4]}
            />
          </div>

          {/* CAT 6: HAZARDS & BONUS TILES */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  6. {lang === 'sr' ? 'Opasnosti i bonusi' : 'Hazards & Bonus'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat6_hazardsAndBonusTilesVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr' ? 'Uklonjene opasnosti (odroni, poplave) i sakupljene bonus pločice' : 'Cleared hazards and bonus tiles'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat6_hazardsAndBonusTilesVP}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat6_hazardsAndBonusTilesVP', val)}
              unit="VP"
              quickSteps={[2, 5]}
            />
          </div>

          {/* CAT 7: DECK CARDS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <SheepIcon className="w-4 h-4" />
                  7. {lang === 'sr' ? 'Karte u špilu' : 'Deck Cards'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat7_deckCardsVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr' ? 'Zbir VP sa svih tvojih ovaca i zgrada karata u špilu/ruci' : 'Total VPs on all sheep and building cards in your deck'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat7_deckCardsVP}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat7_deckCardsVP', val)}
              unit="VP"
              quickSteps={[3, 6]}
            />
          </div>

          {/* CAT 8: OBJECTIVE CARDS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  8. {lang === 'sr' ? 'Karte zadataka' : 'Objective Cards'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat8_objectiveCardsVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr' ? 'Ispunjeni zadaci (+VP) minus neispunjeni zadaci (-VP)' : 'Completed objectives (+VP) minus uncompleted (-VP)'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat8_objectiveCardsVP}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat8_objectiveCardsVP', val)}
              unit="VP"
              allowNegative={true}
              quickSteps={[3, 5]}
            />
          </div>

          {/* CAT 9: HARBOURMASTER TILES */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  9. {lang === 'sr' ? 'Lučki kapetani' : 'Harbourmasters'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat9_harbourmastersVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr' ? 'VP od tvojih osvojenih pločica lučkih kapetana' : 'VP from claimed harbourmaster tiles'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat9_harbourmastersVP}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat9_harbourmastersVP', val)}
              unit="VP"
              quickSteps={[2, 4]}
            />
          </div>

          {/* CAT 10: HAND LIMIT DISC */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  10. {lang === 'sr' ? 'Disk limita ruke' : 'Hand Limit Disc'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat10_handLimitDiscVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr' ? '3 VP ako si otključao polje za 6 karata u ruci' : '3 VP if unlocked hand size 6 space'}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updatePlayerField(
                  activePlayerIndex,
                  'cat10_handLimitDiscVP',
                  activePlayer.cat10_handLimitDiscVP === 3 ? 0 : 3
                )
              }
              className={`w-full min-h-[46px] py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activePlayer.cat10_handLimitDiscVP === 3
                  ? 'bg-amber-400 text-[#0c1f1a] border-amber-300 font-extrabold shadow-sm'
                  : 'bg-[#10241e] text-emerald-300 border-emerald-800 hover:bg-[#16362e]'
              }`}
            >
              {activePlayer.cat10_handLimitDiscVP === 3 ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{lang === 'sr' ? 'Otključano (+3 VP)' : 'Unlocked (+3 VP)'}</span>
                </>
              ) : (
                <span>{lang === 'sr' ? 'Zaključano (0 VP) — Klikni da otključaš' : 'Locked (0 VP) — Tap to unlock'}</span>
              )}
            </button>
          </div>

          {/* CAT 11: WORKERS & STOREHOUSES */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <StorehouseIcon className="w-4 h-4" />
                  11. {lang === 'sr' ? 'Radnici i skladišta' : 'Workers & Storehouses'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat11_workersAndStorehousesVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'sr'
                  ? 'VP za popunjene redove radnika na tabli i otkrivena polja skladišta'
                  : 'VP for worker row completions and revealed storehouses'}
              </p>
            </div>
            <TouchStepper
              value={activePlayer.cat11_workersAndStorehousesVP}
              onChange={(val) => updatePlayerField(activePlayerIndex, 'cat11_workersAndStorehousesVP', val)}
              unit="VP"
              quickSteps={[2, 4]}
            />
          </div>

          {/* CAT 12: END GAME TOKEN - MUTUALLY EXCLUSIVE & RECALCULATES ALL PLAYERS */}
          <div className="bg-[#122822] p-4 rounded-xl border-2 border-amber-500/50 flex flex-col justify-between hover:border-amber-400 transition-all space-y-3 shadow-md">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  12. {lang === 'sr' ? 'Token za kraj igre' : 'End Game Token'}
                </span>
                <span className="text-xs bg-amber-950 text-amber-300 font-black px-2 py-0.5 rounded border border-amber-500/60">
                  {activePlayer.cat12_endGameTokenVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                {lang === 'sr'
                  ? '5 VP dobija samo igrač koji je uzeo token berze bonus pločica i završio igru (strana 18 pravilnika).'
                  : '5 VP only for the player who claimed the end-game token from the bonus market.'}
              </p>

              {onNavigateToEndgame && (
                <button
                  type="button"
                  onClick={onNavigateToEndgame}
                  className="mt-2 text-[11px] text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {lang === 'sr'
                      ? 'Kada se završava igra i ko uzima token? Vidi pravila ➔'
                      : 'When is game end triggered? View rules ➔'}
                  </span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleToggleEndGameToken(activePlayerIndex)}
              className={`w-full min-h-[48px] py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activePlayer.cat12_endGameTokenVP === 5
                  ? 'bg-amber-400 text-[#0c1f1a] border-amber-300 font-black shadow-md'
                  : 'bg-[#10241e] text-emerald-300 border-emerald-800 hover:bg-[#16362e]'
              }`}
            >
              {activePlayer.cat12_endGameTokenVP === 5 ? (
                <>
                  <Award className="w-4 h-4 text-[#0c1f1a]" />
                  <span>{lang === 'sr' ? '🏆 Poseduje Token (+5 VP)' : '🏆 Holds Token (+5 VP)'}</span>
                </>
              ) : (
                <span>{lang === 'sr' ? 'Nema token (0 VP) — Klikni da dodeliš' : 'No Token (0 VP) — Tap to assign'}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED CATEGORY COMPARISON TABLE */}
      <div className="parchment-card rounded-2xl overflow-hidden shadow-lg border border-[#c99738]/30">
        <div className="p-5 bg-gradient-to-r from-[#17372e] to-[#122a23] flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg font-serif-vintage text-amber-100">
              {lang === 'sr' ? 'Uporedna Tabela Poena Svih Igrača' : 'Full Score Comparison Matrix'}
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-[#10241e] border-b border-emerald-800/60 text-amber-200 uppercase">
                <th className="p-3 font-serif-vintage sticky left-0 bg-[#0d221c] z-20 border-r border-emerald-800/60 shadow-md min-w-[160px]">
                  {lang === 'sr' ? 'Kategorija' : 'Category'}
                </th>
                {players.map((p) => {
                  const colors = getColorClasses(p.color);
                  return (
                    <th key={p.id} className="p-3 text-center font-bold font-serif-vintage min-w-[100px]">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                        <span className="truncate">{p.name}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 text-emerald-100">
              {SCORING_CATEGORIES_METADATA.map((cat, idx) => {
                const getPlayerCatVP = (p: PlayerScoreData) => {
                  switch (cat.id) {
                    case 'cat1':
                      return Math.floor(Math.max(0, p.cat1_money) / 5);
                    case 'cat2':
                      return p.cat2_privateBuildingsVP;
                    case 'cat3':
                      return p.cat3_tradingPostsVP;
                    case 'cat4':
                      return p.cat4_harboursVP;
                    case 'cat5':
                      return p.cat5_pathfinderVP;
                    case 'cat6':
                      return p.cat6_hazardsAndBonusTilesVP;
                    case 'cat7':
                      return p.cat7_deckCardsVP;
                    case 'cat8':
                      return p.cat8_objectiveCardsVP;
                    case 'cat9':
                      return p.cat9_harbourmastersVP;
                    case 'cat10':
                      return p.cat10_handLimitDiscVP;
                    case 'cat11':
                      return p.cat11_workersAndStorehousesVP;
                    case 'cat12':
                      return p.cat12_endGameTokenVP;
                    default:
                      return 0;
                  }
                };

                return (
                  <tr key={cat.id} className="hover:bg-[#142e26] transition-colors">
                    <td className="p-3 font-medium text-emerald-200 sticky left-0 bg-[#0c1f19] z-10 border-r border-emerald-800/60 shadow-md">
                      <span className="text-amber-400 font-bold mr-1.5">{idx + 1}.</span>
                      {lang === 'sr' ? cat.serbianName : cat.name}
                    </td>
                    {players.map((p) => (
                      <td key={p.id} className="p-3 text-center font-bold text-amber-200/90">
                        {getPlayerCatVP(p)}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* TOTAL ROW - GUARANTEED EXACT MATCH WITH LEADERBOARD & CARD HEADER */}
              <tr className="bg-[#0f241e] font-extrabold text-amber-300 text-sm border-t-2 border-[#c99738]/50">
                <td className="p-4 font-serif-vintage uppercase tracking-wider sticky left-0 bg-[#0b1b15] z-10 border-r border-emerald-800/60 shadow-md">
                  {lang === 'sr' ? 'UKUPNO (TOTAL VP)' : 'TOTAL VP'}
                </td>
                {players.map((p) => {
                  const total = calculatePlayerTotal(p);
                  const isTop = rankedPlayers[0].calculatedTotal === total && total > 0;
                  return (
                    <td key={p.id} className="p-4 text-center font-serif-vintage text-base">
                      <span className={isTop ? 'text-amber-400 font-black flex items-center justify-center gap-1' : ''}>
                        {isTop && '👑'} {total} VP
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SHARE / URL LINK MODAL FOR "ŠTA IGRAMO?" AND OTHERS */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f251f] border-2 border-amber-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Link2 className="w-5 h-5" />
                <h3 className="font-bold text-lg font-serif-vintage text-amber-100">
                  {lang === 'sr' ? 'Link za "Šta igramo?" i deljenje' : 'Share Link & App Integration'}
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-[#15342a] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed">
              {lang === 'sr'
                ? 'Preko ovog linka možete pokrenuti kalkulator ili setup direktno iz vaše Android aplikacije "Šta igramo?" sa unapred zadatim brojem igrača, njihovim imenima i bojama!'
                : 'Use this link to launch the app directly with the configured players, names, and colors.'}
            </p>

            {/* Generated URL Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold text-amber-300">
                {lang === 'sr' ? 'Generisani link (kliknite dugme za kopiranje):' : 'Generated URL:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="w-full bg-[#081511] border border-emerald-700/70 rounded-xl px-3 py-2 text-xs font-mono text-emerald-200 select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow ${
                    shareCopied
                      ? 'bg-emerald-500 text-[#0c1f1a]'
                      : 'bg-amber-400 hover:bg-amber-300 text-[#0c1f1a]'
                  }`}
                >
                  {shareCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{lang === 'sr' ? 'Kopirano!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{lang === 'sr' ? 'Kopiraj' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Documentation of Supported URL Parameters */}
            <div className="bg-[#081511] p-3.5 rounded-xl border border-emerald-800/80 text-xs space-y-2 text-emerald-300/90">
              <div className="font-bold text-amber-300 text-xs flex items-center gap-1">
                <span>📖 {lang === 'sr' ? 'Podržani URL parametri:' : 'Supported URL parameters:'}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>
                  <code className="text-amber-200">players=Marko:red,Jovan:blue,Ana:yellow</code>{' '}
                  <span className="text-emerald-400">({lang === 'sr' ? 'ili crvena, plava, zelena, zuta, crna' : 'or colors'})</span>
                </li>
                <li>
                  <code className="text-amber-200">p1=Marko&c1=red&p2=Jovan&c2=blue</code>
                </li>
                <li>
                  <code className="text-amber-200">count=3</code> ({lang === 'sr' ? 'broj igrača 1-4' : 'player count 1-4'})
                </li>
                <li>
                  <code className="text-amber-200">tab=scoring</code> | <code className="text-amber-200">setup</code> |{' '}
                  <code className="text-amber-200">endgame</code> | <code className="text-amber-200">rules</code>
                </li>
              </ul>
            </div>

            <div className="text-right">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl bg-[#143028] hover:bg-[#1a3d33] text-xs font-bold text-amber-200 border border-emerald-700/60 cursor-pointer"
              >
                {lang === 'sr' ? 'Zatvori' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
