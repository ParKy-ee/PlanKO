import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';

type ReadyToPlayRouteProp = RouteProp<RootStackParamList, 'ReadyToPlay'>;
type ReadyToPlayNavProp = NativeStackNavigationProp<RootStackParamList, 'ReadyToPlay'>;

interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  durationSeconds: number;
  durationLabel: string;
  baseBpm: number;
  coverImage: any;
}

const AVAILABLE_TRACKS: TrackInfo[] = [
  {
    id: 'track-1',
    title: 'Skyline Pulse',
    artist: 'PlankO Originals',
    durationSeconds: 150,
    durationLabel: '2:30',
    baseBpm: 120,
    coverImage: require('../../../assets/tracks/skyline_pulse.png'),
  },
  {
    id: 'track-2',
    title: 'Neon Core',
    artist: 'Cyber Synth Beats',
    durationSeconds: 135,
    durationLabel: '2:15',
    baseBpm: 128,
    coverImage: require('../../../assets/tracks/neon_core.png'),
  },
  {
    id: 'track-3',
    title: 'Cyber Horizon',
    artist: 'Electro Rush',
    durationSeconds: 165,
    durationLabel: '2:45',
    baseBpm: 135,
    coverImage: require('../../../assets/tracks/cyber_horizon.png'),
  },
];

const AVAILABLE_POSTURES = [
  { id: 'forearm', name: 'Forearm Plank', desc: 'Standard Core Hold' },
  { id: 'straight_arm', name: 'Straight Arm Plank', desc: 'Upper Body & Core' },
  { id: 'side_plank', name: 'Side Plank', desc: 'Oblique Focus' },
];

