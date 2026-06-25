import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

import {
  endTurn,
  getActivePlayer,
  getCurrentMethod,
  initPlayState,
  markWordFound,
  resolveActivePlayer,
  skipWord,
  startCountdown,
  startNextRound,
  tickCountdown,
  tickTurn,
} from '@/lib/game-engine';
import {
  createPlayer,
  DEFAULT_METHODS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  type PlayState,
  type Player,
  type Team,
  WORDS_PER_PLAYER,
} from '@/types/game';

type PlayAction =
  | { type: 'INIT'; players: Player[]; startingTeam: Team }
  | { type: 'START_COUNTDOWN' }
  | { type: 'TICK_COUNTDOWN' }
  | { type: 'TICK_TURN' }
  | { type: 'WORD_FOUND' }
  | { type: 'WORD_SKIPPED' }
  | { type: 'END_TURN' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET' };

function playReducer(state: PlayState | null, action: PlayAction): PlayState | null {
  switch (action.type) {
    case 'INIT':
      return initPlayState(action.players, DEFAULT_METHODS, action.startingTeam);
    case 'START_COUNTDOWN':
      return state ? startCountdown(state) : state;
    case 'TICK_COUNTDOWN':
      return state ? tickCountdown(state) : state;
    case 'TICK_TURN':
      return state ? tickTurn(state) : state;
    case 'WORD_FOUND':
      return state ? markWordFound(state) : state;
    case 'WORD_SKIPPED':
      return state ? skipWord(state) : state;
    case 'END_TURN':
      return state ? endTurn(state) : state;
    case 'NEXT_ROUND':
      return state ? startNextRound(state) : state;
    case 'RESET':
      return null;
    default:
      return state;
  }
}

type GameContextValue = {
  players: Player[];
  playState: PlayState | null;
  initPlayers: (count: number) => void;
  setPlayerName: (index: number, name: string) => void;
  setPlayerTeam: (playerId: string, team: Team) => void;
  setPlayerWords: (playerId: string, words: string[]) => void;
  startGame: (startingTeam: Team) => void;
  startCountdown: () => void;
  tickCountdown: () => void;
  tickTurn: () => void;
  wordFound: () => void;
  wordSkipped: () => void;
  endTurn: () => void;
  nextRound: () => void;
  resetGame: () => void;
  activePlayer: Player | null;
  currentMethod: ReturnType<typeof getCurrentMethod> | null;
  minPlayers: number;
  maxPlayers: number;
  wordsPerPlayer: number;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rawPlayState, dispatchPlay] = useReducer(playReducer, null);

  const initPlayers = useCallback((count: number) => {
    const safeCount = Math.min(Math.max(count, MIN_PLAYERS), MAX_PLAYERS);
    setPlayers(Array.from({ length: safeCount }, (_, index) => createPlayer(String(index))));
    dispatchPlay({ type: 'RESET' });
  }, []);

  const setPlayerName = useCallback((index: number, name: string) => {
    setPlayers((current) =>
      current.map((player, playerIndex) =>
        playerIndex === index ? { ...player, name } : player,
      ),
    );
  }, []);

  const setPlayerTeam = useCallback((playerId: string, team: Team) => {
    setPlayers((current) =>
      current.map((player) => (player.id === playerId ? { ...player, team } : player)),
    );
  }, []);

  const setPlayerWords = useCallback((playerId: string, words: string[]) => {
    setPlayers((current) =>
      current.map((player) => (player.id === playerId ? { ...player, words } : player)),
    );
  }, []);

  const startGame = useCallback((startingTeam: Team) => {
    dispatchPlay({ type: 'INIT', players, startingTeam });
  }, [players]);

  const handleStartCountdown = useCallback(() => {
    dispatchPlay({ type: 'START_COUNTDOWN' });
  }, []);

  const handleTickCountdown = useCallback(() => {
    dispatchPlay({ type: 'TICK_COUNTDOWN' });
  }, []);

  const handleTickTurn = useCallback(() => {
    dispatchPlay({ type: 'TICK_TURN' });
  }, []);

  const handleWordFound = useCallback(() => {
    dispatchPlay({ type: 'WORD_FOUND' });
  }, []);

  const handleWordSkipped = useCallback(() => {
    dispatchPlay({ type: 'WORD_SKIPPED' });
  }, []);

  const handleEndTurn = useCallback(() => {
    dispatchPlay({ type: 'END_TURN' });
  }, []);

  const handleNextRound = useCallback(() => {
    dispatchPlay({ type: 'NEXT_ROUND' });
  }, []);

  const resetGame = useCallback(() => {
    setPlayers([]);
    dispatchPlay({ type: 'RESET' });
  }, []);

  const playState = useMemo(
    () => (rawPlayState ? resolveActivePlayer(rawPlayState, players) : null),
    [rawPlayState, players],
  );

  const activePlayer = useMemo(
    () => (playState ? getActivePlayer(players, playState.activePlayerId) ?? null : null),
    [playState, players],
  );

  const currentMethod = useMemo(
    () => (playState ? getCurrentMethod(playState) : null),
    [playState],
  );

  const value = useMemo(
    () => ({
      players,
      playState,
      initPlayers,
      setPlayerName,
      setPlayerTeam,
      setPlayerWords,
      startGame,
      startCountdown: handleStartCountdown,
      tickCountdown: handleTickCountdown,
      tickTurn: handleTickTurn,
      wordFound: handleWordFound,
      wordSkipped: handleWordSkipped,
      endTurn: handleEndTurn,
      nextRound: handleNextRound,
      resetGame,
      activePlayer,
      currentMethod,
      minPlayers: MIN_PLAYERS,
      maxPlayers: MAX_PLAYERS,
      wordsPerPlayer: WORDS_PER_PLAYER,
    }),
    [
      players,
      playState,
      initPlayers,
      setPlayerName,
      setPlayerTeam,
      setPlayerWords,
      startGame,
      handleStartCountdown,
      handleTickCountdown,
      handleTickTurn,
      handleWordFound,
      handleWordSkipped,
      handleEndTurn,
      handleNextRound,
      resetGame,
      activePlayer,
      currentMethod,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
