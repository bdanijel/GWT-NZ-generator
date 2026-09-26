import React, { useState } from 'react';
import { Language } from '../types/game';
import {
  SHEEP_BREEDS,
  BONUS_CARD_SETS,
  HARBOURMASTER_TILES,
  NEUTRAL_BUILDINGS,
} from '../data/gwtData';
import {
  SheepIcon,
  ShepherdIcon,
  CraftsmanIcon,
  SailorIcon,
  ShearerIcon,
  PoundCoinIcon,
  GoldBarIcon,
  ExchangeTokenIcon,
  CertificateIcon,
  StorehouseIcon,
  CompassIcon,
  HazardRockfallIcon,
  HazardFloodIcon,
  PathfinderIcon,
} from './CustomIcons';
import {
  BookOpen,
  Layers,
  Search,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Award,
  Anchor,
  Building,
  ArrowRight,
  TrendingUp,
  Flag,
  Trophy,
  ShieldAlert,
} from 'lucide-react';

interface RulesEncyclopediaProps {
  lang: Language;
  initialSubtab?: string;
  onNavigateToScoring?: () => void;
}

export const RulesEncyclopedia: React.FC<RulesEncyclopediaProps> = ({
  lang,
  initialSubtab,
  onNavigateToScoring,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'turn_structure'
    | 'wellington'
    | 'endgame'
    | 'shearing'
    | 'breeds'
    | 'bonus_sets'
    | 'harbourmasters'
    | 'buildings'
  >(() => {
    if (initialSubtab && ['turn_structure', 'wellington', 'endgame', 'shearing', 'breeds', 'bonus_sets', 'harbourmasters', 'buildings'].includes(initialSubtab)) {
      return initialSubtab as any;
    }
    return 'turn_structure';
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Wool simulator state
  const [shearerCount, setShearerCount] = useState(3);
  const [permWool, setPermWool] = useState(1);
  const [selectedSheepIds, setSelectedSheepIds] = useState<string[]>(['merino', 'lincoln', 'shropshire']);

  // Calculate simulated wool value
  const uniqueSelectedBreeds = SHEEP_BREEDS.filter((b) => selectedSheepIds.includes(b.id));
  const totalWoolValue =
    uniqueSelectedBreeds.reduce((acc, b) => acc + b.woolValue, 0) + permWool;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#122e26] via-[#1a3c32] to-[#122e26] p-6 rounded-2xl border border-[#c99738]/40 shadow-xl">
        <div className="flex items-center gap-2 text-[#c99738] mb-1">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-semibold font-serif-vintage">
            {lang === 'sr' ? 'Pravila i Enciklopedija Komponenti' : 'Rulebook & Component Encyclopedia'}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-serif-vintage text-amber-100">
          {lang === 'sr' ? 'Vodič Kroz Pravila i Mehanike Igre' : 'Rules & Gameplay Mechanics Guide'}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-3xl">
          {lang === 'sr'
            ? 'Detaljan pregled faza poteza, 4 podfaze Wellingtona, kalkulator striže ovaca, katalog svih 10 rasa ovaca, 10 setova bonus karata, 8 lučkih kapetana i neutralnih zgrada.'
            : 'Complete rules breakdown, Wellington 4 subphases, wool shearing simulator, breeds encyclopedia, bonus card sets, and harbourmasters.'}
        </p>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-emerald-800/40">
          {[
            { id: 'turn_structure', label: lang === 'sr' ? 'Struktura Poteza (A-B-C)' : 'Turn Structure (A-B-C)' },
            { id: 'wellington', label: lang === 'sr' ? '4 Wellington Podfaze' : '4 Wellington Subphases' },
            { id: 'endgame', label: lang === 'sr' ? '🏁 Kraj Igre (Triger i Tok)' : '🏁 Game End (Trigger & Flow)' },
            { id: 'shearing', label: lang === 'sr' ? 'Striža Ovaca & Vuna' : 'Wool & Shearing Action' },
            { id: 'breeds', label: lang === 'sr' ? 'Katalog 10 Rasa Ovaca' : '10 Sheep Breeds' },
            { id: 'bonus_sets', label: lang === 'sr' ? '10 Bonus Setova Karata' : '10 Bonus Card Sets' },
            { id: 'harbourmasters', label: lang === 'sr' ? '8 Lučkih Kapetana' : '8 Harbourmasters' },
            { id: 'buildings', label: lang === 'sr' ? 'Neutralne Zgrade (A-H)' : 'Neutral Buildings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-[#0c1f1a] border-amber-300 shadow-md font-bold'
                  : 'bg-[#132b24] text-emerald-200 border-emerald-800/60 hover:bg-[#1a3a30]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. TURN STRUCTURE (PHASE A, B, C) */}
      {activeTab === 'turn_structure' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phase A */}
            <div className="parchment-card p-5 rounded-2xl border border-emerald-600/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-800/50">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold flex items-center justify-center font-serif-vintage border border-amber-400/40">
                  A
                </span>
                <span className="text-xs uppercase font-bold text-amber-300">
                  {lang === 'sr' ? 'Faza A: Kretanje' : 'Phase A: Move'}
                </span>
              </div>
              <h3 className="font-bold text-base text-emerald-100 font-serif-vintage">
                {lang === 'sr' ? 'Pomeri rančera stazom' : 'Move your runholder'}
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {lang === 'sr'
                  ? 'Pomeri se napred u smeru strelica od 1 do maksimalno onoliko koraka koliko dozvoljava tvoj step limit (počinješ sa 3 ili 4). Lokacije su svaka zgrada i nepogoda; prazna polja se ne broje!'
                  : 'Move forward along the trail 1 to max step limit steps. Buildings and hazards count as steps; empty spaces do not count.'}
              </p>
              <div className="p-2.5 rounded-lg bg-[#0e211c] border border-amber-700/30 text-xs text-amber-200 space-y-1">
                <strong>{lang === 'sr' ? 'Plaćanje putarine (Takse šaka):' : 'Passing Fees:'}</strong>
                <div>• Crna šaka: Plati 1£ (banci ili vlasniku zgrade)</div>
                <div>• Zelena šaka: Plati 2£ (banci ili vlasniku zgrade)</div>
                <div className="text-[10px] text-emerald-400">
                  {lang === 'sr' ? 'Ako nemaš dovoljno novca, plati koliko imaš i nastavi!' : 'If broke, pay as much as you can!'}
                </div>
              </div>
            </div>

            {/* Phase B */}
            <div className="parchment-card p-5 rounded-2xl border border-emerald-600/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-800/50">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold flex items-center justify-center font-serif-vintage border border-amber-400/40">
                  B
                </span>
                <span className="text-xs uppercase font-bold text-amber-300">
                  {lang === 'sr' ? 'Faza B: Akcija' : 'Phase B: Actions'}
                </span>
              </div>
              <h3 className="font-bold text-base text-emerald-100 font-serif-vintage">
                {lang === 'sr' ? 'Izvrši akcije dostignute lokacije' : 'Use reached location'}
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {lang === 'sr'
                  ? 'Na neutralnoj ili svojoj privatnoj zgradi: izvrši lokalne akcije zgrade ILI jednu pomoćnu akciju. Na tuđoj zgradi ili nepogodi: samo jedna jednostruka pomoćna akcija. U Wellingtonu: odradi 4 podfaze!'
                  : 'On neutral or own private building: use local actions OR single auxiliary action. On opponent building or hazard: only 1 auxiliary action.'}
              </p>
            </div>

            {/* Phase C */}
            <div className="parchment-card p-5 rounded-2xl border border-emerald-600/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-800/50">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold flex items-center justify-center font-serif-vintage border border-amber-400/40">
                  C
                </span>
                <span className="text-xs uppercase font-bold text-amber-300">
                  {lang === 'sr' ? 'Faza C: Dopuna' : 'Phase C: Draw'}
                </span>
              </div>
              <h3 className="font-bold text-base text-emerald-100 font-serif-vintage">
                {lang === 'sr' ? 'Dopuni ruku do limita' : 'Draw up to hand limit'}
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {lang === 'sr'
                  ? 'Počinješ sa limitom od 4 karte (može se povećati do 6). Ako imaš manje karata od limita, dovuci iz ličnog špila. Kada se špil isprazni, promešaj odbačene karte.'
                  : 'Draw up to hand limit (starts at 4, can increase to 6). Reshuffle discard pile only when draw pile runs out.'}
              </p>
            </div>
          </div>

          {/* Auxiliary actions guide */}
          <div className="parchment-card p-6 rounded-2xl border border-amber-500/30 space-y-4">
            <h3 className="font-bold text-base text-amber-200 font-serif-vintage flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {lang === 'sr' ? '5 Pomoćnih Akcija na Tabli Igrača (Auxiliary Actions)' : '5 Auxiliary Actions'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="bg-[#122822] p-3 rounded-xl border border-emerald-700/50">
                <span className="text-amber-300 font-bold block mb-1">1. Dobij novac</span>
                <p className="text-emerald-200/80">Jednostruka: +1£. Dvostruka: +2£.</p>
              </div>
              <div className="bg-[#122822] p-3 rounded-xl border border-emerald-700/50">
                <span className="text-amber-300 font-bold block mb-1">2. Vuci i odbaci</span>
                <p className="text-emerald-200/80">Jednostruka: Vuci 1, odbaci 1. Dvostruka: Vuci 2, odbaci 2.</p>
              </div>
              <div className="bg-[#122822] p-3 rounded-xl border border-emerald-700/50">
                <span className="text-amber-300 font-bold block mb-1">3. Sertifikati</span>
                <p className="text-emerald-200/80">Jednostruka: Plati 2£ → +1 sertifikat. Dvostruka: Plati 4£ → +2 sertifikata.</p>
              </div>
              <div className="bg-[#122822] p-3 rounded-xl border border-emerald-700/50">
                <span className="text-amber-300 font-bold block mb-1">4. Plovidba brodom</span>
                <p className="text-emerald-200/80">Jednostruka: Plati 1£ → pomeri brod 1. Dvostruka: Plati 2£ → pomeri brod 2.</p>
              </div>
              <div className="bg-[#122822] p-3 rounded-xl border border-emerald-700/50">
                <span className="text-amber-300 font-bold block mb-1">5. Pathfinder staza</span>
                <p className="text-emerald-200/80">Jednostruka: Plati 1£ → napreduj 1. Dvostruka: Plati 2£ → napreduj 2.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. WELLINGTON SUBPHASES */}
      {activeTab === 'wellington' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="parchment-card p-5 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-[#0c1f1a] font-extrabold flex items-center justify-center font-serif-vintage">
                1
              </div>
              <h3 className="font-bold text-base text-amber-200 font-serif-vintage">
                {lang === 'sr' ? '1. Prihod (Income)' : '1. Income'}
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {lang === 'sr'
                  ? 'Otkrij koliko želiš različitih rasa ovaca iz ruke i saberi njihovu uzgojnu vrednost (Breeding Value). Dodaj privremene i trajne sertifikate. Uzmi taj ukupan iznos funti (£) iz banke. Otkrivene karte idu na tvoj discard pile.'
                  : 'Reveal distinct sheep breeds from hand, sum breeding values + certificates. Collect that amount in £ from bank. Discard revealed sheep.'}
              </p>
            </div>

            <div className="parchment-card p-5 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-[#0c1f1a] font-extrabold flex items-center justify-center font-serif-vintage">
                2
              </div>
              <h3 className="font-bold text-base text-amber-200 font-serif-vintage">
                {lang === 'sr' ? '2. Isporuka (Delivery)' : '2. Delivery'}
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {lang === 'sr'
                  ? 'Prebaci disk sa table na trgovačku stanicu čija je vrednost manja ili jednaka tvom ukupnom prihodu uzgoja. Disk sa belim uglovima može svuda; sa tamnim uglovima samo na stanice sa tamnim uglovima. Plati troškove transporta.'
                  : 'Place a player disc on an eligible trading post <= breeding sum. Pay transport costs and trigger delivery reward.'}
              </p>
            </div>

            <div className="parchment-card p-5 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-[#0c1f1a] font-extrabold flex items-center justify-center font-serif-vintage">
                3
              </div>
              <h3 className="font-bold text-base text-amber-200 font-serif-vintage">
                {lang === 'sr' ? '3. Predviđanje A (Foresight A)' : '3. Foresight A'}
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {lang === 'sr'
                  ? 'Izaberi 1 od 2 pločice sa polja A u Wellingtonu. Ako je radnik, stavi ga na najskuplje slobodno mesto njegove kolone u berzi rada. Ako je nepogoda, stavi je na polje sa najmanjim brojem u zoni poplave ili odrona.'
                  : 'Pick 1 of 2 A tiles and move to job market (worker) or hazard track.'}
              </p>
            </div>

            <div className="parchment-card p-5 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-[#0c1f1a] font-extrabold flex items-center justify-center font-serif-vintage">
                4
              </div>
              <h3 className="font-bold text-base text-amber-200 font-serif-vintage">
                {lang === 'sr' ? '4. Predviđanje B (Foresight B)' : '4. Foresight B'}
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {lang === 'sr'
                  ? 'Izaberi 1 od 2 pločice sa polja B i stavi na sledeće slobodno mesto u redu gde se nalazi token berze bonus pločica. Kada se red popuni, pomeri token u sledeći red duž strelice (može okinuti dopunu tržišta ovaca ili obrtanje neutralnih zgrada).'
                  : 'Pick 1 of 2 B tiles and place in bonus market row. Moving market token triggers sheep refill or flipping 4 neutral buildings.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* END OF THE GAME RULES & TRIGGER (STRANA 18) */}
      {activeTab === 'endgame' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#17372d] to-[#102720] p-6 rounded-2xl border border-amber-500/40 shadow-lg">
            <div className="flex items-center gap-2 text-amber-300 mb-1">
              <Flag className="w-5 h-5" />
              <span className="text-xs uppercase font-extrabold tracking-widest font-serif-vintage">
                {lang === 'sr' ? 'Zvanična Pravila — Kraj Igre (Strana 18 Pravilnika)' : 'Official Rulebook — End of the Game (Page 18)'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-vintage text-amber-100">
              {lang === 'sr' ? 'Triger za Kraj Igre, Poslednji Potezi i Token za Kraj' : 'Game End Trigger, Final Turns & End-Game Token'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-3xl">
              {lang === 'sr'
                ? 'Ovde je detaljno objašnjeno kako se tačno završava partija, ko ima pravo na završni potez, ko uzima token koji nosi +5 VP i kako se prelazi na završno računanje poena.'
                : 'Detailed rules on how the match ends, who takes a final turn, who earns the +5 VP end-game token, and moving to final scoring.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="parchment-card p-5 rounded-2xl border border-amber-500/50 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800/50">
                  <span className="w-8 h-8 rounded-xl bg-amber-400 text-[#0c1f1a] font-black flex items-center justify-center font-serif-vintage text-base">
                    1
                  </span>
                  <span className="text-[11px] uppercase font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded">
                    {lang === 'sr' ? 'Šta je triger?' : 'The Trigger'}
                  </span>
                </div>
                <h4 className="font-bold text-base text-amber-200 font-serif-vintage mt-2">
                  {lang === 'sr' ? 'Poslednje polje berze' : 'Last market space'}
                </h4>
                <p className="text-xs text-emerald-200/85 leading-relaxed mt-2">
                  {lang === 'sr'
                    ? 'U Wellingtonu, tokom podfaze 4 (Predviđanje B), kada igrač postavi pločicu B na poslednje slobodno polje u redu berze pločica — na polje koje ima simbol kraja igre — partija se završava!'
                    : 'In Wellington during subphase 4 (Foresight B), when a player places a B tile onto the final space of the bonus tile market (with the game end icon), the end of the game is triggered!'}
                </p>
                <div className="bg-[#10241e] p-2.5 rounded-xl border border-amber-500/30 text-xs text-amber-300/90 mt-3 font-semibold">
                  🏆 {lang === 'sr' ? 'Igrač odmah uzima Token za kraj igre sa table i stavlja ga na svoju tablu (+5 VP u kategoriji 12).' : 'Player immediately takes the End-Game Token (+5 VP in category 12).'}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="parchment-card p-5 rounded-2xl border border-emerald-600/50 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800/50">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500 text-[#0c1f1a] font-black flex items-center justify-center font-serif-vintage text-base">
                    2
                  </span>
                  <span className="text-[11px] uppercase font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                    {lang === 'sr' ? 'Ko još igra?' : 'Final Turns'}
                  </span>
                </div>
                <h4 className="font-bold text-base text-emerald-100 font-serif-vintage mt-2">
                  {lang === 'sr' ? 'Tačno po 1 potez za ostale' : '1 final turn for others'}
                </h4>
                <p className="text-xs text-emerald-200/85 leading-relaxed mt-2">
                  {lang === 'sr'
                    ? 'Igrač koji je pokrenuo kraj igre (uzeo token) VIŠE NE IGRA. Svaki drugi igrač dobija tačno JEDAN poslednji potez u smeru kazaljke na satu, završavajući sa igračem sa desne strane onoga ko je pokrenuo kraj.'
                    : 'The triggering player takes NO MORE TURNS. All other players take exactly ONE final turn in clockwise order, ending with the player immediately to their right.'}
                </p>
                <div className="bg-[#10241e] p-2.5 rounded-xl border border-emerald-700/40 text-xs text-emerald-200/90 mt-3">
                  {lang === 'sr'
                    ? 'Igrači u svom poslednjem potezu normalno pomeraju figuricu, mogu doći u Wellington i izvršiti isporuku.'
                    : 'Players may still reach Wellington and perform deliveries on their last turn.'}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="parchment-card p-5 rounded-2xl border border-cyan-500/50 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800/50">
                  <span className="w-8 h-8 rounded-xl bg-cyan-400 text-[#0c1f1a] font-black flex items-center justify-center font-serif-vintage text-base">
                    3
                  </span>
                  <span className="text-[11px] uppercase font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded">
                    {lang === 'sr' ? 'Bodovanje' : 'Final Scoring'}
                  </span>
                </div>
                <h4 className="font-bold text-base text-cyan-100 font-serif-vintage mt-2">
                  {lang === 'sr' ? '12 Kategorija na Bloku' : '12 Scorepad Categories'}
                </h4>
                <p className="text-xs text-emerald-200/85 leading-relaxed mt-2">
                  {lang === 'sr'
                    ? 'Nakon što poslednji igrač odigra, sabiraju se poeni svih 12 kategorija na zvaničnom bloku. Pobeđuje igrač sa najviše poena. U slučaju izjednačenja, pobeda se deli!'
                    : 'All 12 official categories are totaled. The player with the highest total score wins. Ties share victory!'}
                </p>
              </div>

              {onNavigateToScoring && (
                <button
                  onClick={onNavigateToScoring}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-[#0c1f1a] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer mt-3"
                >
                  <Trophy className="w-4 h-4" />
                  <span>{lang === 'sr' ? 'Pređi na Računanje Poena' : 'Go to Scoring Pad'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SHEARING SIMULATOR & RULES */}
      {activeTab === 'shearing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="parchment-card p-6 rounded-2xl border border-amber-500/40 space-y-4">
            <h3 className="font-bold text-lg font-serif-vintage text-amber-200 flex items-center gap-2">
              <ShearerIcon className="w-5 h-5 text-amber-400" />
              {lang === 'sr' ? 'Interaktivni Simulator Striže Ovaca' : 'Interactive Shearing Simulator'}
            </h3>
            <p className="text-xs text-emerald-200/80">
              {lang === 'sr'
                ? 'Izaberite broj strizača, trajne vune i rase u ruci da vidite vaš proračun novca i dostupne luke za vunu (5, 9, 13).'
                : 'Select shearers, permanent wool, and hand breeds to simulate shearing payout and unlocked wool trading posts.'}
            </p>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    {lang === 'sr' ? 'Broj Strizača u redu:' : 'Shearers Count:'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={shearerCount}
                    onChange={(e) => setShearerCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg p-2 text-amber-200 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    {lang === 'sr' ? 'Trajna vuna (Permanent Wool):' : 'Permanent Wool:'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={permWool}
                    onChange={(e) => setPermWool(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#10241e] border border-emerald-700/60 rounded-lg p-2 text-amber-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1.5">
                  {lang === 'sr'
                    ? `Izaberi do ${shearerCount} različitih rasa ovaca u ruci:`
                    : `Select up to ${shearerCount} distinct breeds in hand:`}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SHEEP_BREEDS.map((breed) => {
                    const isSelected = selectedSheepIds.includes(breed.id);
                    return (
                      <button
                        key={breed.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSheepIds((prev) => prev.filter((id) => id !== breed.id));
                          } else {
                            if (selectedSheepIds.length < shearerCount) {
                              setSelectedSheepIds((prev) => [...prev, breed.id]);
                            }
                          }
                        }}
                        className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-[#0c1f1a] font-bold border-amber-300'
                            : 'bg-[#10241e] text-emerald-200 border-emerald-800 hover:bg-[#16362e]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate">{breed.name}</span>
                          <span className="text-[10px] bg-black/20 px-1 rounded">Vuna: {breed.woolValue}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Result display */}
              <div className="p-4 rounded-xl bg-[#0f241e] border border-amber-400/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-emerald-300">
                    {lang === 'sr' ? 'Ukupan Prinos Vune / Dobijeni Novac:' : 'Total Wool Output / Payout:'}
                  </span>
                  <span className="text-xl font-extrabold text-amber-300 font-serif-vintage">
                    {totalWoolValue} £
                  </span>
                </div>
                <div className="text-xs text-emerald-200/90 pt-2 border-t border-emerald-900/60">
                  <span className="font-bold text-amber-300 block mb-1">
                    {lang === 'sr' ? 'Dostupne trgovačke stanice za vunu:' : 'Eligible wool trading posts:'}
                  </span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded font-bold ${totalWoolValue >= 5 ? 'bg-emerald-900 text-emerald-200 border border-emerald-500' : 'opacity-40 line-through'}`}>
                      Stanica 5
                    </span>
                    <span className={`px-2 py-1 rounded font-bold ${totalWoolValue >= 9 ? 'bg-emerald-900 text-emerald-200 border border-emerald-500' : 'opacity-40 line-through'}`}>
                      Stanica 9
                    </span>
                    <span className={`px-2 py-1 rounded font-bold ${totalWoolValue >= 13 ? 'bg-emerald-900 text-emerald-200 border border-emerald-500' : 'opacity-40 line-through'}`}>
                      Stanica 13 (Neograničeno)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shearing Rules Explanation */}
          <div className="parchment-card p-6 rounded-2xl border border-emerald-600/40 space-y-4 text-xs text-emerald-200/90 leading-relaxed">
            <h3 className="font-bold text-lg font-serif-vintage text-amber-100">
              {lang === 'sr' ? 'Pravila Striže Ovaca (Shear Your Sheep)' : 'Wool Shearing Mechanics'}
            </h3>
            <p>
              {lang === 'sr'
                ? 'Akcija striže (na zgradi E) vam omogućava da dobijete novac na osnovu vune ovaca umesto uzgojne vrednosti. Možete otkriti onoliko različitih ovaca iz ruke koliko imate strizača u svom radničkom redu.'
                : 'Shearing action lets you earn money based on sheep wool values instead of breeding values up to your shearer count.'}
            </p>
            <div className="p-3 bg-[#0f241e] rounded-xl border border-emerald-700/50 space-y-1.5">
              <strong className="text-amber-300 block">
                {lang === 'sr' ? 'Alternativna upotreba neiskorišćenih strizača:' : 'Unused shearer flexibility:'}
              </strong>
              <div>
                {lang === 'sr'
                  ? 'Svaki strizač kojeg NE upotrebite za strižu može se iskoristiti za akciju: Povuci 1 kartu iz špila, odmah odbaci 1 kartu. Ovo se može uraditi pre ili posle striže!'
                  : 'Any shearer not used to shear can be used to draw 1 card, discard 1 card.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SHEEP BREEDS ENCYCLOPEDIA */}
      {activeTab === 'breeds' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SHEEP_BREEDS.map((breed) => (
              <div
                key={breed.id}
                className="bg-[#122822] rounded-2xl p-5 border flex flex-col justify-between shadow-lg hover:border-amber-400 transition-all"
                style={{ borderColor: `${breed.colorHex}60` }}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-800/40">
                    <span
                      className="text-xs uppercase font-extrabold tracking-wider"
                      style={{ color: breed.colorHex }}
                    >
                      {breed.colorName}
                    </span>
                    <span className="text-xs bg-amber-950/70 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/50">
                      {breed.victoryPoints} VP
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2 font-serif-vintage">
                    {breed.name}
                  </h4>

                  <p className="text-xs text-emerald-300/80 mb-4 leading-relaxed">
                    {breed.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-800/40 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                  <div className="bg-emerald-950/80 p-2 rounded-lg border border-emerald-700/50 text-emerald-200">
                    <span className="text-[10px] block text-emerald-400/80 uppercase">Uzgoj</span>
                    {breed.breedingValue}
                  </div>
                  <div className="bg-amber-950/80 p-2 rounded-lg border border-amber-700/50 text-amber-200">
                    <span className="text-[10px] block text-amber-400/80 uppercase">Vuna</span>
                    {breed.woolValue}
                  </div>
                  <div className="bg-cyan-950/80 p-2 rounded-lg border border-cyan-700/50 text-cyan-200">
                    <span className="text-[10px] block text-cyan-400/80 uppercase">Špil</span>
                    {breed.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BONUS CARD SETS */}
      {activeTab === 'bonus_sets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BONUS_CARD_SETS.map((set) => (
            <div
              key={set.setNumber}
              className="bg-[#122822] p-5 rounded-2xl border border-emerald-700/50 flex flex-col justify-between hover:border-amber-400 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-800/40">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-[#0c1f1a] font-bold text-xs flex items-center justify-center font-serif-vintage">
                      {set.setNumber}
                    </span>
                    <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                      Set {set.setNumber}
                    </span>
                  </div>
                  {set.isObjective && (
                    <span className="text-[10px] uppercase font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      {lang === 'sr' ? 'Cilj' : 'Objective'}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-emerald-100 mb-2">
                  {lang === 'sr' ? set.serbianName : set.name}
                </h4>

                <p className="text-xs text-emerald-300/80 leading-relaxed mb-3">
                  {lang === 'sr' ? set.serbianDescription : set.description}
                </p>
              </div>

              <div className="text-[11px] text-emerald-400/90 pt-2 border-t border-emerald-900/50 flex justify-between">
                <span>2p: 3 karata | 3p: 5 karata | 4p: 6 karata</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. HARBOURMASTERS */}
      {activeTab === 'harbourmasters' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HARBOURMASTER_TILES.map((tile) => (
            <div
              key={tile.id}
              className="bg-[#122822] p-4 rounded-2xl border border-cyan-500/40 flex flex-col justify-between hover:border-cyan-300 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-800/40">
                  <span className="text-xs font-bold text-cyan-300 uppercase">
                    Kapetan #{tile.id}
                  </span>
                </div>

                <div className="bg-[#16352d] p-2.5 rounded-xl mb-3 border border-emerald-700/50">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block mb-0.5">
                    Gornja Nagrada (Trenutno/Trajno):
                  </span>
                  <p className="text-xs font-semibold text-emerald-100">
                    {lang === 'sr' ? tile.upperBenefit.serbianLabel : tile.upperBenefit.label}
                  </p>
                </div>

                <div className="bg-[#0e221d] p-2.5 rounded-xl border border-amber-800/40">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                    Krajnji Zadatak za Poene (VP):
                  </span>
                  <p className="text-xs text-amber-200">
                    {lang === 'sr' ? tile.lowerCondition.serbianLabel : tile.lowerCondition.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. NEUTRAL BUILDINGS A-H */}
      {activeTab === 'buildings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NEUTRAL_BUILDINGS.map((b) => (
            <div
              key={b.id}
              className="bg-[#122822] p-5 rounded-2xl border border-emerald-700/50 space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between pb-2 border-b border-emerald-800/40">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-400 text-[#0c1f1a] font-extrabold flex items-center justify-center font-serif-vintage text-base">
                    {b.letter}
                  </span>
                  <h4 className="font-bold text-sm text-amber-100 font-serif-vintage">
                    {lang === 'sr' ? b.serbianName : b.name}
                  </h4>
                </div>
                {b.isFlippable && (
                  <span className="text-[10px] bg-teal-900/80 text-teal-200 px-2 py-0.5 rounded border border-teal-600">
                    Obrtna (II)
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#16362e] rounded-xl border border-emerald-700/40">
                  <span className="text-[10px] font-bold text-amber-300 uppercase block mb-1">
                    Prednja strana (Akcije):
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-emerald-100">
                    {(lang === 'sr' ? b.serbianFrontActions : b.frontActions).map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>

                {b.backActions && (
                  <div className="p-2.5 bg-[#0f241e] rounded-xl border border-teal-700/40">
                    <span className="text-[10px] font-bold text-teal-300 uppercase block mb-1">
                      Zadnja strana (II) (nakon pomeranja tokena berze):
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-teal-100">
                      {(lang === 'sr' ? b.serbianBackActions! : b.backActions).map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