export const ReadyToPlayScreen: React.FC = () => {
  const navigation = useNavigation<ReadyToPlayNavProp>();
  const route = useRoute<ReadyToPlayRouteProp>();

  // Lock to landscape while on this screen
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch((err) =>
      console.warn('Orientation lock error:', err)
    );

    return () => {
      // Revert when navigating away unless going into PlankWorkout (which is also landscape)
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    };
  }, []);

  // State
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo>(AVAILABLE_TRACKS[0]);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const [selectedPosture, setSelectedPosture] = useState(AVAILABLE_POSTURES[0]);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [isPostureModalOpen, setIsPostureModalOpen] = useState(false);

  // Audio Preview Simulator
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewElapsed, setPreviewElapsed] = useState(0);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Waveform animation values
  const waveformAnim = useRef(
    Array.from({ length: 18 }, () => new Animated.Value(0.4))
  ).current;

  // Animate waveforms while playing
  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    if (isPlayingPreview) {
      const createAnimations = () => {
        const anims = waveformAnim.map((val) => {
          const target = Math.random() * 0.7 + 0.3;
          return Animated.timing(val, {
            toValue: target,
            duration: 180 + Math.random() * 120,
            useNativeDriver: false,
          });
        });
        return Animated.parallel(anims);
      };

      const startWaveCycle = () => {
        animLoop = createAnimations();
        animLoop.start(({ finished }) => {
          if (finished && isPlayingPreview) {
            startWaveCycle();
          }
        });
      };
      startWaveCycle();

      // Preview counter
      previewTimerRef.current = setInterval(() => {
        setPreviewElapsed((prev) => {
          if (prev >= selectedTrack.durationSeconds) {
            setIsPlayingPreview(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (previewTimerRef.current) {
        clearInterval(previewTimerRef.current);
        previewTimerRef.current = null;
      }
      waveformAnim.forEach((val) => {
        Animated.timing(val, {
          toValue: 0.35,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
      if (animLoop) animLoop.stop();
    };
  }, [isPlayingPreview, selectedTrack]);

  const togglePreview = () => {
    setIsPlayingPreview((prev) => !prev);
  };

  const handleBack = () => {
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Activity' });
    }
  };

  const handleStartGame = () => {
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    navigation.navigate('PlankWorkout', {
      mode: route.params?.mode || 'planned',
      program: route.params?.program,
      durationPerPosture: selectedTrack.durationSeconds,
      restTime: route.params?.restTime || 10,
      levelIndex: route.params?.levelIndex || 0,
      trackTitle: selectedTrack.title,
      difficulty,
      bpm: currentBpm,
    });
  };

  // Star rating logic based on difficulty
  const getRatingInfo = () => {
    switch (difficulty) {
      case 'Easy':
        return { stars: 2, label: '2 / 5', bpmOffset: -10 };
      case 'Normal':
        return { stars: 3, label: '3 / 5', bpmOffset: 0 };
      case 'Hard':
        return { stars: 5, label: '5 / 5', bpmOffset: +15 };
    }
  };

  const ratingInfo = getRatingInfo();
  const currentBpm = selectedTrack.baseBpm + ratingInfo.bpmOffset;

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Base heights pattern for waveform bars
  const baseWaveHeights = [
    8, 14, 20, 26, 18, 30, 24, 32, 28, 30, 22, 28, 20, 26, 16, 22, 12, 8,
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0084FF" translucent={false} />

      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Image
            source={require('../../../assets/icons/ready_to_play/arrow_back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ready to Play</Text>
      </View>

      {/* Main Content Area */}
      <View style={styles.bodyContainer}>
        {/* LEFT COLUMN: Cover Art & Preview Player */}
        <View style={styles.leftColumn}>
          {/* Cover Art */}
          <View style={styles.coverWrapper}>
            <Image
              source={selectedTrack.coverImage}
              style={styles.coverImage}
              resizeMode="cover"
            />
          </View>

          {/* Preview Song Card */}
          <View style={styles.previewCard}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePreview}
              activeOpacity={0.8}
            >
              {isPlayingPreview ? (
                <Ionicons name="pause" size={20} color="#FFFFFF" />
              ) : (
                <Ionicons name="play" size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
              )}
            </TouchableOpacity>

            <View style={styles.previewInfo}>
              <Text style={styles.previewTitle}>Preview Song</Text>
              <Text style={styles.previewTimer}>
                {formatElapsed(previewElapsed)} / {selectedTrack.durationLabel}
              </Text>
            </View>

            {/* Waveform Visualizer */}
            <View style={styles.waveformContainer}>
              {waveformAnim.map((anim, idx) => {
                const baseH = baseWaveHeights[idx % baseWaveHeights.length];
                return (
                  <Animated.View
                    key={idx}
                    style={[
                      styles.waveBar,
                      {
                        height: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [6, baseH],
                        }),
                        backgroundColor: isPlayingPreview ? '#2F80ED' : '#90C2F9',
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>

        {/* RIGHT COLUMN: Track Info, Settings & Actions */}
        <View style={styles.rightCard}>
          {/* Header Info */}
          <View style={styles.trackHeaderRow}>
            <Text style={styles.selectedTrackLabel}>SELECTED TRACK</Text>
            <Text style={styles.trackTitleText} numberOfLines={1}>
              {selectedTrack.title}
            </Text>
            <Text style={styles.trackArtistText} numberOfLines={1}>
              {selectedTrack.artist}
            </Text>
          </View>

          {/* Difficulty Selection Pills */}
          <View style={styles.difficultyRow}>
            {(['Easy', 'Normal', 'Hard'] as const).map((diff) => {
              const isActive = difficulty === diff;
              return (
                <TouchableOpacity
                  key={diff}
                  style={[styles.diffButton, isActive && styles.diffButtonActive]}
                  onPress={() => setDifficulty(diff)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.diffButtonText, isActive && styles.diffButtonTextActive]}>
                    {diff}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Difficulty Stars */}
          <View style={styles.starsRow}>
            <Text style={styles.difficultyLabel}>Difficulty</Text>
            <View style={styles.starsGroup}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Image
                  key={i}
                  source={
                    i < ratingInfo.stars
                      ? require('../../../assets/icons/ready_to_play/star_filled.png')
                      : require('../../../assets/icons/ready_to_play/star_empty.png')
                  }
                  style={styles.starIcon}
                  resizeMode="contain"
                />
              ))}
            </View>
            <Text style={styles.ratingNumberText}>{ratingInfo.label}</Text>
          </View>

          {/* Stats Row (Duration | BPM | Posture) */}
          <View style={styles.statsRow}>
            {/* Duration */}
            <View style={styles.statItem}>
              <Image
                source={require('../../../assets/icons/ready_to_play/clock_blue.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <View style={styles.statTextCol}>
                <Text style={styles.statMainValue}>{selectedTrack.durationLabel}</Text>
                <Text style={styles.statSubLabel}>Duration</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            {/* BPM */}
            <View style={styles.statItem}>
              <Image
                source={require('../../../assets/icons/ready_to_play/metronome.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <View style={styles.statTextCol}>
                <Text style={styles.statMainValue}>{currentBpm}</Text>
                <Text style={styles.statSubLabel}>BPM</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            {/* Posture Pill */}
            <TouchableOpacity
              style={styles.posturePill}
              activeOpacity={0.8}
              onPress={() => setIsPostureModalOpen(true)}
            >
              <Image
                source={require('../../../assets/icons/ready_to_play/plank_figure.png')}
                style={styles.postureIcon}
                resizeMode="contain"
              />
              <View style={styles.postureTextCol}>
                <Text style={styles.postureTitle}>{selectedPosture.name}</Text>
                <Text style={styles.postureSubtitle}>Posture</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Connection Status Banner */}
          <View style={styles.connectionCard}>
            <View style={styles.connItem}>
              <Image
                source={require('../../../assets/icons/ready_to_play/check_circle.png')}
                style={styles.checkIcon}
                resizeMode="contain"
              />
              <Text style={styles.connText}>Smart Mat Connected</Text>
            </View>

            <View style={styles.connItem}>
              <Image
                source={require('../../../assets/icons/ready_to_play/check_circle.png')}
                style={styles.checkIcon}
                resizeMode="contain"
              />
              <Text style={styles.connText}>Wearables Connected</Text>
            </View>
          </View>

          {/* Info Hint */}
          <View style={styles.infoHintRow}>
            <Image
              source={require('../../../assets/icons/ready_to_play/info_circle.png')}
              style={styles.infoIcon}
              resizeMode="contain"
            />
            <Text style={styles.infoHintText}>Position yourself on the mat before starting.</Text>
          </View>

          {/* Bottom Action Buttons */}
          <View style={styles.actionButtonsRow}>
            {/* Change Song Button */}
            <TouchableOpacity
              style={styles.changeSongBtn}
              onPress={() => setIsSongModalOpen(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.changeSongBtnText}>Change Song</Text>
            </TouchableOpacity>

            {/* Start Game Button */}
            <TouchableOpacity
              style={styles.startGameBtn}
              onPress={handleStartGame}
              activeOpacity={0.85}
            >
              <Text style={styles.startGameBtnText}>Start Game</Text>
              <Image
                source={require('../../../assets/icons/ready_to_play/arrow_right.png')}
                style={styles.startArrowIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* CHANGE SONG MODAL */}
      <Modal
        visible={isSongModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSongModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Music Track</Text>
              <TouchableOpacity
                onPress={() => setIsSongModalOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.trackList}>
              {AVAILABLE_TRACKS.map((t) => {
                const isSelected = selectedTrack.id === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.trackItem, isSelected && styles.trackItemSelected]}
                    onPress={() => {
                      setSelectedTrack(t);
                      setPreviewElapsed(0);
                      setIsPlayingPreview(false);
                      setIsSongModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Image source={t.coverImage} style={styles.trackThumb} resizeMode="cover" />
                    <View style={styles.trackItemInfo}>
                      <Text style={styles.trackItemTitle}>{t.title}</Text>
                      <Text style={styles.trackItemArtist}>
                        {t.artist} • {t.durationLabel} • {t.baseBpm} BPM
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#0084FF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* SELECT POSTURE MODAL */}
      <Modal
        visible={isPostureModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPostureModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Plank Posture</Text>
              <TouchableOpacity
                onPress={() => setIsPostureModalOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.trackList}>
              {AVAILABLE_POSTURES.map((p) => {
                const isSelected = selectedPosture.id === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.trackItem, isSelected && styles.trackItemSelected]}
                    onPress={() => {
                      setSelectedPosture(p);
                      setIsPostureModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('../../../assets/icons/ready_to_play/plank_figure.png')}
                      style={[styles.trackThumb, { backgroundColor: '#EBF4FF' }]}
                      resizeMode="contain"
                    />
                    <View style={styles.trackItemInfo}>
                      <Text style={styles.trackItemTitle}>{p.name}</Text>
                      <Text style={styles.trackItemArtist}>{p.desc}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#0084FF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
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
    height: 48,
    backgroundColor: '#0084FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#EAF3FD',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 10,
  },

  /* Left Column */
  leftColumn: {
    width: '36%',
    flexDirection: 'column',
  },
  coverWrapper: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000000',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  previewInfo: {
    marginLeft: 8,
    marginRight: 6,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B1B36',
  },
  previewTimer: {
    fontSize: 10,
    color: '#708098',
    marginTop: 1,
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2.5,
    height: 28,
  },
  waveBar: {
    width: 2.5,
    borderRadius: 2,
  },

  /* Right Column */
  rightCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  trackHeaderRow: {
    marginBottom: 2,
  },
  selectedTrackLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7A93B2',
    letterSpacing: 0.8,
  },
  trackTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D1C38',
    marginTop: 1,
  },
  trackArtistText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6A7B95',
  },

  /* Difficulty Selector */
  difficultyRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 2,
  },
  diffButton: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D8E6F5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffButtonActive: {
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
  diffButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D1C38',
  },
  diffButtonTextActive: {
    color: '#FFFFFF',
  },

  /* Stars */
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  difficultyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A6B85',
    marginRight: 8,
  },
  starsGroup: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  ratingNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D2D44',
    marginLeft: 8,
  },

  /* Stats Row */
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FBFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6EFF9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginVertical: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 22,
    height: 22,
  },
  statTextCol: {
    flexDirection: 'column',
  },
  statMainValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D1C38',
  },
  statSubLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: '#7A8B9E',
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#D7E5F4',
    marginHorizontal: 10,
  },
  posturePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF3FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 6,
  },
  postureIcon: {
    width: 26,
    height: 18,
  },
  postureTextCol: {
    flexDirection: 'column',
  },
  postureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D1C38',
  },
  postureSubtitle: {
    fontSize: 9,
    fontWeight: '500',
    color: '#7A8B9E',
  },

  /* Connection Status */
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE8F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 1,
  },
  connItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkIcon: {
    width: 16,
    height: 16,
  },
  connText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D2D44',
  },

  /* Info Hint */
  infoHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 1,
  },
  infoIcon: {
    width: 14,
    height: 14,
  },
  infoHintText: {
    fontSize: 10,
    color: '#7487A3',
    fontWeight: '500',
  },

  /* Action Buttons */
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  changeSongBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.8,
    borderColor: '#0084FF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeSongBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0084FF',
  },
  startGameBtn: {
    flex: 1.3,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0084FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    elevation: 3,
    shadowColor: '#0084FF',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  startGameBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  startArrowIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '75%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3F8',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D1C38',
  },
  trackList: {
    marginTop: 4,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E7EFF7',
  },
  trackItemSelected: {
    backgroundColor: '#EAF3FF',
    borderColor: '#0084FF',
  },
  trackThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
  },
  trackItemInfo: {
    flex: 1,
  },
  trackItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D1C38',
  },
  trackItemArtist: {
    fontSize: 12,
    color: '#6A7B95',
    marginTop: 2,
  },
});
