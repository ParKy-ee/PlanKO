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
  TextInput,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
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
  baseDifficultyStars: number;
  coverImage: any;
}

// Custom SVG Icons matching exact mockup 2 & 3
const ModalSearchIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 17,
  color = '#708098',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10" cy="10" r="6.5" stroke={color} strokeWidth="2.5" />
    <Path d="M15 15L20.5 20.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const ModalListIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = '#0084FF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2.5" y="4" width="19" height="3.2" rx="1.6" fill={color} />
    <Rect x="2.5" y="10.4" width="19" height="3.2" rx="1.6" fill={color} />
    <Rect x="2.5" y="16.8" width="19" height="3.2" rx="1.6" fill={color} />
  </Svg>
);

const ModalGridIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = '#0084FF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2.5" y="2.5" width="8.2" height="8.2" rx="2.5" fill={color} />
    <Rect x="13.3" y="2.5" width="8.2" height="8.2" rx="2.5" fill={color} />
    <Rect x="2.5" y="13.3" width="8.2" height="8.2" rx="2.5" fill={color} />
    <Rect x="13.3" y="13.3" width="8.2" height="8.2" rx="2.5" fill={color} />
  </Svg>
);

const ModalCloseIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 18,
  color = '#708098',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5.5 5.5L18.5 18.5M5.5 18.5L18.5 5.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
  </Svg>
);

const ModalPlayCircleIcon: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="13" fill="#EFF4FA" stroke="#D7E6F7" strokeWidth="1" />
    <Path d="M12 9.5L18.5 14L12 18.5V9.5Z" fill="#607593" />
  </Svg>
);

