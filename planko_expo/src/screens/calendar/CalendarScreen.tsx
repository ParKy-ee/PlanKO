import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const monthsShort = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const weekDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mission, history } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const firstWeekday = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Get active mission workDays (1=Monday ... 7=Sunday -> mapped to 0=Sunday)
  const workDays = mission?.program?.workDays || [1, 2, 3, 4, 5];

  // Render grid items
  const renderCalendarDays = () => {
    const cells = [];
    const totalCells = 42; // 6 rows * 7 cols

    for (let i = 0; i < totalCells; i++) {
      const dayOffset = i - firstWeekday;
      const cellDate = new Date(year, month, 1 + dayOffset);
      const isCurrentMonth = cellDate.getMonth() === month;

      if (!isCurrentMonth && i < firstWeekday) {
        cells.push(<View key={i} style={styles.emptyDayCell} />);
        continue;
      }

      if (!isCurrentMonth && i >= firstWeekday + daysInMonth) {
        cells.push(
          <View key={i} style={styles.emptyDayCell}>
            <Text style={styles.fadedDayText}>{cellDate.getDate()}</Text>
          </View>
        );
        continue;
      }

      const dayNum = cellDate.getDate();

      // Check if completed in history
      const isCompleted = history.some((h) => {
        const hDate = new Date(h.createdAt);
        return (
          hDate.getFullYear() === cellDate.getFullYear() &&
          hDate.getMonth() === cellDate.getMonth() &&
          hDate.getDate() === cellDate.getDate()
        );
      });

      // Check if planned work day
      const jsWeekday = cellDate.getDay(); // 0 is Sunday, 1 is Monday ...
      const thaiWeekday = jsWeekday === 0 ? 7 : jsWeekday;
      const isPlanned = isCurrentMonth && workDays.includes(thaiWeekday);

      const isSelected =
        selectedDay &&
        selectedDay.getFullYear() === cellDate.getFullYear() &&
        selectedDay.getMonth() === cellDate.getMonth() &&
        selectedDay.getDate() === cellDate.getDate();

      cells.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.dayCell,
            isCompleted && styles.dayCellCompleted,
            !isCompleted && isPlanned && styles.dayCellPlanned,
            isSelected && styles.dayCellSelected,
          ]}
          activeOpacity={0.7}
          onPress={() => setSelectedDay(cellDate)}
        >
          <Text
            style={[
              styles.dayText,
              isCompleted && styles.dayTextCompleted,
              isSelected && styles.dayTextSelected,
            ]}
          >
            {dayNum}
          </Text>
        </TouchableOpacity>
      );
    }

    return cells;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.screenTitle}>ปฏิทิน</Text>

        {/* Calendar Frame */}
        <View style={styles.calendarCard}>
          {/* Calendar Month & Year Header */}
          <View style={styles.monthHeaderRow}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navArrow}>
              <Ionicons name="chevron-back" size={24} color="#000000" />
            </TouchableOpacity>

            <View style={styles.dropdownsGroup}>
              <View style={styles.dropdownBadge}>
                <Text style={styles.dropdownText}>{monthsShort[month]}</Text>
                <Ionicons name="chevron-down" size={16} color="#000000" />
              </View>

              <View style={styles.dropdownBadge}>
                <Text style={styles.dropdownText}>{year + 543}</Text>
                <Ionicons name="chevron-down" size={16} color="#000000" />
              </View>
            </View>

            <TouchableOpacity onPress={handleNextMonth} style={styles.navArrow}>
              <Ionicons name="chevron-forward" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Weekday Row */}
          <View style={styles.weekdayRow}>
            {weekDays.map((w, idx) => (
              <Text key={idx} style={styles.weekdayText}>
                {w}
              </Text>
            ))}
          </View>

          {/* 7x6 Grid Days */}
          <View style={styles.daysGrid}>{renderCalendarDays()}</View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendLabel}>ฝึกเสร็จแล้ว</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: '#E8E8E8' }]} />
            <Text style={styles.legendLabel}>มีกำหนดการฝึก</Text>
          </View>
        </View>

        {/* Selected Day Workout Session Card */}
        {selectedDay && (
          <View style={styles.sessionDetailContainer}>
            <Text style={styles.sessionDateHeader}>
              กำหนดการวันที่ {selectedDay.getDate()} {monthsShort[selectedDay.getMonth()]}
            </Text>

            <TouchableOpacity
              style={styles.workoutSessionCard}
              activeOpacity={0.88}
              onPress={() =>
                navigation.navigate('PlankWorkout', {
                  mode: 'planned',
                  program: mission?.program,
                  durationPerPosture: 30,
                  restTime: 10,
                })
              }
            >
              <View style={styles.playIconBox}>
                <Ionicons name="play" size={24} color={Colors.primary} />
              </View>
              <View style={styles.sessionCardInfo}>
                <Text style={styles.sessionCardTitle}>
                  {mission ? mission.programName : 'แผนฝึกมาตรฐาน'}
                </Text>
                <Text style={styles.sessionCardSub}>
                  เป้าหมาย: 750 คะแนน • 3 ท่าฝึก
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 10,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navArrow: {
    padding: 4,
  },
  dropdownsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  dropdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayText: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyDayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fadedDayText: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 2,
  },
  dayCellCompleted: {
    backgroundColor: Colors.primary,
  },
  dayCellPlanned: {
    backgroundColor: '#E8E8E8',
  },
  dayCellSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dayText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  dayTextCompleted: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dayTextSelected: {
    fontWeight: 'bold',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  sessionDetailContainer: {
    marginTop: 24,
  },
  sessionDateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  workoutSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  playIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  sessionCardInfo: {
    flex: 1,
  },
  sessionCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  sessionCardSub: {
    fontSize: 13,
    color: '#64748B',
  },
});
