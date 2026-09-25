import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Rect,
  Circle,
  Path,
} from 'react-native-svg';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../../components/common/CircularProgress';
import { Posture } from '../../types';
import {
  PostureIllustratedIcon,
  getPostureTheme,
} from '../../components/common/PostureIllustratedIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CALORIE_CARD_WIDTH = SCREEN_WIDTH - 32;

// Quest color themes matching Mockup Image 2
const QUEST_THEMES = [
  {
    id: 1,
    color: '#0077FE',
    lightBg: '#EBF4FE',
    icon: 'fitness-center',
    type: 'material',
  },
  {
    id: 2,
    color: '#00B4D8',
    lightBg: '#E6F8FB',
    icon: 'directions-run',
    type: 'material',
  },
  {
    id: 3,
    color: '#7E60FA',
    lightBg: '#F3EFFF',
    icon: 'fitness-center',
    type: 'material',
  },
  {
    id: 4,
    color: '#F59E0B',
    lightBg: '#FEF3C7',
    icon: 'flame',
    type: 'ionicon',
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mission, postures, quests, totalCalories } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [allQuestsModalVisible, setAllQuestsModalVisible] = useState<boolean>(false);

  // Calculate mission progress percentage
  const missionProgress =
    mission && mission.target > 0 ? mission.current / mission.target : 0.43;
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0084FF" />

      {/* 1. Header (Standard Blue Bar matching other screens) */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <MaterialIcons
            name="fitness-center"
            size={24}
            color="#FFFFFF"
            style={styles.logoIconRotate}
          />
          <Text style={styles.logoTitle}>PlankO</Text>
        </View>

        <TouchableOpacity
          style={styles.notificationBtn}
          activeOpacity={0.8}
          onPress={() =>
            Alert.alert(
              'การแจ้งเตือน',
              'วันนี้คุณมีแผนฝึกแพลงก์ตามตารางเวลา 18:00 น. อย่าลืมมาฝึกนะ!'
            )
          }
        >
          <Ionicons name="notifications-outline" size={20} color="#0084FF" />
          <View style={styles.notificationBadgeDot} />
        </TouchableOpacity>
      </View>

      {/* Curved background decoration matching other screens */}
      <View style={styles.topCurveBg} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Calorie Summary Card (Modern Gradient with Fluid Waves - Increased Height) */}
        <View style={styles.calorieCardContainer}>
          <Svg
            width={CALORIE_CARD_WIDTH}
            height={168}
            viewBox={`0 0 ${CALORIE_CARD_WIDTH} 168`}
            style={StyleSheet.absoluteFillObject}
          >
            <Defs>
              <SvgGradient id="homeCalorieGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#0072FF" />
                <Stop offset="50%" stopColor="#0099FE" />
                <Stop offset="100%" stopColor="#00C4FF" />
              </SvgGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={CALORIE_CARD_WIDTH}
              height={168}
              rx="26"
              ry="26"
              fill="url(#homeCalorieGrad)"
            />
            {/* Fluid wave overlays in background */}
            <Path
              d={`M ${CALORIE_CARD_WIDTH * 0.3} 168 Q ${CALORIE_CARD_WIDTH * 0.62} 25, ${CALORIE_CARD_WIDTH} 55 L ${CALORIE_CARD_WIDTH} 168 Z`}
              fill="rgba(255, 255, 255, 0.12)"
            />
            <Path
              d={`M ${CALORIE_CARD_WIDTH * 0.48} 168 Q ${CALORIE_CARD_WIDTH * 0.76} 50, ${CALORIE_CARD_WIDTH} 90 L ${CALORIE_CARD_WIDTH} 168 Z`}
              fill="rgba(255, 255, 255, 0.14)"
            />
            <Circle
              cx={CALORIE_CARD_WIDTH - 25}
              cy={84}
              r={70}
              fill="rgba(255, 255, 255, 0.06)"
            />
          </Svg>

          <View style={styles.calorieCardContent}>
            {/* Left: Glowing Flame Orb */}
            <View style={styles.flameOrbOuter}>
              <View style={styles.flameOrbInner}>
                <Ionicons name="flame" size={28} color="#FFFFFF" />
              </View>
            </View>

            {/* Center: Calorie Texts cleanly aligned without extra mini icons */}
            <View style={styles.calorieInfoCol}>
              <Text style={styles.calorieLabelTitle}>
                จำนวนแคลอรี่ที่เผาผลาญ
              </Text>
              <Text style={styles.calorieLabelSub}>รวม</Text>

              <View style={styles.calorieNumberRow}>
                <Text style={styles.calorieNumber}>
                  {totalCalories > 0 ? totalCalories : 135}
                </Text>
                <Text style={styles.calorieUnit}>Cal</Text>
              </View>
            </View>

            {/* Right: Progress Meter */}
            <View style={styles.calorieProgressWrapper}>
              <CircularProgress
                size={90}
                strokeWidth={7.5}
                progress={missionProgress}
                color="#FFFFFF"
                backgroundColor="rgba(255, 255, 255, 0.25)"
                centerText={`${missionPercentage}%`}
                textColor="#FFFFFF"
                fontSize={19}
              />
            </View>
          </View>
        </View>

        {/* 2. Progress / Quests Section (การพัฒนา - สูงสุด 4 รายการ) */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons
              name="target"
              size={22}
              color="#0084FF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.sectionTitle}>การพัฒนา</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => setAllQuestsModalVisible(true)}
          >
            <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
            <Ionicons
              name="chevron-forward"
              size={15}
              color="#0084FF"
              style={{ marginLeft: 2 }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.questListScroll}
        >
          {quests.slice(0, 4).map((quest, index) => {
            const theme = QUEST_THEMES[index % QUEST_THEMES.length];
            const qProgress =
              quest.targetValue > 0 ? quest.currentValue / quest.targetValue : 0.6;
            return (
              <TouchableOpacity
                key={quest.id}
                style={styles.questCard}
                activeOpacity={0.85}
                onPress={() => setAllQuestsModalVisible(true)}
              >
                {/* Glowing Circle Icon Container */}
                <View style={styles.questOrbOuter}>
                  <CircularProgress
                    size={54}
                    strokeWidth={4.5}
                    progress={qProgress}
                    color={theme.color}
                    backgroundColor="#EEF2F6"
                    centerText=""
                    textColor={theme.color}
                    fontSize={10}
                  />
                  <View
                    style={[
                      styles.questIconInside,
                      { backgroundColor: theme.lightBg },
                    ]}
                  >
                    {theme.type === 'ionicon' ? (
                      <Ionicons
                        name={theme.icon as any}
                        size={20}
                        color={theme.color}
                      />
                    ) : (
                      <MaterialIcons
                        name={theme.icon as any}
                        size={20}
                        color={theme.color}
                      />
                    )}
                  </View>
                </View>

                {/* Numbers */}
                <Text style={[styles.questValueText, { color: theme.color }]}>
                  {quest.currentValue}/{quest.targetValue}
                </Text>

                {/* Bottom Title & Chevron */}
                <View style={styles.questFooterRow}>
                  <Text style={styles.questTitle} numberOfLines={1}>
                    {quest.questName}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={12}
                    color={theme.color}
                    style={{ marginLeft: 2 }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 3. Posture Library Section (ข้อมูลท่า) */}
        <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="list"
              size={20}
              color="#0084FF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.sectionTitle}>ข้อมูลท่า</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('PostureList')}
          >
            <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
            <Ionicons
              name="chevron-forward"
              size={15}
              color="#0084FF"
              style={{ marginLeft: 2 }}
            />
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
                activeOpacity={0.75}
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

        {/* Posture Preview Cards (Illustrated posture icons) */}
        <View style={styles.postureCardsList}>
          {filteredPostures.slice(0, 5).map((posture: Posture) => {
            const theme = getPostureTheme(posture.id, posture.name);
            return (
              <TouchableOpacity
                key={posture.id}
                style={styles.postureCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('PostureDetail', { posture })}
              >
                {/* Posture Illustrated Icon Box */}
                <View style={[styles.postureIconWrapper, { backgroundColor: theme.bgColor }]}>
                  <PostureIllustratedIcon
                    postureId={posture.id}
                    postureName={posture.name}
                    size={42}
                  />
                </View>

                {/* Posture Content & Category Tags */}
                <View style={styles.postureInfo}>
                  <Text style={styles.postureName}>{posture.name}</Text>
                  <Text style={styles.postureDesc} numberOfLines={1}>
                    {posture.description}
                  </Text>

                  <View style={styles.postureTagsRow}>
                    <View style={styles.postureTagPill}>
                      <Text style={styles.postureTagText}>
                        {posture.postureCategory?.name || 'พื้นฐาน'}
                      </Text>
                    </View>
                    <View style={[styles.postureTagPill, styles.difficultyPill]}>
                      <Text style={[styles.postureTagText, styles.difficultyTagText]}>
                        {posture.id === 2
                          ? 'แขนและไหล่'
                          : posture.id === 5
                          ? 'แขนและไหล่'
                          : 'แกนกลางลำตัว'}
                      </Text>
                    </View>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#0084FF" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal แสดงรายการการพัฒนาทั้งหมด */}
      <Modal
        visible={allQuestsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAllQuestsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.allQuestsModalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalHeaderTitle}>การพัฒนาและเป้าหมาย</Text>
                <Text style={styles.modalHeaderSubtitle}>
                  เป้าหมายทั้งหมด ({quests.length} รายการ)
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setAllQuestsModalVisible(false)}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24, paddingTop: 6 }}
            >
              {quests.map((quest, index) => {
                const theme = QUEST_THEMES[index % QUEST_THEMES.length];
                const qProgress =
                  quest.targetValue > 0
                    ? Math.min(1, quest.currentValue / quest.targetValue)
                    : 0;
                const isCompleted = quest.currentValue >= quest.targetValue;
                const percent = Math.round(qProgress * 100);

                return (
                  <View key={quest.id} style={styles.allQuestItemCard}>
                    <View style={styles.allQuestItemTop}>
                      {/* Icon */}
                      <View
                        style={[
                          styles.allQuestIconBox,
                          { backgroundColor: theme.lightBg },
                        ]}
                      >
                        {theme.type === 'ionicon' ? (
                          <Ionicons
                            name={theme.icon as any}
                            size={22}
                            color={theme.color}
                          />
                        ) : (
                          <MaterialIcons
                            name={theme.icon as any}
                            size={22}
                            color={theme.color}
                          />
                        )}
                      </View>

                      {/* Info */}
                      <View style={{ flex: 1 }}>
                        <View style={styles.allQuestTitleRow}>
                          <Text style={styles.allQuestTitleText} numberOfLines={1}>
                            {quest.questName}
                          </Text>
                          {isCompleted ? (
                            <View style={styles.completedBadge}>
                              <Ionicons
                                name="checkmark-circle"
                                size={13}
                                color="#10B981"
                              />
                              <Text style={styles.completedBadgeText}>
                                สำเร็จ
                              </Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.categoryTagBadge,
                                { backgroundColor: theme.lightBg },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.categoryTagText,
                                  { color: theme.color },
                                ]}
                              >
                                {quest.categoryName || 'เป้าหมาย'}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.allQuestValueRow}>
                          <Text style={styles.allQuestCurrentValue}>
                            {quest.currentValue}{' '}
                            <Text style={styles.allQuestTargetValue}>
                              / {quest.targetValue} {quest.unit || ''}
                            </Text>
                          </Text>
                          <Text
                            style={[
                              styles.allQuestPercentText,
                              { color: theme.color },
                            ]}
                          >
                            {percent}%
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${percent}%`,
                            backgroundColor: theme.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#0084FF',
    zIndex: 10,
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
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  calorieCardContainer: {
    marginHorizontal: 16,
    height: 168,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#0072FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.38)',
  },
  calorieCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  flameOrbOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    marginRight: 14,
  },
  flameOrbInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calorieInfoCol: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 2,
  },
  calorieLabelTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  calorieLabelSub: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
    opacity: 0.95,
    lineHeight: 18,
  },
  calorieNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  calorieNumber: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  calorieUnit: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 5,
    opacity: 0.92,
  },
  calorieProgressWrapper: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInnerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  progressFlameIcon: {
    marginTop: 2,
    opacity: 0.85,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13.5,
    color: '#0084FF',
    fontWeight: '600',
  },
  questListScroll: {
    paddingHorizontal: 16,
  },
  questCard: {
    width: 124,
    height: 136,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8F1FC',
    marginRight: 10,
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  questOrbOuter: {
    position: 'relative',
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questIconInside: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questValueText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    marginTop: 8,
  },
  questFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  questTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    maxWidth: 90,
  },
  categoryPillsScroll: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryPill: {
    paddingHorizontal: 15,
    paddingVertical: 6.5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  categoryPillSelected: {
    borderColor: '#0084FF',
    backgroundColor: '#0084FF',
  },
  categoryPillText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  categoryPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  postureCardsList: {
    paddingHorizontal: 16,
  },
  postureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8F1FC',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  postureIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postureInfo: {
    flex: 1,
  },
  postureName: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  postureDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 6,
  },
  postureTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postureTagPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  postureTagText: {
    fontSize: 10,
    color: '#0284C7',
    fontWeight: '600',
  },
  difficultyPill: {
    backgroundColor: '#F1F5F9',
  },
  difficultyTagText: {
    color: '#475569',
  },
  // Quests Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  allQuestsModalContainer: {
    backgroundColor: '#EDF4FE',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '82%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalHeaderSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  allQuestItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F1FC',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  allQuestItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  allQuestIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  allQuestTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allQuestTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  completedBadgeText: {
    fontSize: 10.5,
    color: '#16A34A',
    fontWeight: '700',
    marginLeft: 3,
  },
  categoryTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  allQuestValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 4,
  },
  allQuestCurrentValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  allQuestTargetValue: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#94A3B8',
  },
  allQuestPercentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
});

