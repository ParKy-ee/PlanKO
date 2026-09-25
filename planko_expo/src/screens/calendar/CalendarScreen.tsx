import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
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

const monthsFull = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const weekDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { history } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [yearPickerVisible, setYearPickerVisible] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const currentRealYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 16 }, (_, i) => currentRealYear - 6 + i);

  const handleSelectMonth = (monthIndex: number) => {
    setCurrentDate(new Date(year, monthIndex, 1));
    setSelectedDay(null);
    setMonthPickerVisible(false);
  };

  const handleSelectYear = (selectedYear: number) => {
    setCurrentDate(new Date(selectedYear, month, 1));
    setSelectedDay(null);
    setYearPickerVisible(false);
  };

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0).getDate();

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

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  const formatDateShort = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.getDate()}/${d.getMonth() + 1}/${(d.getFullYear() + 543).toString().slice(-2)}`;
    } catch {
      return isoString;
    }
  };

  // Find all workout sessions completed on the selected day
  const selectedHistoryItems = selectedDay
    ? history.filter((h) => {
        const hDate = new Date(h.createdAt);
        return (
          hDate.getFullYear() === selectedDay.getFullYear() &&
          hDate.getMonth() === selectedDay.getMonth() &&
          hDate.getDate() === selectedDay.getDate()
        );
      })
    : [];

  // Render grid items (exact 7 columns * 6 rows = 42 cells)
  const renderCalendarDays = () => {
    const cells = [];
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      const dayOffset = i - firstWeekday;
      const cellDate = new Date(year, month, 1 + dayOffset);

      // Previous Month Days
      if (i < firstWeekday) {
        const prevDayNum = prevMonthLastDay - (firstWeekday - 1 - i);
        cells.push(
          <View key={`prev-${i}`} style={styles.dayCellContainer}>
            <View style={styles.dayCellInactive}>
              <Text style={styles.fadedDayText}>{prevDayNum}</Text>
            </View>
          </View>
        );
        continue;
      }

      // Next Month Days
      if (i >= firstWeekday + daysInMonth) {
        const nextDayNum = i - (firstWeekday + daysInMonth) + 1;
        cells.push(
          <View key={`next-${i}`} style={styles.dayCellContainer}>
            <View style={styles.dayCellInactive}>
              <Text style={styles.fadedDayText}>{nextDayNum}</Text>
            </View>
          </View>
        );
        continue;
      }

      const dayNum = cellDate.getDate();

      // Check if this date has any workout history
      const hasWorkout = history.some((h) => {
        const hDate = new Date(h.createdAt);
        return (
          hDate.getFullYear() === cellDate.getFullYear() &&
          hDate.getMonth() === cellDate.getMonth() &&
          hDate.getDate() === cellDate.getDate()
        );
      });

      const isSelected =
        selectedDay &&
        selectedDay.getFullYear() === cellDate.getFullYear() &&
        selectedDay.getMonth() === cellDate.getMonth() &&
        selectedDay.getDate() === cellDate.getDate();

      cells.push(
        <View key={`cur-${i}`} style={styles.dayCellContainer}>
          <TouchableOpacity
            style={[
              styles.dayCell,
              hasWorkout && styles.dayCellWithActivity,
              !hasWorkout && isSelected && styles.dayCellSelectedNoActivity,
              hasWorkout && isSelected && styles.dayCellSelectedWithActivity,
            ]}
            activeOpacity={0.7}
            onPress={() => setSelectedDay(cellDate)}
          >
            <Text
              style={[
                styles.dayText,
                hasWorkout && styles.dayTextWhite,
                !hasWorkout && isSelected && styles.dayTextSelected,
              ]}
            >
              {dayNum}
            </Text>
            {hasWorkout && <View style={styles.activityDotWhite} />}
          </TouchableOpacity>
        </View>
      );
    }

    return cells;
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

        <View style={styles.headerTitleRow}>
          <Ionicons name="calendar-outline" size={22} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>ปฏิทิน</Text>
        </View>

        <View style={styles.headerPlaceholder} />
      </View>

      {/* Curved background decoration */}
      <View style={styles.topCurveBg} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Big Card */}
        <View style={styles.calendarCard}>
          {/* Calendar Month & Year Header */}
          <View style={styles.monthHeaderRow}>
            <TouchableOpacity
              onPress={handlePrevMonth}
              style={styles.navArrow}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color="#0084FF" />
            </TouchableOpacity>

            <View style={styles.dropdownsGroup}>
              <TouchableOpacity
                style={styles.dropdownBadge}
                activeOpacity={0.7}
                onPress={() => setMonthPickerVisible(true)}
              >
                <Text style={styles.dropdownText}>{monthsShort[month]}</Text>
                <Ionicons name="chevron-down" size={14} color="#0084FF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownBadge}
                activeOpacity={0.7}
                onPress={() => setYearPickerVisible(true)}
              >
                <Text style={styles.dropdownText}>{year + 543}</Text>
                <Ionicons name="chevron-down" size={14} color="#0084FF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleNextMonth}
              style={styles.navArrow}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={20} color="#0084FF" />
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

          {/* Legend Row */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0084FF' }]} />
              <Text style={styles.legendLabel}>มีกิจกรรม</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#D9EEFC' }]} />
              <Text style={styles.legendLabel}>ไม่มีการเพิ่มกิจกรรม</Text>
            </View>
          </View>
        </View>

        {/* 2. Activity Section (Always show header for selectedDay) */}
        {selectedDay && (
          <View style={styles.activitySection}>
            <View style={styles.activityHeaderRow}>
              <View style={styles.activityHeaderIcon}>
                <Ionicons name="calendar" size={22} color="#0084FF" />
              </View>
              <View>
                <Text style={styles.activityHeaderTitle}>กิจกรรมล่าสุด</Text>
                <Text style={styles.activityHeaderDate}>
                  วันที่ {selectedDay.getDate()} {monthsFull[selectedDay.getMonth()]} {selectedDay.getFullYear() + 543}
                </Text>
              </View>
            </View>

            {/* Show sessions if any exist on this day */}
            {selectedHistoryItems.length > 0 ? (
              selectedHistoryItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.workoutSessionCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    Alert.alert(
                      item.planName,
                      `แต้ม: ${item.score}\nเวลา: ${Math.round(item.duration / 60)} นาที\nแคลอรี่: ${item.kcal} Cal\nวันที่: ${formatDateShort(item.createdAt)}`
                    );
                  }}
                >
                  {/* Dumbbell Icon Badge */}
                  <View style={styles.sessionIconWrapper}>
                    <MaterialIcons name="fitness-center" size={26} color="#0084FF" />
                  </View>

                  {/* Session Info */}
                  <View style={styles.sessionCardInfo}>
                    <Text style={styles.sessionCardTitle} numberOfLines={1}>
                      {item.planName}
                    </Text>

                    <View style={styles.sessionStatRow}>
                      <Ionicons name="flame" size={14} color="#0084FF" style={{ marginRight: 3 }} />
                      <Text style={styles.sessionStatScore}>{item.score} แต้ม</Text>
                      <Text style={styles.sessionStatDot}>•</Text>
                      <Ionicons name="time-outline" size={14} color="#64748B" style={{ marginRight: 3 }} />
                      <Text style={styles.sessionStatDuration}>
                        {Math.round(item.duration / 60)} นาที ({item.kcal} Cal)
                      </Text>
                    </View>

                    <View style={styles.sessionDateRow}>
                      <Ionicons name="calendar-outline" size={12} color="#94A3B8" style={{ marginRight: 4 }} />
                      <Text style={styles.sessionDateText}>{formatDateShort(item.createdAt)}</Text>
                    </View>
                  </View>

                  {/* Chevron Arrow */}
                  <View style={styles.sessionChevronCircle}>
                    <Ionicons name="chevron-forward" size={16} color="#0084FF" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              /* Empty state placeholder when no activity exists */
              <View style={styles.noActivityCard}>
                <Ionicons name="calendar-outline" size={32} color="#94A3B8" />
                <Text style={styles.noActivityText}>ไม่มีกิจกรรมในวันนี้</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Month Picker Modal */}
      <Modal
        visible={monthPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMonthPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthPickerVisible(false)}
        >
          <View style={styles.pickerModalCard}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>เลือกเดือน</Text>
              <TouchableOpacity
                onPress={() => setMonthPickerVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.monthsGrid}>
              {monthsShort.map((m, idx) => {
                const isSelected = idx === month;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.monthGridItem,
                      isSelected && styles.pickerItemSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleSelectMonth(idx)}
                  >
                    <Text
                      style={[
                        styles.monthGridText,
                        isSelected && styles.pickerItemTextSelected,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={yearPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setYearPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setYearPickerVisible(false)}
        >
          <View style={styles.pickerModalCard}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>เลือกปี (พ.ศ.)</Text>
              <TouchableOpacity
                onPress={() => setYearPickerVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ maxHeight: 250 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.monthsGrid}>
                {availableYears.map((y) => {
                  const isSelected = y === year;
                  return (
                    <TouchableOpacity
                      key={y}
                      style={[
                        styles.monthGridItem,
                        isSelected && styles.pickerItemSelected,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => handleSelectYear(y)}
                    >
                      <Text
                        style={[
                          styles.monthGridText,
                          isSelected && styles.pickerItemTextSelected,
                        ]}
                      >
                        {y + 543}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerPlaceholder: {
    width: 40,
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E8F1FC',
    padding: 16,
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownsGroup: {
    flexDirection: 'row',
  },
  dropdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginHorizontal: 4,
  },
  dropdownText: {
    fontSize: 14,
    color: '#0284C7',
    fontWeight: 'bold',
    marginRight: 6,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
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
  dayCellContainer: {
    width: '14.28%',
    alignItems: 'center',
    marginVertical: 4,
  },
  dayCell: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellInactive: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellWithActivity: {
    backgroundColor: '#0084FF',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  dayCellSelectedWithActivity: {
    backgroundColor: '#0084FF',
    borderWidth: 2,
    borderColor: '#0284C7',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  dayCellSelectedNoActivity: {
    backgroundColor: '#E0F2FE',
    borderWidth: 2,
    borderColor: '#0084FF',
  },
  fadedDayText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '500',
  },
  dayText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  dayTextWhite: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dayTextSelected: {
    color: '#0084FF',
    fontWeight: 'bold',
  },
  activityDotWhite: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  activitySection: {
    marginTop: 18,
  },
  activityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  activityHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activityHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  activityHeaderDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  workoutSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8F1FC',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  sessionIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionCardInfo: {
    flex: 1,
  },
  sessionCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 3,
  },
  sessionStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  sessionStatScore: {
    fontSize: 13,
    color: '#0084FF',
    fontWeight: 'bold',
    marginRight: 4,
  },
  sessionStatDot: {
    color: '#94A3B8',
    marginRight: 4,
  },
  sessionStatDuration: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  sessionDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  sessionChevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EBF4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  noActivityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8F1FC',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  noActivityText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthGridItem: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  monthGridText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  yearsList: {
    paddingVertical: 4,
  },
  yearListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yearListText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  pickerItemSelected: {
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
  pickerItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
