import React from 'react';
import { Language } from '../types/game';
import {
  Flag,
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Coins,
  Compass,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import { CompassIcon, SheepIcon, PoundCoinIcon } from './CustomIcons';

interface EndgameGuideViewProps {
  lang: Language;
  onNavigateToScoring?: () => void;
}

export const EndgameGuideView: React.FC<EndgameGuideViewProps> = ({
  lang,
  onNavigateToScoring,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1a382e] via-[#122b23] to-[#0c1f19] p-6 sm:p-8 rounded-2xl border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Flag className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-extrabold font-serif-vintage">
              {lang === 'sr' ? 'Zvanična Pravila — Kraj Igre' : 'Official Rules — End of the Game'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-serif-vintage text-amber-100">
            {lang === 'sr' ? 'Kada i Kako Se Završava Igra?' : 'End of the Game & Final Trigger'}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-200/90 mt-2 max-w-2xl leading-relaxed">
            {lang === 'sr'
              ? 'Pravila sa strane 18 pravilnika: Šta tačno pokreće kraj igre, ko uzima token za kraj igre (+5 VP), ko ima pravo na poslednji potez i kako se vrši završna runda pre konačnog bodovanja.'
              : 'Rules from page 18 of the rulebook: What triggers game end, who takes the +5 VP end game token, who gets a final turn, and what happens next.'}
          </p>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute right-4 -bottom-6 opacity-10 text-amber-300 pointer-events-none hidden sm:block">
          <Flag className="w-48 h-48" />
        </div>
      </div>

      {/* 3 STEPS OF THE END GAME */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1: Trigger */}
        <div className="parchment-card p-6 rounded-2xl border-2 border-amber-500/50 space-y-4 relative flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
              <span className="w-9 h-9 rounded-xl bg-amber-400 text-[#0c1f1a] font-extrabold flex items-center justify-center font-serif-vintage text-lg shadow">
                1
              </span>
              <span className="text-[11px] uppercase font-bold tracking-wider text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-700/50">
                {lang === 'sr' ? 'Triger (Pokretač)' : 'The Trigger'}
              </span>
            </div>

            <h3 className="font-bold text-lg text-amber-100 font-serif-vintage mt-3">
              {lang === 'sr' ? 'Ispražnjen Berzanski Red' : 'Job / Bonus Market Empties'}
            </h3>

            <p className="text-xs text-emerald-200/90 leading-relaxed mt-2">
              {lang === 'sr'
                ? 'Kraj igre se pokreće u trenutku kada igrač u podfazi Foresight B (Predviđanje B) u Wellingtonu treba da pomeri token berze bonus pločica na sledeće polje, ali je staza došla do samog kraja — poslednje polje sa simbolom kraja igre!'
                : 'The game end is triggered when a player in Wellington subphase Foresight B places the last tile on the final space of the bonus market (with the game end icon).'}
            </p>

            <div className="bg-[#10241e] p-3 rounded-xl border border-amber-500/30 text-xs text-amber-200/90 mt-3">
              <strong>{lang === 'sr' ? 'Važno:' : 'Important:'}</strong>{' '}
              {lang === 'sr'
                ? 'Igrač koji je postavio poslednju pločicu odmah uzima Token za Kraj Igre sa table (End-Game Token) i stavlja ga na svoju tablu!'
                : 'The triggering player immediately takes the End-Game Token and places it on their player board!'}
            </div>
          </div>

          <div className="pt-2 text-right">
            <span className="text-xs font-bold text-amber-400 font-serif-vintage">
              +5 VP {lang === 'sr' ? 'za taj token' : 'for this token'}
            </span>
          </div>
        </div>

        {/* Step 2: Final Turns */}
        <div className="parchment-card p-6 rounded-2xl border-2 border-emerald-600/50 space-y-4 relative flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
              <span className="w-9 h-9 rounded-xl bg-emerald-500 text-[#0c1f1a] font-extrabold flex items-center justify-center font-serif-vintage text-lg shadow">
                2
              </span>
              <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-700/50">
                {lang === 'sr' ? 'Završna Runda' : 'Final Round'}
              </span>
            </div>

            <h3 className="font-bold text-lg text-emerald-100 font-serif-vintage mt-3">
              {lang === 'sr' ? 'Ko Igra Poslednji Potez?' : 'Who Takes a Final Turn?'}
            </h3>

            <p className="text-xs text-emerald-200/90 leading-relaxed mt-2">
              {lang === 'sr'
                ? 'Igrač koji je pokrenuo kraj igre više NEMA pravo na dodatne poteze! Svaki drugi igrač (u smeru kazaljke na satu) dobija tačno JEDAN poslednji potez.'
                : 'The player who triggered the end takes NO more turns! Every other player gets exactly ONE final turn in clockwise order.'}
            </p>

            <div className="bg-[#10241e] p-3 rounded-xl border border-emerald-700/40 text-xs text-emerald-200/90 mt-3 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'sr'
                    ? 'Poslednji igrač koji igra je igrač sa desne strane onoga ko je uzeo token za kraj igre.'
                    : 'The last player to play is the one to the right of the triggering player.'}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'sr'
                    ? 'Igrači u svom poslednjem potezu mogu normalno stići u Wellington i izvršiti isporuku!'
                    : 'Players in their final turn can still reach Wellington and complete their delivery.'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <span className="text-xs font-bold text-emerald-400 font-serif-vintage">
              {lang === 'sr' ? 'Tačno 1 potez za ostale' : 'Exactly 1 turn for others'}
            </span>
          </div>
        </div>

        {/* Step 3: Scoring */}
        <div className="parchment-card p-6 rounded-2xl border-2 border-cyan-500/50 space-y-4 relative flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
              <span className="w-9 h-9 rounded-xl bg-cyan-400 text-[#0c1f1a] font-extrabold flex items-center justify-center font-serif-vintage text-lg shadow">
                3
              </span>
              <span className="text-[11px] uppercase font-bold tracking-wider text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-700/50">
                {lang === 'sr' ? 'Prebrojavanje' : 'Final Scoring'}
              </span>
            </div>

            <h3 className="font-bold text-lg text-cyan-100 font-serif-vintage mt-3">
              {lang === 'sr' ? '12 Zvaničnih Kategorija' : '12 Scoring Categories'}
            </h3>

            <p className="text-xs text-emerald-200/90 leading-relaxed mt-2">
              {lang === 'sr'
                ? 'Nakon što svi ostali igrači odigraju svoj poslednji potez, igra se odmah prekida i prelazi se na blok za računanje (Scoring Pad) koji sabira 12 kategorija.'
                : 'After all eligible players finish their final turn, the game ends immediately and points are tallied across all 12 categories.'}
            </p>

            <div className="bg-[#10241e] p-3 rounded-xl border border-cyan-600/40 text-xs text-cyan-200/90 mt-3">
              {lang === 'sr'
                ? 'Igrač sa najviše poena pobeđuje! U slučaju nerešenog rezultata (tie), pobeda se ravnopravno deli.'
                : 'The player with the most victory points wins! In case of a tie, victory is shared.'}
            </div>
          </div>

          {onNavigateToScoring && (
            <button
              onClick={onNavigateToScoring}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0c1f1a] font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer mt-2"
            >
              <span>{lang === 'sr' ? 'Otvori Kalkulator Poena' : 'Open Scoring Pad'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* DETAILED CHECKLIST & IMPORTANT RULES */}
      <div className="parchment-card p-6 rounded-2xl border border-amber-500/30 space-y-6">
        <h3 className="text-xl font-bold font-serif-vintage text-amber-200 flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          {lang === 'sr' ? 'Ključna Pravila i Česte Zablude na Kraju Igre' : 'Critical Rules & Common Misunderstandings'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Award className="w-4 h-4" />
              <span>{lang === 'sr' ? '1. Token za kraj igre (Kategorija 12)' : '1. End-Game Token (Category 12)'}</span>
            </div>
            <p className="text-emerald-200/85 leading-relaxed">
              {lang === 'sr'
                ? 'Vredi tačno 5 pobedničkih poena (VP) na kraju igre. Samo jedan igrač ga može imati — onaj koji je postavio pločicu na polje koje je označeno ikonicom kraja igre. Ostali igrači imaju 0 poena u kategoriji 12.'
                : 'Worth exactly 5 VP at the end of the game. Only one player holds it — the one who triggered the endgame. All other players score 0 VP in category 12.'}
            </p>
          </div>

          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <PoundCoinIcon className="w-4 h-4" />
              <span>{lang === 'sr' ? '2. Novac u poene (Kategorija 1)' : '2. Money to VP (Category 1)'}</span>
            </div>
            <p className="text-emerald-200/85 leading-relaxed">
              {lang === 'sr'
                ? 'Svakih 5 funti (£) vredi 1 VP (zaokruženo naniže). Na primer, 14£ = 2 VP, dok 15£ = 3 VP. Zlatne poluge se tokom igre pretvaraju ili koriste, a preostali novac se deli sa 5.'
                : 'Every 5 pounds (£) is worth 1 VP (rounded down). E.g. £14 = 2 VP, £15 = 3 VP.'}
            </p>
          </div>

          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Compass className="w-4 h-4" />
              <span>{lang === 'sr' ? '3. Karte u Špilu, Ruci i Discardu (Kategorija 7)' : '3. Deck Cards VP (Category 7)'}</span>
            </div>
            <p className="text-emerald-200/85 leading-relaxed">
              {lang === 'sr'
                ? 'U obzir se uzimaju SVE vaše karte: karte u ruci, karte u špilu za vučenje i sve odbačene karte (discard pile). Svaka karta ima ispisanu VP vrednost u donjem levom uglu (npr. Merino vredi 2 VP, Romney 1 VP, pas 0-1 VP, itd.).'
                : 'Include ALL your cards: hand, draw deck, and discard pile. Sum the printed VP at the bottom left of each card.'}
            </p>
          </div>

          <div className="bg-[#122822] p-4 rounded-xl border border-emerald-700/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>{lang === 'sr' ? '4. Kartice Ciljeva (Kategorija 8)' : '4. Objective Cards (Category 8)'}</span>
            </div>
            <p className="text-emerald-200/85 leading-relaxed">
              {lang === 'sr'
                ? 'Ispunjeni ciljevi donose pozitivne poene (zeleni broj). Neispunjeni ciljevi koji su plasirani ili u ruci ODUZIMAJU poene (crveni negativni broj)! Ako cilj niste ispunili, gubite poene.'
                : 'Fulfilled objectives yield positive VP. Unfulfilled objectives in hand or played SUBTRACT negative points!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
