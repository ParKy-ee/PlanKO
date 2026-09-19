import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ScreenOrientation from 'expo-screen-orientation';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import { mockBiofeedbackScenarios } from '../../mocks/mockBeatmap';
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
  const [lastHitRating, setLastHitRating] = useState<string | null>(null);
  const [activePads, setActivePads] = useState<string[]>([
    'L2',
    'L3',
    'R2',
    'R3',
  ]);
  const [biofeedback, setBiofeedback] = useState(mockBiofeedbackScenarios[0]);
  const [isFinished, setIsFinished] = useState(false);

  const activePostureList: Posture[] = postures.slice(0, 4);
  const currentPosture = activePostureList[currentPostureIndex] || postures[0];
  const postureName = currentPosture?.name || 'Standard Elbow Plank';

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
          setActivePads(matchedScenario.activePads);
        }

        return nextTime;
      });
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
    setActivePads((previous) =>
      previous.includes(padId)
        ? previous.filter((pad) => pad !== padId)
        : [...previous, padId],
    );

    const points = 50 + Math.floor(Math.random() * 30);
    setScore((previous) => previous + points);
    setCombo((previous) => {
      const nextCombo = previous + 1;
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);
      return nextCombo;
    });

    const ratings = ['PERFECT!', 'GREAT!', 'PERFECT!'];
    setLastHitRating(ratings[Math.floor(Math.random() * ratings.length)]);
    setTimeout(() => setLastHitRating(null), 600);
  };

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
    const isActive = activePads.includes(padId);
    const isGold = padId.endsWith('3');

    return (
      <TouchableOpacity
        key={padId}
        onPress={() => handlePadTap(padId)}
        style={[
          styles.padButton,
          {
            width: 48 * scale,
            height: 48 * scale,
            borderRadius: 24 * scale,
          },
          isActive && styles.padButtonActive,
          isActive && isGold && styles.padButtonGold,
        ]}
        activeOpacity={0.75}
      >
        <Text style={styles.padText}>{padId.substring(1)}</Text>
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

          <View style={styles.headerProgress}>
            <View style={styles.headerProgressFill} />
            <View style={styles.headerProgressThumb} />
          </View>

          <View style={styles.headerDots}>
            <View style={styles.headerDotActive} />
            <View style={styles.headerDotActive} />
            <View style={styles.headerDot} />
            <View style={styles.headerDot} />
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
            <View style={styles.settingsBadge}>
              <Ionicons name="settings" size={24} color="#B7B7B7" />
            </View>
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

          {lastHitRating && (
            <View style={styles.hitRatingBadge}>
              <Text style={styles.hitRatingText}>{lastHitRating}</Text>
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
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0789EE',
    paddingHorizontal: 8,
  },
  headerBackButton: {
    width: 28,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTimer: {
    width: 52,
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  headerProgress: {
    height: 4,
    flex: 1,
    maxWidth: 146,
    marginHorizontal: 4,
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
  gameHud: {
    position: 'absolute',
    top: 3,
    right: 9,
    zIndex: 2,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
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
    borderWidth: 2,
    borderColor: '#F1F1F1',
  },
  padButtonActive: {
    borderColor: '#00A7FF',
    backgroundColor: 'rgba(43, 94, 124, 0.45)',
  },
  padButtonGold: {
    borderColor: '#FFD400',
    backgroundColor: 'rgba(102, 89, 27, 0.42)',
  },
  padText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '400',
  },
  hitRatingBadge: {
    position: 'absolute',
    left: '50%',
    bottom: 5,
    transform: [{ translateX: -36 }],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: '#FFD400',
  },
  hitRatingText: {
    color: '#202020',
    fontSize: 9,
    fontWeight: '800',
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
