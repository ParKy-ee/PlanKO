import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Rect,
  Path,
  Circle,
  G,
} from 'react-native-svg';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { mockPostures } from '../../mocks/mockPostures';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH - 40;
const CAROUSEL_HEIGHT = 210;

type PostureDetailRouteProp = RouteProp<RootStackParamList, 'PostureDetail'>;
type PostureDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PostureDetail'
>;

export const PostureDetailScreen: React.FC = () => {
  const route = useRoute<PostureDetailRouteProp>();
  const navigation = useNavigation<PostureDetailNavigationProp>();
  const { posture } = route.params;

  const [activeSlide, setActiveSlide] = useState(0);
  const [customImages, setCustomImages] = useState<any[] | null>(null);

  // Obtain posture images from custom upload, params, or mockPostures
  const baseImages =
    (posture.images && posture.images.length > 0)
      ? posture.images
      : (mockPostures.find((p) => p.id === posture.id || p.name === posture.name)?.images || null);

  const postureImages = customImages || baseImages;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  const handleStartSoloPosture = () => {
    navigation.navigate('PlankWorkout', {
      mode: 'custom',
      durationPerPosture: posture.targetDurationSeconds || 30,
      restTime: 10,
    });
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('ต้องการสิทธิ์การเข้าถึง', 'กรุณาอนุญาตให้แอปเข้าถึงคลังรูปภาพเพื่อเลือกรูปท่าฝึก');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.85,
      });

      if (!result.cancelled && 'uri' in result) {
        setCustomImages((prev) => (prev ? [...prev, { uri: result.uri }] : [{ uri: result.uri }]));
        Alert.alert('สำเร็จ', 'เพิ่มรูปภาพท่าฝึกของคุณเรียบร้อยแล้ว');
      }
    } catch (e) {
      console.log('Error picking posture image:', e);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x / CAROUSEL_WIDTH
    );
    if (slide !== activeSlide && slide >= 0 && slide < (postureImages?.length || 1)) {
      setActiveSlide(slide);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background SVG Waves and Gradients */}
      <Svg
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <SvgGradient id="detailScreenBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#D8EBFC" />
            <Stop offset="30%" stopColor="#E8F3FD" />
            <Stop offset="70%" stopColor="#F5FAFF" />
            <Stop offset="100%" stopColor="#E1F0FD" />
          </SvgGradient>

          <SvgGradient id="detailWaveTopGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#BADDFB" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#E2F1FE" stopOpacity="0.2" />
          </SvgGradient>

          <SvgGradient id="detailWaveBottomGrad" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0%" stopColor="#C6E3FB" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#D9ECFD" stopOpacity="0.3" />
          </SvgGradient>

          <SvgGradient id="detailBtnGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#2F95F6" />
            <Stop offset="50%" stopColor="#0080FF" />
            <Stop offset="100%" stopColor="#0066EE" />
          </SvgGradient>
        </Defs>

        {/* Base Background Fill */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#detailScreenBgGrad)" />

        {/* Top Organic Ambient Waves */}
        <Path
          d={`M -20 0 L ${SCREEN_WIDTH + 20} 0 L ${SCREEN_WIDTH + 20} 140 Q ${SCREEN_WIDTH * 0.7} 90, ${SCREEN_WIDTH * 0.35} 125 T -20 100 Z`}
          fill="url(#detailWaveTopGrad)"
        />
        <Path
          d={`M 0 0 L ${SCREEN_WIDTH} 0 L ${SCREEN_WIDTH} 80 Q ${SCREEN_WIDTH * 0.5} 130, 0 60 Z`}
          fill="rgba(255, 255, 255, 0.4)"
        />

        {/* Decorative Floating Bubbles */}
        <Circle cx={SCREEN_WIDTH * 0.85} cy={40} r={18} fill="rgba(255, 255, 255, 0.35)" />
        <Circle cx={SCREEN_WIDTH * 0.15} cy={120} r={10} fill="rgba(255, 255, 255, 0.4)" />

        {/* Bottom Organic Waves */}
        <Path
          d={`M -20 ${SCREEN_HEIGHT} L ${SCREEN_WIDTH + 20} ${SCREEN_HEIGHT} L ${SCREEN_WIDTH + 20} ${SCREEN_HEIGHT - 90} Q ${SCREEN_WIDTH * 0.6} ${SCREEN_HEIGHT - 40}, 0 ${SCREEN_HEIGHT - 80} Z`}
          fill="url(#detailWaveBottomGrad)"
        />
        <Path
          d={`M 0 ${SCREEN_HEIGHT} L ${SCREEN_WIDTH} ${SCREEN_HEIGHT} L ${SCREEN_WIDTH} ${SCREEN_HEIGHT - 45} Q ${SCREEN_WIDTH * 0.4} ${SCREEN_HEIGHT - 85}, 0 ${SCREEN_HEIGHT - 40} Z`}
          fill="rgba(255, 255, 255, 0.45)"
        />

        {/* Bottom Right Dot Matrix */}
        <G opacity={0.28}>
          {[0, 1, 2, 3].map((col) =>
            [0, 1, 2, 3].map((row) => (
              <Circle
                key={`detail-dot-${col}-${row}`}
                cx={SCREEN_WIDTH - 45 + col * 8}
                cy={SCREEN_HEIGHT - 95 + row * 8}
                r={2}
                fill="#0077E6"
              />
            ))
          )}
        </G>
      </Svg>

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backBtn}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>รายละเอียด</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Subtitle */}
          <View style={styles.titleSection}>
            <Text style={styles.postureName}>{posture.name}</Text>
            <Text style={styles.postureSubtitle}>อัปเดตรูปภาพและข้อมูลท่าของคุณ</Text>
          </View>

          {/* Visual Showcase: Swipeable Carousel OR Dashed Upload Card */}
          {postureImages && postureImages.length > 0 ? (
            <View style={styles.carouselContainer}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.carouselScrollView}
              >
                {postureImages.map((imgSrc: any, index: number) => (
                  <View key={`plank-slide-${index}`} style={styles.carouselSlide}>
                    <Image
                      source={imgSrc}
                      style={styles.carouselImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Pagination Indicators & Counter Badge */}
              <View style={styles.carouselOverlayFooter}>
                <View style={styles.dotsRow}>
                  {postureImages.map((_: any, idx: number) => (
                    <View
                      key={`dot-${idx}`}
                      style={[
                        styles.carouselDot,
                        activeSlide === idx && styles.carouselDotActive,
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.badgeIndicator}>
                  <Ionicons name="swap-horizontal" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.badgeText}>
                    {activeSlide + 1} / {postureImages.length}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadPlaceholderCard}
              onPress={handlePickImage}
              activeOpacity={0.85}
            >
              {/* 3D Image Icon Illustration */}
              <Svg width={72} height={72} viewBox="0 0 100 100" style={styles.uploadSvg}>
                <Defs>
                  <SvgGradient id="imgIconGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#38BDF8" />
                    <Stop offset="100%" stopColor="#0284C7" />
                  </SvgGradient>
                  <SvgGradient id="plusBadgeGrad2" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#38BDF8" />
                    <Stop offset="100%" stopColor="#0077E6" />
                  </SvgGradient>
                </Defs>

                {/* Blue Sparks */}
                <G fill="#38BDF8" opacity={0.85}>
                  <Path d="M 22 28 Q 22 31, 25 31 Q 22 31, 22 34 Q 22 31, 19 31 Q 22 31, 22 28 Z" />
                  <Path d="M 80 24 Q 80 27, 83 27 Q 80 27, 80 30 Q 80 27, 77 27 Q 80 27, 80 24 Z" />
                </G>

                {/* Outer Picture Frame */}
                <Rect
                  x="20"
                  y="20"
                  width="54"
                  height="44"
                  rx="10"
                  ry="10"
                  fill="#FFFFFF"
                  stroke="#0084FF"
                  strokeWidth="4"
                />

                {/* Sun / Orb */}
                <Circle cx="58" cy="34" r="4.5" fill="#7DD3FC" />

                {/* Mountains inside Frame */}
                <Path
                  d="M 24 58 L 38 42 L 52 56 L 60 48 L 70 58 Z"
                  fill="url(#imgIconGrad)"
                />

                {/* Plus (+) Badge in Bottom Right */}
                <Circle cx="68" cy="62" r="13" fill="url(#plusBadgeGrad2)" stroke="#FFFFFF" strokeWidth="3" />
                <Path
                  d="M 68 55 L 68 69 M 61 62 L 75 62"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </Svg>

              <Text style={styles.uploadPromptTitle}>แตะเพื่อเพิ่มรูปภาพ</Text>
              <Text style={styles.uploadPromptSubtitle}>รองรับไฟล์ JPG, PNG (ไม่เกิน 5MB)</Text>
            </TouchableOpacity>
          )}

          {/* 3 Detail Info Cards */}
          <View style={styles.cardsList}>
            {/* Card 1: ประเภท */}
            <View style={styles.infoCard}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="disc" size={22} color="#0084FF" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>ประเภท</Text>
                <Text style={styles.cardValue}>{posture.postureCategory?.name || 'ทั่วไป'}</Text>
              </View>
            </View>

            {/* Card 2: คำอธิบาย */}
            <View style={styles.infoCard}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="person" size={20} color="#0084FF" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>คำอธิบาย</Text>
                <Text style={styles.cardValue}>{posture.description}</Text>
              </View>
            </View>

            {/* Card 3: ช่วยด้าน */}
            <View style={styles.infoCard}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="barbell" size={20} color="#0084FF" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>ช่วยด้าน</Text>
                <Text style={styles.cardValue}>{posture.benefit}</Text>
              </View>
            </View>
          </View>

          {/* Quick Launch Workout Button */}
          <TouchableOpacity
            style={styles.startWorkoutButtonContainer}
            onPress={handleStartSoloPosture}
            activeOpacity={0.88}
          >
            <View style={styles.startWorkoutButtonGradient}>
              <Svg
                width={SCREEN_WIDTH - 40}
                height={52}
                style={StyleSheet.absoluteFillObject}
              >
                <Rect
                  x="0"
                  y="0"
                  width={SCREEN_WIDTH - 40}
                  height={52}
                  rx="26"
                  ry="26"
                  fill="url(#detailBtnGrad)"
                />
              </Svg>
              <View style={styles.startWorkoutButtonContent}>
                <Ionicons name="play" size={18} color="#FFFFFF" style={styles.playIcon} />
                <Text style={styles.startWorkoutButtonText}>
                  ฝึกท่านี้ตอนนี้ ({posture.targetDurationSeconds || 30} วิ)
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#FFFFFF" style={styles.chevronIcon} />
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF5FD',
  },
  safeArea: {
    flex: 1,
  },
  topHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7DB9F8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerPlaceholder: {
    width: 38,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  titleSection: {
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  postureName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  postureSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  carouselContainer: {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(219, 234, 254, 0.75)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 4,
  },
  carouselScrollView: {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
  },
  carouselSlide: {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
  },
  carouselOverlayFooter: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  carouselDotActive: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  badgeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  uploadPlaceholderCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  uploadSvg: {
    marginBottom: 6,
  },
  uploadPromptTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0084FF',
    marginTop: 4,
  },
  uploadPromptSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardsList: {
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(219, 234, 254, 0.75)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
  },
  startWorkoutButtonContainer: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: 2,
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  startWorkoutButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startWorkoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  playIcon: {
    marginRight: 8,
  },
  startWorkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  chevronIcon: {
    marginLeft: 8,
  },
});
