import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { deletePlayerVoiceFile, persistPlayerVoice } from '@/lib/player-voice';

const MAX_RECORDING_SECONDS = 3;
const MAX_RECORDING_MS = MAX_RECORDING_SECONDS * 1000;
const RECORD_RED = '#E53935';

const PLAYER_VOICE_RECORDING_OPTIONS = {
  ...RecordingPresets.HIGH_QUALITY,
  directory: 'document' as const,
};

type PlayerVoiceControlsInnerProps = {
  playerId: string;
  voiceUri: string | null;
  onVoiceChange: (voiceUri: string | null) => void;
};

type VoiceIconButtonProps = {
  iconName: 'play.fill' | 'pause.fill';
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

function VoiceIconButton({ iconName, label, onPress, disabled = false }: VoiceIconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <SymbolView
        name={iconName}
        size={22}
        tintColor={theme.text}
        fallback={<ThemedText type="small">{iconName === 'play.fill' ? '▶' : '⏸'}</ThemedText>}
      />
    </Pressable>
  );
}

function RecordButton({
  isRecording,
  onPress,
  disabled,
}: {
  isRecording: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isRecording ? 'Arrêter l\'enregistrement' : 'Enregistrer ta voix'}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.recordButton,
        { borderColor: theme.textSecondary },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <View style={[styles.recordMark, isRecording ? styles.recordMarkStop : styles.recordMarkDot]} />
    </Pressable>
  );
}

function ProgressBar({
  progress,
  trackColor,
  fillColor,
}: {
  progress: number;
  trackColor: string;
  fillColor: string;
}) {
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
      <View style={[styles.progressFill, { width: `${clamped * 100}%`, backgroundColor: fillColor }]} />
    </View>
  );
}

function DeleteVoiceButton({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Supprimer l'enregistrement"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <SymbolView
        name="xmark"
        size={20}
        tintColor={theme.textSecondary}
        fallback={<ThemedText type="small">✕</ThemedText>}
      />
    </Pressable>
  );
}

export function PlayerVoiceControlsInner({
  playerId,
  voiceUri,
  onVoiceChange,
}: PlayerVoiceControlsInnerProps) {
  const theme = useTheme();
  const [isBusy, setIsBusy] = useState(false);
  const wasRecordingRef = useRef(false);
  const isFinalizingRef = useRef(false);
  const audioRecorder = useAudioRecorder(PLAYER_VOICE_RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(audioRecorder);
  const previewPlayer = useAudioPlayer(voiceUri);
  const playbackStatus = useAudioPlayerStatus(previewPlayer);

  useEffect(() => {
    void (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  const finalizeRecording = useCallback(async () => {
    if (isFinalizingRef.current) {
      return;
    }

    isFinalizingRef.current = true;
    setIsBusy(true);

    try {
      if (audioRecorder.isRecording) {
        await audioRecorder.stop();
      }

      const tempUri = audioRecorder.uri;
      if (!tempUri) {
        Alert.alert('Erreur', 'Aucun enregistrement disponible.');
        return;
      }

      const savedUri = await persistPlayerVoice(playerId, tempUri);
      onVoiceChange(savedUri);
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'enregistrement.');
    } finally {
      isFinalizingRef.current = false;
      setIsBusy(false);
    }
  }, [audioRecorder, onVoiceChange, playerId]);

  useEffect(() => {
    if (recorderState.isRecording) {
      wasRecordingRef.current = true;
      return;
    }

    if (wasRecordingRef.current) {
      wasRecordingRef.current = false;
      void finalizeRecording();
    }
  }, [recorderState.isRecording, finalizeRecording]);

  useEffect(() => {
    if (playbackStatus.didJustFinish) {
      previewPlayer.pause();
      void previewPlayer.seekTo(0);
    }
  }, [playbackStatus.didJustFinish, previewPlayer]);

  const handleRecordPress = async () => {
    if (isBusy || isFinalizingRef.current) {
      return;
    }

    if (recorderState.isRecording) {
      wasRecordingRef.current = false;
      await finalizeRecording();
      return;
    }

    setIsBusy(true);

    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert(
          'Microphone requis',
          'Autorisez l\'accès au microphone pour enregistrer le nom du joueur.',
        );
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      if (voiceUri) {
        previewPlayer.pause();
        await deletePlayerVoiceFile(voiceUri);
        onVoiceChange(null);
      }

      wasRecordingRef.current = true;
      await audioRecorder.prepareToRecordAsync(PLAYER_VOICE_RECORDING_OPTIONS);
      audioRecorder.record({ forDuration: MAX_RECORDING_SECONDS });
    } catch {
      wasRecordingRef.current = false;
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleTogglePlayback = () => {
    if (!voiceUri || isBusy) {
      return;
    }

    if (playbackStatus.playing) {
      previewPlayer.pause();
      return;
    }

    previewPlayer.replace(voiceUri);
    void previewPlayer.seekTo(0).then(() => {
      previewPlayer.play();
    });
  };

  const handleDelete = async () => {
    if (isBusy || !voiceUri) {
      return;
    }

    setIsBusy(true);

    try {
      previewPlayer.pause();
      await deletePlayerVoiceFile(voiceUri);
      onVoiceChange(null);
    } catch {
      Alert.alert('Erreur', 'Impossible de supprimer l\'enregistrement.');
    } finally {
      setIsBusy(false);
    }
  };

  const recordingProgress = recorderState.durationMillis / MAX_RECORDING_MS;
  const playbackProgress =
    playbackStatus.duration > 0 ? playbackStatus.currentTime / playbackStatus.duration : 0;

  return (
    <View style={styles.wrapper}>
      <ThemedText type="smallBold">Voix</ThemedText>
      <ThemedText themeColor="textSecondary" type="small" style={styles.hint}>
        Ton enregistrement sera joué automatiquement quand ce sera ton tour de jouer.
      </ThemedText>

      <View style={styles.row}>
        {voiceUri && !recorderState.isRecording ? (
          <>
            <VoiceIconButton
              iconName={playbackStatus.playing ? 'pause.fill' : 'play.fill'}
              label={playbackStatus.playing ? 'Arrêter la lecture' : 'Écouter l\'enregistrement'}
              onPress={handleTogglePlayback}
              disabled={isBusy}
            />
            <ProgressBar
              progress={playbackStatus.playing ? playbackProgress : 0}
              trackColor={theme.backgroundElement}
              fillColor={theme.textSecondary}
            />
            <DeleteVoiceButton onPress={handleDelete} disabled={isBusy} />
          </>
        ) : (
          <>
            <RecordButton
              isRecording={recorderState.isRecording}
              onPress={handleRecordPress}
              disabled={isBusy}
            />
            <ProgressBar
              progress={recorderState.isRecording ? recordingProgress : 0}
              trackColor={theme.backgroundElement}
              fillColor={RECORD_RED}
            />
          </>
        )}
      </View>

      {recorderState.isRecording ? (
        <ThemedText themeColor="textSecondary" type="small">
          Enregistrement… {Math.min(MAX_RECORDING_SECONDS, Math.ceil(recorderState.durationMillis / 1000))}/
          {MAX_RECORDING_SECONDS}s
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
  },
  hint: {
    fontSize: 11,
    lineHeight: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconButton: {
    padding: Spacing.one,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordMark: {
    backgroundColor: RECORD_RED,
  },
  recordMarkDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  recordMarkStop: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
