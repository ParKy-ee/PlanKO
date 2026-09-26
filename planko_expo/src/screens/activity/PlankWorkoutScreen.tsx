import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type DimensionValue,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ScreenOrientation from 'expo-screen-orientation';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import { mockBeatmap, mockBiofeedbackScenarios } from '../../mocks/mockBeatmap';
import { Posture } from '../../types';
import { SENSOR_WS_URL } from '../../config/sensor';
import { getPressedSensorId } from './sensorMessage';

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
  const { postures, addSessionPerformance } = useApp();
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
  const [biofeedback, setBiofeedback] = useState(mockBiofeedbackScenarios[0]);
  const [isFinished, setIsFinished] = useState(false);
  const [sensorConnection, setSensorConnection] = useState<'off' | 'connecting' | 'connected' | 'disconnected'>(
    SENSOR_WS_URL ? 'connecting' : 'off',
  );
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
  ) as DimensionValue;
  const restOverlayOpacity = restTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

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
        const matchedScenario = mockBiofeedbackScenarios.find(
          (scenario) => scenario.time === nextTime % 20,
        );

        if (matchedScenario) {
          setBiofeedback(matchedScenario);
        }

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

  const handlePadTapRef = useRef(handlePadTap);
  handlePadTapRef.current = handlePadTap;
  const canReceiveSensorRef = useRef(!isPaused && !isResting && !isFinished);
  canReceiveSensorRef.current = !isPaused && !isResting && !isFinished;

  useEffect(() => {
    if (!SENSOR_WS_URL) return;
    let active = true;
    let socket: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (!active) return;
      setSensorConnection('connecting');
      try {
        socket = new WebSocket(SENSOR_WS_URL);
      } catch (error) {
        console.warn('Sensor WebSocket connection failed:', error);
        setSensorConnection('disconnected');
        retry = setTimeout(connect, 3000);
        return;
      }
      socket.onopen = () => {
        if (active) setSensorConnection('connected');
      };
      socket.onmessage = (event) => {
        if (!active || !canReceiveSensorRef.current || typeof event.data !== 'string') return;
        const sensorId = getPressedSensorId(event.data);
        if (sensorId) handlePadTapRef.current(sensorId);
      };
      socket.onerror = () => {
        if (active) setSensorConnection('disconnected');
      };
      socket.onclose = () => {
        if (!active) return;
        setSensorConnection('disconnected');
        retry = setTimeout(connect, 3000);
      };
    };

    connect();
    return () => {
      active = false;
      if (retry) clearTimeout(retry);
      if (socket) socket.close();
    };
  }, []);

  const handleSaveAndExit = () => {
    const calculatedKcal = Math.max(15, Math.round(totalElapsedTime * 0.22));
    const accuracy = Math.min(98, 85 + Math.floor(Math.random() * 12));

    addSessionPerformance({
      planName:
        mode === 'planned'
          ? `ตามแผน - ${postureName}`
          : 'กำหนดเอง - Custom Plank Session',
      score: score || 650,
      duration: totalElapsedTime || 60,
      kcal: calculatedKcal,
      accuracy,
      maxCombo: maxCombo || 12,
      avgBpm: biofeedback.bpm,
      postureHits: combo || 16,
    });

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
            <Text style={styles.comboText}>combo {combo || 0}x</Text>
            <Text style={styles.pointsText}>{score || 0} Point</Text>
            <Text style={styles.pointsText}>Sensor: {sensorConnection}</Text>
            <View style={styles.settingsBadge}>
              <Ionicons name="settings" size={24} color="#B7B7B7" />
            </View>
          </View>

          <View style={styles.rhythmGuide} pointerEvents="none">
            <View style={styles.rhythmGuideIcon}>
              <View style={styles.rhythmGuideOuterRing} />
            </View>
            <Text style={styles.rhythmGuideText}>
              TAP WHEN RING MEETS SENSOR
            </Text>
          </View>

          <View style={[styles.playField, { gap: 6 }]}>
            <View
              style={[
                styles.sensorGroup,
                { width: 112 * boardScale, gap: 10 * boardScale },
              ]}
            >
              {leftSensorRows.map((row) => (
                <View key={row.join('-')} style={styles.sensorRow}>
                  {row.map((padId) => renderPad(padId))}
                </View>
              ))}
            </View>

            <View
              style={[
                styles.centerLane,
                { width: 158 * boardScale, gap: 8 * boardScale },
              ]}
            >
              <View
                style={[
                  styles.bioCard,
                  {
                    width: 150 * boardScale,
                    height: 55 * boardScale,
                    borderRadius: 9 * boardScale,
                    paddingHorizontal: 13 * boardScale,
                    paddingVertical: 5 * boardScale,
                  },
                ]}
                >
                  <View style={styles.bioRow}>
                    <Ionicons name="heart-outline" size={16} color="#F13D48" />
                    <Text
                      style={[styles.bioValue, { fontSize: 12 * boardScale }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {biofeedback.bpm} BPM
                    </Text>
                  </View>
                  <View style={styles.bioRow}>
                    <Ionicons name="keypad-outline" size={12} color="#514BFF" />
                    <Text
                      style={[styles.bioSmallValue, { fontSize: 11 * boardScale }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {biofeedback.spo2}%
                    </Text>
                  </View>
              </View>

              <View style={[styles.centerSensorGrid, { gap: 8 * boardScale }]}>
                {centerSensorRows.map((row) => (
                  <View
                    key={row.join('-')}
                    style={[styles.centerSensorRow, { gap: 12 * boardScale }]}
                  >
                    {row.map((padId) => renderPad(padId, boardScale))}
                  </View>
                ))}
              </View>
            </View>

            <View
              style={[
                styles.sensorGroup,
                { width: 112 * boardScale, gap: 10 * boardScale },
              ]}
            >
              {rightSensorRows.map((row) => (
                <View key={row.join('-')} style={styles.sensorRow}>
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
        animationType="slide"
        transparent
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryTrophy}>
              <MaterialIcons name="emoji-events" size={54} color="#FFD700" />
            </View>
            <Text style={styles.summaryTitle}>ยอดเยี่ยม! การฝึกสำเร็จ</Text>
            <Text style={styles.summarySub}>
              คุณฝึกแพลงก์ได้อย่างมีประสิทธิภาพตามมาตรฐาน Closed-Loop Biofeedback
            </Text>

            <View style={styles.statsSummaryGrid}>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatLabel}>คะแนนรวม</Text>
                <Text style={styles.summaryStatVal}>{score || 720}</Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatLabel}>แคลอรี่</Text>
                <Text style={styles.summaryStatVal}>
                  {Math.max(20, Math.round(totalElapsedTime * 0.22))} kcal
                </Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatLabel}>ความแม่นยำ</Text>
                <Text style={styles.summaryStatVal}>94%</Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatLabel}>Max Combo</Text>
                <Text style={styles.summaryStatVal}>{maxCombo || 16}x</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveResultButton}
              onPress={handleSaveAndExit}
              activeOpacity={0.85}
            >
              <Text style={styles.saveResultText}>บันทึกผลและกลับหน้าหลัก</Text>
            </TouchableOpacity>
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
    backgroundColor: '#5F5F5F',
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
    top: 3,
    right: 9,
    zIndex: 2,
    flexDirection: 'row',
    gap: 10,
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
    width: 38,
    height: 38,
    marginLeft: -2,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(125, 125, 125, 0.34)',
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
    gap: 10,
  },
  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centerLane: {
    width: 158,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bioCard: {
    width: 150,
    height: 55,
    borderRadius: 9,
    backgroundColor: '#E6E6E6',
    paddingHorizontal: 13,
    paddingVertical: 5,
    justifyContent: 'center',
    gap: 1,
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
    backgroundColor: 'rgba(72, 72, 72, 0.28)',
    borderWidth: 3,
    borderColor: '#F1F1F1',
    overflow: 'visible',
    zIndex: 2,
  },
  padButtonRatingTarget: {
    zIndex: 100,
    elevation: 20,
  },
  padText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
  },
  noteRing: {
    position: 'absolute',
    borderWidth: 3,
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
    minWidth: 108,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#FFD400',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    zIndex: 200,
    elevation: 30,
  },
  hitRatingGood: {
    backgroundColor: '#39FF14',
  },
  hitRatingBad: {
    backgroundColor: '#FF9F1C',
  },
  hitRatingMiss: {
    backgroundColor: '#FF4F9D',
  },
  hitRatingText: {
    color: '#202020',
    fontSize: 18,
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
});
