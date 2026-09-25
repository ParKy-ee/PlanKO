import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = 148;

export const ActivityScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mission } = useApp();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('Home');
    }
  };

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0084FF" />

      {/* 1. Standard Top Header (Same as Calendar & Profile) */}
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
          <MaterialIcons
            name="directions-run"
            size={24}
            color="#FFFFFF"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.headerTitle}>กิจกรรม</Text>
        </View>

        <View style={styles.headerPlaceholder} />
      </View>

      {/* Standard Curved background decoration */}
      <View style={styles.topCurveBg} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          เลือกดูเมนูการฝึกที่คุณต้องการเริ่มต้นในวันนี้
        </Text>

        <View style={styles.cardsList}>
          {/* CARD 1: ตามแผนการ (Planned Workout) */}
          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={handleStartPlannedWorkout}
          >
            <View style={styles.cardInner}>
              {/* Card 1 Svg Gradient & Fluid Waves */}
              <Svg
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
                style={StyleSheet.absoluteFillObject}
              >
                <Defs>
                  <SvgGradient id="blueCardGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#0077FE" />
                    <Stop offset="45%" stopColor="#1B88FE" />
                    <Stop offset="100%" stopColor="#00B4FE" />
                  </SvgGradient>
                </Defs>
                <Rect
                  x="0"
                  y="0"
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  rx="26"
                  ry="26"
                  fill="url(#blueCardGrad)"
                />
                {/* Fluid wave overlays in bottom right */}
                <Path
                  d={`M ${CARD_WIDTH * 0.35} ${CARD_HEIGHT} Q ${CARD_WIDTH * 0.65} ${CARD_HEIGHT * 0.25}, ${CARD_WIDTH} ${CARD_HEIGHT * 0.45} L ${CARD_WIDTH} ${CARD_HEIGHT} Z`}
                  fill="rgba(255, 255, 255, 0.12)"
                />
                <Path
                  d={`M ${CARD_WIDTH * 0.52} ${CARD_HEIGHT} Q ${CARD_WIDTH * 0.78} ${CARD_HEIGHT * 0.45}, ${CARD_WIDTH} ${CARD_HEIGHT * 0.7} L ${CARD_WIDTH} ${CARD_HEIGHT} Z`}
                  fill="rgba(255, 255, 255, 0.14)"
                />
                <Circle
                  cx={CARD_WIDTH - 25}
                  cy={CARD_HEIGHT * 0.65}
                  r={CARD_HEIGHT * 0.55}
                  fill="rgba(255, 255, 255, 0.05)"
                />
              </Svg>

              {/* Left: 3-Layer Glowing Orb with Dumbbell */}
              <View style={styles.iconOrbOuter}>
                <View style={styles.iconOrbMiddle}>
                  <View style={styles.iconOrbInner}>
                    <MaterialIcons
                      name="fitness-center"
                      size={34}
                      color="#FFFFFF"
                      style={styles.dumbbellInOrb}
                    />
                  </View>
                </View>
              </View>

              {/* Center: Title, Subtitle, Pill Badge */}
              <View style={styles.cardInfoCol}>
                <Text style={styles.cardHeading}>ตามแผนการ</Text>
                <Text style={styles.cardSubheading} numberOfLines={1}>
                  {mission ? mission.programName : 'สร้างแกนกลาง 7 วัน'}
                </Text>

                <View style={styles.pillBadge}>
                  <Ionicons
                    name="calendar-outline"
                    size={13}
                    color="#FFFFFF"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.pillBadgeText}>7 วัน • มีแผนชัดเจน</Text>
                </View>
              </View>

              {/* Right: Round White Chevron Action Button */}
              <View style={styles.arrowCircleButton}>
                <Ionicons name="chevron-forward" size={20} color="#0077FE" />
              </View>
            </View>
          </TouchableOpacity>

          {/* CARD 2: กำหนดเอง (Custom Workout) */}
          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={handleStartCustomWorkout}
          >
            <View style={styles.cardInner}>
              {/* Card 2 Svg Gradient & Fluid Waves */}
              <Svg
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
                style={StyleSheet.absoluteFillObject}
              >
                <Defs>
                  <SvgGradient id="purpleCardGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#6C5CE7" />
                    <Stop offset="50%" stopColor="#7E60FA" />
                    <Stop offset="100%" stopColor="#9E87FE" />
                  </SvgGradient>
                </Defs>
                <Rect
                  x="0"
                  y="0"
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  rx="26"
                  ry="26"
                  fill="url(#purpleCardGrad)"
                />
                {/* Fluid wave overlays in bottom right */}
                <Path
                  d={`M ${CARD_WIDTH * 0.35} ${CARD_HEIGHT} Q ${CARD_WIDTH * 0.65} ${CARD_HEIGHT * 0.25}, ${CARD_WIDTH} ${CARD_HEIGHT * 0.45} L ${CARD_WIDTH} ${CARD_HEIGHT} Z`}
                  fill="rgba(255, 255, 255, 0.12)"
                />
                <Path
                  d={`M ${CARD_WIDTH * 0.52} ${CARD_HEIGHT} Q ${CARD_WIDTH * 0.78} ${CARD_HEIGHT * 0.45}, ${CARD_WIDTH} ${CARD_HEIGHT * 0.7} L ${CARD_WIDTH} ${CARD_HEIGHT} Z`}
                  fill="rgba(255, 255, 255, 0.14)"
                />
                <Circle
                  cx={CARD_WIDTH - 25}
                  cy={CARD_HEIGHT * 0.65}
                  r={CARD_HEIGHT * 0.55}
                  fill="rgba(255, 255, 255, 0.05)"
                />
              </Svg>

              {/* Left: 3-Layer Glowing Orb with Settings Gear */}
              <View style={[styles.iconOrbOuter, styles.iconOrbPurple]}>
                <View style={[styles.iconOrbMiddle, styles.iconOrbMiddlePurple]}>
                  <View style={styles.iconOrbInner}>
                    <Ionicons name="settings" size={32} color="#FFFFFF" />
                  </View>
                </View>
              </View>

              {/* Center: Title, Subtitle, Pill Badge */}
              <View style={styles.cardInfoCol}>
                <Text style={styles.cardHeading}>กำหนดเอง</Text>
                <Text style={styles.cardSubheading} numberOfLines={1}>
                  ปรับแต่งเวลา ท่าฝึก และระดับความยาก
                </Text>

                <View style={styles.pillBadge}>
                  <Ionicons
                    name="options-outline"
                    size={13}
                    color="#FFFFFF"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.pillBadgeText}>อิสระในการฝึกของคุณ</Text>
                </View>
              </View>

              {/* Right: Round White Chevron Action Button */}
              <View style={styles.arrowCircleButton}>
                <Ionicons name="chevron-forward" size={20} color="#6C5CE7" />
              </View>
            </View>
          </TouchableOpacity>
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
    height: 40,
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
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsList: {
    marginTop: 2,
  },
  cardContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 26,
    marginBottom: 18,
    shadowColor: '#0077FE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  cardInner: {
    flex: 1,
    borderRadius: 26,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.38)',
  },
  /* 3-Layer Glowing Orb */
  iconOrbOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.38)',
    marginRight: 13,
  },
  iconOrbPurple: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  iconOrbMiddle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOrbMiddlePurple: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
  },
  iconOrbInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dumbbellInOrb: {
    transform: [{ rotate: '-28deg' }],
  },
  cardInfoCol: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 6,
  },
  cardHeading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  cardSubheading: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.94)',
    fontWeight: '500',
    marginBottom: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  pillBadgeText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
  },
  arrowCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
