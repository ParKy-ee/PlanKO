import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  type ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ScreenOrientation from 'expo-screen-orientation';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import { mockBeatmap } from '../../mocks/mockBeatmap';
import {
  connectGameModelBridge,
  INITIAL_GAME_MODEL_FRAME,
} from '../../services/gameModelBridge';
import type { BridgeConnectionStatus, GameSensorFrame } from '../../types/gameModel';
import { Posture } from '../../types';

type PlankWorkoutRouteProp = RouteProp<RootStackParamList, 'PlankWorkout'>;
type PlankWorkoutNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlankWorkout'
>;

const leftSensorRows = [
  ['L2', 'L1'],
  ['L5', 'L4'],
  ['L8', 'L7'],
];

const rightSensorRows = [
  ['R1', 'R2'],
  ['R4', 'R5'],
  ['R7', 'R8'],
];

const centerSensorRows = [
  ['L3', 'R3'],
  ['L6', 'R6'],
];

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
};

const RHYTHM_CYCLE_LENGTH = Math.max(...mockBeatmap.map((note) => note.time));
const RHYTHM_LOOK_AHEAD = 1;
const RHYTHM_HIT_WINDOW = 0.2;
const RHYTHM_GOOD_WINDOW = 0.12;
const RING_START_SCALE = 2.35;
const NODE_ACTION_LABELS: Record<string, string> = {
  lumbar_flexion: 'ก้มหลัง',
  lumbar_extension: 'แอ่นหลัง',
  unknown: 'รอข้อมูล',
};
const NODE_STAGE_LABELS: Record<string, string> = {
  neutral: 'ท่ากลาง',
  approaching: 'กำลังเคลื่อนไหว',
  holding: 'ค้างท่า',
  returning: 'กำลังกลับ',
  unknown: 'กำลังประเมิน',
};
const NODE_REASON_LABELS: Record<string, string> = {
  waiting_for_imu: 'ยังไม่มีข้อมูลจาก node',
  warming_up: 'กำลังเก็บข้อมูล 0.5 วินาที',
  calibration_required: 'ต้อง calibrate node ก่อน',
  calibration_method_version_unavailable: 'เวอร์ชัน calibration ไม่ตรงกับ model',
  mock_sample: 'ข้อมูลจำลอง',
  low_action_score: 'คะแนน model ต่ำกว่าค่ากำหนด',
  low_phase_score: 'คะแนน phase model ต่ำกว่าค่ากำหนด',
  confirming_holding: 'กำลังตรวจสอบว่าค้างท่าครบเวลา',
  duplicate_or_invalid_sample: 'sample ซ้ำหรือไม่ถูกต้อง',
};

const getNodeActionLabel = (node: GameSensorFrame['nodes'][number]) =>
  node.status === 'live'
    ? NODE_ACTION_LABELS[node.prediction.action] || node.prediction.action
    : 'รอข้อมูล';

const getNodeStageLabel = (node: GameSensorFrame['nodes'][number]) =>
  node.status === 'live'
    ? NODE_STAGE_LABELS[node.prediction.stage] || node.prediction.stage
    : 'รอข้อมูล';

const getNodeMotionSummary = (node: GameSensorFrame['nodes'][number]) => {
  const telemetry = node.telemetry;
  if (!telemetry) return null;
  const acceleration = telemetry.accel
    ? telemetry.accel.map((value) => value.toFixed(2)).join('/')
    : '--/--/--';
  return `A ${acceleration} · P/R/Y ${telemetry.pitch.toFixed(0)}/${telemetry.roll.toFixed(0)}/${telemetry.yaw.toFixed(0)}°`;
};

const getNodeReasonLabel = (node: GameSensorFrame['nodes'][number]) => {
  if (node.status === 'missing') return 'ยังไม่พบ node นี้';
  if (node.status === 'stale') return 'ข้อมูลเก่า';
  if (node.missingFields.length) {
    return `ข้อมูลไม่ครบ: ${node.missingFields.join(', ')}`;
  }
  if (NODE_REASON_LABELS[node.prediction.reason]) {
    return NODE_REASON_LABELS[node.prediction.reason];
  }
  if (!node.prediction.reason && node.prediction.score !== null) {
    return 'ได้รับผลจาก model แล้ว';
  }
  return node.prediction.reason;
};

type RhythmTarget = {
  buttonId: string;
  key: string;
  noteId: number;
  cycle: number;
  timeDiff: number;
};

const getRhythmTargetKey = (cycle: number, noteId: number) =>
  String(cycle) + ':' + String(noteId);

const findNearestRhythmTarget = (
  padId: string,
  rhythmTime: number,
): RhythmTarget | null => {
  const currentCycle = Math.floor(rhythmTime / RHYTHM_CYCLE_LENGTH);
  let nearestTarget: RhythmTarget | null = null;

  for (let cycle = Math.max(0, currentCycle - 1); cycle <= currentCycle + 1; cycle += 1) {
    mockBeatmap.forEach((note) => {
      if (note.buttonId !== padId) return;

      const absoluteTime = (cycle * RHYTHM_CYCLE_LENGTH) + note.time;
      const timeDiff = absoluteTime - rhythmTime;

      if (
        !nearestTarget ||
        Math.abs(timeDiff) < Math.abs(nearestTarget.timeDiff)
      ) {
        nearestTarget = {
          buttonId: note.buttonId,
          key: getRhythmTargetKey(cycle, note.id),
          noteId: note.id,
          cycle,
          timeDiff,
        };
      }
    });
  }

  return nearestTarget;
};

