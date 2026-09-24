import { GameSetupResult, PlayerColor, SheepBreed } from '../types/game';
import { BONUS_CARD_SETS, HARBOURMASTER_TILES, NEUTRAL_BUILDINGS, PLAYER_STARTING_SETUP, SHEEP_BREEDS } from '../data/gwtData';

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateGWTNZSetup(
  playerCount: 1 | 2 | 3 | 4,
  options?: {
    randomNeutralBuildings?: boolean;
    randomizePrivateBuildings?: boolean;
    playerNames?: string[];
    playerColors?: PlayerColor[];
  }
): GameSetupResult {
  const isSolo = playerCount === 1;
  const effectivePlayers = isSolo ? 2 : playerCount; // Solo mode uses 2-player board scaling

  // 1. Harbourmaster Tiles (Shuffle 8, pick 5, box 3)
  const shuffledHarbourmasters = shuffleArray(HARBOURMASTER_TILES);
  const selectedHarbourmasters = shuffledHarbourmasters.slice(0, 5);
  const boxedHarbourmasters = shuffledHarbourmasters.slice(5, 8);

  // 2. Bonus Card Sets (Pick 4 of 10 randomly, sort by set number)
  const shuffledSets = shuffleArray(BONUS_CARD_SETS);
  const pickedSets = shuffledSets.slice(0, 4).sort((a, b) => a.setNumber - b.setNumber);
  const boxedBonusSets = shuffledSets.slice(4, 10).sort((a, b) => a.setNumber - b.setNumber);

  // Assign to the 4 Supply Spots:
  // Spot 1: Steering Wheel (Lowest set) -> 3 Gold
  // Spot 2: Barrel (2nd lowest) -> 3 Gold
  // Spot 3: Bell (2nd highest) -> 4 Gold
  // Spot 4: Compass (Highest set) -> 5 Gold
  const spots: ('steering_wheel' | 'barrel' | 'bell' | 'compass')[] = [
    'steering_wheel',
    'barrel',
    'bell',
    'compass',
  ];
  const goldCosts = [3, 3, 4, 5];

  const cardsCountPerSet = effectivePlayers === 2 ? 3 : effectivePlayers === 3 ? 5 : 6;

  const selectedBonusSets = pickedSets.map((set, index) => ({
    spot: spots[index],
    goldCost: goldCosts[index],
    set,
    cardsCount: cardsCountPerSet,
  }));

  // 3. Neutral Buildings (A to H)
  const neutralLayout = options?.randomNeutralBuildings
    ? shuffleArray(NEUTRAL_BUILDINGS).map((b, idx) => ({
        space: idx + 1,
        buildingLetter: b.letter,
        isFlippable: b.isFlippable,
      }))
    : NEUTRAL_BUILDINGS.map((b, idx) => ({
        space: idx + 1,
        buildingLetter: b.letter,
        isFlippable: b.isFlippable,
      }));

  // 4. Wellington Supply & Job Market
  const drawnTilesCount = effectivePlayers === 2 ? 12 : effectivePlayers === 3 ? 13 : 14;
  const initialBonusMarketTiles = effectivePlayers === 2 ? 3 : effectivePlayers === 3 ? 5 : 7;

  // 5. Sheep Market Draw Simulation
  // Market sheep deck composition: 5 Dorset Horn, 7 Lincoln, 7 Corriedale, 6 Hampshire, 6 Ryeland, 6 Suffolk
  const marketDeck: SheepBreed[] = [];
  const marketBreeds = SHEEP_BREEDS.filter((b) => b.type === 'market');
  
  marketBreeds.forEach((breed) => {
    for (let i = 0; i < breed.totalCards; i++) {
      marketDeck.push(breed);
    }
  });

  const shuffledMarketDeck = shuffleArray(marketDeck);
  const sheepToDrawCount = effectivePlayers === 2 ? 9 : effectivePlayers === 3 ? 11 : 14;
  const drawnSheep = shuffledMarketDeck.slice(0, sheepToDrawCount);

  // Sort by official color order: Orange -> Red -> Yellow -> Blue -> Purple
  const colorOrder: Record<string, number> = {
    'dorset_horn': 1,
    'lincoln': 2,
    'corriedale': 3,
    'hampshire': 4,
    'ryeland': 5,
    'suffolk': 6,
  };
  
  const simulatedInitialMarket = drawnSheep.sort(
    (a, b) => (colorOrder[a.id] || 99) - (colorOrder[b.id] || 99)
  );

  // 6. Pathfinder Step Tiles
  const stepTilesCount = effectivePlayers;
  const stepTilesLocation = effectivePlayers === 4 ? 'Space 6' : 'Space 4';

  // 7. Private Buildings Variant
  const privateBuildingsSide = options?.randomizePrivateBuildings ? 'randomized_ab' : 'all_a';
  const randomizedSides: Record<number, 'a' | 'b'> = {};
  if (privateBuildingsSide === 'randomized_ab') {
    for (let i = 1; i <= 10; i++) {
      randomizedSides[i] = Math.random() < 0.5 ? 'a' : 'b';
    }
  }

  // 8. Player Setup
  const defaultColors: PlayerColor[] = ['red', 'blue', 'green', 'yellow'];
  const playersCountToIterate = isSolo ? 1 : playerCount;

  const playersStartingInfo = Array.from({ length: playersCountToIterate }, (_, i) => {
    const info = PLAYER_STARTING_SETUP[i];
    const name = options?.playerNames?.[i] || `Igrač ${i + 1}`;
    const color = options?.playerColors?.[i] || defaultColors[i];

    return {
      turnOrder: info.turnOrder,
      name,
      color,
      startingPounds: info.startingPounds,
      startingCardsDrawn: info.startingCardsDrawn,
      startingExchangeTokens: info.startingExchangeTokens,
      startingGold: info.startingGold,
      startingCertificate: info.startingCertificate,
      turn1Action: info.turn1Action,
    };
  });

  if (isSolo) {
    // Add Sarah Automa details
    playersStartingInfo.push({
      turnOrder: 2,
      name: 'Sarah (Automa)',
      color: 'black',
      startingPounds: 8,
      startingCardsDrawn: 0,
      startingExchangeTokens: 0,
      startingGold: 0,
      startingCertificate: 0,
      turn1Action: 'Postavi Sarah tablu, specijalizaciju, i pripremi njen špil od 17 karata.',
    });
  }

  return {
    playerCount,
    isSolo,
    timestamp: new Date().toISOString(),
    neutralBuildingsLayout: neutralLayout,
    isRandomNeutralBuildings: !!options?.randomNeutralBuildings,
    selectedHarbourmasters,
    boxedHarbourmasters,
    selectedBonusSets,
    boxedBonusSets,
    wellingtonSupply: {
      workerTilesCount: 28,
      hazardTilesCount: 16,
      bonusTilesCount: 33,
      drawnTilesCount,
      initialBonusMarketTiles,
      foresightTiles: { a: 2, b: 2 },
    },
    sheepMarketCardsToDraw: sheepToDrawCount,
    simulatedInitialMarket,
    stepTilesCount,
    stepTilesLocation,
    privateBuildingsSide,
    randomizedSides: Object.keys(randomizedSides).length > 0 ? randomizedSides : undefined,
    playersStartingInfo,
  };
}
