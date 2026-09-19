import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

export const ActivityScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mission } = useApp();

  const handleStartPlannedWorkout = () => {
    navigation.navigate('PlankWorkout', {
      mode: 'planned',
      program: mission?.program,
      durationPerPosture: 30,
      restTime: 10,
    });
  };

  const handleStartCustomWorkout = () => {
    navigation.navigate('CustomWorkout');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>กิจกรรม</Text>
        <Text style={styles.subtitle}>
          เลือกรูปแบบการฝึกที่คุณต้องการเริ่มต้นในวันนี้
        </Text>

        <View style={styles.cardsContainer}>
          {/* 1. Planned Workout Card */}
          <TouchableOpacity
            style={styles.activityCard}
            activeOpacity={0.88}
            onPress={handleStartPlannedWorkout}
          >
            <View style={styles.iconCircle}>
              <MaterialIcons name="fitness-center" size={72} color="#FFFFFF" />
            </View>
            <Text style={styles.cardTitle}>ตามแผนการ</Text>
            <Text style={styles.cardSubtitle}>
              {mission ? mission.programName : 'แผนฝึกมาตรฐาน'}
            </Text>
          </TouchableOpacity>

          {/* 2. Custom Workout Card */}
          <TouchableOpacity
            style={styles.activityCard}
            activeOpacity={0.88}
            onPress={handleStartCustomWorkout}
          >
            <View style={styles.iconCircle}>
              <MaterialIcons name="settings" size={72} color="#FFFFFF" />
            </View>
            <Text style={styles.cardTitle}>กำหนดเอง</Text>
            <Text style={styles.cardSubtitle}>
              ปรับแต่งเวลา ท่าฝึก และระดับความยาก
            </Text>
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
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: 28,
  },
  cardsContainer: {
    gap: 22,
  },
  activityCard: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.primaryDark,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginTop: 4,
  },
});