const ModalCheckCircleIcon: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
    <Circle cx="13" cy="13" r="13" fill="#0084FF" />
    <Path
      d="M8 13.2L11.5 16.7L18.5 9.7"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AVAILABLE_TRACKS: TrackInfo[] = [
  {
    id: 'track-1',
    title: 'Skyline Pulse',
    artist: 'PlankO Originals',
    durationSeconds: 150,
    durationLabel: '2:30',
    baseBpm: 120,
    baseDifficultyStars: 3.5,
    coverImage: require('../../../assets/tracks/skyline_pulse.png'),
  },
  {
    id: 'track-2',
    title: 'Neon Core',
    artist: 'Cyber Synth Beats',
    durationSeconds: 135,
    durationLabel: '2:15',
    baseBpm: 128,
    baseDifficultyStars: 4.0,
    coverImage: require('../../../assets/tracks/neon_core.png'),
  },
  {
    id: 'track-3',
    title: 'Cyber Horizon',
    artist: 'PlankO Originals',
    durationSeconds: 165,
    durationLabel: '2:45',
    baseBpm: 110,
    baseDifficultyStars: 3.0,
    coverImage: require('../../../assets/tracks/cyber_horizon.png'),
  },
  {
    id: 'track-4',
    title: 'Ocean Drive',
    artist: 'Tidal Rhythm',
    durationSeconds: 180,
    durationLabel: '3:00',
    baseBpm: 100,
    baseDifficultyStars: 2.5,
    coverImage: require('../../../assets/tracks/ocean_drive.png'),
  },
  {
    id: 'track-5',
    title: 'Starlight Run',
    artist: 'Nova Beats',
    durationSeconds: 140,
    durationLabel: '2:20',
    baseBpm: 132,
    baseDifficultyStars: 4.5,
    coverImage: require('../../../assets/tracks/starlight_run.png'),
  },
  {
    id: 'track-6',
    title: 'Electric Flow',
    artist: 'PlankO Originals',
    durationSeconds: 160,
    durationLabel: '2:40',
    baseBpm: 125,
    baseDifficultyStars: 3.5,
    coverImage: require('../../../assets/tracks/electric_flow.png'),
  },
  {
    id: 'track-7',
    title: 'Calm Motion',
    artist: 'Zen Wave',
    durationSeconds: 190,
    durationLabel: '3:10',
    baseBpm: 90,
    baseDifficultyStars: 2.0,
    coverImage: require('../../../assets/tracks/calm_motion.png'),
  },
  {
    id: 'track-8',
    title: 'Midnight Beat',
    artist: 'Urban Pulse',
    durationSeconds: 170,
    durationLabel: '2:50',
    baseBpm: 118,
    baseDifficultyStars: 3.0,
    coverImage: require('../../../assets/tracks/midnight_beat.png'),
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
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;

  // Compute a safe, landscape-optimized modal card height
  const songModalCardHeight = Math.min(
    Math.max(windowHeight - Math.max(insets.top, 8) - Math.max(insets.bottom, 12) - 16, 260),
    315
  );

  // State
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo>(AVAILABLE_TRACKS[0]);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>(() => {
    if (route.params?.levelIndex !== undefined) {
      if (route.params.levelIndex === 0) return 'Easy';
      if (route.params.levelIndex === 1) return 'Normal';
      if (route.params.levelIndex >= 2) return 'Hard';
    }
    return 'Normal';
  });

  const allPostures = React.useMemo(() => {
    if (
      route.params?.posture &&
      !AVAILABLE_POSTURES.some(
        (ap) =>
          ap.name.toLowerCase() === route.params!.posture!.name.toLowerCase() ||
          ap.id === String(route.params!.posture!.id)
      )
    ) {
      return [
        {
          id: String(route.params.posture.id),
          name: route.params.posture.name,
          desc: route.params.posture.description || 'Target Posture Hold',
        },
        ...AVAILABLE_POSTURES,
      ];
    }
    return AVAILABLE_POSTURES;
  }, [route.params?.posture]);

  const [selectedPosture, setSelectedPosture] = useState(() => {
    if (route.params?.posture) {
      const p = route.params.posture;
      const found = AVAILABLE_POSTURES.find(
        (ap) =>
          ap.name.toLowerCase().includes(p.name.toLowerCase()) ||
          p.name.toLowerCase().includes(ap.name.toLowerCase()) ||
          ap.id === String(p.id)
      );
      if (found) return found;
      return { id: String(p.id), name: p.name, desc: p.description || 'Target Posture Hold' };
    }
    return AVAILABLE_POSTURES[0];
  });
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [songModalViewMode, setSongModalViewMode] = useState<'list' | 'grid'>('list');
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [tempSelectedTrack, setTempSelectedTrack] = useState<TrackInfo>(AVAILABLE_TRACKS[0]);
  const [isPostureModalOpen, setIsPostureModalOpen] = useState(false);

  // Filtered tracks for the song modal
  const filteredTracks = AVAILABLE_TRACKS.filter((t) => {
    if (!songSearchQuery || songSearchQuery.trim() === '') return true;
    const q = songSearchQuery.toLowerCase().trim();
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q);
  });

  // Audio Preview Simulator
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewElapsed, setPreviewElapsed] = useState(0);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Waveform animation values (28 bars to fill slot nicely)
  const waveformAnim = useRef(
    Array.from({ length: 28 }, () => new Animated.Value(0.4))
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

  const handleBack = React.useCallback(() => {
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Activity' });
    }
  }, [navigation]);

  // Lock to landscape whenever this screen is focused (handles returning from other screens)
  useFocusEffect(
    React.useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch((err) =>
        console.warn('Orientation lock error:', err)
      );

      const onBackPress = () => {
        handleBack();
        return true;
      };

      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        sub.remove();
      };
    }, [handleBack])
  );

  // Active orientation guard: if screen reports portrait, immediately re-request landscape lock
  useEffect(() => {
    if (!isLandscape) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});
    }
  }, [isLandscape]);

  const effectiveDurationSeconds =
    route.params?.durationPerPosture || selectedTrack.durationSeconds;
  const effectiveDurationLabel = route.params?.durationPerPosture
    ? `${route.params.durationPerPosture}s`
    : selectedTrack.durationLabel;

  const handleStartGame = () => {
    if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    const chosenLevel = difficulty === 'Easy' ? 0 : difficulty === 'Normal' ? 1 : 2;
    navigation.navigate('PlankWorkout', {
      mode: route.params?.mode || 'planned',
      program: route.params?.program,
      durationPerPosture: effectiveDurationSeconds,
      restTime: route.params?.restTime || 10,
      levelIndex: route.params?.levelIndex !== undefined ? route.params.levelIndex : chosenLevel,
      trackTitle: selectedTrack.title,
      difficulty,
      bpm: currentBpm,
    });
  };

  // Half-star rating logic (progresses in 0.5 step increments)
  const calculateDefaultRating = (track: TrackInfo, diff: 'Easy' | 'Normal' | 'Hard') => {
    const base = track.baseDifficultyStars || 3.5;
    if (diff === 'Easy') return Math.max(1.5, base - 1.0);
    if (diff === 'Normal') return base;
    return Math.min(5.0, base + 1.0);
  };

  const [starRating, setStarRating] = useState<number>(() => {
    const initialDiff =
      route.params?.levelIndex !== undefined
        ? route.params.levelIndex === 0
          ? 'Easy'
          : route.params.levelIndex === 1
          ? 'Normal'
          : 'Hard'
        : 'Normal';
    return calculateDefaultRating(AVAILABLE_TRACKS[0], initialDiff);
  });

  const handleSelectDifficulty = (diff: 'Easy' | 'Normal' | 'Hard') => {
    setDifficulty(diff);
    setStarRating(calculateDefaultRating(selectedTrack, diff));
  };

  useEffect(() => {
    setStarRating(calculateDefaultRating(selectedTrack, difficulty));
  }, [selectedTrack]);

  const handleStarPress = (index: number) => {
    const halfVal = index + 0.5;
    const fullVal = index + 1.0;

    let nextVal: number;
    if (starRating === halfVal) {
      nextVal = fullVal;
    } else if (starRating === fullVal) {
      nextVal = halfVal;
    } else {
      nextVal = halfVal;
    }

    setStarRating(nextVal);

    if (nextVal <= 2.5) {
      setDifficulty('Easy');
    } else if (nextVal <= 3.5) {
      setDifficulty('Normal');
    } else {
      setDifficulty('Hard');
    }
  };

  const bpmOffset = Math.round((starRating - (selectedTrack.baseDifficultyStars || 3.5)) * 10);
  const currentBpm = selectedTrack.baseBpm + bpmOffset;
  const ratingLabel = `${starRating.toFixed(1).replace('.0', '')} / 5`;

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Base heights pattern for waveform bars
  const baseWaveHeights = [
    6, 12, 18, 24, 16, 22, 28, 20, 26, 30, 22, 28, 18, 24, 20, 26, 18, 24, 28, 20, 26, 18, 22, 16, 14, 12, 8, 6,
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
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
      <View style={[styles.bodyContainer, !isLandscape && styles.bodyContainerPortrait]}>
        {/* LEFT COLUMN: Cover Art & Preview Player */}
        <View style={[styles.leftColumn, !isLandscape && styles.leftColumnPortrait]}>
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
                  onPress={() => handleSelectDifficulty(diff)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.diffButtonText, isActive && styles.diffButtonTextActive]}>
                    {diff}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Difficulty Stars (Increasing by half star 0.5) */}
          <View style={styles.starsRow}>
            <Text style={styles.difficultyLabel}>Difficulty</Text>
            <View style={styles.starsGroup}>
              {Array.from({ length: 5 }).map((_, i) => {
                const starSource =
                  i + 1 <= starRating
                    ? require('../../../assets/icons/ready_to_play/star_filled.png')
                    : i + 0.5 <= starRating
                    ? require('../../../assets/icons/ready_to_play/star_half.png')
                    : require('../../../assets/icons/ready_to_play/star_empty.png');

                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => handleStarPress(i)}
                    hitSlop={{ top: 8, bottom: 8, left: 3, right: 3 }}
                  >
                    <Image
                      source={starSource}
                      style={styles.starIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.ratingNumberText}>{ratingLabel}</Text>
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
                <Text style={styles.statMainValue}>{effectiveDurationLabel}</Text>
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
                <Text style={styles.postureTitle} numberOfLines={1} ellipsizeMode="tail">
                  {selectedPosture.name}
                </Text>
                <Text style={styles.postureSubtitle} numberOfLines={1}>
                  Posture
                </Text>
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
              <Text style={styles.connText} numberOfLines={1}>
                Smart Mat Connected
              </Text>
            </View>

            <View style={styles.connItem}>
              <Image
                source={require('../../../assets/icons/ready_to_play/check_circle.png')}
                style={styles.checkIcon}
                resizeMode="contain"
              />
              <Text style={styles.connText} numberOfLines={1}>
                Wearables Connected
              </Text>
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
              onPress={() => {
                setTempSelectedTrack(selectedTrack);
                setSongSearchQuery('');
                setIsSongModalOpen(true);
              }}
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

      {/* CHANGE SONG MODAL (REDESIGNED MATCHING MOCKUP 4 & 5) */}
      <Modal
        visible={isSongModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSongModalOpen(false)}
        statusBarTranslucent={true}
      >
        <View
          style={[
            styles.songModalOverlay,
            {
              paddingTop: Math.max(insets.top, 8),
              paddingBottom: Math.max(insets.bottom, 12),
              paddingLeft: Math.max(insets.left, 16),
              paddingRight: Math.max(insets.right, 16),
            },
          ]}
        >
          <View style={[styles.songModalCard, { height: songModalCardHeight }]}>
            {/* Top Header: Title + Track Count Badge + Close Icon */}
            <View style={styles.songModalHeader}>
              <View style={styles.songModalTitleRow}>
                <Text style={styles.songModalTitle}>Choose Music Track</Text>
                <Text style={styles.songModalSubtitle}>
                  {filteredTracks.length} {filteredTracks.length === 1 ? 'track' : 'tracks'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsSongModalOpen(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                <ModalCloseIcon size={18} color="#708098" />
              </TouchableOpacity>
            </View>

            {/* Filter Bar: Search Input & View Switch Toggle (List / Grid) */}
            <View style={styles.songModalFilterRow}>
              {/* Search Box */}
              <View style={styles.songSearchBox}>
                <ModalSearchIcon size={16} color="#7B8B9E" />
                <TextInput
                  style={styles.songSearchInput}
                  placeholder="Search songs or artists"
                  placeholderTextColor="#94A3B8"
                  value={songSearchQuery}
                  onChangeText={setSongSearchQuery}
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                />
              </View>

              {/* View Mode Toggle */}
              <View style={styles.viewToggleGroup}>
                <TouchableOpacity
                  style={[
                    styles.viewToggleBtn,
                    songModalViewMode === 'list' && styles.viewToggleBtnActive,
                  ]}
                  onPress={() => setSongModalViewMode('list')}
                  activeOpacity={0.8}
                >
                  <ModalListIcon
                    color={songModalViewMode === 'list' ? '#FFFFFF' : '#607593'}
                    size={14}
                  />
                  <Text
                    style={[
                      styles.viewToggleText,
                      songModalViewMode === 'list' && styles.viewToggleTextActive,
                    ]}
                  >
                    List
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.viewToggleBtn,
                    songModalViewMode === 'grid' && styles.viewToggleBtnActive,
                  ]}
                  onPress={() => setSongModalViewMode('grid')}
                  activeOpacity={0.8}
                >
                  <ModalGridIcon
                    color={songModalViewMode === 'grid' ? '#FFFFFF' : '#607593'}
                    size={14}
                  />
                  <Text
                    style={[
                      styles.viewToggleText,
                      songModalViewMode === 'grid' && styles.viewToggleTextActive,
                    ]}
                  >
                    Grid
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Content Area: List View OR Grid View */}
            <ScrollView
              style={styles.songModalScrollView}
              contentContainerStyle={styles.songModalScrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {songModalViewMode === 'list' ? (
                /* LIST VIEW (Mockup 4) */
                <View style={styles.songListView}>
                  {filteredTracks.map((t) => {
                    const isSelected = tempSelectedTrack.id === t.id;
                    return (
                      <TouchableOpacity
                        key={t.id}
                        style={[
                          styles.songListItem,
                          isSelected && styles.songListItemSelected,
                        ]}
                        onPress={() => setTempSelectedTrack(t)}
                        activeOpacity={0.75}
                      >
                        <Image source={t.coverImage} style={styles.songListThumb} resizeMode="cover" />
                        <View style={styles.songListInfo}>
                          <Text style={styles.songListTitle}>{t.title}</Text>
                          <Text style={styles.songListArtist}>{t.artist}</Text>
                        </View>
                        <View style={styles.songListMetaCol}>
                          <Text style={styles.songListMetaText}>
                            {t.durationLabel} • {t.baseBpm} BPM
                          </Text>
                          {isSelected ? (
                            <ModalCheckCircleIcon size={26} />
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                setTempSelectedTrack(t);
                                setSelectedTrack(t);
                                togglePreview();
                              }}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <ModalPlayCircleIcon size={26} />
                            </TouchableOpacity>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                /* GRID VIEW (Mockup 5) */
                <View style={styles.songGridView}>
                  {filteredTracks.map((t) => {
                    const isSelected = tempSelectedTrack.id === t.id;
                    return (
                      <TouchableOpacity
                        key={t.id}
                        style={[
                          styles.songGridCard,
                          isSelected && styles.songGridCardSelected,
                        ]}
                        onPress={() => setTempSelectedTrack(t)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.songGridCoverWrapper}>
                          <Image
                            source={t.coverImage}
                            style={styles.songGridCover}
                            resizeMode="cover"
                          />
                          {isSelected && (
                            <View style={styles.songGridCheckBadge}>
                              <ModalCheckCircleIcon size={20} />
                            </View>
                          )}
                        </View>
                        <Text style={styles.songGridTitle} numberOfLines={1}>
                          {t.title}
                        </Text>
                        <Text style={styles.songGridArtist} numberOfLines={1}>
                          {t.artist}
                        </Text>
                        <Text style={styles.songGridMeta}>
                          {t.durationLabel} • {t.baseBpm} BPM
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>

            {/* Modal Bottom Footer Bar */}
            <View style={styles.songModalFooter}>
              <View style={styles.songModalFooterSelectedRow}>
                <Text style={styles.songModalSelectedPrefix}>Selected:</Text>
                <Text style={styles.songModalSelectedTitle} numberOfLines={1}>
                  {tempSelectedTrack.title}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.useTrackBtn}
                onPress={() => {
                  setSelectedTrack(tempSelectedTrack);
                  setPreviewElapsed(0);
                  setIsPlayingPreview(false);
                  setIsSongModalOpen(false);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.useTrackBtnText}>Use This Track</Text>
                <Text style={styles.useTrackArrowText}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SELECT POSTURE MODAL */}
      <Modal
        visible={isPostureModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPostureModalOpen(false)}
        statusBarTranslucent={true}
      >
        <View
          style={[
            styles.modalOverlay,
            {
              paddingTop: Math.max(insets.top, 10),
              paddingBottom: Math.max(insets.bottom, 12),
              paddingLeft: Math.max(insets.left, 16),
              paddingRight: Math.max(insets.right, 16),
            },
          ]}
        >
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
              {allPostures.map((p) => {
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
  },
  bodyContainerPortrait: {
    flexDirection: 'column',
  },

  /* Left Column */
  leftColumn: {
    width: '36%',
    flexDirection: 'column',
    marginRight: 10,
  },
  leftColumnPortrait: {
    width: '100%',
    height: 180,
    marginRight: 0,
    marginBottom: 8,
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
    justifyContent: 'space-between',
    height: 28,
    paddingLeft: 8,
    paddingRight: 4,
  },
  waveBar: {
    width: 2.8,
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
    marginVertical: 2,
    marginHorizontal: -4,
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
    marginHorizontal: 4,
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
    alignItems: 'center',
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
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
  },
  statIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
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
    flex: 1.2,
    minWidth: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF3FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  postureIcon: {
    width: 26,
    height: 18,
    marginRight: 6,
  },
  postureTextCol: {
    flexDirection: 'column',
    flex: 1,
  },
  postureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D1C38',
    flexShrink: 1,
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
    flex: 1,
    marginRight: 6,
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  connText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D2D44',
    flexShrink: 1,
  },

  /* Info Hint */
  infoHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  infoIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  infoHintText: {
    fontSize: 10,
    color: '#7487A3',
    fontWeight: '500',
  },

  /* Action Buttons */
  actionButtonsRow: {
    flexDirection: 'row',
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
    marginRight: 10,
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
    marginLeft: 6,
  },

  /* Modal (Posture) */
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

  /* NEW SONG MODAL STYLES (Matching Mockup 4 & 5 - Compact for Landscape) */
  songModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songModalCard: {
    width: '84%',
    maxWidth: 680,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  songModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  songModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D1C38',
  },
  songModalSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#708098',
    marginLeft: 8,
  },
  songModalFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  songSearchBox: {
    flex: 1,
    height: 32,
    backgroundColor: '#F3F6FA',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8EFF7',
  },
  songSearchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12,
    color: '#0D1C38',
    marginLeft: 6,
    padding: 0,
  },
  viewToggleGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    height: 30,
  },
  viewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  viewToggleBtnActive: {
    backgroundColor: '#0084FF',
  },
  viewToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#607593',
    marginLeft: 4,
  },
  viewToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  songModalScrollView: {
    flex: 1,
    flexShrink: 1,
    width: '100%',
  },
  songModalScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    paddingBottom: 8,
  },

  /* List View Styles */
  songListView: {
    width: '100%',
    flexDirection: 'column',
  },
  songListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EFF7',
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 5,
  },
  songListItemSelected: {
    borderColor: '#0084FF',
    backgroundColor: '#F5F9FF',
    borderWidth: 1.8,
  },
  songListThumb: {
    width: 38,
    height: 38,
    borderRadius: 6,
    marginRight: 10,
  },
  songListInfo: {
    flex: 1,
  },
  songListTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D1C38',
  },
  songListArtist: {
    fontSize: 10,
    color: '#708098',
    marginTop: 1,
  },
  songListMetaCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songListMetaText: {
    fontSize: 10,
    color: '#708098',
    marginRight: 10,
    fontWeight: '500',
  },

  /* Grid View Styles */
  songGridView: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  songGridCard: {
    width: '23.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EFF7',
    padding: 5,
    marginBottom: 6,
  },
  songGridCardSelected: {
    borderColor: '#0084FF',
    borderWidth: 1.8,
    backgroundColor: '#F5F9FF',
  },
  songGridCoverWrapper: {
    width: '100%',
    height: 56,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  songGridCover: {
    width: '100%',
    height: '100%',
  },
  songGridCheckBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
  },
  songGridTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D1C38',
    marginTop: 4,
  },
  songGridArtist: {
    fontSize: 9,
    color: '#708098',
    marginTop: 1,
  },
  songGridMeta: {
    fontSize: 8,
    color: '#708098',
    marginTop: 1,
  },

  /* Modal Footer */
  songModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF3F8',
    backgroundColor: '#FFFFFF',
  },
  songModalFooterSelectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  songModalSelectedPrefix: {
    fontSize: 12,
    color: '#708098',
    marginRight: 4,
  },
  songModalSelectedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0084FF',
    flexShrink: 1,
  },
  useTrackBtn: {
    backgroundColor: '#0084FF',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0084FF',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  useTrackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  useTrackArrowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
});
