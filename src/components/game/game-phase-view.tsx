import { StyleSheet, View } from 'react-native';

import { GameLandscapeLayout } from '@/components/game/game-landscape-layout';
import { PauseToggleButton } from '@/components/game/pause-toggle-button';
import { ScoreBoard } from '@/components/game/score-board';
import { SplitTapZones } from '@/components/game/split-tap-zones';
import { TurnTimer } from '@/components/game/turn-timer';
import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ROUND_COUNT, type Player, type PlayState, type RoundMethod } from '@/types/game';

type GamePhaseViewProps = {
  playState: PlayState;
  activePlayer: Player | null;
  currentMethod: RoundMethod;
  onStartCountdown: () => void;
  onWordFound: () => void;
  onWordSkipped: () => void;
  onNextRound: () => void;
  onBackHome: () => void;
  previewMode?: boolean;
  isPaused?: boolean;
  onTogglePause?: () => void;
};

export function GamePhaseView({
  playState,
  activePlayer,
  currentMethod,
  onStartCountdown,
  onWordFound,
  onWordSkipped,
  onNextRound,
  onBackHome,
  previewMode = false,
  isPaused = false,
  onTogglePause,
}: GamePhaseViewProps) {
  if (playState.phase === 'game-end') {
    return (
      <GameLandscapeLayout
        header={<ScoreBoard scores={playState.scores} />}
        footer={
          previewMode ? null : <PrimaryButton label="Retour à l'accueil" onPress={onBackHome} />
        }>
        <ThemedView style={styles.centerContent}>
          <ThemedText type="title" style={styles.centerText}>
            Partie terminée !
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.centerText}>
            Équipe 1 : {playState.scores[1]} — Équipe 2 : {playState.scores[2]}
          </ThemedText>
        </ThemedView>
      </GameLandscapeLayout>
    );
  }

  if (playState.phase === 'round-end') {
    const nextMethod = playState.methods[playState.roundIndex + 1];
    return (
      <GameLandscapeLayout
        header={<ScoreBoard scores={playState.scores} />}
        footer={previewMode ? null : <PrimaryButton label="Continuer" onPress={onNextRound} />}>
        <ThemedView style={styles.centerContent}>
          <ThemedText type="subtitle" style={styles.centerText}>
            Étape {playState.roundIndex + 1} terminée !
          </ThemedText>
          {nextMethod ? (
            <ThemedText themeColor="textSecondary" style={styles.centerText}>
              Prochaine étape : {nextMethod.label} — {nextMethod.instruction}
            </ThemedText>
          ) : null}
        </ThemedView>
      </GameLandscapeLayout>
    );
  }

  if (playState.phase === 'countdown') {
    return (
      <GameLandscapeLayout
        overlay={
          <ThemedText type="title" style={styles.countdown}>
            {playState.countdown}
          </ThemedText>
        }>
        <ThemedView style={styles.centerContent}>
          <ThemedText type="subtitle" style={styles.centerText}>
            {activePlayer?.name}
          </ThemedText>
        </ThemedView>
      </GameLandscapeLayout>
    );
  }

  if (playState.phase === 'active-turn') {
    return (
      <View style={styles.activeTurnScreen}>
        {playState.currentWord ? (
          <SplitTapZones
            word={playState.currentWord.text}
            onFound={onWordFound}
            onSkip={onWordSkipped}
            disabled={previewMode}
          />
        ) : (
          <ThemedView style={styles.activeTurnEmpty}>
            <ThemedText type="subtitle">Plus de mots</ThemedText>
          </ThemedView>
        )}

        <View style={styles.activeTurnOverlay} pointerEvents="box-none">
          <View style={styles.activeHeader} pointerEvents="box-none">
            <View style={styles.activeHeaderSide} />
            <View style={styles.activeHeaderCenter} pointerEvents="none">
              <TurnTimer seconds={playState.turnTimeLeft} />
              <ThemedText themeColor="textSecondary" type="small" style={styles.methodHint}>
                {currentMethod.label} — Étape {playState.roundIndex + 1}/{ROUND_COUNT}
              </ThemedText>
            </View>
            <View style={[styles.activeHeaderSide, styles.activeHeaderSideRight]}>
              <PauseToggleButton
                isPaused={isPaused}
                onPress={onTogglePause ?? (() => {})}
                disabled={previewMode || !onTogglePause}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <GameLandscapeLayout
      header={
        <ThemedText themeColor="textSecondary" type="small" style={styles.methodHint}>
          Étape {playState.roundIndex + 1}/{ROUND_COUNT} — {currentMethod.instruction}
        </ThemedText>
      }
      footer={previewMode ? null : <PrimaryButton label="Go" onPress={onStartCountdown} />}>
      <ThemedView style={styles.centerContent}>
        <ThemedText type="title" style={styles.centerText}>
          {activePlayer?.name}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.centerText}>
          Équipe {playState.activeTeam}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.centerText}>
          {playState.remainingWords.length} mot{playState.remainingWords.length > 1 ? 's' : ''}{' '}
          restant{playState.remainingWords.length > 1 ? 's' : ''}
        </ThemedText>
      </ThemedView>
    </GameLandscapeLayout>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  centerText: {
    textAlign: 'center',
  },
  countdown: {
    fontSize: 96,
    lineHeight: 104,
  },
  activeTurnScreen: {
    flex: 1,
  },
  activeTurnEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTurnOverlay: {
    position: 'absolute',
    top: Spacing.two,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  activeHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activeHeaderSide: {
    width: 52,
    alignItems: 'center',
  },
  activeHeaderSideRight: {
    alignItems: 'flex-end',
  },
  activeHeaderCenter: {
    flex: 1,
    gap: Spacing.one,
    alignItems: 'center',
  },
  methodHint: {
    textAlign: 'center',
  },
});
