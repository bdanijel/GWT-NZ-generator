import { PlayerColor, PlayerScoreData } from '../types/game';

export interface ParsedUrlGameConfig {
  playerCount?: number;
  players?: Array<{ name: string; color: PlayerColor }>;
  tab?: 'setup' | 'scoring' | 'rules' | 'solo' | 'history' | 'endgame';
  subtab?: string;
}

// Map color names in English and Serbian (Latin and Cyrillic / colloquial)
export const COLOR_MAP: Record<string, PlayerColor> = {
  // English
  red: 'red',
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  black: 'black',

  // Serbian Latin
  crvena: 'red',
  crveni: 'red',
  plava: 'blue',
  plavi: 'blue',
  zelena: 'green',
  zeleni: 'green',
  zuta: 'yellow',
  zuti: 'yellow',
  žuta: 'yellow',
  žuti: 'yellow',
  crna: 'black',
  crni: 'black',
};

const DEFAULT_CYCLE_COLORS: PlayerColor[] = ['red', 'blue', 'green', 'yellow', 'black'];

/**
 * Parses URL query params or hash for player configurations.
 * Supports:
 * - players=Marko:red,Jovan:blue,Ana:yellow
 * - p1=Marko&c1=red&p2=Jovan&c2=blue
 * - players=Marko,Jovan,Ana&colors=red,blue,yellow
 * - count=3 or players_count=3
 * - tab=scoring | setup | rules | solo | history
 */
export function parseUrlPlayerConfig(searchString: string = window.location.search): ParsedUrlGameConfig | null {
  try {
    // Also check location.hash if search is empty (e.g., #/setup?players=...)
    let query = searchString;
    if (!query && window.location.hash.includes('?')) {
      query = window.location.hash.slice(window.location.hash.indexOf('?'));
    }

    if (!query) return null;

    const params = new URLSearchParams(query);
    const result: ParsedUrlGameConfig = {};

    // 1. Tab parameter
    const tabParam = params.get('tab') || params.get('view') || params.get('sekcija');
    if (tabParam) {
      const lower = tabParam.toLowerCase();
      if (['setup', 'scoring', 'rules', 'solo', 'history', 'endgame'].includes(lower)) {
        result.tab = lower as any;
      } else if (lower === 'poeni' || lower === 'kalkulator' || lower === 'score') {
        result.tab = 'scoring';
      } else if (lower === 'pravila' || lower === 'enciklopedija') {
        result.tab = 'rules';
      } else if (lower === 'postavka') {
        result.tab = 'setup';
      } else if (lower === 'kraj' || lower === 'end' || lower === 'kraj-igre') {
        result.tab = 'endgame';
      }
    }

    // Subtab parameter
    const subtab = params.get('subtab');
    if (subtab) {
      result.subtab = subtab;
    }

    // 2. Player count
    const countParam = params.get('count') || params.get('players_count') || params.get('broj_igraca');
    if (countParam) {
      const parsedCount = parseInt(countParam, 10);
      if (!isNaN(parsedCount) && parsedCount >= 1 && parsedCount <= 4) {
        result.playerCount = parsedCount;
      }
    }

    const parsedPlayers: Array<{ name: string; color: PlayerColor }> = [];

    // Format A: players=Marko:red,Jovan:blue,Ana:green or Marko:crvena,Jovan:plava
    const playersParam = params.get('players') || params.get('igraci');
    const colorsParam = params.get('colors') || params.get('boje');

    if (playersParam) {
      const entries = playersParam.split(',').map((s) => s.trim()).filter(Boolean);

      if (entries.some((entry) => entry.includes(':'))) {
        // e.g. "Marko:red,Jovan:plava"
        entries.forEach((entry, idx) => {
          const parts = entry.split(':');
          const name = decodeURIComponent(parts[0].trim());
          const rawColor = parts[1]?.trim().toLowerCase();
          const mappedColor = rawColor && COLOR_MAP[rawColor] ? COLOR_MAP[rawColor] : DEFAULT_CYCLE_COLORS[idx % 5];
          if (name) {
            parsedPlayers.push({ name, color: mappedColor });
          }
        });
      } else if (colorsParam) {
        // e.g. players=Marko,Jovan&colors=red,blue
        const colorList = colorsParam.split(',').map((c) => c.trim().toLowerCase());
        entries.forEach((rawName, idx) => {
          const name = decodeURIComponent(rawName);
          const rawColor = colorList[idx];
          const mappedColor = rawColor && COLOR_MAP[rawColor] ? COLOR_MAP[rawColor] : DEFAULT_CYCLE_COLORS[idx % 5];
          if (name) {
            parsedPlayers.push({ name, color: mappedColor });
          }
        });
      } else {
        // e.g. players=Marko,Jovan,Ana (auto-assign colors)
        entries.forEach((rawName, idx) => {
          const name = decodeURIComponent(rawName);
          if (name) {
            parsedPlayers.push({ name, color: DEFAULT_CYCLE_COLORS[idx % 5] });
          }
        });
      }
    } else {
      // Format B: p1=Marko&c1=red&p2=Jovan&c2=blue or igrac1=Marko&boja1=crvena
      for (let i = 1; i <= 5; i++) {
        const nameParam =
          params.get(`p${i}`) ||
          params.get(`player${i}`) ||
          params.get(`igrac${i}`);
        const colorParam =
          params.get(`c${i}`) ||
          params.get(`color${i}`) ||
          params.get(`boja${i}`);

        if (nameParam) {
          const name = decodeURIComponent(nameParam.trim());
          const rawColor = colorParam?.trim().toLowerCase();
          const color = rawColor && COLOR_MAP[rawColor] ? COLOR_MAP[rawColor] : DEFAULT_CYCLE_COLORS[(i - 1) % 5];
          parsedPlayers.push({ name, color });
        }
      }
    }

    if (parsedPlayers.length > 0) {
      result.players = parsedPlayers.slice(0, 4); // Max 4 players in GWT:NZ
      if (!result.playerCount) {
        result.playerCount = result.players.length;
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch (err) {
    console.warn('Error parsing URL player parameters:', err);
    return null;
  }
}

/**
 * Builds a shareable URL string based on players, player count, and active tab
 */
export function buildShareableUrl(
  players: Array<{ name: string; color: PlayerColor }>,
  tab: string = 'scoring'
): string {
  const url = new URL(window.location.origin + window.location.pathname);
  const playerStrings = players.map((p) => `${encodeURIComponent(p.name)}:${p.color}`).join(',');
  url.searchParams.set('tab', tab);
  url.searchParams.set('players', playerStrings);
  url.searchParams.set('count', players.length.toString());
  return url.toString();
}

/**
 * Generates an empty score data object for a player
 */
export function createEmptyPlayerScore(
  name: string,
  color: PlayerColor,
  id: string = `player-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
): PlayerScoreData {
  return {
    id,
    name,
    color,
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
}
