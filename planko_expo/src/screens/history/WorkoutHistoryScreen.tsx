import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

const cardColorThemes = [
  { bg: '#E0F2FE', border: '#BAE6FD', icon: '#0284C7' },
  { bg: '#EDE9FE', border: '#DDD6FE', icon: '#7C3AED' },
  { bg: '#CCFBF1', border: '#99F6E4', icon: '#0D9488' },
  { bg: '#FFEDD5', border: '#FED7AA', icon: '#EA580C' },
];

export const WorkoutHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { history } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'planned' | 'custom'>('all');

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.getDate()}/${d.getMonth() + 1}/${(d.getFullYear() + 543).toString().slice(-2)}`;
    } catch {
      return isoString;
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Profile' });
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filterType === 'planned') return item.planName.includes('สร้างแกนกลาง');
    if (filterType === 'custom') return item.planName.includes('กำหนดเอง');
    return true;
  });

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

        <Text style={styles.headerTitle}>ประวัติ</Text>

        {/* Filter Pill on top right */}
        <TouchableOpacity
          style={styles.filterPill}
          activeOpacity={0.8}
          onPress={() => {
            const nextFilter =
              filterType === 'all'
                ? 'planned'
                : filterType === 'planned'
                ? 'custom'
                : 'all';
            setFilterType(nextFilter);
          }}
        >
          <Ionicons name="options-outline" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.filterPillText}>
            {filterType === 'all'
              ? 'ดูทั้งหมด'
              : filterType === 'planned'
              ? 'ตามแผนการ'
              : 'กำหนดเอง'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Curved background decoration */}
      <View style={styles.topCurveBg} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={54} color="#94A3B8" />
            <Text style={styles.emptyText}>ยังไม่มีประวัติการฝึกในหมวดหมู่นี้</Text>
          </View>
        ) : (
          filteredHistory.map((item, index) => {
            const theme = cardColorThemes[index % cardColorThemes.length];
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.historyCard}
                activeOpacity={0.75}
                onPress={() =>
                  Alert.alert(
                    item.planName,
                    `แต้ม: ${item.score}\nเวลา: ${Math.round(item.duration / 60)} นาที\nแคลอรี่: ${item.kcal} Cal\nความแม่นยำ: ${item.accuracy}%\nวันที่: ${formatDate(item.createdAt)}`
                  )
                }
              >
                {/* Colored Dumbbell Badge */}
                <View
                  style={[
                    styles.historyIconWrapper,
                    { backgroundColor: theme.bg, borderColor: theme.border },
                  ]}
                >
                  <MaterialIcons name="fitness-center" size={26} color={theme.icon} />
                </View>

                {/* Details */}
                <View style={styles.historyInfo}>
                  <Text style={styles.historyPlanTitle} numberOfLines={1}>
                    {item.planName}
                  </Text>

                  <View style={styles.statsRow}>
                    <View style={styles.scoreBadge}>
                      <Ionicons name="flame" size={14} color="#0084FF" style={{ marginRight: 3 }} />
                      <Text style={styles.scoreText}>{item.score} แต้ม</Text>
                    </View>
                    <View style={styles.timeBadge}>
                      <Ionicons name="time-outline" size={14} color="#64748B" style={{ marginRight: 3 }} />
                      <Text style={styles.timeText}>
                        {Math.round(item.duration / 60)} นาที ({item.kcal} Cal)
                      </Text>
                    </View>
                  </View>

                  <View style={styles.historyDateRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color="#94A3B8"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.historyDate}>{formatDate(item.createdAt)}</Text>
                  </View>
                </View>

                {/* Chevron */}
                <View style={styles.historyChevronCircle}>
                  <Ionicons name="chevron-forward" size={16} color="#0084FF" />
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  filterPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  topCurveBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#0084FF',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#EDF4FE',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8F1FC',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
  },
  historyInfo: {
    flex: 1,
  },
  historyPlanTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  scoreText: {
    fontSize: 13,
    color: '#0084FF',
    fontWeight: 'bold',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  historyDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  historyChevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EBF4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94A3B8',
  },
});