export const PlankWorkoutScreen: React.FC = () => {
  const route = useRoute<PlankWorkoutRouteProp>();
  const navigation = useNavigation<PlankWorkoutNavigationProp>();
  const {
    postures,
    addSessionPerformance,
  } = useApp();
  const { width } = useWindowDimensions();
  const boardScale = Math.min(1.65, Math.max(0.72, (width / 568) * 1.15));

  const {
    mode = 'planned',
    durationPerPosture = 30,
    restTime = 10,
  } = route.params || {};

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(
      (err) => console.warn('Orientation lock error:', err),
    );

    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch(() => {});
    };
  }, []);

  const [currentPostureIndex, setCurrentPostureIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationPerPosture);
  const [isPaused, setIsPaused] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [stepElapsedTime, setStepElapsedTime] = useState(0);
  const [lastHitRating, setLastHitRating] = useState<string | null>(null);
  const [lastHitPadId, setLastHitPadId] = useState<string | null>(null);
  const [gameFrame, setGameFrame] = useState<GameSensorFrame>(INITIAL_GAME_MODEL_FRAME);
  const [bridgeStatus, setBridgeStatus] = useState<BridgeConnectionStatus>('connecting');
  const [bridgeError, setBridgeError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [rhythmTime, setRhythmTime] = useState(0);
  const [handledRhythmNotes, setHandledRhythmNotes] = useState<Set<string>>(
    new Set(),
  );
  const rhythmLastTickRef = useRef<number | null>(null);
  const hitRatingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hitRatingScale = useRef(new Animated.Value(0.7)).current;
  const hitRatingOpacity = useRef(new Animated.Value(0)).current;
  const restTransition = useRef(new Animated.Value(0)).current;

  const activePostureList: Posture[] = postures.slice(0, 4);
  const currentPosture = activePostureList[currentPostureIndex] || postures[0];
  const postureName = currentPosture?.name || 'Standard Elbow Plank';
  const totalWorkoutDuration =
    (activePostureList.length * durationPerPosture) +
    (Math.max(0, activePostureList.length - 1) * restTime);
  const workoutProgress = totalWorkoutDuration
    ? Math.min(1, totalElapsedTime / totalWorkoutDuration)
    : 0;
  const displayedStageElapsed = isResting
    ? Math.max(0, restTime - timeLeft)
    : stepElapsedTime;
  const workoutProgressPercent = (
    String(Math.round(workoutProgress * 100)) + '%'
  ) as ViewStyle['width'];
  const restOverlayOpacity = restTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });
  const liveBio = gameFrame.nodes
    .filter((node) => node.status === 'live' && node.telemetry?.bio.finger)
    .map((node) => node.telemetry?.bio)
    .find((bio) => bio && (bio.bpm !== null || bio.spo2 !== null));

  const currentBpm = liveBio?.bpm ?? 120;
  const exertionLevel = currentBpm > 140 ? 'High' : currentBpm >= 105 ? 'Moderate' : 'Low';
  const exertionPercent = (currentBpm > 140 ? '80%' : currentBpm >= 105 ? '52%' : '24%') as ViewStyle['left'];
  const exertionColor = currentBpm > 140 ? '#EF4444' : currentBpm >= 105 ? '#EAA023' : '#16A34A';

  useEffect(() => {
    setStepElapsedTime(0);
  }, [currentPostureIndex, isResting]);

  useEffect(() => {
    Animated.timing(restTransition, {
      toValue: isResting ? 1 : 0,
      duration: 320,
      useNativeDriver: false,
    }).start();
  }, [isResting, restTransition]);

  // Keep the ring guide on a high-resolution clock so it reaches the sensor
  // border on the beat instead of moving only once per countdown second.
  useEffect(() => {
    if (isPaused || isResting || isFinished) {
      rhythmLastTickRef.current = null;
      return;
    }

    rhythmLastTickRef.current = Date.now();
    let animationFrameId: number;
    const updateRhythmClock = () => {
      const now = Date.now();
      const previous = rhythmLastTickRef.current ?? now;
      rhythmLastTickRef.current = now;
      setRhythmTime((time) => time + (now - previous) / 1000);
      animationFrameId = requestAnimationFrame(updateRhythmClock);
    };

    animationFrameId = requestAnimationFrame(updateRhythmClock);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isFinished, isPaused, isResting]);

  const showHitRating = (rating: 'GOOD' | 'BAD' | 'MISS', padId: string) => {
    if (hitRatingTimeoutRef.current) {
      clearTimeout(hitRatingTimeoutRef.current);
    }

    hitRatingScale.stopAnimation();
    hitRatingOpacity.stopAnimation();
    setLastHitRating(rating);
    setLastHitPadId(padId);
    hitRatingScale.setValue(0.7);
    hitRatingOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(hitRatingScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 22,
        bounciness: 8,
      }),
      Animated.timing(hitRatingOpacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    hitRatingTimeoutRef.current = setTimeout(() => {
      Animated.timing(hitRatingOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setLastHitRating(null);
          setLastHitPadId(null);
          hitRatingTimeoutRef.current = null;
        }
      });
    }, 650);
  };

  const markRhythmNoteHandled = (target: RhythmTarget) => {
    setHandledRhythmNotes((previous) => {
      if (previous.has(target.key)) return previous;

      const next = new Set(previous);
      next.add(target.key);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (hitRatingTimeoutRef.current) {
        clearTimeout(hitRatingTimeoutRef.current);
      }
      hitRatingScale.stopAnimation();
      hitRatingOpacity.stopAnimation();
    };
  }, []);

  const nextGuideByPad = useMemo(() => {
    const targets = new Map<string, RhythmTarget>();

    if (isResting || isFinished) return targets;

    const currentCycle = Math.floor(rhythmTime / RHYTHM_CYCLE_LENGTH);

    for (
      let cycle = Math.max(0, currentCycle - 1);
      cycle <= currentCycle + 1;
      cycle += 1
    ) {
      mockBeatmap.forEach((note) => {
        const key = getRhythmTargetKey(cycle, note.id);
        if (handledRhythmNotes.has(key)) return;

        const absoluteTime = (cycle * RHYTHM_CYCLE_LENGTH) + note.time;
        const timeDiff = absoluteTime - rhythmTime;
        if (timeDiff < -RHYTHM_HIT_WINDOW || timeDiff > RHYTHM_LOOK_AHEAD) {
          return;
        }

        const currentTarget = targets.get(note.buttonId);
        if (!currentTarget || timeDiff < currentTarget.timeDiff) {
          targets.set(note.buttonId, {
            buttonId: note.buttonId,
            key,
            noteId: note.id,
            cycle,
            timeDiff,
          });
        }
      });
    }

    return targets;
  }, [handledRhythmNotes, isFinished, isResting, rhythmTime]);

  useEffect(() => {
    if (isResting || isFinished) return;

    const currentCycle = Math.floor(rhythmTime / RHYTHM_CYCLE_LENGTH);
    const missedTargets: RhythmTarget[] = [];

    for (
      let cycle = Math.max(0, currentCycle - 1);
      cycle <= currentCycle;
      cycle += 1
    ) {
      mockBeatmap.forEach((note) => {
        const key = getRhythmTargetKey(cycle, note.id);
        const absoluteTime = (cycle * RHYTHM_CYCLE_LENGTH) + note.time;

        if (
          rhythmTime - absoluteTime > RHYTHM_HIT_WINDOW &&
          !handledRhythmNotes.has(key)
        ) {
          missedTargets.push({
            buttonId: note.buttonId,
            key,
            noteId: note.id,
            cycle,
            timeDiff: absoluteTime - rhythmTime,
          });
        }
      });
    }

    if (!missedTargets.length) return;

    setHandledRhythmNotes((previous) => {
      const next = new Set(previous);
      let hasNewMiss = false;

      missedTargets.forEach((target) => {
        if (!next.has(target.key)) {
          next.add(target.key);
          hasNewMiss = true;
        }
      });

      if (!hasNewMiss) return previous;
      return next;
    });
    setCombo(0);
    showHitRating('MISS', missedTargets[0].buttonId);
  }, [handledRhythmNotes, isFinished, isResting, rhythmTime]);

  useEffect(() => {
    if (isPaused || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          if (isResting) {
            if (currentPostureIndex + 1 < activePostureList.length) {
              setCurrentPostureIndex((index) => index + 1);
              setIsResting(false);
              return durationPerPosture;
            }

            setIsFinished(true);
            return 0;
          }

          if (currentPostureIndex + 1 < activePostureList.length) {
            setIsResting(true);
            return restTime;
          }

          setIsFinished(true);
          return 0;
        }

        return previous - 1;
      });

      setTotalElapsedTime((previous) => {
        const nextTime = previous + 1;
        return nextTime;
      });

      if (!isResting) {
        setStepElapsedTime((previous) => previous + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    activePostureList.length,
    currentPostureIndex,
    durationPerPosture,
    isFinished,
    isPaused,
    isResting,
    restTime,
  ]);

  const handlePadTap = (padId: string) => {
    const target = findNearestRhythmTarget(padId, rhythmTime);
    const absoluteDifference = target ? Math.abs(target.timeDiff) : Infinity;
    const isGood =
      target !== null &&
      absoluteDifference <= RHYTHM_GOOD_WINDOW &&
      !handledRhythmNotes.has(target.key);
    const isWithinNoteWindow =
      target !== null && absoluteDifference <= RHYTHM_HIT_WINDOW;

    if (isGood) {
      markRhythmNoteHandled(target);
      setScore((previous) => previous + 100);
      setCombo((previous) => {
        const nextCombo = previous + 1;
        setMaxCombo((previousMax) => Math.max(previousMax, nextCombo));
        return nextCombo;
      });
      showHitRating('GOOD', padId);
      return;
    }

    // A press close to a note but outside the good window is BAD. It counts
    // as an attempt, so it will not later be reported as a missed note.
    if (target && isWithinNoteWindow && !handledRhythmNotes.has(target.key)) {
      markRhythmNoteHandled(target);
    }

    setCombo(0);
    showHitRating('BAD', padId);
  };

  useEffect(() => {
    return connectGameModelBridge(
      setGameFrame,
      (status, error) => {
        setBridgeStatus(status);
        setBridgeError(error || null);
      },
    );
  }, []);

  const hasSavedRef = useRef(false);

  const saveSessionStats = () => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;
    const calculatedKcal = Math.max(15, Math.round(totalElapsedTime * 0.22));
    const accuracy = Math.min(98, 85 + Math.floor(Math.random() * 12));

    addSessionPerformance({
      planName:
        mode === 'planned'
          ? `Planned - ${postureName}`
          : 'Custom - Plank Session',
      score: score || 500,
      duration: totalElapsedTime || 60,
      kcal: calculatedKcal,
      accuracy,
      maxCombo: maxCombo || 50,
      avgBpm: liveBio?.bpm ?? 0,
      postureHits: combo || 16,
    });
  };

  const handleBackToPrevious = () => {
    saveSessionStats();
    setIsFinished(false);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Activity' });
    }
  };

  const handlePlayAgain = () => {
    saveSessionStats();
    hasSavedRef.current = false;
    setIsFinished(false);
    setCurrentPostureIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalElapsedTime(0);
    setTimeLeft(durationPerPosture);
    setIsResting(false);
    setIsPaused(false);
  };

  const handleBackToHome = () => {
    saveSessionStats();
    setIsFinished(false);
    navigation.replace('MainTabs', { screen: 'Home' });
  };

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Activity' });
    }
  };

  const renderPad = (padId: string, scale = boardScale) => {
    const guideTarget = nextGuideByPad.get(padId);
    const timeDiff = guideTarget?.timeDiff;
    const isOnBeat = typeof timeDiff === 'number' && timeDiff <= 0;
    const guideProgress =
      typeof timeDiff !== 'number'
        ? 0
        : isOnBeat
          ? 1
          : 1 - Math.min(1, Math.max(0, timeDiff / RHYTHM_LOOK_AHEAD));
    const ringScale = isOnBeat
      ? 1
      : RING_START_SCALE - (1.35 * guideProgress);
    const ringOpacity = isOnBeat ? 1 : 0.34 + (0.66 * guideProgress);
    const padSize = 48 * scale;
    const isRatingPad = lastHitRating !== null && lastHitPadId === padId;

    return (
      <TouchableOpacity
        key={padId}
        onPress={() => handlePadTap(padId)}
        style={[
          styles.padButton,
          {
            width: padSize,
            height: padSize,
            borderRadius: padSize / 2,
          marginHorizontal: 5 * scale,
          },
          isRatingPad && styles.padButtonRatingTarget,
        ]}
        activeOpacity={0.75}
      >
        <Text style={styles.padText}>{padId.substring(1)}</Text>
        {guideTarget && (
          <View
            pointerEvents="none"
            style={[
              styles.noteRing,
              isOnBeat && styles.noteRingOnBeat,
              {
                width: padSize,
                height: padSize,
                borderRadius: padSize / 2,
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
        )}
        {isRatingPad && (
          <Animated.View
            style={[
              styles.hitRatingBadge,
              lastHitRating === 'GOOD' && styles.hitRatingGood,
              lastHitRating === 'BAD' && styles.hitRatingBad,
              lastHitRating === 'MISS' && styles.hitRatingMiss,
              {
                left: (padSize - 108) / 2,
                top: -50,
                opacity: hitRatingOpacity,
                transform: [{ scale: hitRatingScale }],
              },
            ]}
          >
            <Text style={styles.hitRatingText}>{lastHitRating}</Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.headerBackButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTimer}>{formatTime(timeLeft)}</Text>

          <View style={styles.headerStepInfo}>
            <Text style={styles.headerStepLabel}>
              {isResting
                ? 'REST'
                : 'STEP ' +
                  String(currentPostureIndex + 1) +
                  '/' +
                  String(activePostureList.length)}
            </Text>
            <Text style={styles.headerStepElapsed}>
              {isResting ? 'REST TIME' : 'STEP TIME'} {formatTime(displayedStageElapsed)}
            </Text>
          </View>

          <View style={styles.headerProgress}>
            <View
              style={[
                styles.headerProgressFill,
                { width: workoutProgressPercent },
              ]}
            />
            <View
              style={[
                styles.headerProgressThumb,
                { left: workoutProgressPercent },
              ]}
            />
          </View>

          <View style={styles.headerTotalTime}>
            <Text style={styles.headerTotalLabel}>TOTAL</Text>
            <Text style={styles.headerTotalValue}>
              {formatTime(totalElapsedTime)}
            </Text>
          </View>

          <View style={styles.headerDots}>
            {activePostureList.map((posture, index) => (
              <View
                key={posture.id || index}
                style={
                  index <= currentPostureIndex
                    ? styles.headerDotActive
                    : styles.headerDot
                }
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setIsPaused((previous) => !previous)}
            style={styles.pauseButton}
            activeOpacity={0.75}
          >
            <Ionicons
              name={isPaused ? 'play' : 'pause'}
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.gameArea}>
          <View style={styles.gameHud}>
            <Text style={styles.hudStatsText}>
              combo {combo || 0}, {score || 0} Point
              {'   '}
              <Text style={styles.hudSensorStatus}>
                Sensor: {bridgeStatus === 'connected' ? 'connected' : 'off'}
              </Text>
            </Text>
            <TouchableOpacity style={styles.settingsBadge} activeOpacity={0.75}>
              <Ionicons name="settings-sharp" size={18} color="#BDBDBD" />
            </TouchableOpacity>
          </View>

          <View style={styles.rhythmGuide} pointerEvents="none">
            <View style={styles.rhythmGuideIcon}>
              <View style={styles.rhythmGuideOuterRing} />
            </View>
            <Text style={styles.rhythmGuideText}>
              TAP WHEN RING MEETS SENSOR
            </Text>
          </View>

          <View style={styles.playField}>
            <View
              style={[
                styles.sensorGroup,
                { width: 112 * boardScale, marginHorizontal: 3 * boardScale },
              ]}
            >
              {leftSensorRows.map((row, index) => (
                <View key={row.join('-')} style={[styles.sensorRow, index < leftSensorRows.length - 1 && styles.sensorRowSpacing]}>
                  {row.map((padId) => renderPad(padId))}
                </View>
              ))}
            </View>

            <View
              style={[
                styles.centerLane,
                { width: 146 * boardScale, marginHorizontal: 3 * boardScale },
              ]}
            >
              <View
                style={[
                  styles.vitalsCard,
                  {
                    width: 142 * boardScale,
                    borderRadius: 10 * boardScale,
                    paddingHorizontal: 6 * boardScale,
                    paddingTop: 3.5 * boardScale,
                    paddingBottom: 3.5 * boardScale,
                    marginBottom: 3 * boardScale,
                  },
                ]}
              >
                {/* Header: Blue Dot + LIVE VITALS */}
                <View style={styles.vitalsHeader}>
                  <View
                    style={[
                      styles.vitalsBlueDot,
                      {
                        width: 4 * boardScale,
                        height: 4 * boardScale,
                        borderRadius: 2 * boardScale,
                        marginRight: 3 * boardScale,
                      },
                    ]}
                  />
                  <Text style={[styles.vitalsTitle, { fontSize: 7 * boardScale }]}>
                    LIVE VITALS
                  </Text>
                </View>

                {/* 3 Columns: Heart Rate, SpO2, Temperature */}
                <View style={[styles.vitalsGrid, { marginTop: 1.5 * boardScale }]}>
                  {/* Heart Rate */}
                  <View style={styles.vitalCol}>
                    <Image
                      source={require('../../../assets/icons/vitals/vitals_heart.png')}
                      style={[styles.vitalIcon, { width: 14 * boardScale, height: 11.5 * boardScale }]}
                      resizeMode="contain"
                    />
                    <Text style={[styles.vitalLabel, { fontSize: 5.5 * boardScale, marginTop: 0.5 * boardScale }]}>
                      Heart Rate
                    </Text>
                    <View style={styles.vitalValueRow}>
                      <Text style={[styles.vitalValue, { fontSize: 9.5 * boardScale }]}>
                        {currentBpm}
                      </Text>
                      <Text style={[styles.vitalUnit, { fontSize: 5.5 * boardScale, marginLeft: 1 * boardScale }]}>
                        BPM
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.vitalDivider, { height: 17 * boardScale, marginHorizontal: 1 * boardScale }]} />

                  {/* SpO2 */}
                  <View style={styles.vitalCol}>
                    <Image
                      source={require('../../../assets/icons/vitals/vitals_spo2.png')}
                      style={[styles.vitalIcon, { width: 11.5 * boardScale, height: 12 * boardScale }]}
                      resizeMode="contain"
                    />
                    <Text style={[styles.vitalLabel, { fontSize: 5.5 * boardScale, marginTop: 0.5 * boardScale }]}>
                      SpO₂
                    </Text>
                    <View style={styles.vitalValueRow}>
                      <Text style={[styles.vitalValue, { fontSize: 9.5 * boardScale }]}>
                        {liveBio?.spo2 ?? 98}
                      </Text>
                      <Text style={[styles.vitalUnit, { fontSize: 5.5 * boardScale, marginLeft: 1 * boardScale }]}>
                        %
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.vitalDivider, { height: 17 * boardScale, marginHorizontal: 1 * boardScale }]} />

                  {/* Temperature */}
                  <View style={styles.vitalCol}>
                    <Image
                      source={require('../../../assets/icons/vitals/vitals_temp.png')}
                      style={[styles.vitalIcon, { width: 9 * boardScale, height: 12 * boardScale }]}
                      resizeMode="contain"
                    />
                    <Text style={[styles.vitalLabel, { fontSize: 5.5 * boardScale, marginTop: 0.5 * boardScale }]}>
                      Temperature
                    </Text>
                    <View style={styles.vitalValueRow}>
                      <Text style={[styles.vitalValue, { fontSize: 9.5 * boardScale }]}>
                        36.5
                      </Text>
                      <Text style={[styles.vitalUnit, { fontSize: 5.5 * boardScale, marginLeft: 1 * boardScale }]}>
                        °C
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Separator Line */}
                <View style={[styles.exertionSeparator, { marginVertical: 2 * boardScale }]} />

                {/* Estimated Exertion Header */}
                <View style={styles.exertionHeader}>
                  <Text style={[styles.exertionTitle, { fontSize: 7 * boardScale }]}>
                    Estimated Exertion
                  </Text>
                  <View style={[styles.exertionBadge, { backgroundColor: exertionColor, paddingHorizontal: 4 * boardScale, paddingVertical: 1 * boardScale, borderRadius: 6 * boardScale }]}>
                    <Text style={[styles.exertionBadgeText, { fontSize: 6 * boardScale }]}>
                      {exertionLevel}
                    </Text>
                  </View>
                </View>

                {/* Exertion Track Bar + Thumb */}
                <View style={[styles.exertionBarWrapper, { marginTop: 2 * boardScale }]}>
                  <View style={[styles.exertionTrack, { height: 3.5 * boardScale, borderRadius: 1.75 * boardScale }]}>
                    <View style={[styles.exertionSegmentLow, { flex: 4 }]} />
                    <View style={[styles.exertionSegmentMod, { flex: 3.5 }]} />
                    <View style={[styles.exertionSegmentHigh, { flex: 2.5 }]} />
                  </View>
                  <View
                    style={[
                      styles.exertionThumb,
                      {
                        left: exertionPercent,
                        width: 6 * boardScale,
                        height: 6 * boardScale,
                        borderRadius: 3 * boardScale,
                        top: -1.25 * boardScale,
                        marginLeft: -3 * boardScale,
                      },
                    ]}
                  />
                </View>

                {/* Exertion Labels: Low, Moderate, High */}
                <View style={[styles.exertionLabelsRow, { marginTop: 1.5 * boardScale }]}>
                  <Text style={[styles.exertionLabel, { fontSize: 5.5 * boardScale }]}>Low</Text>
                  <Text style={[styles.exertionLabel, { fontSize: 5.5 * boardScale }]}>Moderate</Text>
                  <Text style={[styles.exertionLabel, { fontSize: 5.5 * boardScale }]}>High</Text>
                </View>

                {/* Bottom Status: Green Dot + Posture aligned */}
                <View style={[styles.vitalsFooter, { marginTop: 2 * boardScale }]}>
                  <View
                    style={[
                      styles.vitalsGreenDot,
                      {
                        width: 3.5 * boardScale,
                        height: 3.5 * boardScale,
                        borderRadius: 1.75 * boardScale,
                        marginRight: 3 * boardScale,
                      },
                    ]}
                  />
                  <Text style={[styles.vitalsStatusText, { fontSize: 6.5 * boardScale }]}>
                    Posture aligned
                  </Text>
                </View>
              </View>

              <View style={styles.centerSensorGrid}>
                {centerSensorRows.map((row, index) => (
                  <View
                    key={row.join('-')}
                    style={[styles.centerSensorRow, index < centerSensorRows.length - 1 && { marginBottom: 8 * boardScale }]}
                  >
                    {row.map((padId) => renderPad(padId, boardScale))}
                  </View>
                ))}
              </View>
            </View>

            <View
              style={[
                styles.sensorGroup,
                { width: 112 * boardScale, marginHorizontal: 3 * boardScale },
              ]}
            >
              {rightSensorRows.map((row, index) => (
                <View key={row.join('-')} style={[styles.sensorRow, index < rightSensorRows.length - 1 && styles.sensorRowSpacing]}>
                  {row.map((padId) => renderPad(padId))}
                </View>
              ))}
            </View>
          </View>

          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.restBackdrop,
              { opacity: restOverlayOpacity },
            ]}
          />
          {isResting && (
            <View style={styles.restMessage} pointerEvents="none">
              <Text style={styles.restTitle}>REST</Text>
              <Text style={styles.restTimer}>{formatTime(timeLeft)}</Text>
              <Text style={styles.restSubtitle}>NEXT STEP</Text>
            </View>
          )}

        </View>
      </View>

      <Modal
        visible={isFinished}
        animationType="fade"
        transparent={true}
        onRequestClose={handleBackToPrevious}
      >
        <View style={styles.completeModalOverlay}>
          <View style={styles.completeCardWrapper}>
            {/* Header Bar */}
            <View style={styles.completeHeader}>
              <TouchableOpacity
                onPress={handleBackToPrevious}
                style={styles.completeHeaderBackBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.75}
              >
                <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.completeHeaderTitle}>Workout Complete</Text>

              <View style={styles.completeLogoRow}>
                <Text style={styles.completeLogoText}>PlankO</Text>
                <MaterialIcons name="auto-awesome" size={14} color="#67E8F9" style={{ marginLeft: 3, marginTop: -4 }} />
              </View>
            </View>

            {/* Main Body (Landscape 2 Columns) */}
            <View style={styles.completeBody}>
              {/* Left Column: Session Grade */}
              <View style={styles.completeGradeCard}>
                <Text style={styles.gradeHeaderLabel}>SESSION GRADE</Text>

                {/* Rainbow A+ Badge - requested by user */}
                <Image
                  source={require('../../../assets/icons/workout_summary/grade_a_plus_rainbow.png')}
                  style={styles.rainbowGradeBadge}
                  resizeMode="contain"
                />

                <View style={styles.gradeResultTextWrap}>
                  <Text style={styles.gradeResultTitle}>Excellent Work!</Text>
                  <Text style={styles.gradeResultSubtitle}>Keep up the great effort.</Text>
                </View>
              </View>

              {/* Right Column: Stats & Summary */}
              <View style={styles.completeStatsCol}>
                {/* Top Row: Total Score & Best Combo */}
                <View style={styles.completeTopStatsRow}>
                  {/* Total Score */}
                  <View style={styles.completeStatBox}>
                    <Image
                      source={require('../../../assets/icons/workout_summary/summary_trophy.png')}
                      style={styles.completeStatIcon}
                      resizeMode="contain"
                    />
                    <View>
                      <View style={styles.scoreValRow}>
                        <Text style={styles.completeStatNumber}>{score || 500}</Text>
                        <Text style={styles.completeStatUnit}>pts</Text>
                      </View>
                      <Text style={styles.completeStatLabel}>Total Score</Text>
                    </View>
                  </View>

                  {/* Best Combo */}
                  <View style={[styles.completeStatBox, { marginLeft: 10 }]}>
                    <Image
                      source={require('../../../assets/icons/workout_summary/summary_flame.png')}
                      style={styles.completeStatIcon}
                      resizeMode="contain"
                    />
                    <View>
                      <Text style={styles.completeStatNumber}>{maxCombo || 50}</Text>
                      <Text style={styles.completeStatLabel}>Best Combo</Text>
                    </View>
                  </View>
                </View>

                {/* Middle Card: Session Summary */}
                <View style={styles.completeSummaryCard}>
                  <Text style={styles.sessionSummaryHeading}>Session Summary</Text>
                  <View style={styles.summaryGrid}>
                    {/* Row 1: Difficulty & Active Time */}
                    <View style={styles.summaryGridRow}>
                      <View style={styles.summaryPill}>
                        <Image
                          source={require('../../../assets/icons/workout_summary/summary_target.png')}
                          style={styles.summaryPillIcon}
                          resizeMode="contain"
                        />
                        <View>
                          <Text style={styles.summaryPillVal}>General</Text>
                          <Text style={styles.summaryPillLbl}>Difficulty</Text>
                        </View>
                      </View>

                      <View style={[styles.summaryPill, { marginLeft: 8 }]}>
                        <Image
                          source={require('../../../assets/icons/workout_summary/summary_stopwatch.png')}
                          style={styles.summaryPillIcon}
                          resizeMode="contain"
                        />
                        <View>
                          <Text style={styles.summaryPillVal}>
                            {Math.max(20, Math.round(totalElapsedTime || 20))} sec
                          </Text>
                          <Text style={styles.summaryPillLbl}>Active Time</Text>
                        </View>
                      </View>
                    </View>

                    {/* Row 2: Rest Time & Miss Rate */}
                    <View style={[styles.summaryGridRow, { marginTop: 8 }]}>
                      <View style={styles.summaryPill}>
                        <Image
                          source={require('../../../assets/icons/workout_summary/summary_coffee.png')}
                          style={styles.summaryPillIcon}
                          resizeMode="contain"
                        />
                        <View>
                          <Text style={styles.summaryPillVal}>15 sec</Text>
                          <Text style={styles.summaryPillLbl}>Rest Time</Text>
                        </View>
                      </View>

                      <View style={[styles.summaryPill, { marginLeft: 8 }]}>
                        <Image
                          source={require('../../../assets/icons/workout_summary/summary_miss_x.png')}
                          style={styles.summaryPillIcon}
                          resizeMode="contain"
                        />
                        <View>
                          <Text style={styles.summaryPillVal}>10%</Text>
                          <Text style={styles.summaryPillLbl}>Miss Rate</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Bottom Buttons: Play Again & Back to Home */}
                <View style={styles.completeActionsRow}>
                  <TouchableOpacity
                    style={styles.playAgainBtn}
                    onPress={handlePlayAgain}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={require('../../../assets/icons/workout_summary/btn_play_again.png')}
                      style={styles.playAgainIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.playAgainText}>Play Again</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backHomeBtn}
                    onPress={handleBackToHome}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={require('../../../assets/icons/workout_summary/btn_home.png')}
                      style={styles.backHomeIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.backHomeText}>Back to Home</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#202020',
  },
  screen: {
    flex: 1,
    backgroundColor: '#202020',
  },
  headerBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0789EE',
    paddingHorizontal: 8,
  },
  headerBackButton: {
    width: 28,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTimer: {
    width: 56,
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  headerStepInfo: {
    width: 96,
    flexShrink: 0,
    justifyContent: 'center',
    marginRight: 5,
  },
  headerStepLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  headerStepElapsed: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
  },
  headerProgress: {
    height: 4,
    flex: 1,
    minWidth: 70,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    position: 'relative',
  },
  headerProgressFill: {
    width: '72%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  headerProgressThumb: {
    position: 'absolute',
    left: '72%',
    top: -3,
    width: 2,
    height: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTotalTime: {
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  headerTotalLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 9,
    lineHeight: 10,
    fontWeight: '700',
  },
  headerTotalValue: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '800',
  },
  headerDots: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    marginLeft: 5,
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  headerDotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  pauseButton: {
    width: 26,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  gameArea: {
    flex: 1,
    minHeight: 135,
    backgroundColor: '#444444',
    position: 'relative',
  },
  restBackdrop: {
    backgroundColor: '#000000',
    zIndex: 10,
  },
  restMessage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
  restTimer: {
    color: '#FFFFFF',
    fontSize: 52,
    lineHeight: 58,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  restSubtitle: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  gameHud: {
    position: 'absolute',
    top: 6,
    right: 12,
    zIndex: 2,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rhythmGuide: {
    position: 'absolute',
    top: 5,
    left: 8,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(32, 32, 32, 0.48)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  rhythmGuideIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    position: 'relative',
  },
  rhythmGuideOuterRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#FFD400',
  },
  rhythmGuideText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  settingsBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  hudStatsText: {
    color: '#E0E0E0',
    fontSize: 10,
    fontWeight: '500',
  },
  hudSensorStatus: {
    color: '#B0B0B0',
    fontSize: 10,
    fontWeight: '500',
  },
  comboText: {
    color: '#E7E7E7',
    fontSize: 10,
    fontWeight: '500',
  },
  pointsText: {
    color: '#F1F1F1',
    fontSize: 10,
    fontWeight: '600',
  },
  playField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingTop: 7,
    gap: 0,
  },
  sensorGroup: {
    width: 112,
  },
  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sensorRowSpacing: {
    marginBottom: 10,
  },
  centerLane: {
    width: 146,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0080FF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  vitalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vitalsBlueDot: {
    backgroundColor: '#007AFF',
  },
  vitalsTitle: {
    color: '#0A2540',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vitalsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vitalCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalIcon: {},
  vitalLabel: {
    color: '#64748B',
    fontWeight: '500',
  },
  vitalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  vitalValue: {
    color: '#0A2540',
    fontWeight: '800',
  },
  vitalUnit: {
    color: '#0A2540',
    fontWeight: '700',
  },
  vitalDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  vitalsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalsGreenDot: {
    backgroundColor: '#16A34A',
  },
  vitalsStatusText: {
    color: '#16A34A',
    fontWeight: '700',
  },
  exertionSeparator: {
    height: 1,
    backgroundColor: '#EDF2F7',
    width: '100%',
  },
  exertionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exertionTitle: {
    color: '#0A2540',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  exertionBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  exertionBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  exertionBarWrapper: {
    position: 'relative',
    width: '100%',
  },
  exertionTrack: {
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
  },
  exertionSegmentLow: {
    backgroundColor: '#22C55E',
  },
  exertionSegmentMod: {
    backgroundColor: '#F59E0B',
  },
  exertionSegmentHigh: {
    backgroundColor: '#E2E8F0',
  },
  exertionThumb: {
    position: 'absolute',
    backgroundColor: '#0F2748',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  exertionLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exertionLabel: {
    color: '#64748B',
    fontWeight: '500',
  },
  bioCard: {
    width: 200,
    height: 110,
    borderRadius: 9,
    backgroundColor: '#E6E6E6',
    paddingHorizontal: 13,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  bioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bioValue: {
    flex: 1,
    color: '#202020',
    fontSize: 12,
    fontWeight: '700',
  },
  bioSmallValue: {
    flex: 1,
    color: '#202020',
    fontSize: 11,
    fontWeight: '700',
  },
  modelPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  modelPanelTitle: {
    color: '#0789EE',
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  nodeResultRow: {
    width: '100%',
  },
  nodeResultText: {
    color: '#202020',
    fontWeight: '800',
  },
  nodeResultReason: {
    color: '#555555',
    fontWeight: '500',
  },
  centerPads: {
    flexDirection: 'row',
    gap: 12,
  },
  centerSensorGrid: {
    width: '100%',
    alignItems: 'center',
  },
  centerSensorRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  padButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.45)',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    overflow: 'visible',
    zIndex: 2,
  },
  padButtonRatingTarget: {
    zIndex: 100,
    elevation: 20,
  },
  padText: {
    color: '#FFFFFF',
    fontSize: 19,
    lineHeight: 21,
    fontWeight: '700',
  },
  noteRing: {
    position: 'absolute',
    borderWidth: 3.5,
    borderColor: '#FFD400',
    backgroundColor: 'transparent',
    zIndex: 4,
  },
  noteRingOnBeat: {
    borderWidth: 4,
    shadowColor: '#FFD400',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 5,
  },
  hitRatingBadge: {
    position: 'absolute',
    minWidth: 80,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FF3366',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    zIndex: 200,
    elevation: 30,
  },
  hitRatingGood: {
    backgroundColor: '#10B981',
  },
  hitRatingBad: {
    backgroundColor: '#F59E0B',
  },
  hitRatingMiss: {
    backgroundColor: '#FF3366',
  },
  hitRatingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  summaryCard: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#121A2E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2B3A59',
  },
  summaryTrophy: {
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  summarySub: {
    fontSize: 12,
    color: '#9EACC5',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  statsSummaryGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  summaryStatItem: {
    width: '48%',
    backgroundColor: '#18233B',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2B3A59',
  },
  summaryStatLabel: {
    fontSize: 11,
    color: '#9EACC5',
  },
  summaryStatVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#55E6FF',
    marginTop: 2,
  },
  saveResultButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#0084FF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveResultText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  completeCardWrapper: {
    width: '98%',
    maxWidth: 750,
    maxHeight: '96%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 22,
    elevation: 12,
  },
  completeHeader: {
    height: 44,
    backgroundColor: '#0080FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  completeHeaderBackBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeHeaderTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  completeLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeLogoText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  completeBody: {
    backgroundColor: '#EDF5FE',
    flexDirection: 'row',
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  completeGradeCard: {
    flex: 0.38,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gradeHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
  },
  rainbowGradeBadge: {
    width: 130,
    height: 130,
  },
  gradeResultTextWrap: {
    alignItems: 'center',
  },
  gradeResultTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
    textAlign: 'center',
  },
  gradeResultSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  completeStatsCol: {
    flex: 0.62,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  completeTopStatsRow: {
    flexDirection: 'row',
  },
  completeStatBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  completeStatIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  scoreValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  completeStatNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  completeStatUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 4,
  },
  completeStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  completeSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sessionSummaryHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  summaryGrid: {},
  summaryGridRow: {
    flexDirection: 'row',
  },
  summaryPill: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryPillIcon: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
  summaryPillVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryPillLbl: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  completeActionsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  playAgainBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#0080FF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  playAgainIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
    marginRight: 6,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  backHomeBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#0080FF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  backHomeIcon: {
    width: 18,
    height: 18,
    tintColor: '#0080FF',
    marginRight: 6,
  },
  backHomeText: {
    color: '#0080FF',
    fontSize: 14,
    fontWeight: '700',
  },
});
