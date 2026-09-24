import React, { useState, useEffect } from 'react';
import { Language, PlayerColor, PlayerScoreData, SavedGameHistory } from '../types/game';
import { SCORING_CATEGORIES_METADATA, HARBOURMASTER_TILES, SHEEP_BREEDS } from '../data/gwtData';
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
} from 'lucide-react';

interface ScoringCalculatorViewProps {
  lang: Language;
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
    totalScore: 0,
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
    totalScore: 0,
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
    totalScore: 0,
  },
];

export const ScoringCalculatorView: React.FC<ScoringCalculatorViewProps> = ({ lang }) => {
  const [players, setPlayers] = useState<PlayerScoreData[]>(() => {
    const saved = localStorage.getItem('gwt_nz_current_scoring');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PLAYERS;
  });

  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [activeCategoryModal, setActiveCategoryModal] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(true);

  // Calculate total score for each player
  const calculatePlayerTotal = (p: PlayerScoreData): number => {
    const moneyVP = Math.floor(Math.max(0, p.cat1_money) / 5);
    return (
      moneyVP +
      (p.cat2_privateBuildingsVP || 0) +
      (p.cat3_tradingPostsVP || 0) +
      (p.cat4_harboursVP || 0) +
      (p.cat5_pathfinderVP || 0) +
      (p.cat6_hazardsAndBonusTilesVP || 0) +
      (p.cat7_deckCardsVP || 0) +
      (p.cat8_objectiveCardsVP || 0) +
      (p.cat9_harbourmastersVP || 0) +
      (p.cat10_handLimitDiscVP || 0) +
      (p.cat11_workersAndStorehousesVP || 0) +
      (p.cat12_endGameTokenVP || 0)
    );
  };

  // Sync total scores
  useEffect(() => {
    const updated = players.map((p) => ({
      ...p,
      totalScore: calculatePlayerTotal(p),
    }));
    setPlayers(updated);
    localStorage.setItem('gwt_nz_current_scoring', JSON.stringify(updated));
  }, []);

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

    setPlayers((prev) => [...prev, newPlayer]);
    setActivePlayerIndex(players.length);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 1) return;
    setPlayers((prev) => prev.filter((_, i) => i !== index));
    if (activePlayerIndex >= index && activePlayerIndex > 0) {
      setActivePlayerIndex(activePlayerIndex - 1);
    }
  };

  const handleResetAll = () => {
    if (confirm(lang === 'sr' ? 'Da li ste sigurni da želite da resetujete sve poene?' : 'Reset all scores?')) {
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
      setPlayers(reset);
      localStorage.setItem('gwt_nz_current_scoring', JSON.stringify(reset));
    }
  };

  const handleSaveToHistory = () => {
    const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
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

  // Sorted rankings
  const rankedPlayers = [...players].map((p, originalIdx) => ({
    ...p,
    originalIdx,
    calculatedTotal: calculatePlayerTotal(p),
  })).sort((a, b) => b.calculatedTotal - a.calculatedTotal);

  const activePlayer = players[activePlayerIndex] || players[0];

  const getColorClasses = (color: PlayerColor) => {
    switch (color) {
      case 'red':
        return {
          border: 'border-red-500/60',
          bg: 'bg-red-950/40',
          text: 'text-red-300',
          badge: 'bg-red-600',
        };
      case 'blue':
        return {
          border: 'border-blue-500/60',
          bg: 'bg-blue-950/40',
          text: 'text-blue-300',
          badge: 'bg-blue-600',
        };
      case 'green':
        return {
          border: 'border-emerald-500/60',
          bg: 'bg-emerald-950/40',
          text: 'text-emerald-300',
          badge: 'bg-emerald-600',
        };
      case 'yellow':
        return {
          border: 'border-amber-500/60',
          bg: 'bg-amber-950/40',
          text: 'text-amber-300',
          badge: 'bg-amber-600',
        };
      case 'black':
        return {
          border: 'border-stone-500/60',
          bg: 'bg-stone-900/60',
          text: 'text-stone-300',
          badge: 'bg-stone-700',
        };
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header & Summary Bar */}
      <div className="bg-gradient-to-r from-[#122e26] via-[#1a3c32] to-[#122e26] p-6 rounded-2xl border border-[#c99738]/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#c99738] mb-1">
              <Calculator className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold font-serif-vintage">
                {lang === 'sr' ? 'Zvanični Blok Za Računanje Poena (Scoring Pad)' : 'Official Scoring Pad Calculator'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif-vintage text-amber-100">
              {lang === 'sr' ? 'Krajnje Računanje Poena (12 Kategorija)' : 'Endgame Scoring (12 Categories)'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              {lang === 'sr'
                ? 'Unesite poene za svih 12 zvaničnih kategorija sa strane 19 pravilnika uz automatsko sabiranje, rangiranje i kalkulatore.'
                : 'Enter points across all 12 official categories from page 19 of the rulebook.'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleSaveToHistory}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[#0c1f1a] bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span className="text-sm">
                {savedSuccess ? (lang === 'sr' ? 'Sačuvano!' : 'Saved!') : (lang === 'sr' ? 'Sačuvaj Igru' : 'Save Match')}
              </span>
            </button>

            <button
              onClick={handleResetAll}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#152e27] hover:bg-[#1d3d34] text-red-300 border border-red-900/50 transition-all cursor-pointer"
              title="Resetuj poene"
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
              {lang === 'sr' ? 'U slučaju nerešenog, pobeda se deli!' : 'Ties share victory!'}
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
                      ? 'ring-2 ring-amber-400 bg-[#193a30]'
                      : 'bg-[#122822] hover:bg-[#16332b]'
                  } ${colors.border}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isWinner
                          ? 'bg-amber-400 text-[#0c1f1a] shadow-lg shadow-amber-500/40'
                          : 'bg-emerald-900/80 text-emerald-200'
                      }`}
                    >
                      {rank + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors.badge}`} />
                        <span className="font-bold text-xs sm:text-sm text-emerald-100 line-clamp-1">
                          {player.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400/80 uppercase">
                        {player.color}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-extrabold text-amber-300 font-serif-vintage block">
                      {player.calculatedTotal}
                    </span>
                    <span className="text-[9px] text-emerald-400 uppercase font-semibold">VP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PLAYER TABS & SELECTION */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {players.map((p, idx) => {
            const colors = getColorClasses(p.color);
            const isActive = activePlayerIndex === idx;

            return (
              <button
                key={p.id}
                onClick={() => setActivePlayerIndex(idx)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0c1f1a] border-amber-300 shadow-md font-extrabold'
                    : 'bg-[#132b24] text-emerald-200 border-emerald-800/50 hover:bg-[#1a3a30]'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${colors.badge}`} />
                <span>{p.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-black/20 text-[#0c1f1a]' : 'bg-emerald-950 text-amber-300'
                  }`}
                >
                  {p.totalScore} VP
                </span>
              </button>
            );
          })}

          {players.length < 4 && (
            <button
              onClick={handleAddPlayer}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#132b24] hover:bg-[#1c3e34] text-emerald-300 border border-dashed border-emerald-700/60 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'sr' ? 'Dodaj Igrača' : 'Add Player'}</span>
            </button>
          )}
        </div>

        {players.length > 1 && (
          <button
            onClick={() => handleRemovePlayer(activePlayerIndex)}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/30 border border-red-900/40 cursor-pointer"
            title="Ukloni trenutnog igrača"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'sr' ? 'Ukloni' : 'Remove'}</span>
          </button>
        )}
      </div>

      {/* ACTIVE PLAYER DETAILS & INPUT FORM */}
      <div className="parchment-card rounded-2xl p-6 border border-[#c99738]/40 shadow-xl space-y-6">
        {/* Player Name & Color Editor */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-800/40">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={activePlayer.name}
              onChange={(e) => updatePlayerField(activePlayerIndex, 'name', e.target.value)}
              className="bg-[#10241e] border border-emerald-700/60 rounded-xl px-3.5 py-2 font-serif-vintage font-bold text-lg text-amber-200 focus:outline-none focus:border-amber-400 w-full sm:w-64"
              placeholder="Ime igrača"
            />

            {/* Color Switcher */}
            <div className="flex items-center gap-1.5 bg-[#10241e] p-1.5 rounded-xl border border-emerald-800/60">
              {(['red', 'blue', 'green', 'yellow', 'black'] as PlayerColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => updatePlayerField(activePlayerIndex, 'color', c)}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                    activePlayer.color === c ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor:
                      c === 'red'
                        ? '#dc2626'
                        : c === 'blue'
                        ? '#2563eb'
                        : c === 'green'
                        ? '#16a34a'
                        : c === 'yellow'
                        ? '#ca8a04'
                        : '#44403c',
                  }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#10241e] px-4 py-2 rounded-xl border border-amber-500/40">
            <span className="text-xs uppercase font-bold text-emerald-300">
              {lang === 'sr' ? 'Ukupno Poena:' : 'Total Score:'}
            </span>
            <span className="text-2xl font-extrabold text-amber-300 font-serif-vintage">
              {activePlayer.totalScore} VP
            </span>
          </div>
        </div>

        {/* 12 OFFICIAL SCORING CATEGORIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CAT 1: MONEY */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
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
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? '1 poen za svakih 5 funti (£) na kraju igre' : '1 VP for every 5 pounds (£)'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300">{lang === 'sr' ? 'Funti:' : 'Pounds:'}</span>
              <input
                type="number"
                min="0"
                value={activePlayer.cat1_money}
                onChange={(e) => updatePlayerField(activePlayerIndex, 'cat1_money', parseInt(e.target.value) || 0)}
                className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CAT 2: PRIVATE BUILDINGS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  2. {lang === 'sr' ? 'Privatne zgrade' : 'Private Buildings'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat2_privateBuildingsVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? 'Zbir VP odštampanih na tvojim postavljenim zgradama' : 'Sum of VPs on placed private buildings'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300">VP:</span>
              <input
                type="number"
                min="0"
                value={activePlayer.cat2_privateBuildingsVP}
                onChange={(e) =>
                  updatePlayerField(activePlayerIndex, 'cat2_privateBuildingsVP', parseInt(e.target.value) || 0)
                }
                className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CAT 3: TRADING POSTS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  3. {lang === 'sr' ? 'Trgovačke stanice' : 'Trading Posts'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat3_tradingPostsVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr'
                  ? 'Grbovi stanica (lokalne, strane, vuna) -8 VP za polje 0, susedni bonusi'
                  : 'Trading crests (local, foreign, wool) -8 VP per disc on 0, adjacent bonuses'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300">VP:</span>
              <input
                type="number"
                value={activePlayer.cat3_tradingPostsVP}
                onChange={(e) =>
                  updatePlayerField(activePlayerIndex, 'cat3_tradingPostsVP', parseInt(e.target.value) || 0)
                }
                className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CAT 4: HARBOURS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  4. {lang === 'sr' ? 'Luke i pristaništa' : 'Harbours'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat4_harboursVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? 'Poeni sa malih i srednjih luka + 4 VP bonus za susedne male luke' : 'Small & medium harbours VPs + 4 VP pair bonuses'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300">VP:</span>
              <input
                type="number"
                min="0"
                value={activePlayer.cat4_harboursVP}
                onChange={(e) =>
                  updatePlayerField(activePlayerIndex, 'cat4_harboursVP', parseInt(e.target.value) || 0)
                }
                className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CAT 5: PATHFINDER TRACK */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <PathfinderIcon className="w-4 h-4" />
                  5. {lang === 'sr' ? 'Pathfinder staza' : 'Pathfinder Track'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat5_pathfinderVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? 'Najveća dostignuta vrednost na stazi (0, 1, 2, 4, 7, 10, 15)' : 'Highest reached milestone (0, 1, 2, 4, 7, 10, 15)'}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 4, 7, 10, 15].map((vp) => (
                <button
                  key={vp}
                  onClick={() => updatePlayerField(activePlayerIndex, 'cat5_pathfinderVP', vp)}
                  className={`flex-1 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    activePlayer.cat5_pathfinderVP === vp
                      ? 'bg-amber-400 text-[#0c1f1a]'
                      : 'bg-[#10241e] text-emerald-300 border border-emerald-800 hover:bg-[#16362e]'
                  }`}
                >
                  {vp}
                </button>
              ))}
            </div>
          </div>

          {/* CAT 6: HAZARDS & BONUS TILES */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  6. {lang === 'sr' ? 'Nepogode i bonus pločice' : 'Hazards & Bonus Tiles'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat6_hazardsAndBonusTilesVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? 'Zbir poena sa sakupljenih nepogoda (2,3,4) i bonus pločica' : 'Sum of collected hazards (2, 3, 4 VP) and bonus tiles'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300">VP:</span>
              <input
                type="number"
                min="0"
                value={activePlayer.cat6_hazardsAndBonusTilesVP}
                onChange={(e) =>
                  updatePlayerField(activePlayerIndex, 'cat6_hazardsAndBonusTilesVP', parseInt(e.target.value) || 0)
                }
                className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CAT 7: DECK SHEEP & BONUS CARDS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <SheepIcon className="w-4 h-4" />
                  7. {lang === 'sr' ? 'Ovce i karte u špilu' : 'Deck Sheep & Cards'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat7_deckCardsVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? 'Sve ovce i bonus karte sa VP u celom špilu (vučenje, ruka, odbačene)' : 'All cards with VP in full deck (draw, hand, discard)'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300">VP:</span>
              <input
                type="number"
                min="0"
                value={activePlayer.cat7_deckCardsVP}
                onChange={(e) =>
                  updatePlayerField(activePlayerIndex, 'cat7_deckCardsVP', parseInt(e.target.value) || 0)
                }
                className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CAT 8: OBJECTIVE CARDS */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  8. {lang === 'sr' ? 'Karte ciljeva' : 'Objective Cards'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat8_objectiveCardsVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? 'Ispunjeni ciljevi (+VP) minus neispunjeni ciljevi (-VP)' : 'Fulfilled (+VP) minus unfulfilled (-VP)'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300">Net VP:</span>
              <input
                type="number"
                value={activePlayer.cat8_objectiveCardsVP}
                onChange={(e) =>
                  updatePlayerField(activePlayerIndex, 'cat8_objectiveCardsVP', parseInt(e.target.value) || 0)
                }
                className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CAT 9: HARBOURMASTER TILES */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <CompassIcon className="w-4 h-4" />
                  9. {lang === 'sr' ? 'Lučki kapetani' : 'Harbourmaster Tiles'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat9_harbourmastersVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? 'Krajnji VP zadaci sa osvojenih pločica lučkih kapetana' : 'Endgame VP conditions on claimed harbourmasters'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300">VP:</span>
              <input
                type="number"
                min="0"
                value={activePlayer.cat9_harbourmastersVP}
                onChange={(e) =>
                  updatePlayerField(activePlayerIndex, 'cat9_harbourmastersVP', parseInt(e.target.value) || 0)
                }
                className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CAT 10: HAND LIMIT DISC */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  10. {lang === 'sr' ? 'Disk za limit karata' : 'Hand Limit Disc'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat10_handLimitDiscVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? '3 VP ako je oslobođeno desno polje za limit karata sa tamnim uglovima' : '3 VP if right hand limit disc was cleared on board'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updatePlayerField(activePlayerIndex, 'cat10_handLimitDiscVP', activePlayer.cat10_handLimitDiscVP === 3 ? 0 : 3)
                }
                className={`w-full py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  activePlayer.cat10_handLimitDiscVP === 3
                    ? 'bg-amber-400 text-[#0c1f1a] border-amber-300'
                    : 'bg-[#10241e] text-emerald-300 border-emerald-800 hover:bg-[#16362e]'
                }`}
              >
                {activePlayer.cat10_handLimitDiscVP === 3
                  ? (lang === 'sr' ? '✓ Oslobođeno (+3 VP)' : '✓ Cleared (+3 VP)')
                  : (lang === 'sr' ? 'Nije oslobođeno (0 VP)' : 'Not Cleared (0 VP)')}
              </button>
            </div>
          </div>

          {/* CAT 11: 5TH SLOT WORKERS & STOREHOUSES */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  11. {lang === 'sr' ? 'Radnici na 5. mestu i skladišta' : '5th Space Workers & Stores'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat11_workersAndStorehousesVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? '4 VP po radniku na 5. mestu u redu + 2 ili 4 VP za parove skladišta' : '4 VP per 5th slot worker + 2/4 VP per storehouse pairs'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300">VP:</span>
              <input
                type="number"
                min="0"
                value={activePlayer.cat11_workersAndStorehousesVP}
                onChange={(e) =>
                  updatePlayerField(activePlayerIndex, 'cat11_workersAndStorehousesVP', parseInt(e.target.value) || 0)
                }
                className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CAT 12: END GAME TOKEN */}
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  12. {lang === 'sr' ? 'Token za kraj igre' : 'End Game Token'}
                </span>
                <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/40">
                  {activePlayer.cat12_endGameTokenVP} VP
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mb-3">
                {lang === 'sr' ? '5 VP za igrača koji je uzeo token berze bonus pločica i završio igru' : '5 VP for player holding bonus tiles market token'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentVP = activePlayer.cat12_endGameTokenVP;
                  // Only one player can hold the 5 VP token
                  setPlayers((prev) =>
                    prev.map((p, idx) => ({
                      ...p,
                      cat12_endGameTokenVP: idx === activePlayerIndex ? (currentVP === 5 ? 0 : 5) : 0,
                    }))
                  );
                }}
                className={`w-full py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  activePlayer.cat12_endGameTokenVP === 5
                    ? 'bg-amber-400 text-[#0c1f1a] border-amber-300'
                    : 'bg-[#10241e] text-emerald-300 border-emerald-800 hover:bg-[#16362e]'
                }`}
              >
                {activePlayer.cat12_endGameTokenVP === 5
                  ? (lang === 'sr' ? '🏆 Poseduje Token (+5 VP)' : '🏆 Holds Token (+5 VP)')
                  : (lang === 'sr' ? 'Nema token (0 VP)' : 'No Token (0 VP)')}
              </button>
            </div>
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#10241e] border-b border-emerald-800/60 text-amber-200 uppercase">
                <th className="p-3 font-serif-vintage">{lang === 'sr' ? 'Kategorija' : 'Category'}</th>
                {players.map((p) => {
                  const colors = getColorClasses(p.color);
                  return (
                    <th key={p.id} className="p-3 text-center font-bold font-serif-vintage">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors.badge}`} />
                        <span>{p.name}</span>
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
                    <td className="p-3 font-medium text-emerald-200">
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

              {/* TOTAL ROW */}
              <tr className="bg-[#0f241e] font-extrabold text-amber-300 text-sm border-t-2 border-[#c99738]/50">
                <td className="p-4 font-serif-vintage uppercase tracking-wider">
                  {lang === 'sr' ? 'UKUPNO (TOTAL VP)' : 'TOTAL VP'}
                </td>
                {players.map((p, idx) => {
                  const isTop = rankedPlayers[0].calculatedTotal === p.totalScore && p.totalScore > 0;
                  return (
                    <td key={p.id} className="p-4 text-center font-serif-vintage text-base">
                      <span className={isTop ? 'text-amber-400 font-black flex items-center justify-center gap-1' : ''}>
                        {isTop && '👑'} {p.totalScore}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
