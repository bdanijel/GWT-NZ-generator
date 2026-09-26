import React, { useState } from 'react';
import { GameSetupResult, Language, PlayerColor } from '../types/game';
import { generateGWTNZSetup } from '../utils/setupGenerator';
import {
  CompassIcon,
  SteeringWheelIcon,
  BarrelIcon,
  BellIcon,
  PoundCoinIcon,
  GoldBarIcon,
  ExchangeTokenIcon,
  CertificateIcon,
  SheepIcon,
  ShepherdIcon,
  CraftsmanIcon,
  SailorIcon,
  ShearerIcon,
  PathfinderIcon,
} from './CustomIcons';
import {
  Dices,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  Users,
  Building2,
  Anchor,
  Compass,
} from 'lucide-react';

interface SetupViewProps {
  lang: Language;
  initialPlayerCount?: 1 | 2 | 3 | 4;
  onNavigateToScoring?: () => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ lang, initialPlayerCount, onNavigateToScoring }) => {
  const [playerCount, setPlayerCount] = useState<1 | 2 | 3 | 4>(initialPlayerCount || 3);
  const [randomNeutral, setRandomNeutral] = useState<boolean>(false);
  const [randomPrivate, setRandomPrivate] = useState<boolean>(false);
  const [setup, setSetup] = useState<GameSetupResult>(() =>
    generateGWTNZSetup(initialPlayerCount || 3, { randomNeutralBuildings: false, randomizePrivateBuildings: false })
  );
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    bonusSets: true,
    harbourmasters: true,
    wellington: true,
    sheepMarket: true,
    players: true,
    buildings: false,
  });

  const handleGenerate = () => {
    const newSetup = generateGWTNZSetup(playerCount, {
      randomNeutralBuildings: randomNeutral,
      randomizePrivateBuildings: randomPrivate,
    });
    setSetup(newSetup);
    setCheckedSteps({});
  };

  const handlePlayerCountChange = (count: 1 | 2 | 3 | 4) => {
    setPlayerCount(count);
    const newSetup = generateGWTNZSetup(count, {
      randomNeutralBuildings: randomNeutral,
      randomizePrivateBuildings: randomPrivate,
    });
    setSetup(newSetup);
    setCheckedSteps({});
  };

  const toggleStep = (stepKey: string) => {
    setCheckedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCopySummary = () => {
    const setsSummary = setup.selectedBonusSets
      .map(
        (s) =>
          `• ${s.spot.toUpperCase()} (${s.goldCost} Gold): Set ${s.set.setNumber} (${s.set.name}) - ${s.cardsCount} karata`
      )
      .join('\n');

    const text = `GREAT WESTERN TRAIL: NEW ZEALAND - SETUP
Broj igrača: ${setup.playerCount} ${setup.isSolo ? '(Solo - Sarah)' : ''}
Datum: ${new Date(setup.timestamp).toLocaleDateString()}

BONUS KARTE:
${setsSummary}

LUČKI KAPETANI (5 izvučenih):
${setup.selectedHarbourmasters.map((h) => `• ${h.name}: ${h.upperBenefit.label} | ${h.lowerCondition.label}`).join('\n')}

WELLINGTON:
• Izvuci ${setup.wellingtonSupply.drawnTilesCount} pločica iz vreće A
• Početne bonus pločice na berzi: ${setup.wellingtonSupply.initialBonusMarketTiles} pločica
• Izvuci ${setup.sheepMarketCardsToDraw} ovaca za tržište

POČETAK IGRE:
${setup.playersStartingInfo.map((p) => `• ${p.turnOrder}. ${p.name} (${p.color}): ${p.startingPounds}£, ${p.startingCardsDrawn} karata, ${p.startingExchangeTokens} žeton zamene, 1 zlato`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getColorBg = (color: PlayerColor) => {
    switch (color) {
      case 'red':
        return 'bg-red-900/60 border-red-500/60 text-red-100';
      case 'blue':
        return 'bg-blue-900/60 border-blue-500/60 text-blue-100';
      case 'green':
        return 'bg-emerald-900/60 border-emerald-500/60 text-emerald-100';
      case 'yellow':
        return 'bg-amber-900/60 border-amber-500/60 text-amber-100';
      case 'black':
        return 'bg-stone-900/80 border-stone-500/60 text-stone-100';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Control Panel Header */}
      <div className="bg-gradient-to-r from-[#122e26] via-[#1a3c32] to-[#122e26] p-6 rounded-2xl border border-[#c99738]/40 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#c99738]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[#c99738] mb-1">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold font-serif-vintage">
                {lang === 'sr' ? 'Zvanični Generator Pripreme Igre' : 'Official Game Setup Generator'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif-vintage text-amber-100">
              {lang === 'sr' ? 'Priprema za Great Western Trail: New Zealand' : 'Great Western Trail: New Zealand Setup'}
            </h2>
            <p className="text-sm text-emerald-200/80 mt-1 max-w-2xl">
              {lang === 'sr'
                ? 'Automatski nasumično bira 4 seta bonus karata po ceni u zlatu, 5 lučkih kapetana, simulira početno tržište ovaca i raspoređuje resurse prema zvaničnom pravilniku.'
                : 'Randomizes the 4 bonus card sets by gold cost, 5 harbourmasters, simulates starting sheep market, and sets player resources according to the rulebook.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleGenerate}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[#0c1f1a] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-lg shadow-amber-950/30 transition-all transform active:scale-95 cursor-pointer"
            >
              <Dices className="w-5 h-5" />
              <span>{lang === 'sr' ? 'Generiši Novi Setup' : 'Generate New Setup'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-[#1a3830] hover:bg-[#234c41] text-amber-200 border border-[#c99738]/40 transition-all active:scale-95 cursor-pointer"
              title="Kopiraj sažetak"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              <span className="text-sm hidden sm:inline">{copied ? (lang === 'sr' ? 'Kopirano!' : 'Copied!') : (lang === 'sr' ? 'Kopiraj' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Options & Player Count Selector */}
        <div className="mt-6 pt-6 border-t border-emerald-800/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Player Count */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-amber-200/80 uppercase tracking-wider block">
                {lang === 'sr' ? 'Broj Igrača' : 'Player Count'}
              </label>
              <button
                type="button"
                onClick={() => {
                  const allKeys = ['bonusSets', 'harbourmasters', 'wellington', 'sheepMarket', 'players', 'buildings'];
                  const allDone = allKeys.every((k) => checkedSteps[k]);
                  const nextChecked: Record<string, boolean> = {};
                  allKeys.forEach((k) => {
                    nextChecked[k] = !allDone;
                  });
                  setCheckedSteps(nextChecked);
                }}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline cursor-pointer"
              >
                {Object.values(checkedSteps).filter(Boolean).length >= 5
                  ? (lang === 'sr' ? 'Poništi sve oznake' : 'Uncheck all')
                  : (lang === 'sr' ? 'Označi sve završeno' : 'Check all')}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { count: 1, label: lang === 'sr' ? '1 (Solo)' : '1 (Solo)' },
                { count: 2, label: lang === 'sr' ? '2 Igrača' : '2 Players' },
                { count: 3, label: lang === 'sr' ? '3 Igrača' : '3 Players' },
                { count: 4, label: lang === 'sr' ? '4 Igrača' : '4 Players' },
              ].map((item) => (
                <button
                  key={item.count}
                  onClick={() => handlePlayerCountChange(item.count as 1 | 2 | 3 | 4)}
                  className={`min-h-[44px] py-2 px-1 sm:px-2 text-center rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                    playerCount === item.count
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm font-extrabold'
                      : 'bg-[#152e27] border-emerald-900/60 text-emerald-300/80 hover:bg-[#1c3e34]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Random Neutral Buildings Toggle */}
          <div className="flex flex-col justify-between">
            <label className="text-xs font-semibold text-amber-200/80 uppercase tracking-wider block mb-2">
              {lang === 'sr' ? 'Neutralne zgrade' : 'Neutral Buildings'}
            </label>
            <button
              onClick={() => {
                setRandomNeutral(!randomNeutral);
                const newSetup = generateGWTNZSetup(playerCount, {
                  randomNeutralBuildings: !randomNeutral,
                  randomizePrivateBuildings: randomPrivate,
                });
                setSetup(newSetup);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${
                randomNeutral
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-[#152e27] border-emerald-900/60 text-emerald-300/70 hover:bg-[#1c3e34]'
              }`}
            >
              <span>{randomNeutral ? (lang === 'sr' ? 'Nasumičan raspored' : 'Randomized') : (lang === 'sr' ? 'Standardno (A-H)' : 'Standard (A-H)')}</span>
              <RefreshCw className={`w-3.5 h-3.5 ${randomNeutral ? 'text-amber-400' : 'text-emerald-500'}`} />
            </button>
          </div>

          {/* Private Buildings Side Toggle */}
          <div className="flex flex-col justify-between">
            <label className="text-xs font-semibold text-amber-200/80 uppercase tracking-wider block mb-2">
              {lang === 'sr' ? 'Privatne zgrade strana' : 'Private Buildings Side'}
            </label>
            <button
              onClick={() => {
                setRandomPrivate(!randomPrivate);
                const newSetup = generateGWTNZSetup(playerCount, {
                  randomNeutralBuildings: randomNeutral,
                  randomizePrivateBuildings: !randomPrivate,
                });
                setSetup(newSetup);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${
                randomPrivate
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-[#152e27] border-emerald-900/60 text-emerald-300/70 hover:bg-[#1c3e34]'
              }`}
            >
              <span>{randomPrivate ? (lang === 'sr' ? 'Nasumične A/B strane' : 'Random A/B') : (lang === 'sr' ? 'Sve A strane (Početno)' : 'All A sides')}</span>
              <Building2 className={`w-3.5 h-3.5 ${randomPrivate ? 'text-amber-400' : 'text-emerald-500'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* SETUP SECTIONS */}

      {/* 1. BONUS CARD SETS SUPPLY */}
      <div className="parchment-card rounded-2xl overflow-hidden shadow-lg border border-[#c99738]/30">
        <div
          onClick={() => toggleSection('bonusSets')}
          className="p-5 bg-gradient-to-r from-[#17372e] to-[#122a23] flex items-center justify-between cursor-pointer border-b border-emerald-800/40 select-none hover:bg-[#1a3d33] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif-vintage text-amber-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                {lang === 'sr' ? 'Izabrana 4 Seta Bonus Karata (Bonus Cards Supply)' : 'Selected 4 Bonus Card Sets'}
              </h3>
              <p className="text-xs text-emerald-300/70">
                {lang === 'sr'
                  ? `Izvučena 4 seta iz 10. Svaki set sadrži ${setup.selectedBonusSets[0].cardsCount} karata (${setup.playerCount === 2 ? 'zvezdica + 2' : setup.playerCount === 3 ? 'zvezdica + 4' : 'svih 6'}) poređana od najmanjeg do najvećeg broja seta.`
                  : `4 sets drawn from 10. Each set contains ${setup.selectedBonusSets[0].cardsCount} cards sorted by set number.`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStep('bonusSets');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#11241f] border border-emerald-700/50 hover:border-amber-400 text-amber-200 transition-all cursor-pointer"
            >
              {checkedSteps['bonusSets'] ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-emerald-600" />
              )}
              <span>{checkedSteps['bonusSets'] ? (lang === 'sr' ? 'Postavljeno' : 'Done') : (lang === 'sr' ? 'Označi' : 'Check')}</span>
            </button>
            {expandedSections['bonusSets'] ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-emerald-400" />}
          </div>
        </div>

        {expandedSections['bonusSets'] && (
          <div className="p-6 space-y-6">
            {/* The 4 Supply Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {setup.selectedBonusSets.map((item, idx) => {
                const getSpotIcon = () => {
                  switch (item.spot) {
                    case 'steering_wheel':
                      return <SteeringWheelIcon className="w-6 h-6 text-amber-400" />;
                    case 'barrel':
                      return <BarrelIcon className="w-6 h-6 text-amber-400" />;
                    case 'bell':
                      return <BellIcon className="w-6 h-6 text-amber-400" />;
                    case 'compass':
                      return <CompassIcon className="w-6 h-6 text-amber-400" />;
                  }
                };

                const getSpotName = () => {
                  switch (item.spot) {
                    case 'steering_wheel':
                      return lang === 'sr' ? 'Kormilo (Steering Wheel)' : 'Steering Wheel';
                    case 'barrel':
                      return lang === 'sr' ? 'Bure (Barrel)' : 'Barrel';
                    case 'bell':
                      return lang === 'sr' ? 'Zvono (Bell)' : 'Bell';
                    case 'compass':
                      return lang === 'sr' ? 'Kompas (Compass)' : 'Compass';
                  }
                };

                return (
                  <div
                    key={item.spot}
                    className="bg-[#122822] rounded-xl p-4 border border-amber-500/30 flex flex-col justify-between relative group hover:border-amber-400 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-800/40">
                      <div className="flex items-center gap-2">
                        {getSpotIcon()}
                        <span className="font-bold text-xs uppercase text-amber-200 tracking-wider">
                          {getSpotName()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-md text-xs border border-amber-500/40">
                        <GoldBarIcon className="w-3.5 h-3.5" />
                        <span>{item.goldCost} {lang === 'sr' ? 'Zlata' : 'Gold'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-[#0c1f1a] font-bold text-xs flex items-center justify-center font-serif-vintage">
                          {item.set.setNumber}
                        </span>
                        <h4 className="font-bold text-sm text-emerald-100 line-clamp-1">
                          {lang === 'sr' ? item.set.serbianName : item.set.name}
                        </h4>
                      </div>

                      <p className="text-xs text-emerald-300/80 leading-relaxed min-h-[48px]">
                        {lang === 'sr' ? item.set.serbianDescription : item.set.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs text-emerald-400/90 border-t border-emerald-900/50">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-amber-400" />
                          <strong>{item.cardsCount}</strong> {lang === 'sr' ? 'karata u gomili' : 'cards in pile'}
                        </span>
                        {item.set.isObjective && (
                          <span className="text-[10px] uppercase font-bold text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                            {lang === 'sr' ? 'Cilj' : 'Objective'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Boxed Sets Reminder */}
            <div className="p-3.5 rounded-xl bg-[#0e211c] border border-emerald-900/60 text-xs text-emerald-300/70 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>{lang === 'sr' ? 'Preostalih 6 setova vraćeno u kutiju:' : 'Leftover 6 sets returned to box:'}</strong>{' '}
                {setup.boxedBonusSets.map((s) => `Set ${s.setNumber} (${lang === 'sr' ? s.serbianName : s.name})`).join(', ')}.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. HARBOURMASTER TILES */}
      <div className="parchment-card rounded-2xl overflow-hidden shadow-lg border border-[#c99738]/30">
        <div
          onClick={() => toggleSection('harbourmasters')}
          className="p-5 bg-gradient-to-r from-[#17372e] to-[#122a23] flex items-center justify-between cursor-pointer border-b border-emerald-800/40 select-none hover:bg-[#1a3d33] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif-vintage text-amber-100 flex items-center gap-2">
                <Anchor className="w-5 h-5 text-amber-400" />
                {lang === 'sr' ? '5 Pločica Lučkih Kapetana na Morskim Rutama' : '5 Harbourmaster Tiles on Sea Routes'}
              </h3>
              <p className="text-xs text-emerald-300/70">
                {lang === 'sr'
                  ? 'Promešaj 8 pločica, postavi nasumično 5 licem nagore na označena mesta luka, a preostale 3 vrati u kutiju.'
                  : 'Shuffle 8 tiles, place 5 face-up onto sea route harbours, return 3 to box.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStep('harbourmasters');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#11241f] border border-emerald-700/50 hover:border-amber-400 text-amber-200 transition-all cursor-pointer"
            >
              {checkedSteps['harbourmasters'] ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-emerald-600" />
              )}
              <span>{checkedSteps['harbourmasters'] ? (lang === 'sr' ? 'Postavljeno' : 'Done') : (lang === 'sr' ? 'Označi' : 'Check')}</span>
            </button>
            {expandedSections['harbourmasters'] ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-emerald-400" />}
          </div>
        </div>

        {expandedSections['harbourmasters'] && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {setup.selectedHarbourmasters.map((tile, idx) => (
                <div
                  key={tile.id}
                  className="bg-[#122822] rounded-xl p-3.5 border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-400 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between pb-1 mb-2 border-b border-emerald-800/40">
                      <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                        {lang === 'sr' ? `Luka ${idx + 1}` : `Harbour ${idx + 1}`}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-bold flex items-center justify-center border border-cyan-700">
                        #{tile.id}
                      </span>
                    </div>

                    {/* Upper Action */}
                    <div className="bg-[#16352d] p-2 rounded-lg mb-2 border border-emerald-700/40">
                      <span className="text-[10px] uppercase font-bold text-amber-300 block mb-0.5">
                        {lang === 'sr' ? 'Gornji deo (Trenutno / Trajno):' : 'Upper (Instant / Permanent):'}
                      </span>
                      <p className="text-xs font-semibold text-emerald-100">
                        {lang === 'sr' ? tile.upperBenefit.serbianLabel : tile.upperBenefit.label}
                      </p>
                    </div>

                    {/* Lower Endgame VP */}
                    <div className="bg-[#0e221d] p-2 rounded-lg border border-amber-800/30">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                        {lang === 'sr' ? 'Donji deo (Krajnji VP zadatak):' : 'Lower (Endgame VP Task):'}
                      </span>
                      <p className="text-xs text-amber-200">
                        {lang === 'sr' ? tile.lowerCondition.serbianLabel : tile.lowerCondition.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-[#0e211c] border border-emerald-900/60 text-xs text-emerald-300/70 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>{lang === 'sr' ? 'U kutiju vraćeno 3 kapetana:' : 'Returned 3 tiles to box:'}</strong>{' '}
                {setup.boxedHarbourmasters.map((h) => `#${h.id} (${lang === 'sr' ? h.lowerCondition.serbianVpRule : h.lowerCondition.vpRule})`).join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. WELLINGTON SUPPLY & JOB MARKET */}
      <div className="parchment-card rounded-2xl overflow-hidden shadow-lg border border-[#c99738]/30">
        <div
          onClick={() => toggleSection('wellington')}
          className="p-5 bg-gradient-to-r from-[#17372e] to-[#122a23] flex items-center justify-between cursor-pointer border-b border-emerald-800/40 select-none hover:bg-[#1a3d33] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif-vintage text-amber-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                {lang === 'sr' ? 'Wellington Zalihe, Berza Rada i Pločice Bonusa' : 'Wellington Supply, Job Market & Bonus Tiles'}
              </h3>
              <p className="text-xs text-emerald-300/70">
                {lang === 'sr'
                  ? 'Raspored radnika u gornji red berze rada, izvlačenje pločica iz A i B vreća prema broju igrača.'
                  : 'Worker placements, draws from A & B bags based on player count.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStep('wellington');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#11241f] border border-emerald-700/50 hover:border-amber-400 text-amber-200 transition-all cursor-pointer"
            >
              {checkedSteps['wellington'] ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-emerald-600" />
              )}
              <span>{checkedSteps['wellington'] ? (lang === 'sr' ? 'Postavljeno' : 'Done') : (lang === 'sr' ? 'Označi' : 'Check')}</span>
            </button>
            {expandedSections['wellington'] ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-emerald-400" />}
          </div>
        </div>

        {expandedSections['wellington'] && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 6 Job market initial row */}
            <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <ShepherdIcon className="w-4 h-4" />
                <span>{lang === 'sr' ? 'Gornji red Berze Rada (Job Market)' : 'Job Market Top Row'}</span>
              </div>
              <p className="text-xs text-emerald-200/80">
                {lang === 'sr'
                  ? 'Izvuci tačno po 1 radnika svakog tipa (Pastir, Zanatlija, Mornar, Strizač) iz vreće A i stavi u gornji red odgovarajućih kolona.'
                  : 'Pick 1 of each worker type (Shepherd, Craftsman, Sailor, Shearer) from bag A into the top row of their columns.'}
              </p>
              <div className="grid grid-cols-4 gap-1.5 pt-2 text-[11px] font-semibold text-center">
                <div className="bg-amber-950/60 p-1.5 rounded border border-amber-700/50 text-amber-200">Pastir</div>
                <div className="bg-orange-950/60 p-1.5 rounded border border-orange-700/50 text-orange-200">Zanatlija</div>
                <div className="bg-cyan-950/60 p-1.5 rounded border border-cyan-700/50 text-cyan-200">Mornar</div>
                <div className="bg-purple-950/60 p-1.5 rounded border border-purple-700/50 text-purple-200">Strizač</div>
              </div>
            </div>

            {/* Wellington Draws count */}
            <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>{lang === 'sr' ? 'Početno izvlačenje iz vreće A' : 'Initial Bag A Draws'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-between">
                <span className="text-xs text-emerald-200 font-medium">
                  {lang === 'sr' ? `Za ${setup.playerCount} igrača izvuci:` : `For ${setup.playerCount} players draw:`}
                </span>
                <span className="text-lg font-extrabold text-amber-300 font-serif-vintage">
                  {setup.wellingtonSupply.drawnTilesCount} {lang === 'sr' ? 'pločica' : 'tiles'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 leading-relaxed">
                {lang === 'sr'
                  ? 'Radnici idu na najskuplje slobodno mesto svoje kolone. Nepogode (odron/poplava) idu na slobodno mesto sa najmanjim brojem (od 1).'
                  : 'Workers to highest free space in column. Hazards to lowest numbered space (from 1).'}
              </p>
            </div>

            {/* Bonus Market & Foresight */}
            <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'sr' ? 'Berza bonusa i Predviđanja (Foresight)' : 'Bonus Market & Foresights'}</span>
              </div>
              <ul className="text-xs text-emerald-200/90 space-y-1.5">
                <li className="flex items-center justify-between bg-[#16362e] p-1.5 rounded">
                  <span>{lang === 'sr' ? 'Početnih bonus pločica na berzi:' : 'Initial bonus tiles in market:'}</span>
                  <strong className="text-amber-300">{setup.wellingtonSupply.initialBonusMarketTiles}</strong>
                </li>
                <li className="flex items-center justify-between bg-[#16362e] p-1.5 rounded">
                  <span>{lang === 'sr' ? 'Predviđanje A (Foresight A):' : 'Foresight A spaces:'}</span>
                  <strong className="text-amber-300">2 {lang === 'sr' ? 'pločice A' : 'A tiles'}</strong>
                </li>
                <li className="flex items-center justify-between bg-[#16362e] p-1.5 rounded">
                  <span>{lang === 'sr' ? 'Predviđanje B (Foresight B):' : 'Foresight B spaces:'}</span>
                  <strong className="text-amber-300">2 {lang === 'sr' ? 'pločice B' : 'B tiles'}</strong>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 4. SHEEP MARKET SIMULATION */}
      <div className="parchment-card rounded-2xl overflow-hidden shadow-lg border border-[#c99738]/30">
        <div
          onClick={() => toggleSection('sheepMarket')}
          className="p-5 bg-gradient-to-r from-[#17372e] to-[#122a23] flex items-center justify-between cursor-pointer border-b border-emerald-800/40 select-none hover:bg-[#1a3d33] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
              4
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif-vintage text-amber-100 flex items-center gap-2">
                <SheepIcon className="w-5 h-5 text-amber-400" />
                {lang === 'sr' ? `Početno Tržište Ovaca (${setup.sheepMarketCardsToDraw} Karata)` : `Initial Sheep Market (${setup.sheepMarketCardsToDraw} Cards)`}
              </h3>
              <p className="text-xs text-emerald-300/70">
                {lang === 'sr'
                  ? 'Promešaj 37 karata sa tržišta, izvuci i poređaj po zvaničnom redosledu boja: Narandžasta → Crvena → Žuta → Plava → Ljubičasta.'
                  : 'Shuffle 37 market cards, draw and sort by official color order: Orange → Red → Yellow → Blue → Purple.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStep('sheepMarket');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#11241f] border border-emerald-700/50 hover:border-amber-400 text-amber-200 transition-all cursor-pointer"
            >
              {checkedSteps['sheepMarket'] ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-emerald-600" />
              )}
              <span>{checkedSteps['sheepMarket'] ? (lang === 'sr' ? 'Postavljeno' : 'Done') : (lang === 'sr' ? 'Označi' : 'Check')}</span>
            </button>
            {expandedSections['sheepMarket'] ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-emerald-400" />}
          </div>
        </div>

        {expandedSections['sheepMarket'] && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-emerald-200/80 mb-2">
              <span>{lang === 'sr' ? 'Simulirano izvlačenje početnih karata ovaca:' : 'Simulated initial drawn cards:'}</span>
              <span className="text-amber-300 font-semibold">{setup.simulatedInitialMarket.length} {lang === 'sr' ? 'karata u nizu' : 'cards in row'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {setup.simulatedInitialMarket.map((breed, idx) => (
                <div
                  key={`${breed.id}-${idx}`}
                  className="rounded-xl p-3 border flex flex-col justify-between shadow-md transition-transform hover:-translate-y-1"
                  style={{
                    backgroundColor: '#122822',
                    borderColor: `${breed.colorHex}70`,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1 pb-1 border-b border-emerald-800/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: breed.colorHex }}>
                        {breed.colorName}
                      </span>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-1 rounded">
                        {breed.victoryPoints} VP
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white mb-2 line-clamp-1">{breed.name}</h4>

                    <div className="grid grid-cols-2 gap-1 text-[11px] font-bold text-center">
                      <div className="bg-emerald-950/70 p-1 rounded border border-emerald-700/50 text-emerald-200" title="Uzgojna vrednost (Breeding Value)">
                        <span className="text-[9px] block text-emerald-400/80">Uzgoj</span>
                        {breed.breedingValue}
                      </div>
                      <div className="bg-amber-950/70 p-1 rounded border border-amber-700/50 text-amber-200" title="Vrednost vune (Wool Value)">
                        <span className="text-[9px] block text-amber-400/80">Vuna</span>
                        {breed.woolValue}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Deck building supply reminder */}
            <div className="p-3 rounded-xl bg-[#0e211c] border border-emerald-900/60 text-xs text-emerald-300/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong>{lang === 'sr' ? 'Špilovi za gradnju špila (Deck-building Supply):' : 'Deck-building Supply:'}</strong>{' '}
                  18 Romney ovaca (Vrednost 3, 1 VP), 12 Ovčarskih pasa (Sheepdog), 14 Trajekata (Ferry), 12 Kōtare ptica.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. PLAYER STARTING RESOURCES & TURN 1 RULES */}
      <div className="parchment-card rounded-2xl overflow-hidden shadow-lg border border-[#c99738]/30">
        <div
          onClick={() => toggleSection('players')}
          className="p-5 bg-gradient-to-r from-[#17372e] to-[#122a23] flex items-center justify-between cursor-pointer border-b border-emerald-800/40 select-none hover:bg-[#1a3d33] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
              5
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif-vintage text-amber-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                {lang === 'sr' ? 'Početni Kapital Igrača i Prvi Potez' : 'Starting Player Resources & First Turn Rules'}
              </h3>
              <p className="text-xs text-emerald-300/70">
                {lang === 'sr'
                  ? 'Redosled poteza, novac, početne karte u ruci, žetoni zamene i pravila odbacivanja u prvom potezu.'
                  : 'Turn order, pounds, initial cards dealt, exchange tokens and turn 1 discard requirement.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStep('players');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#11241f] border border-emerald-700/50 hover:border-amber-400 text-amber-200 transition-all cursor-pointer"
            >
              {checkedSteps['players'] ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-emerald-600" />
              )}
              <span>{checkedSteps['players'] ? (lang === 'sr' ? 'Postavljeno' : 'Done') : (lang === 'sr' ? 'Označi' : 'Check')}</span>
            </button>
            {expandedSections['players'] ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-emerald-400" />}
          </div>
        </div>

        {expandedSections['players'] && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {setup.playersStartingInfo.map((p) => (
                <div
                  key={p.turnOrder}
                  className={`rounded-2xl p-4 border shadow-lg flex flex-col justify-between transition-all ${getColorBg(
                    p.color
                  )}`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/20">
                      <span className="text-xs uppercase font-extrabold tracking-wider">
                        {p.turnOrder}. {lang === 'sr' ? 'Igrač' : 'Player'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 font-bold uppercase">
                        {p.color}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-white mb-3">{p.name}</h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between bg-black/30 p-2 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <PoundCoinIcon className="w-4 h-4 text-amber-300" />
                          {lang === 'sr' ? 'Početni novac:' : 'Starting money:'}
                        </span>
                        <strong className="text-amber-300 font-bold text-sm">{p.startingPounds} £</strong>
                      </div>

                      <div className="flex items-center justify-between bg-black/30 p-2 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-cyan-300" />
                          {lang === 'sr' ? 'Vuče na početku:' : 'Draws at start:'}
                        </span>
                        <strong className="text-cyan-200 font-bold text-sm">
                          {p.startingCardsDrawn} {lang === 'sr' ? 'karata' : 'cards'}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between bg-black/30 p-2 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <ExchangeTokenIcon className="w-4 h-4 text-blue-300" />
                          {lang === 'sr' ? 'Žeton zamene:' : 'Exchange token:'}
                        </span>
                        <strong className="text-blue-200 font-bold text-sm">{p.startingExchangeTokens}x</strong>
                      </div>

                      <div className="flex items-center justify-between bg-black/30 p-2 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <GoldBarIcon className="w-4 h-4 text-amber-400" />
                          {lang === 'sr' ? 'Početno zlato:' : 'Starting gold:'}
                        </span>
                        <strong className="text-amber-200 font-bold text-sm">1 {lang === 'sr' ? 'Zlato' : 'Gold'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Turn 1 reminder */}
                  <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-white/90 leading-snug">
                    <span className="font-bold text-amber-300 uppercase block mb-1">
                      {lang === 'sr' ? '⚠️ Pravilo 1. poteza:' : '⚠️ Turn 1 Rule:'}
                    </span>
                    {lang === 'sr'
                      ? 'Odbaci karte dok ne ostane tačno 4 u ruci. Postavi 1 disk na polje 0 Pathfinder staze. Rančera stavi na bilo koju neutralnu zgradu i kreni sa Fazom B!'
                      : 'Discard down to exactly 4 hand cards. Place 1 disc onto Pathfinder space 0. Place runholder on any neutral building and start directly with Phase B!'}
                  </div>
                </div>
              ))}
            </div>

            {/* General setup notes */}
            <div className="p-4 rounded-xl bg-[#122822] border border-amber-500/30 text-xs text-emerald-200/90 space-y-2">
              <h5 className="font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <PathfinderIcon className="w-4 h-4" />
                {lang === 'sr' ? 'Pločice Koraka (Step Tiles) na Pathfinder Stazi:' : 'Step Tiles on Pathfinder Track:'}
              </h5>
              <p>
                {lang === 'sr'
                  ? `Postavi tačno ${setup.stepTilesCount} narandžaste pločice koraka (+1/+2) na polje ${setup.stepTilesLocation} pored Pathfinder staze.`
                  : `Place ${setup.stepTilesCount} orange step tiles on ${setup.stepTilesLocation} next to pathfinder track.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 6. NEUTRAL & PRIVATE BUILDINGS OVERVIEW */}
      <div className="parchment-card rounded-2xl overflow-hidden shadow-lg border border-[#c99738]/30">
        <div
          onClick={() => toggleSection('buildings')}
          className="p-5 bg-gradient-to-r from-[#17372e] to-[#122a23] flex items-center justify-between cursor-pointer border-b border-emerald-800/40 select-none hover:bg-[#1a3d33] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
              6
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif-vintage text-amber-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                {lang === 'sr' ? 'Raspored Neutralnih i Privatnih Zgrada' : 'Neutral & Private Buildings Layout'}
              </h3>
              <p className="text-xs text-emerald-300/70">
                {lang === 'sr'
                  ? 'Pregled rasporeda neutralnih zgrada (A do H) i varijante strana privatnih zgrada.'
                  : 'Layout of neutral building spaces (A through H) and private building sides.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStep('buildings');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#11241f] border border-emerald-700/50 hover:border-amber-400 text-amber-200 transition-all cursor-pointer"
            >
              {checkedSteps['buildings'] ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-emerald-600" />
              )}
              <span>{checkedSteps['buildings'] ? (lang === 'sr' ? 'Postavljeno' : 'Done') : (lang === 'sr' ? 'Označi' : 'Check')}</span>
            </button>
            {expandedSections['buildings'] ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-emerald-400" />}
          </div>
        </div>

        {expandedSections['buildings'] && (
          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-bold text-sm text-amber-200 uppercase mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                {lang === 'sr' ? 'Neutralne zgrade na stazi (8 lokacija):' : 'Neutral buildings on trail (8 spaces):'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {setup.neutralBuildingsLayout.map((b) => (
                  <div
                    key={b.space}
                    className="bg-[#122822] p-3 rounded-xl border border-emerald-700/50 text-center flex flex-col justify-between"
                  >
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {lang === 'sr' ? `Polje ${b.space}` : `Space ${b.space}`}
                    </span>
                    <span className="text-xl font-bold font-serif-vintage text-amber-300 my-1">
                      {b.buildingLetter}
                    </span>
                    {b.isFlippable ? (
                      <span className="text-[9px] bg-teal-900/60 text-teal-300 px-1 py-0.5 rounded border border-teal-600/50">
                        {lang === 'sr' ? 'Obrtna (II)' : 'Flippable (II)'}
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-600">Standard</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {setup.randomizedSides && (
              <div>
                <h4 className="font-bold text-sm text-amber-200 uppercase mb-3">
                  {lang === 'sr' ? 'Izvučene strane privatnih zgrada (identično za sve igrače):' : 'Randomized private building sides (identical for all):'}
                </h4>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Object.entries(setup.randomizedSides).map(([num, side]) => (
                    <div
                      key={num}
                      className="bg-[#122822] p-2 rounded-lg border border-amber-600/40 text-center"
                    >
                      <span className="text-[10px] text-emerald-400 block font-bold">Zgrada {num}</span>
                      <span className="text-base font-extrabold text-amber-300 uppercase">
                        {num}{side}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
