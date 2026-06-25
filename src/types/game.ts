export type Team = 1 | 2;

export type StartingTeamChoice = Team | 'random';

export type Player = {
  id: string;
  name: string;
  team: Team | null;
  words: string[];
};

export type WordEntry = {
  id: string;
  text: string;
  playerId: string;
};

export type RoundMethod = {
  id: string;
  label: string;
  instruction: string;
  isDefault: boolean;
};

export type GamePhase = 'pre-turn' | 'countdown' | 'active-turn' | 'round-end' | 'game-end';

export type PlayState = {
  phase: GamePhase;
  roundIndex: number;
  methods: RoundMethod[];
  allWords: WordEntry[];
  remainingWords: WordEntry[];
  currentWord: WordEntry | null;
  activeTeam: Team;
  activePlayerId: string;
  teamTurnIndex: Record<Team, number>;
  scores: Record<Team, number>;
  countdown: number;
  turnTimeLeft: number;
};

export const WORDS_PER_PLAYER = 5;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 20;
export const COUNTDOWN_SECONDS = 3;
export const TURN_SECONDS = 30;
export const ROUND_COUNT = 3;

export const DEFAULT_METHODS: RoundMethod[] = [
  {
    id: 'description',
    label: 'Description',
    instruction: 'Faites deviner en décrivant librement',
    isDefault: true,
  },
  {
    id: 'one-word',
    label: 'Un mot',
    instruction: 'Faites deviner avec un seul mot',
    isDefault: true,
  },
  {
    id: 'mime',
    label: 'Mime',
    instruction: 'Faites deviner en mimant',
    isDefault: true,
  },
];

export function createEmptyWords(): string[] {
  return Array.from({ length: WORDS_PER_PLAYER }, () => '');
}

export function createPlayer(id: string): Player {
  return {
    id,
    name: '',
    team: null,
    words: createEmptyWords(),
  };
}
