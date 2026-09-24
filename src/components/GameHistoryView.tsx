import React, { useState, useEffect } from 'react';
import { Language, SavedGameHistory } from '../types/game';
import { Trophy, Trash2, Calendar, Users, Eye, Sparkles, Download, FileSpreadsheet } from 'lucide-react';

interface GameHistoryViewProps {
  lang: Language;
}

export const GameHistoryView: React.FC<GameHistoryViewProps> = ({ lang }) => {
  const [history, setHistory] = useState<SavedGameHistory[]>([]);
  const [selectedGame, setSelectedGame] = useState<SavedGameHistory | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gwt_nz_game_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm(lang === 'sr' ? 'Obrisati ovaj zapis partije?' : 'Delete this game log?')) {
      const updated = history.filter((g) => g.id !== id);
      setHistory(updated);
      localStorage.setItem('gwt_nz_game_history', JSON.stringify(updated));
      if (selectedGame?.id === id) {
        setSelectedGame(null);
      }
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gwt_nz_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="bg-gradient-to-r from-[#122e26] via-[#1a3c32] to-[#122e26] p-6 rounded-2xl border border-[#c99738]/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#c99738] mb-1">
            <Trophy className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-semibold font-serif-vintage">
              {lang === 'sr' ? 'Istorijat Odigranih Partija' : 'Game History & Archive'}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif-vintage text-amber-100">
            {lang === 'sr' ? 'Sačuvani Rezultati Partija' : 'Saved Match Results'}
          </h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            {lang === 'sr'
              ? 'Pregled prethodno odigranih partija, pobednika, i raspodele poena po kategorijama.'
              : 'Review your previously recorded games, winning scores, and score breakdowns.'}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#16362e] hover:bg-[#1d443a] text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'sr' ? 'Preuzmi JSON' : 'Export JSON'}</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="parchment-card p-12 rounded-2xl border border-emerald-800/40 text-center space-y-3">
          <Trophy className="w-12 h-12 text-amber-500/40 mx-auto" />
          <h3 className="text-lg font-bold text-amber-100 font-serif-vintage">
            {lang === 'sr' ? 'Još uvek nema sačuvanih partija' : 'No saved games yet'}
          </h3>
          <p className="text-xs text-emerald-300/70 max-w-md mx-auto">
            {lang === 'sr'
              ? 'Nakon što završite partiju i unesete poene u Scoring Pad, kliknite na dugme "Sačuvaj Igru" kako bi se rezultat arhivirao ovde.'
              : 'Save match results from the Scoring Pad to see your game archive here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((game) => (
              <div
                key={game.id}
                className="parchment-card p-5 rounded-2xl border border-amber-500/30 hover:border-amber-400/70 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-800/50">
                    <div className="flex items-center gap-2 text-xs text-emerald-300/80">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{new Date(game.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800">
                        {game.playerCount} {lang === 'sr' ? 'igrača' : 'players'}
                      </span>
                      <button
                        onClick={() => handleDelete(game.id)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        title="Obriši"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-amber-400/90 font-bold uppercase tracking-wider block">
                        {lang === 'sr' ? 'Pobednik:' : 'Winner:'}
                      </span>
                      <h4 className="text-lg font-extrabold text-amber-200 font-serif-vintage flex items-center gap-1.5">
                        👑 {game.winnerName}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-amber-300 font-serif-vintage">
                        {game.winnerScore}
                      </span>
                      <span className="text-[10px] text-emerald-400 block font-bold uppercase">VP</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-emerald-100">
                    {game.players.map((p, idx) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-1.5 rounded bg-[#11241f]"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-400">{idx + 1}.</span>
                          <span>{p.name}</span>
                        </span>
                        <strong className="text-amber-300">{p.totalScore} VP</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
