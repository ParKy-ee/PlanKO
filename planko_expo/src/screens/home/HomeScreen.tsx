import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../../components/common/CircularProgress';
import { Posture } from '../../types';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mission, postures, quests, totalCalories } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  // Calculate mission progress percentage
  const missionProgress =
    mission && mission.target > 0 ? mission.current / mission.target : 0.0;
  const missionPercentage = Math.round(missionProgress * 100);

  // Extract unique categories
  const categories = [
    { id: 0, name: 'ทั้งหมด' },
    ...Array.from(
      new Map(
        postures
          .filter((p) => p.postureCategory)
          .map((p) => [p.postureCategory!.id, p.postureCategory!])
      ).values()
    ),
  ];

  // Filter postures
  const filteredPostures =
    selectedCategoryId === 0
      ? postures
      : postures.filter((p) => p.postureCategory?.id === selectedCategoryId);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <Text style={styles.logoTitle}>PlankO</Text>
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() =>
            Alert.alert(
              'การแจ้งเตือน',
              'วันนี้คุณมีแผนฝึกแพลงก์ตามตารางเวลา 18:00 น. อย่าลืมมาฝึกนะ!'
            )
          }
        >
          <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Calorie Card */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieTextGroup}>
            <Text style={styles.calorieLabel}>
              จำนวน{'\n'}แคลอรี่{'\n'}ที่เผาผลาญ{'\n'}รวม
            </Text>
            <View style={styles.calorieNumberRow}>
              <Text style={styles.calorieNumber}>{totalCalories}</Text>
              <Text style={styles.calorieUnit}> แคล</Text>
            </View>
          </View>

          <View style={styles.calorieProgressContainer}>
            <CircularProgress
              size={95}
              strokeWidth={8}
              progress={missionProgress}
              color="#FFFFFF"
              backgroundColor="rgba(255, 255, 255, 0.25)"
              centerText={`${missionPercentage}%`}
              textColor="#FFFFFF"
              fontSize={20}
            />
          </View>
        </View>

        {/* 2. Progress / Quests Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>การพัฒนา</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('เควสต์ทั้งหมด', 'คุณกำลังทำ 4 เควสต์ประจำสัปดาห์นี้')
            }
          >
            <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.questListScroll}
        >
          {quests.map((quest) => {
            const qProgress =
              quest.targetValue > 0 ? quest.currentValue / quest.targetValue : 0;
            return (
              <View key={quest.id} style={styles.questCard}>
                <View style={styles.questMoreIcon}>
                  <Ionicons name="ellipsis-vertical" size={14} color="#94A3B8" />
                </View>

                <CircularProgress
                  size={58}
                  strokeWidth={5}
                  progress={qProgress}
                  color={Colors.primary}
                  backgroundColor="#E2E8F0"
                  centerText={`${quest.currentValue}/${quest.targetValue}`}
                  textColor={Colors.primaryDark}
                  fontSize={10}
                />

                <Text style={styles.questTitle} numberOfLines={1}>
                  {quest.questName}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* 3. Posture Library Section */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>ข้อมูลท่า</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PostureList')}>
            <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsScroll}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Posture Preview Cards */}
        <View style={styles.postureCardsList}>
          {filteredPostures.slice(0, 5).map((posture: Posture) => (
            <TouchableOpacity
              key={posture.id}
              style={styles.postureCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('PostureDetail', { posture })}
            >
              <View style={styles.postureIconWrapper}>
                <MaterialIcons
                  name={(posture.iconName as any) || 'fitness-center'}
                  size={36}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.postureInfo}>
                <Text style={styles.postureName}>{posture.name}</Text>
                <Text style={styles.postureDesc} numberOfLines={1}>
                  {posture.description}
                </Text>
                <Text style={styles.postureBenefit} numberOfLines={1}>
                  จุดเด่น: {posture.benefit}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
            </TouchableOpacity>
          ))}
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
  topAppBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  calorieCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  calorieTextGroup: {
    flex: 1,
  },
  calorieLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  calorieNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  calorieNumber: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
  },
  calorieUnit: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  calorieProgressContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  questListScroll: {
    paddingHorizontal: 12,
    gap: 10,
  },
  questCard: {
    width: 135,
    height: 130,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questMoreIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  questTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 10,
    textAlign: 'center',
  },
  categoryPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'transparent',
  },
  categoryPillSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  categoryPillText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoryPillTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  postureCardsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  postureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cyanLight,
    borderRadius: 18,
    padding: 12,
  },
  postureIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postureInfo: {
    flex: 1,
  },
  postureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  postureDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  postureBenefit: {
    fontSize: 11,
    color: '#0369A1',
    fontStyle: 'italic',
  },
});
