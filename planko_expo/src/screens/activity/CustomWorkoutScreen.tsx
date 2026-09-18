import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

  const handleNextTime = () => {
    setTimeIndex((prev) => (prev + 1) % timeOptions.length);
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
    <SafeAreaView style={styles.safeArea}>
      {/* Blue Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>กำหนดเอง</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 1. Level Selector */}
        <View style={styles.selectorCard}>
          <Text style={styles.cardLabel}>ระดับ</Text>
          <TouchableOpacity onPress={handlePrevLevel} style={styles.chevronBtn}>
            <Ionicons name="chevron-back" size={26} color="#000000" />
          </TouchableOpacity>

          <View style={styles.valueInnerBox}>
            <View style={styles.valueRow}>
              <Text style={styles.mainValue}>{levels[levelIndex].name}</Text>
              <Text style={styles.subValue}>{levels[levelIndex].sub}</Text>
            </View>
            {/* Step Bars */}
            <View style={styles.stepBarsRow}>
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

          <TouchableOpacity onPress={handleNextLevel} style={styles.chevronBtn}>
            <Ionicons name="chevron-forward" size={26} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* 2. Time per posture selector */}
        <TouchableOpacity
          style={styles.selectorCard}
          activeOpacity={0.85}
          onPress={handleNextTime}
        >
          <Text style={styles.cardLabel}>เวลาต่อท่า</Text>
          <View style={styles.valueInnerBox}>
            <Text style={styles.mainValueCentered}>
              {timeOptions[timeIndex]} วินาที
            </Text>
          </View>
          <View style={styles.chevronBtn}>
            <Ionicons name="chevron-forward" size={26} color="#000000" />
          </View>
        </TouchableOpacity>

        {/* 3. Rest time selector */}
        <TouchableOpacity
          style={styles.selectorCard}
          activeOpacity={0.85}
          onPress={handleNextRest}
        >
          <Text style={styles.cardLabel}>เวลาพัก</Text>
          <View style={styles.valueInnerBox}>
            <Text style={styles.mainValueCentered}>
              {restOptions[restIndex]} วินาที
            </Text>
          </View>
          <View style={styles.chevronBtn}>
            <Ionicons name="chevron-forward" size={26} color="#000000" />
          </View>
        </TouchableOpacity>

        {/* 4. Show preview toggle */}
        <View style={styles.selectorCard}>
          <Text style={styles.cardLabelLong}>แสดงตัวอย่างท่าทาง</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleHalfLeft,
                showPreview && styles.toggleActive,
              ]}
              onPress={() => setShowPreview(true)}
            >
              <Text
                style={[
                  styles.toggleText,
                  showPreview && styles.toggleTextActive,
                ]}
              >
                แสดง
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleHalfRight,
                !showPreview && styles.toggleActive,
              ]}
              onPress={() => setShowPreview(false)}
            >
              <Text
                style={[
                  styles.toggleText,
                  !showPreview && styles.toggleTextActive,
                ]}
              >
                ไม่แสดง
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Start Button */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWorkout}
            activeOpacity={0.85}
          >
            <Text style={styles.startButtonText}>เริ่ม</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    height: 56,
    backgroundColor: Colors.primaryDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    zIndex: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 24,
    gap: 14,
  },
  selectorCard: {
    backgroundColor: '#D9D9D9',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardLabel: {
    width: 90,
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cardLabelLong: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  chevronBtn: {
    padding: 2,
  },
  valueInnerBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  mainValueCentered: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subValue: {
    fontSize: 11,
    color: '#64748B',
  },
  stepBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 4,
  },
  stepBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  stepBarActive: {
    backgroundColor: Colors.primaryDark,
  },
  toggleContainer: {
    flexDirection: 'row',
    width: 150,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  toggleHalfLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  toggleHalfRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  toggleActive: {
    backgroundColor: Colors.primaryDark,
  },
  toggleText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 30,
  },
  startButton: {
    width: 280,
    height: 52,
    backgroundColor: Colors.primaryDark,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
