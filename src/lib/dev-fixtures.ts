import { getCurrentMethod } from '@/lib/game-engine';
import {
  COUNTDOWN_SECONDS,
  DEFAULT_METHODS,
  TURN_SECONDS,
  type Player,
  type PlayState,
  type RoundMethod,
} from '@/types/game';

export type DevPhaseId =
  | 'pre-turn'
  | 'pre-turn-round2'
  | 'pre-turn-round3'
  | 'countdown'
  | 'active-turn'
  | 'round-end'
  | 'game-end';

export type DevPhasePreview = {
  id: DevPhaseId;
  title: string;
  subtitle: string;
};

export const DEV_PHASE_PREVIEWS: DevPhasePreview[] = [
  {
    id: 'pre-turn',
    title: 'Avant le tour',
    subtitle: 'Étape 1 — Description',
  },
  {
    id: 'pre-turn-round2',
    title: 'Avant le tour',
    subtitle: 'Étape 2 — Un mot',
  },
  {
    id: 'pre-turn-round3',
    title: 'Avant le tour',
    subtitle: 'Étape 3 — Mime',
  },
  {
    id: 'countdown',
    title: 'Compte à rebours',
    subtitle: 'Écran avant le début du tour',
  },
  {
    id: 'active-turn',
    title: 'Tour actif',
    subtitle: 'Mot à deviner et zones tactiles',
  },
  {
    id: 'round-end',
    title: 'Fin d\'étape',
    subtitle: 'Transition vers l\'étape suivante',
  },
  {
    id: 'game-end',
    title: 'Fin de partie',
    subtitle: 'Scores finaux',
  },
];

export const DEV_PLAYERS: Player[] = [
  {
    id: '0',
    name: 'Alice',
    team: 1,
    words: ['Tour Eiffel AAAAAAAAA AZEAZEZAE ', 'Baguette', 'Fromage', 'Lyon', 'Marseille'],
    voiceUri: null,
  },
  {
    id: '1',
    name: 'Bob',
    team: 1,
    words: ['Paris', 'Vin', 'Bordeaux', 'Nice', 'Strasbourg'],
    voiceUri: null,
  },
  {
    id: '2',
    name: 'Claire',
    team: 2,
    words: ['Croissant', 'Bretagne', 'Normandie', 'Toulouse', 'Nantes'],
    voiceUri: null,
  },
  {
    id: '3',
    name: 'David',
    team: 2,
    words: ['Côte d\'Azur', 'Mont Blanc', 'Loire', 'Seine', 'Camembert'],
    voiceUri: null,
  },
];

const DEV_WORDS = DEV_PLAYERS.flatMap((player) =>
  player.words.map((text, index) => ({
    id: `${player.id}-${index}`,
    text,
    playerId: player.id,
  })),
);

function baseState(overrides: Partial<PlayState>): PlayState {
  return {
    phase: 'pre-turn',
    roundIndex: 0,
    methods: DEFAULT_METHODS,
    allWords: DEV_WORDS,
    remainingWords: DEV_WORDS,
    currentWord: null,
    activeTeam: 1,
    activePlayerId: '0',
    teamTurnIndex: { 1: 0, 2: 1 },
    scores: { 1: 12, 2: 9 },
    countdown: COUNTDOWN_SECONDS,
    turnTimeLeft: TURN_SECONDS,
    ...overrides,
  };
}

export function getDevPhaseId(value: string | undefined): DevPhaseId | null {
  return DEV_PHASE_PREVIEWS.some((preview) => preview.id === value)
    ? (value as DevPhaseId)
    : null;
}

export function createDevPreviewState(phaseId: DevPhaseId): PlayState {
  switch (phaseId) {
    case 'pre-turn':
      return baseState({
        phase: 'pre-turn',
        roundIndex: 0,
        activeTeam: 1,
        activePlayerId: '0',
      });
    case 'pre-turn-round2':
      return baseState({
        phase: 'pre-turn',
        roundIndex: 1,
        activeTeam: 2,
        activePlayerId: '2',
        scores: { 1: 18, 2: 14 },
      });
    case 'pre-turn-round3':
      return baseState({
        phase: 'pre-turn',
        roundIndex: 2,
        activeTeam: 1,
        activePlayerId: '1',
        scores: { 1: 24, 2: 21 },
      });
    case 'countdown':
      return baseState({
        phase: 'countdown',
        roundIndex: 0,
        activeTeam: 1,
        activePlayerId: '0',
        countdown: 3,
      });
    case 'active-turn':
      return baseState({
        phase: 'active-turn',
        roundIndex: 0,
        activeTeam: 1,
        activePlayerId: '0',
        currentWord: DEV_WORDS[0],
        turnTimeLeft: 24,
      });
    case 'round-end':
      return baseState({
        phase: 'round-end',
        roundIndex: 0,
        scores: { 1: 15, 2: 12 },
      });
    case 'game-end':
      return baseState({
        phase: 'game-end',
        roundIndex: 2,
        scores: { 1: 42, 2: 38 },
      });
  }
}

export function getDevPreviewData(phaseId: DevPhaseId): {
  playState: PlayState;
  activePlayer: Player;
  currentMethod: RoundMethod;
} {
  const playState = createDevPreviewState(phaseId);
  const activePlayer =
    DEV_PLAYERS.find((player) => player.id === playState.activePlayerId) ?? DEV_PLAYERS[0];

  return {
    playState,
    activePlayer,
    currentMethod: getCurrentMethod(playState),
  };
}
