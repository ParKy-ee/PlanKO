import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
import { CircularProgress } from '../../components/common/CircularProgress';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MISSION_CARD_WIDTH = SCREEN_WIDTH - 32;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, mission, history, updateUser, logout } = useApp();

  const missionProgress =
    mission && mission.target > 0 ? mission.current / mission.target : 0.0;
  const missionPercentage = Math.round(missionProgress * 100);

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
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  const handlePickImageFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('ต้องการสิทธิ์การเข้าถึง', 'กรุณาอนุญาตให้แอปเข้าถึงคลังรูปภาพเพื่อเปลี่ยนรูปโปรไฟล์');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateUser({ avatarUrl: result.assets[0].uri });
        Alert.alert('สำเร็จ', 'อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว');
      } else if (!(result as any).cancelled && (result as any).uri) {
        updateUser({ avatarUrl: (result as any).uri });
        Alert.alert('สำเร็จ', 'อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว');
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเลือกรูปภาพได้');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('ต้องการสิทธิ์การเข้าถึง', 'กรุณาอนุญาตให้แอปเข้าถึงกล้องเพื่อถ่ายรูปโปรไฟล์');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateUser({ avatarUrl: result.assets[0].uri });
        Alert.alert('สำเร็จ', 'อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว');
      } else if (!(result as any).cancelled && (result as any).uri) {
        updateUser({ avatarUrl: (result as any).uri });
        Alert.alert('สำเร็จ', 'อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว');
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถถ่ายรูปภาพได้');
    }
  };

  const handleChoosePhotoSource = () => {
    Alert.alert(
      'เปลี่ยนรูปโปรไฟล์',
      'เลือกวิธีการอัปโหลดรูปภาพที่คุณต้องการ',
      [
        {
          text: 'ถ่ายภาพใหม่',
          onPress: handleTakePhoto,
        },
        {
          text: 'เลือกจากคลังรูปภาพ',
          onPress: handlePickImageFromLibrary,
        },
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
      ]
    );
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
          <Ionicons name="person" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>โปรไฟล์</Text>
        </View>

        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Settings')}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Curved background decoration */}
      <View style={styles.topCurveBg} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. User Info Card */}
        <View style={styles.userHeaderCard}>
          {/* Avatar with Camera Badge */}
          <View style={styles.avatarWrapper}>
            <TouchableOpacity
              style={styles.avatarContainer}
              activeOpacity={0.85}
              onPress={handleChoosePhotoSource}
            >
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-outline" size={42} color="#818CF8" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraBadge}
              activeOpacity={0.8}
              onPress={handleChoosePhotoSource}
            >
              <Ionicons name="camera" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* User Details */}
          <View style={styles.userInfoCol}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="bookmark-outline" size={12} color="#0284C7" style={{ marginRight: 4 }} />
              <Text style={styles.memberBadgeText}>สมาชิกทั่วไป</Text>
            </View>
          </View>
        </View>

        {/* 3. Active Mission Card (Gradient with Fluid Waves) */}
        <View style={styles.missionCard}>
          <Svg
            width={MISSION_CARD_WIDTH}
            height={160}
            viewBox={`0 0 ${MISSION_CARD_WIDTH} 160`}
            style={StyleSheet.absoluteFillObject}
          >
            <Defs>
              <SvgGradient id="profileMissionGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#0072FF" />
                <Stop offset="55%" stopColor="#0099FE" />
                <Stop offset="100%" stopColor="#00C4FF" />
              </SvgGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={MISSION_CARD_WIDTH}
              height={160}
              rx="24"
              ry="24"
              fill="url(#profileMissionGrad)"
            />
            {/* Subtle fluid wave curves in background */}
            <Path
              d={`M ${MISSION_CARD_WIDTH * 0.25} 160 Q ${MISSION_CARD_WIDTH * 0.6} 20, ${MISSION_CARD_WIDTH} 50 L ${MISSION_CARD_WIDTH} 160 Z`}
              fill="rgba(255, 255, 255, 0.12)"
            />
            <Path
              d={`M ${MISSION_CARD_WIDTH * 0.45} 160 Q ${MISSION_CARD_WIDTH * 0.75} 45, ${MISSION_CARD_WIDTH} 85 L ${MISSION_CARD_WIDTH} 160 Z`}
              fill="rgba(255, 255, 255, 0.14)"
            />
            <Circle
              cx={MISSION_CARD_WIDTH - 25}
              cy={80}
              r={65}
              fill="rgba(255, 255, 255, 0.06)"
            />
          </Svg>

          <View style={styles.missionCardInner}>
            <View style={styles.missionTopRow}>
              {/* Dumbbell Badge */}
              <View style={styles.missionIconWrapper}>
                <MaterialIcons name="fitness-center" size={24} color="#FFFFFF" />
              </View>

              <View style={styles.missionTitleCol}>
                <Text style={styles.missionTitle}>
                  {mission ? mission.programName : 'สร้างแกนกลาง 7 วัน'}
                </Text>
                <View style={styles.missionStatusBadge}>
                  <Text style={styles.missionStatusBadgeText}>
                    {mission?.status || 'ACTIVE'}
                  </Text>
                </View>
              </View>

              <CircularProgress
                size={56}
                strokeWidth={6}
                progress={missionProgress > 0 ? missionProgress : 0.43}
                color="#FFFFFF"
                backgroundColor="rgba(255, 255, 255, 0.25)"
                centerText={`${missionProgress > 0 ? missionPercentage : 43}%`}
                textColor="#FFFFFF"
                fontSize={13}
              />
            </View>

            <View style={styles.divider} />

            {/* Stats Sub-row (Flame & Calendar) */}
            <View style={styles.missionStatsRow}>
              {/* Start Date */}
              <View style={styles.missionStatBox}>
                <Ionicons name="flame" size={20} color="#BAE6FD" style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.missionStatLabel}>เริ่มเมื่อ</Text>
                  <Text style={styles.missionStatVal}>
                    {mission ? formatDate(mission.startAt) : '20/9/69'}
                  </Text>
                </View>
              </View>

              <View style={styles.statsDivider} />

              {/* Completed Days */}
              <View style={styles.missionStatBox}>
                <Ionicons name="calendar-outline" size={19} color="#BAE6FD" style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.missionStatLabel}>สำเร็จไปแล้ว</Text>
                  <Text style={styles.missionStatVal}>
                    {mission ? `${mission.current} วัน` : '3 วัน'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Body Stats Grid (2x2) */}
        <View style={styles.statsGrid}>
          {/* Height */}
          <View style={styles.statGridCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="body-outline" size={22} color="#0284C7" />
            </View>
            <View style={styles.statTextCol}>
              <Text style={styles.statGridLabel}>ส่วนสูง</Text>
              <Text style={styles.statGridVal}>{user.height} cm</Text>
            </View>
          </View>

          {/* Weight */}
          <View style={styles.statGridCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <MaterialCommunityIcons name="scale-bathroom" size={22} color="#0284C7" />
            </View>
            <View style={styles.statTextCol}>
              <Text style={styles.statGridLabel}>น้ำหนัก</Text>
              <Text style={styles.statGridVal}>{user.weight} Kg</Text>
            </View>
          </View>

          {/* Age */}
          <View style={styles.statGridCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="hourglass-outline" size={20} color="#4F46E5" />
            </View>
            <View style={styles.statTextCol}>
              <Text style={styles.statGridLabel}>อายุ</Text>
              <Text style={styles.statGridVal}>{user.age} ปี</Text>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.statGridCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="male-outline" size={22} color="#0284C7" />
            </View>
            <View style={styles.statTextCol}>
              <Text style={styles.statGridLabel}>เพศ</Text>
              <Text style={styles.statGridVal}>{user.gender}</Text>
            </View>
          </View>
        </View>

        {/* 5. Workout History Timeline */}
        <View style={styles.historyHeaderRow}>
          <View style={styles.historyHeaderLeft}>
            <Ionicons name="time-outline" size={24} color="#0084FF" style={{ marginRight: 6 }} />
            <Text style={styles.historyTitle}>ประวัติ</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('WorkoutHistory')}
            style={styles.seeAllBtn}
          >
            <Text style={styles.historySeeAll}>ดูทั้งหมด</Text>
            <Ionicons name="chevron-forward" size={16} color="#0084FF" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.historyList}>
          {history.slice(0, 4).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.historyCard}
              activeOpacity={0.7}
              onPress={() => Alert.alert(item.planName, `แต้ม: ${item.score}\nเวลา: ${Math.round(item.duration / 60)} นาที\nแคลอรี่: ${item.kcal} Cal\nวันที่: ${formatDate(item.createdAt)}`)}
            >
              <View style={styles.historyIconWrapper}>
                <MaterialIcons name="fitness-center" size={24} color="#0084FF" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyPlanTitle}>{item.planName}</Text>
                <Text style={styles.historyScoreRow}>
                  {item.score} แต้ม • {Math.round(item.duration / 60)} นาที ({item.kcal} Cal)
                </Text>
                <View style={styles.historyDateRow}>
                  <Ionicons name="calendar-outline" size={13} color="#94A3B8" style={{ marginRight: 4 }} />
                  <Text style={styles.historyDate}>{formatDate(item.createdAt)}</Text>
                </View>
              </View>
              <View style={styles.historyChevronCircle}>
                <Ionicons name="chevron-forward" size={16} color="#0084FF" />
              </View>
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
  headerBtn: {
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
  userHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfoCol: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  memberBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
  },
  missionCard: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.38)',
    shadowColor: '#0072FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  missionCardInner: {
    padding: 18,
  },
  missionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  missionTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  missionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  missionStatusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  missionStatusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 14,
  },
  missionStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  missionStatBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },
  missionStatLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  missionStatVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statGridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F1FC',
    marginBottom: 12,
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statTextCol: {
    flex: 1,
  },
  statGridLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  statGridVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historySeeAll: {
    fontSize: 14,
    color: '#0084FF',
    fontWeight: '600',
  },
  historyList: {
    marginBottom: 20,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F1FC',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  historyIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyPlanTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  historyScoreRow: {
    fontSize: 13,
    color: '#0084FF',
    fontWeight: '600',
    marginBottom: 3,
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
    marginLeft: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFE0E0',
    marginBottom: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editModalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  editModalInput: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    marginVertical: 16,
    textAlign: 'center',
    color: '#1E293B',
    fontWeight: 'bold',
  },
  editModalBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  saveWeightBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveWeightBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
