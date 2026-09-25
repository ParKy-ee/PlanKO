import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';

export const CustomWorkoutScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [levelIndex, setLevelIndex] = useState<number>(2); // 0-4 (ระดับ 1-5)
  const levels = [
    { name: 'เริ่มต้น', sub: 'ฟื้นฟูกล้ามเนื้อ' },
    { name: 'ง่าย', sub: 'เน้นความยืดหยุ่น' },
    { name: 'ทั่วไป', sub: 'ฝึกประจำวัน' },
    { name: 'ปานกลาง', sub: 'เผาผลาญไขมัน' },
    { name: 'ขั้นสูง', sub: 'ท้าทายแกนกลาง' },
  ];

  const timeOptions = [15, 20, 30, 45, 60];
  const [timeIndex, setTimeIndex] = useState<number>(2); // 30s

  const restOptions = [5, 10, 15, 20, 30];
  const [restIndex, setRestIndex] = useState<number>(2); // 15s

  const [showPreview, setShowPreview] = useState<boolean>(true);

  const handlePrevLevel = () => {
    if (levelIndex > 0) setLevelIndex(levelIndex - 1);
  };

  const handleNextLevel = () => {
    if (levelIndex < levels.length - 1) setLevelIndex(levelIndex + 1);
  };

  const handlePrevTime = () => {
    setTimeIndex((prev) => (prev > 0 ? prev - 1 : timeOptions.length - 1));
  };

  const handleNextTime = () => {
    setTimeIndex((prev) => (prev + 1) % timeOptions.length);
  };

  const handlePrevRest = () => {
    setRestIndex((prev) => (prev > 0 ? prev - 1 : restOptions.length - 1));
  };

  const handleNextRest = () => {
    setRestIndex((prev) => (prev + 1) % restOptions.length);
  };

  const handleStartWorkout = () => {
    navigation.navigate('PlankWorkout', {
      mode: 'custom',
      durationPerPosture: timeOptions[timeIndex],
      restTime: restOptions[restIndex],
      levelIndex,
    });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Activity' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0084FF" />

      {/* 1. Header (Blue Bar) */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerBackBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>กำหนดเอง</Text>
        {/* Empty placeholder on the right (no calendar icon) */}
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Curved background decoration */}
      <View style={styles.topCurveBg} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Big White Card */}
        <View style={styles.mainCard}>
          {/* Row 1: ระดับ (Level) */}
          <View style={styles.cardRow}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E2F1FF' }]}>
              <MaterialIcons name="directions-run" size={26} color="#0084FF" />
            </View>
            <Text style={styles.rowLabel}>ระดับ</Text>

            <View style={styles.levelSelectorPill}>
              <TouchableOpacity
                onPress={handlePrevLevel}
                style={styles.chevronTouch}
                activeOpacity={0.6}
              >
                <Ionicons name="chevron-back" size={18} color="#475569" />
              </TouchableOpacity>

              <View style={styles.levelInfoBox}>
                <View style={styles.levelTextRow}>
                  <Text style={styles.levelMainText}>{levels[levelIndex].name}</Text>
                  <Text style={styles.levelSubText}>{levels[levelIndex].sub}</Text>
                </View>
                {/* Step bars */}
                <View style={styles.stepBarsContainer}>
                  {levels.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.stepBar,
                        idx === levelIndex && styles.stepBarActive,
                      ]}
                    />
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleNextLevel}
                style={styles.chevronTouch}
                activeOpacity={0.6}
              >
                <Ionicons name="chevron-forward" size={18} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2: เวลาต่อท่า (Time per posture) */}
          <View style={styles.cardRow}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E6F8F0' }]}>
              <Ionicons name="time-outline" size={24} color="#10B981" />
            </View>
            <Text style={styles.rowLabel}>เวลาต่อท่า</Text>

            <View style={styles.timeSelectorPill}>
              <TouchableOpacity
                onPress={handlePrevTime}
                style={styles.chevronTouch}
                activeOpacity={0.6}
              >
                <Ionicons name="chevron-back" size={18} color="#475569" />
              </TouchableOpacity>

              <Text style={styles.timeMainText}>
                {timeOptions[timeIndex]} วินาที
              </Text>

              <TouchableOpacity
                onPress={handleNextTime}
                style={styles.chevronTouch}
                activeOpacity={0.6}
              >
                <Ionicons name="chevron-forward" size={18} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 3: เวลาพัก (Rest time) */}
          <View style={styles.cardRow}>
            <View style={[styles.iconWrapper, { backgroundColor: '#F0EAFF' }]}>
              <Ionicons name="timer-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.rowLabel}>เวลาพัก</Text>

            <View style={styles.timeSelectorPill}>
              <TouchableOpacity
                onPress={handlePrevRest}
                style={styles.chevronTouch}
                activeOpacity={0.6}
              >
                <Ionicons name="chevron-back" size={18} color="#475569" />
              </TouchableOpacity>

              <Text style={styles.timeMainText}>
                {restOptions[restIndex]} วินาที
              </Text>

              <TouchableOpacity
                onPress={handleNextRest}
                style={styles.chevronTouch}
                activeOpacity={0.6}
              >
                <Ionicons name="chevron-forward" size={18} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 4: แสดงตัวอย่างท่าทาง (Preview toggle) */}
          <View style={[styles.cardRow, { marginBottom: 10 }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FFF0E5' }]}>
              <Ionicons name="image" size={22} color="#F97316" />
            </View>
            <Text style={styles.rowLabelLong}>แสดงตัวอย่างท่าทาง</Text>

            <View style={styles.togglePill}>
              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  showPreview && styles.toggleOptionActive,
                ]}
                onPress={() => setShowPreview(true)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.toggleOptionText,
                    showPreview && styles.toggleOptionTextActive,
                  ]}
                >
                  แสดง
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  !showPreview && styles.toggleOptionActive,
                ]}
                onPress={() => setShowPreview(false)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.toggleOptionText,
                    !showPreview && styles.toggleOptionTextActive,
                  ]}
                >
                  ไม่แสดง
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Start Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartWorkout}
              activeOpacity={0.85}
            >
              <Ionicons
                name="play"
                size={22}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.startButtonText}>เริ่ม</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0084FF',
  },
  topHeader: {
    height: 58,
    backgroundColor: '#0084FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRightPlaceholder: {
    width: 44,
  },
  topCurveBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: '#0084FF',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#EDF4FE',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 14,
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8F1FC',
  },
  cardRow: {
    backgroundColor: '#F7FAFD',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rowLabel: {
    width: 78,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 6,
  },
  rowLabelLong: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 6,
  },
  levelSelectorPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  chevronTouch: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  levelInfoBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 4,
  },
  levelMainText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 6,
  },
  levelSubText: {
    fontSize: 11,
    color: '#64748B',
  },
  stepBarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBar: {
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 2,
  },
  stepBarActive: {
    width: 22,
    backgroundColor: '#0084FF',
  },
  timeSelectorPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  timeMainText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  togglePill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    height: 40,
    width: 150,
  },
  toggleOption: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
  },
  toggleOptionActive: {
    backgroundColor: '#0084FF',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  toggleOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  startButton: {
    width: '92%',
    height: 54,
    backgroundColor: '#0084FF',
    borderRadius: 27,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
