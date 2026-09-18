import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ScreenOrientation from 'expo-screen-orientation';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { mockBiofeedbackScenarios } from '../../mocks/mockBeatmap';
import { Posture } from '../../types';

type PlankWorkoutRouteProp = RouteProp<RootStackParamList, 'PlankWorkout'>;
type PlankWorkoutNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlankWorkout'
>;

export const PlankWorkoutScreen: React.FC = () => {
  const route = useRoute<PlankWorkoutRouteProp>();
  const navigation = useNavigation<PlankWorkoutNavigationProp>();
  const { postures, addSessionPerformance } = useApp();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const {
    mode = 'planned',
    durationPerPosture = 30,
    restTime = 10,
  } = route.params || {};

  // Force Landscape Orientation when entering workout screen
  useEffect(() => {
    async function lockLandscape() {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (err) {
        console.warn('Orientation lock error:', err);
      }
    }

    lockLandscape();

    return () => {
      // Revert back to portrait when exiting
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).catch(() => {});
    };
  }, []);

  // Workout state
  const [currentPostureIndex, setCurrentPostureIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationPerPosture);
  const [isPaused, setIsPaused] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  // Scoring & Game metrics
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastHitRating, setLastHitRating] = useState<string | null>(null);

  // Biofeedback and Smart Mat state
  const [activePads, setActivePads] = useState<string[]>(['L2', 'L3', 'R2', 'R3']);
  const [biofeedback, setBiofeedback] = useState(mockBiofeedbackScenarios[0]);
  const [isFinished, setIsFinished] = useState(false);

  const activePostureList: Posture[] = postures.slice(0, 4);
  const currentPosture = activePostureList[currentPostureIndex] || postures[0];

  const leftPads = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
  const rightPads = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'];

  // Timer loop
  useEffect(() => {
    if (isPaused || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (isResting) {
            if (currentPostureIndex + 1 < activePostureList.length) {
              setCurrentPostureIndex((idx) => idx + 1);
              setIsResting(false);
              return durationPerPosture;
            } else {
              setIsFinished(true);
              return 0;
            }
          } else {
            if (currentPostureIndex + 1 < activePostureList.length) {
              setIsResting(true);
              return restTime;
            } else {
              setIsFinished(true);
              return 0;
            }
          }
        }
        return prev - 1;
      });

      setTotalElapsedTime((prev) => {
        const nextTime = prev + 1;
        const matchedScenario = mockBiofeedbackScenarios.find(
          (s) => s.time === nextTime % 20
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
    isPaused,
    isResting,
    currentPostureIndex,
    isFinished,
    durationPerPosture,
    restTime,
  ]);

  // Handle tapping Smart Mat pad
  const handlePadTap = (padId: string) => {
    setActivePads((prev) =>
      prev.includes(padId) ? prev.filter((p) => p !== padId) : [...prev, padId]
    );

    const pts = 50 + Math.floor(Math.random() * 30);
    setScore((s) => s + pts);
    setCombo((c) => {
      const nextCombo = c + 1;
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);
      return nextCombo;
    });

    const ratings = ['PERFECT!', 'GREAT!', 'PERFECT!'];
    const selectedRating = ratings[Math.floor(Math.random() * ratings.length)];
    setLastHitRating(selectedRating);

    setTimeout(() => {
      setLastHitRating(null);
    }, 600);
  };

  const handleSaveAndExit = () => {
    const calculatedKcal = Math.max(15, Math.round(totalElapsedTime * 0.22));
    const accuracy = Math.min(98, 85 + Math.floor(Math.random() * 12));

    addSessionPerformance({
      planName:
        mode === 'planned'
          ? `ตามแผนการ - ${currentPosture.name}`
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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.headerBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.sessionModeBadge}>
          <Text style={styles.sessionModeText}>
            {isResting ? '💤 ช่วงเวลาพัก' : `ท่าที่ ${currentPostureIndex + 1}/${activePostureList.length} • ${currentPosture.name}`}
          </Text>
        </View>

        {/* Header HUD: Score, Combo, BPM */}
        <View style={styles.headerHudRow}>
          <View style={styles.headerScoreBox}>
            <Text style={styles.headerScoreText}>คะแนน: {score}</Text>
            <Text style={styles.headerComboText}>🔥 {combo} COMBO</Text>
          </View>

          <TouchableOpacity
            onPress={() => setIsPaused(!isPaused)}
            style={styles.headerBtn}
          >
            <Ionicons
              name={isPaused ? 'play' : 'pause'}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isLandscape && styles.scrollContentLandscape,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Landscape Dual-Column Layout */}
        <View style={[styles.mainLayout, isLandscape && styles.mainLayoutLandscape]}>
          
          {/* LEFT COLUMN: Timer & Biofeedback HUD */}
          <View style={[styles.leftColumn, isLandscape && styles.leftColumnLandscape]}>
            {/* Countdown & Posture Info */}
            <View style={styles.timerCard}>
              <Text style={styles.postureTitle}>
                {isResting ? 'พักฟื้นกล้ามเนื้อ' : currentPosture.name}
              </Text>
              <Text style={styles.postureSub} numberOfLines={1}>
                {isResting ? 'เตรียมพร้อมสำหรับท่าถัดไป' : currentPosture.benefit}
              </Text>

              {/* Large Countdown Ring */}
              <View style={styles.countdownContainer}>
                <Text style={styles.timerNumber}>{timeLeft}</Text>
                <Text style={styles.timerUnit}>วินาที</Text>
              </View>

              {/* Floating Hit Indicator */}
              {lastHitRating && (
                <View style={styles.hitRatingBadge}>
                  <Text style={styles.hitRatingText}>{lastHitRating}</Text>
                </View>
              )}
            </View>

            {/* Wearable Biometrics */}
            <View style={styles.hudRow}>
              <View style={styles.hudCard}>
                <Text style={styles.hudLabel}>อัตราหัวใจ</Text>
                <View style={styles.hudStatRow}>
                  <Ionicons name="heart" size={16} color="#FF3B30" />
                  <Text style={styles.hudValue}>{biofeedback.bpm}</Text>
                </View>
                <Text style={styles.hudSub}>BPM</Text>
              </View>

              <View style={styles.hudCard}>
                <Text style={styles.hudLabel}>ออกซิเจน</Text>
                <View style={styles.hudStatRow}>
                  <Ionicons name="water" size={16} color="#55E6FF" />
                  <Text style={styles.hudValue}>{biofeedback.spo2}%</Text>
                </View>
                <Text style={styles.hudSub}>SpO₂</Text>
              </View>
            </View>

            {/* Real-time Biofeedback Alert Banner */}
            <View
              style={[
                styles.biofeedbackBanner,
                biofeedback.statusType === 'warning' && styles.bannerWarning,
                biofeedback.statusType === 'alert' && styles.bannerAlert,
                biofeedback.statusType === 'success' && styles.bannerSuccess,
              ]}
            >
              <Ionicons
                name={
                  biofeedback.statusType === 'alert'
                    ? 'warning'
                    : biofeedback.statusType === 'warning'
                    ? 'alert-circle'
                    : 'checkmark-circle'
                }
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.bannerText} numberOfLines={2}>
                {biofeedback.statusText}
              </Text>
            </View>
          </View>

          {/* RIGHT COLUMN: CoP Balance & Smart Mat 16-point Grid */}
          <View style={[styles.rightColumn, isLandscape && styles.rightColumnLandscape]}>
            {/* Center of Pressure (CoP) Balance Bar */}
            <View style={styles.copContainer}>
              <View style={styles.copHeaderRow}>
                <Text style={styles.copTitle}>สมดุลน้ำหนัก (Center of Pressure)</Text>
                <Text style={styles.copValues}>
                  ซ้าย {biofeedback.leftPressure}% : ขวา {biofeedback.rightPressure}%
                </Text>
              </View>
              <View style={styles.copTrack}>
                <View
                  style={[
                    styles.copBarLeft,
                    { width: `${biofeedback.leftPressure}%` },
                  ]}
                />
                <View
                  style={[
                    styles.copBarRight,
                    { width: `${biofeedback.rightPressure}%` },
                  ]}
                />
                <View style={styles.copCenterDivider} />
              </View>
            </View>

            {/* Smart Mat 16-Point Interactive Grid */}
            <View style={styles.matContainer}>
              <Text style={styles.matTitle}>
                แผ่นรองอัจฉริยะ Smart Mat (กดปุ่ม L/R เพื่อจำลองเซนเซอร์)
              </Text>

              <View style={styles.matGrid}>
                {/* Left Pads */}
                <View style={styles.matColumn}>
                  <Text style={styles.matSideLabel}>ฝั่งซ้าย (Left)</Text>
                  <View style={styles.padsWrap}>
                    {leftPads.map((pad) => {
                      const isActive = activePads.includes(pad);
                      return (
                        <TouchableOpacity
                          key={pad}
                          onPress={() => handlePadTap(pad)}
                          style={[
                            styles.padButton,
                            isActive && styles.padButtonActive,
                          ]}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.padText,
                              isActive && styles.padTextActive,
                            ]}
                          >
                            {pad}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Right Pads */}
                <View style={styles.matColumn}>
                  <Text style={styles.matSideLabel}>ฝั่งขวา (Right)</Text>
                  <View style={styles.padsWrap}>
                    {rightPads.map((pad) => {
                      const isActive = activePads.includes(pad);
                      return (
                        <TouchableOpacity
                          key={pad}
                          onPress={() => handlePadTap(pad)}
                          style={[
                            styles.padButton,
                            isActive && styles.padButtonActive,
                          ]}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.padText,
                              isActive && styles.padTextActive,
                            ]}
                          >
                            {pad}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Workout Complete Summary Modal */}
      <Modal
        visible={isFinished}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryTrophy}>
              <MaterialIcons name="emoji-events" size={54} color="#FFD700" />
            </View>
            <Text style={styles.summaryTitle}>ยอดเยี่ยม! การฝึกสำเร็จ</Text>
            <Text style={styles.summarySub}>
              คุณได้ฝึกแพลงก์อย่างมีประสิทธิภาพตามมาตรฐาน Closed-Loop Biofeedback
            </Text>

            {/* Result Stats Grid */}
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

            {/* Save & Finish Button */}
            <TouchableOpacity
              style={styles.saveResultButton}
              onPress={handleSaveAndExit}
              activeOpacity={0.85}
            >
              <Text style={styles.saveResultText}>บันทึกผลและกลับสู่หน้าหลัก</Text>
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
    backgroundColor: '#0B1020',
  },
  headerBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerBtn: {
    padding: 6,
  },
  sessionModeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  sessionModeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerHudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerScoreBox: {
    alignItems: 'flex-end',
  },
  headerScoreText: {
    color: '#55E6FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerComboText: {
    color: '#FFD166',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 12,
  },
  scrollContentLandscape: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainLayout: {
    flexDirection: 'column',
    gap: 12,
  },
  mainLayoutLandscape: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'stretch',
  },
  leftColumn: {
    flex: 1,
    gap: 10,
  },
  leftColumnLandscape: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    gap: 10,
  },
  rightColumnLandscape: {
    flex: 1.2,
  },
  timerCard: {
    backgroundColor: '#121A2E',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2B3A59',
  },
  postureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#55E6FF',
    textAlign: 'center',
  },
  postureSub: {
    fontSize: 11,
    color: '#9EACC5',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  countdownContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#18233B',
    borderWidth: 3,
    borderColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  timerNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  timerUnit: {
    fontSize: 10,
    color: '#9EACC5',
    marginTop: -2,
  },
  hitRatingBadge: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  hitRatingText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 11,
  },
  hudRow: {
    flexDirection: 'row',
    gap: 8,
  },
  hudCard: {
    flex: 1,
    backgroundColor: '#121A2E',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2B3A59',
  },
  hudLabel: {
    fontSize: 10,
    color: '#9EACC5',
    fontWeight: '500',
  },
  hudValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  hudStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  hudSub: {
    fontSize: 9,
    color: '#55E6FF',
  },
  biofeedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    gap: 8,
  },
  bannerSuccess: {
    backgroundColor: '#1B4D3E',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  bannerWarning: {
    backgroundColor: '#5C3810',
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  bannerAlert: {
    backgroundColor: '#5C1D24',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  copContainer: {
    backgroundColor: '#121A2E',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2B3A59',
  },
  copHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  copTitle: {
    fontSize: 11,
    color: '#9EACC5',
    fontWeight: '600',
  },
  copValues: {
    fontSize: 11,
    color: '#55E6FF',
    fontWeight: 'bold',
  },
  copTrack: {
    height: 10,
    backgroundColor: '#18233B',
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  copBarLeft: {
    backgroundColor: '#0084FF',
    height: '100%',
  },
  copBarRight: {
    backgroundColor: '#55E6FF',
    height: '100%',
  },
  copCenterDivider: {
    position: 'absolute',
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  matContainer: {
    backgroundColor: '#121A2E',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2B3A59',
    flex: 1,
    justifyContent: 'center',
  },
  matTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#EDF4FF',
    marginBottom: 8,
    textAlign: 'center',
  },
  matGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  matColumn: {
    flex: 1,
  },
  matSideLabel: {
    fontSize: 10,
    color: '#9EACC5',
    textAlign: 'center',
    marginBottom: 6,
  },
  padsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'center',
  },
  padButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 6,
    backgroundColor: '#18233B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2B3A59',
  },
  padButtonActive: {
    backgroundColor: '#0084FF',
    borderColor: '#55E6FF',
  },
  padText: {
    color: '#9EACC5',
    fontSize: 10,
    fontWeight: 'bold',
  },
  padTextActive: {
    color: '#FFFFFF',
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
    backgroundColor: Colors.primary,
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
