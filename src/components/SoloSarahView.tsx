import React, { useState } from 'react';
import { Language } from '../types/game';
import { Bot, Sparkles, Shield, Play, RotateCcw, Award, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { SheepIcon, PoundCoinIcon } from './CustomIcons';

interface SoloSarahViewProps {
  lang: Language;
}

export const SoloSarahView: React.FC<SoloSarahViewProps> = ({ lang }) => {
  const [sarahDifficulty, setSarahDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#17252a] via-[#203a43] to-[#0f2027] p-6 rounded-2xl border border-teal-500/40 shadow-xl">
        <div className="flex items-center gap-2 text-teal-400 mb-1">
          <Bot className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-semibold font-serif-vintage">
            {lang === 'sr' ? 'Zvanični Solo Režim (Automa Sarah)' : 'Official Solo Automa Mode (Sarah)'}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-serif-vintage text-teal-100">
          {lang === 'sr' ? 'Igra Protiv Autome Sarah' : 'Solo Challenge vs Sarah Automa'}
        </h2>
        <p className="text-xs sm:text-sm text-teal-200/80 mt-1 max-w-2xl">
          {lang === 'sr'
            ? 'Pravila, priprema i vođenje automatskog protivnika Sarah za Great Western Trail: New Zealand.'
            : 'Rules, setup, and card guidance for playing against Sarah in solo mode.'}
        </p>

        {/* Difficulty switcher */}
        <div className="mt-5 pt-4 border-t border-teal-800/40 flex items-center gap-3">
          <span className="text-xs font-bold text-teal-300 uppercase">
            {lang === 'sr' ? 'Težina:' : 'Difficulty:'}
          </span>
          {(['easy', 'normal', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSarahDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                sarahDifficulty === diff
                  ? 'bg-teal-400 text-[#0c1f1a] border-teal-300 font-extrabold shadow'
                  : 'bg-teal-950/60 text-teal-200 border-teal-800 hover:bg-teal-900'
              }`}
            >
              {diff === 'easy' ? (lang === 'sr' ? 'Lako' : 'Easy') : diff === 'normal' ? (lang === 'sr' ? 'Normalno' : 'Normal') : (lang === 'sr' ? 'Teško' : 'Hard')}
            </button>
          ))}
        </div>
      </div>

      {/* Solo Setup Steps */}
      <div className="parchment-card p-6 rounded-2xl border border-teal-500/30 space-y-4">
        <h3 className="text-lg font-bold text-teal-100 font-serif-vintage flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-400" />
          {lang === 'sr' ? 'Priprema za Solo Igru sa Sarah' : 'Sarah Setup Guide'}
        </h3>

        <div className="space-y-3 text-xs text-emerald-200/90 leading-relaxed">
          <div className="p-3 bg-[#102720] rounded-xl border border-emerald-700/50 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <strong>{lang === 'sr' ? 'Komponente za Sarah:' : 'Sarah Components:'}</strong>{' '}
              {lang === 'sr'
                ? '1 Sarah tabla, 1 pločica specijalizacije, 17 Sarah karata (promešaj u poseban špil), 1 pločica tržišta ovaca za Sarah, i set komponenti u njenoj boji.'
                : '1 Sarah board, 1 specialization tile, 17 Sarah cards, 1 Sarah sheep market tile.'}
            </div>
          </div>

          <div className="p-3 bg-[#102720] rounded-xl border border-emerald-700/50 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <strong>{lang === 'sr' ? 'Pravila 2 igrača:' : '2-Player Rules apply:'}</strong>{' '}
              {lang === 'sr'
                ? 'Priprema glavne table se radi kao za igru u 2 igrača (12 pločica iz vreće A, 3 početne bonus pločice na berzi, 9 ovaca na tržištu ovaca).'
                : 'Setup the main board using the 2-player rules (12 bag A tiles, 3 bonus market tiles, 9 market sheep).'}
            </div>
          </div>

          <div className="p-3 bg-[#102720] rounded-xl border border-emerald-700/50 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <strong>{lang === 'sr' ? 'Redosled poteza:' : 'Turn Order:'}</strong>{' '}
              {lang === 'sr'
                ? 'Vi ste uvek 1. igrač (počinjete sa 7£, 4 karte, 1 žeton zamene), a Sarah je 2. igrač (počinje sa 8£).'
                : 'You are player 1 (7£, 4 cards, 1 exchange token), Sarah is player 2 (8£).'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
