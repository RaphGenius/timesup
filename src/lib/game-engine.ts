import {
  COUNTDOWN_SECONDS,
  DEFAULT_METHODS,
  ROUND_COUNT,
  TURN_SECONDS,
  type Player,
  type PlayState,
  type RoundMethod,
  type Team,
  type WordEntry,
} from '@/types/game';

export function buildWordPool(players: Player[]): WordEntry[] {
  return players.flatMap((player) =>
    player.words
      .filter((word) => word.trim().length > 0)
      .map((word, index) => ({
        id: `${player.id}-${index}`,
        text: word.trim(),
        playerId: player.id,
      })),
  );
}

export function shuffleWords<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickRandomWord(remaining: WordEntry[]): WordEntry | null {
  if (remaining.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * remaining.length);
  return remaining[index];
}

export function getTeamPlayers(players: Player[], team: Team): Player[] {
  return players.filter((player) => player.team === team);
}

export function getActivePlayer(players: Player[], playerId: string): Player | undefined {
  return players.find((player) => player.id === playerId);
}

export function getNextTeamPlayer(
  players: Player[],
  team: Team,
  teamTurnIndex: Record<Team, number>,
): Player {
  const teamPlayers = getTeamPlayers(players, team);
  if (teamPlayers.length === 0) {
    throw new Error(`No players in team ${team}`);
  }
  const index = teamTurnIndex[team] % teamPlayers.length;
  return teamPlayers[index];
}

export function advanceTeam(currentTeam: Team): Team {
  return currentTeam === 1 ? 2 : 1;
}

export function initPlayState(players: Player[], methods: RoundMethod[] = DEFAULT_METHODS): PlayState {
  const allWords = shuffleWords(buildWordPool(players));
  const team1Players = getTeamPlayers(players, 1);
  const activePlayer = team1Players[0] ?? players[0];

  return {
    phase: 'pre-turn',
    roundIndex: 0,
    methods,
    allWords,
    remainingWords: allWords,
    currentWord: null,
    activeTeam: 1,
    activePlayerId: activePlayer.id,
    teamTurnIndex: { 1: 0, 2: 0 },
    scores: { 1: 0, 2: 0 },
    countdown: COUNTDOWN_SECONDS,
    turnTimeLeft: TURN_SECONDS,
  };
}

function withNextWord(state: PlayState, remainingWords: WordEntry[]): PlayState {
  return {
    ...state,
    remainingWords,
    currentWord: pickRandomWord(remainingWords),
  };
}

export function startCountdown(state: PlayState): PlayState {
  return {
    ...state,
    phase: 'countdown',
    countdown: COUNTDOWN_SECONDS,
  };
}

export function tickCountdown(state: PlayState): PlayState {
  if (state.countdown <= 1) {
    return startTurn(state);
  }
  return {
    ...state,
    countdown: state.countdown - 1,
  };
}

export function startTurn(state: PlayState): PlayState {
  const withWord = withNextWord(state, state.remainingWords);
  return {
    ...withWord,
    phase: 'active-turn',
    turnTimeLeft: TURN_SECONDS,
  };
}

export function tickTurn(state: PlayState): PlayState {
  if (state.turnTimeLeft <= 1) {
    return endTurn(state);
  }
  return {
    ...state,
    turnTimeLeft: state.turnTimeLeft - 1,
  };
}

export function markWordFound(state: PlayState): PlayState {
  if (!state.currentWord) {
    return state;
  }

  const remainingWords = state.remainingWords.filter((word) => word.id !== state.currentWord!.id);
  const scores = {
    ...state.scores,
    [state.activeTeam]: state.scores[state.activeTeam] + 1,
  };

  if (remainingWords.length === 0) {
    return finishRound({
      ...state,
      remainingWords,
      currentWord: null,
      scores,
    });
  }

  return withNextWord(
    {
      ...state,
      scores,
    },
    remainingWords,
  );
}

export function skipWord(state: PlayState): PlayState {
  if (state.remainingWords.length === 0) {
    return state;
  }
  return withNextWord(state, state.remainingWords);
}

export function endTurn(state: PlayState): PlayState {
  const nextTeam = advanceTeam(state.activeTeam);
  const teamTurnIndex = {
    ...state.teamTurnIndex,
    [state.activeTeam]: state.teamTurnIndex[state.activeTeam] + 1,
  };

  return {
    ...state,
    phase: 'pre-turn',
    activeTeam: nextTeam,
    activePlayerId: '',
    currentWord: null,
    turnTimeLeft: TURN_SECONDS,
    countdown: COUNTDOWN_SECONDS,
    teamTurnIndex,
  };
}

export function resolveActivePlayer(state: PlayState, players: Player[]): PlayState {
  if (state.phase !== 'pre-turn' || state.activePlayerId) {
    return state;
  }

  const activePlayer = getNextTeamPlayer(players, state.activeTeam, state.teamTurnIndex);
  return {
    ...state,
    activePlayerId: activePlayer.id,
  };
}

function finishRound(state: PlayState): PlayState {
  if (state.roundIndex >= ROUND_COUNT - 1) {
    return {
      ...state,
      phase: 'game-end',
      currentWord: null,
    };
  }

  return {
    ...state,
    phase: 'round-end',
    currentWord: null,
  };
}

export function startNextRound(state: PlayState): PlayState {
  const nextRoundIndex = state.roundIndex + 1;
  const remainingWords = shuffleWords(state.allWords);

  return {
    ...state,
    phase: 'pre-turn',
    roundIndex: nextRoundIndex,
    remainingWords,
    currentWord: null,
    activePlayerId: '',
    turnTimeLeft: TURN_SECONDS,
    countdown: COUNTDOWN_SECONDS,
  };
}

export function getCurrentMethod(state: PlayState): RoundMethod {
  return state.methods[state.roundIndex] ?? state.methods[0];
}
