export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow' | 'black';

export type Language = 'sr' | 'en';

export interface SheepBreed {
  id: string;
  name: string;
  serbianName: string;
  breedingValue: number;
  woolValue: number;
  victoryPoints: number;
  colorName: string;
  colorHex: string;
  type: 'starter' | 'market' | 'deck-building' | 'bonus';
  totalCards: number;
  description: string;
}

export interface BonusCardSet {
  setNumber: number;
  name: string;
  serbianName: string;
  category: 'ferry' | 'sheepdog' | 'sheep' | 'bird' | 'harbour' | 'building' | 'special-sheep' | 'objective';
  isObjective: boolean;
  assignedSpot?: 'steering_wheel' | 'barrel' | 'bell' | 'compass';
  goldCost: number; // 3, 3, 4, or 5
  description: string;
  serbianDescription: string;
  cardCount: {
    twoPlayer: number; // 3
    threePlayer: number; // 5
    fourPlayer: number; // 6
  };
}

export interface HarbourmasterTile {
  id: number;
  name: string;
  upperBenefit: {
    type: 'immediate_money' | 'immediate_money_ferry' | 'immediate_pathfinder' | 'permanent_certificate';
    label: string;
    serbianLabel: string;
    icon: string;
  };
  lowerCondition: {
    type: 'certificates' | 'storehouses' | 'objectives' | 'buildings' | 'hazards' | 'ferries' | 'pathfinder' | 'workers';
    label: string;
    serbianLabel: string;
    vpRule: string;
    serbianVpRule: string;
  };
}

export interface NeutralBuilding {
  id: string;
  letter: string;
  name: string;
  serbianName: string;
  isFlippable: boolean;
  flippedIcon: string;
  frontActions: string[];
  serbianFrontActions: string[];
  backActions?: string[];
  serbianBackActions?: string[];
}

export interface PlayerScoreData {
  id: string;
  name: string;
  color: PlayerColor;
  isSarahAutoma?: boolean;
  
  // 12 official categories
  cat1_money: number; // total pounds
  cat2_privateBuildingsVP: number; // direct VP sum of placed buildings
  cat3_tradingPostsVP: number; // net VP from local, foreign, wool posts (incl minus 8 from 0, adjacent bonuses)
  cat4_harboursVP: number; // small & medium harbour VPs + adjacent 4 VP pair bonus
  cat5_pathfinderVP: number; // highest reached space on track (0, 1, 2, 4, 7, 10, 15)
  cat6_hazardsAndBonusTilesVP: number; // collected hazards (2/3/4) + bonus tiles
  cat7_deckCardsVP: number; // sheep & bonus cards in draw + hand + discard
  cat8_objectiveCardsVP: number; // completed positive minus failed negative
  cat9_harbourmastersVP: number; // harbourmaster tile tasks sum
  cat10_handLimitDiscVP: number; // 3 VP if right disc removed
  cat11_workersAndStorehousesVP: number; // 4 VP per 5th slot worker + 2/4 VP for storehouse pairs
  cat12_endGameTokenVP: number; // 5 VP if player holds market token

  // Helper breakdowns for detailed counting modal
  detailedData?: {
    coinsCount?: number;
    hazardTilesCount?: { twoVP: number; threeVP: number; fourVP: number };
    bonusTilesVP?: number;
    deckSheepVPBreakdown?: Record<string, number>;
    objectivesList?: { name: string; vp: number; fulfilled: boolean }[];
    harbourmastersCount?: Record<number, number>;
    workersOnFifthSlot?: number;
    storehousePairsCleared?: number; // 2 or 4 VP
    hasEndGameToken?: boolean;
    hasHandLimitDiscCleared?: boolean;
  };
  
  totalScore: number;
}

export interface GameSetupResult {
  playerCount: 1 | 2 | 3 | 4;
  isSolo: boolean;
  timestamp: string;
  
  // Neutral buildings
  neutralBuildingsLayout: {
    space: number;
    buildingLetter: string;
    isFlippable: boolean;
  }[];
  isRandomNeutralBuildings: boolean;

  // Harbourmasters
  selectedHarbourmasters: HarbourmasterTile[];
  boxedHarbourmasters: HarbourmasterTile[];

  // Bonus card sets
  selectedBonusSets: {
    spot: 'steering_wheel' | 'barrel' | 'bell' | 'compass';
    goldCost: number;
    set: BonusCardSet;
    cardsCount: number;
  }[];
  boxedBonusSets: BonusCardSet[];

  // Initial Markets & Supplies
  wellingtonSupply: {
    workerTilesCount: number; // 28
    hazardTilesCount: number; // 16 (9 rockfalls, 7 floods)
    bonusTilesCount: number; // 33
    drawnTilesCount: number; // 12 (2p), 13 (3p), 14 (4p)
    initialBonusMarketTiles: number; // 3 (2p), 5 (3p), 7 (4p)
    foresightTiles: { a: number; b: number };
  };

  // Sheep market
  sheepMarketCardsToDraw: number; // 9 (2p), 11 (3p), 14 (4p)
  simulatedInitialMarket: SheepBreed[];

  // Pathfinder Step tiles
  stepTilesCount: number;
  stepTilesLocation: string; // e.g. "Space 4" or "Space 6"

  // Private buildings mode
  privateBuildingsSide: 'all_a' | 'randomized_ab';
  randomizedSides?: Record<number, 'a' | 'b'>;

  // Player starting table
  playersStartingInfo: {
    turnOrder: number;
    name: string;
    color: PlayerColor;
    startingPounds: number;
    startingCardsDrawn: number;
    startingExchangeTokens: number;
    startingGold: number;
    startingCertificate: number;
    turn1Action: string;
  }[];
}

export interface SavedGameHistory {
  id: string;
  date: string;
  playerCount: number;
  winnerName: string;
  winnerScore: number;
  players: PlayerScoreData[];
  setupSummary?: string;
}
