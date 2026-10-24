import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { Program } from '../../types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';

type MissionPlanScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MissionPlan'
>;

interface Props {
  navigation: MissionPlanScreenNavigationProp;
}

const dayNames: { [key: number]: string } = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};

// Custom Icons matching exact user-uploaded assets
const PlanDumbbellIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <Image
    source={require('../../../assets/icons/missions/dumbbell.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

const PlanFlameIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <Image
    source={require('../../../assets/icons/missions/flame.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

const PlanTrophyIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <Image
    source={require('../../../assets/icons/missions/trophy.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

const PlanReliefIcon: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <Image
    source={require('../../../assets/icons/missions/office_relief.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Illustrated Posture icons matching exact user artwork
const ForearmPlankIllustration: React.FC<{ width?: number; height?: number }> = ({
  width = 74,
  height = 38,
}) => (
  <Image
    source={require('../../../assets/icons/missions/forearm_plank.png')}
    style={{ width, height }}
    resizeMode="contain"
  />
);

const HighPlankIllustration: React.FC<{ width?: number; height?: number }> = ({
  width = 74,
  height = 42,
}) => (
  <Image
    source={require('../../../assets/icons/missions/high_plank.png')}
    style={{ width, height }}
    resizeMode="contain"
  />
);

const SidePlankIllustration: React.FC<{ width?: number; height?: number }> = ({
  width = 64,
  height = 48,
}) => (
  <Image
    source={require('../../../assets/icons/missions/side_plank.png')}
    style={{ width, height }}
    resizeMode="contain"
  />
);

const WEEK_DAYS = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 7, label: 'Sun' },
];

export const MissionPlanScreen: React.FC<Props> = ({ navigation }) => {
  const { programs, startMission } = useApp();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(
    programs[0] || null
  );
  const [modalProgram, setModalProgram] = useState<Program | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleOpenDetail = (program: Program) => {
    setSelectedProgram(program);
    setModalProgram(program);
    setModalVisible(true);
  };

  const handleStartMission = () => {
    if (!modalProgram) return;
    setModalVisible(false);
    setSuccessModalVisible(true);
  };

  const handleConfirmStart = () => {
    if (!modalProgram) return;
    startMission(modalProgram.id, modalProgram.period);
    setSuccessModalVisible(false);
    navigation.replace('MainTabs', { screen: 'Home' });
  };

  const handleBackToPlans = () => {
    setSuccessModalVisible(false);
  };

  const handleBack = () => {
    navigation.navigate('UserDetail');
  };

  const getProgramBadge = (prog: Program) => {
    if (prog.id === 1) {
      return { text: 'Beginner', bg: '#DBEAFE', color: '#0284C7' };
    }
    if (prog.id === 2) {
      return { text: 'Intermediate', bg: '#FEF3C7', color: '#D97706' };
    }
    if (prog.id === 3) {
      return { text: 'Advanced', bg: '#FEE2E2', color: '#E11D48' };
    }
    return { text: 'Daily', bg: '#F3E8FF', color: '#9333EA' };
  };

  const getTotalSessions = (prog: Program) => {
    return Math.round((prog.period / 7) * prog.workDays.length);
  };

  const getProgramIcon = (progId: number) => {
    switch (progId) {
      case 1:
        return <PlanDumbbellIcon size={34} />;
      case 2:
        return <PlanFlameIcon size={34} />;
      case 3:
        return <PlanTrophyIcon size={34} />;
      case 4:
      default:
        return <PlanReliefIcon size={38} />;
    }
  };

  const getModalHeroIcon = (prog: Program) => {
    switch (prog.id) {
      case 1:
        return <PlanDumbbellIcon size={44} />;
      case 2:
        return <PlanFlameIcon size={44} />;
      case 3:
        return <PlanTrophyIcon size={44} />;
      case 4:
      default:
        return <PlanReliefIcon size={46} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0080FF" />

      {/* Top App Header with Back Btn & PlankO Logo */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.logoRow}>
          <MaterialIcons
            name="fitness-center"
            size={24}
            color="#FFFFFF"
            style={styles.logoIconRotate}
          />
          <Text style={styles.logoTitle}>PlankO</Text>
        </View>

        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content Area */}
      <View style={styles.contentWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Indicator */}
          <View style={styles.stepIndicatorRow}>
            <View style={[styles.stepBar, styles.stepBarActive]} />
            <View style={[styles.stepBar, styles.stepBarActive]} />
            <View style={[styles.stepBar, styles.stepBarInactive]} />
          </View>
          <Text style={styles.stepText}>Step 2 of 3</Text>

          {/* Header Title Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Select Mission Plan</Text>
            <Text style={styles.subtitle}>
              Choose a plan that fits your goals and fitness level.
            </Text>
          </View>

          {/* Program Cards List */}
          <View style={styles.listContainer}>
            {programs.map((prog) => {
              const badge = getProgramBadge(prog);
              const isSelected = selectedProgram?.id === prog.id;

              return (
                <TouchableOpacity
                  key={prog.id}
                  style={[
                    styles.programCard,
                    isSelected && styles.programCardSelected,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => handleOpenDetail(prog)}
                >
                  {/* Left Illustrated Box */}
                  <View style={styles.iconBox}>
                    {getProgramIcon(prog.id)}
                  </View>

                  {/* Middle Details */}
                  <View style={styles.cardInfo}>
                    <Text style={styles.programName}>{prog.programName}</Text>

                    <View style={styles.metaRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={15}
                        color="#0080FF"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.periodText}>{prog.period} days</Text>

                      <View style={styles.verticalDivider} />

                      <View
                        style={[
                          styles.badgePill,
                          { backgroundColor: badge.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            { color: badge.color },
                          ]}
                        >
                          {badge.text}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.programType}>{prog.programType}</Text>
                  </View>

                  {/* Right Chevron */}
                  <Ionicons name="chevron-forward" size={18} color="#0080FF" />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer Guide Note */}
          <View style={styles.footerNoteRow}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#0080FF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.footerNoteText}>
              Tap a plan to explore the details.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Program Detail Modal Matching Image 2 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalProgram && (
              <>
                {/* Header Row: Illustrated Box + Info */}
                <View style={styles.modalTopRow}>
                  <View style={styles.modalHeroIconBox}>
                    {getModalHeroIcon(modalProgram)}
                  </View>

                  <View style={styles.modalHeroInfo}>
                    <View style={styles.modalBadgeAndCloseRow}>
                      <View
                        style={[
                          styles.modalBadgePill,
                          { backgroundColor: getProgramBadge(modalProgram).bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.modalBadgeText,
                            { color: getProgramBadge(modalProgram).color },
                          ]}
                        >
                          {getProgramBadge(modalProgram).text.toUpperCase()}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.closeBtn}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
                        <Ionicons name="close" size={22} color="#64748B" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.modalHeroTitle}>
                      {modalProgram.programName}
                    </Text>
                    <Text style={styles.modalHeroSubtitle}>
                      {modalProgram.id === 1
                        ? 'Build core strength and practice proper plank posture.'
                        : modalProgram.description}
                    </Text>
                  </View>
                </View>

                {/* Duration & Total Workouts Stats Card */}
                <View style={styles.modalStatsCard}>
                  <View style={styles.statCol}>
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#0080FF"
                      style={styles.statIcon}
                    />
                    <View>
                      <Text style={styles.statValue}>{modalProgram.period} days</Text>
                      <Text style={styles.statLabel}>Duration</Text>
                    </View>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statCol}>
                    <Ionicons
                      name="barbell-outline"
                      size={24}
                      color="#0080FF"
                      style={[styles.statIcon, { transform: [{ rotate: '-35deg' }] }]}
                    />
                    <View>
                      <Text style={styles.statValue}>
                        {getTotalSessions(modalProgram)} sessions
                      </Text>
                      <Text style={styles.statLabel}>Total workouts</Text>
                    </View>
                  </View>
                </View>

                {/* Weekly Schedule */}
                <Text style={styles.sectionHeading}>Weekly Schedule</Text>
                <View style={styles.scheduleDaysRow}>
                  {WEEK_DAYS.map((day) => {
                    const isWorkout = modalProgram.workDays.includes(day.id);
                    return (
                      <View
                        key={day.id}
                        style={[
                          styles.dayPill,
                          isWorkout ? styles.dayPillWorkout : styles.dayPillRest,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayPillText,
                            isWorkout ? styles.dayTextWorkout : styles.dayTextRest,
                          ]}
                        >
                          {day.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Legend */}
                <View style={styles.scheduleLegendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#0080FF' }]} />
                    <Text style={styles.legendLabel}>Workout</Text>
                  </View>
                  <View style={[styles.legendItem, { marginLeft: 16 }]}>
                    <View style={[styles.legendDot, { backgroundColor: '#94A3B8' }]} />
                    <Text style={styles.legendLabel}>Rest</Text>
                  </View>
                </View>

                {/* Sample Postures */}
                <Text style={styles.sectionHeading}>Sample Postures</Text>
                <View style={styles.samplePosturesRow}>
                  <View style={styles.postureCard}>
                    <View style={styles.postureIconBox}>
                      <ForearmPlankIllustration />
                    </View>
                    <Text style={styles.postureName}>Forearm Plank</Text>
                  </View>

                  <View style={styles.postureCard}>
                    <View style={styles.postureIconBox}>
                      <HighPlankIllustration />
                    </View>
                    <Text style={styles.postureName}>High Plank</Text>
                  </View>

                  <View style={styles.postureCard}>
                    <View style={styles.postureIconBox}>
                      <SidePlankIllustration />
                    </View>
                    <Text style={styles.postureName}>Side Plank</Text>
                  </View>
                </View>

                {/* Subtle Divider */}
                <View style={styles.modalDivider} />

                {/* Start Button */}
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStartMission}
                  activeOpacity={0.88}
                >
                  <Text style={styles.startButtonText}>Start This Mission</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 2. Success "You're All Set!" Modal matching Image 2 */}
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleBackToPlans}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalCard}>
            {/* Sparkle Checkmark Icon */}
            <Image
              source={require('../../../assets/icons/success_sparkle.png')}
              style={styles.successSparkleIcon}
              resizeMode="contain"
            />

            {/* Title & Subtitle */}
            <Text style={styles.successTitle}>You’re All Set!</Text>
            <Text style={styles.successSubtitle}>
              Your mission is ready. Let’s get started!
            </Text>

            {/* Selected Plan Details Card */}
            {modalProgram && (
              <View style={styles.selectedPlanCard}>
                <View style={styles.selectedPlanIconBox}>
                  {getProgramIcon(modalProgram.id)}
                </View>
                <View style={styles.selectedPlanInfo}>
                  <View style={styles.selectedPlanBadge}>
                    <Text style={styles.selectedPlanBadgeText}>SELECTED PLAN</Text>
                  </View>
                  <Text style={styles.selectedPlanTitle}>
                    {modalProgram.programName}
                  </Text>
                  <View style={styles.selectedPlanMetaRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color="#0080FF"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.selectedPlanMetaText}>
                      {modalProgram.period} days
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Start Training Primary Button */}
            <TouchableOpacity
              style={styles.confirmStartButton}
              onPress={handleConfirmStart}
              activeOpacity={0.88}
            >
              <Text style={styles.confirmStartText}>Start Training</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>

            {/* Back to Plans Secondary Button (ย้อนไปก่อนหน้า ไม่ใช่หน้าแรก) */}
            <TouchableOpacity
              style={styles.backToPlansButton}
              onPress={handleBackToPlans}
              activeOpacity={0.7}
            >
              <Text style={styles.backToPlansText}>Back to Plans</Text>
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
    backgroundColor: '#0080FF',
  },
  topHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#0080FF',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconRotate: {
    transform: [{ rotate: '-25deg' }],
    marginRight: 8,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerPlaceholder: {
    width: 42,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F0F6FD',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBar: {
    width: 40,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  stepBarActive: {
    backgroundColor: '#0080FF',
  },
  stepBarInactive: {
    backgroundColor: '#D1E3F6',
  },
  stepText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 10,
  },
  headerSection: {
    marginTop: 14,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 6,
    lineHeight: 20,
  },
  listContainer: {
    marginBottom: 16,
  },
  programCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EDF4FC',
    shadowColor: '#004080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  programCardSelected: {
    borderColor: '#0080FF',
    borderWidth: 1.5,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#EDF5FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  programName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0080FF',
  },
  verticalDivider: {
    width: 1,
    height: 13,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  programType: {
    fontSize: 13,
    color: '#94A3B8',
  },
  footerNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  footerNoteText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalHeroIconBox: {
    width: 74,
    height: 74,
    borderRadius: 18,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  modalHeroInfo: {
    flex: 1,
  },
  modalBadgeAndCloseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBadgePill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  modalBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  closeBtn: {
    padding: 4,
  },
  modalHeroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
    marginTop: 5,
    letterSpacing: -0.3,
  },
  modalHeroSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 17,
    marginTop: 3,
  },
  modalStatsCard: {
    backgroundColor: '#F1F7FD',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 10,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#DBEAFE',
    marginHorizontal: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  scheduleDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPill: {
    flex: 1,
    height: 36,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  dayPillWorkout: {
    backgroundColor: '#E0F2FE',
  },
  dayPillRest: {
    backgroundColor: '#F1F5F9',
  },
  dayPillText: {
    fontSize: 12,
  },
  dayTextWorkout: {
    color: '#0284C7',
    fontWeight: '700',
  },
  dayTextRest: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  scheduleLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  samplePosturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postureCard: {
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  postureIconBox: {
    width: '100%',
    height: 64,
    borderRadius: 14,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postureName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 6,
    textAlign: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 18,
    marginBottom: 16,
  },
  startButton: {
    height: 50,
    backgroundColor: '#0080FF',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  successSparkleIcon: {
    width: 140,
    height: 96,
  },
  successTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedPlanCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2F0FD',
  },
  selectedPlanIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#E0F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  selectedPlanInfo: {
    flex: 1,
  },
  selectedPlanBadge: {
    backgroundColor: '#D7ECFC',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  selectedPlanBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  selectedPlanTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
    letterSpacing: -0.2,
  },
  selectedPlanMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  selectedPlanMetaText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  confirmStartButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0080FF',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmStartText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backToPlansButton: {
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backToPlansText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0080FF',
  },
});
