import { useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';

import { GamePhaseView } from '@/components/game/game-phase-view';
import { useGame } from '@/context/game-context';

export default function GameScreen() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);

  const {
    playState,
    activePlayer,
    currentMethod,
    startCountdown,
    tickCountdown,
    tickTurn,
    wordFound,
    wordSkipped,
    nextRound,
    resetGame,
  } = useGame();

  useEffect(() => {
    if (!playState) {
      router.replace('/setup/ready' as Href);
    }
  }, [playState, router]);

  useEffect(() => {
    if (playState?.phase !== 'active-turn') {
      setIsPaused(false);
    }
  }, [playState?.phase]);

  useEffect(() => {
    if (playState?.phase !== 'countdown') {
      return;
    }

    const interval = setInterval(() => {
      tickCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [playState?.phase, tickCountdown]);

  useEffect(() => {
    if (playState?.phase !== 'active-turn' || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      tickTurn();
    }, 1000);

    return () => clearInterval(interval);
  }, [playState?.phase, isPaused, tickTurn]);

  if (!playState || !currentMethod) {
    return null;
  }

  const handleBackHome = () => {
    resetGame();
    router.replace('/');
  };

  return (
    <GamePhaseView
      playState={playState}
      activePlayer={activePlayer}
      currentMethod={currentMethod}
      onStartCountdown={startCountdown}
      onWordFound={wordFound}
      onWordSkipped={wordSkipped}
      onNextRound={nextRound}
      onBackHome={handleBackHome}
      isPaused={isPaused}
      onTogglePause={() => setIsPaused((value) => !value)}
    />
  );
}
