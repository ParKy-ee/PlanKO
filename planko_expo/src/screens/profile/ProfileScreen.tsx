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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../../components/common/CircularProgress';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, mission, history, updateUser, logout } = useApp();

  const [editWeightVisible, setEditWeightVisible] = useState(false);
  const [newWeight, setNewWeight] = useState(user.weight.toString());

  const missionProgress =
    mission && mission.target > 0 ? mission.current / mission.target : 0.0;
  const missionPercentage = Math.round(missionProgress * 100);

  const handleSaveWeight = () => {
    const w = parseFloat(newWeight);
    if (!isNaN(w) && w > 20 && w < 300) {
      updateUser({ weight: w });
      setEditWeightVisible(false);
      Alert.alert('สำเร็จ', 'อัปเดตน้ำหนักของคุณเรียบร้อยแล้ว');
    } else {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกค่าน้ำหนักที่ถูกต้อง');
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.getDate()}/${d.getMonth() + 1}/${(d.getFullYear() + 543).toString().slice(-2)}`;
    } catch {
      return isoString;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>โปรไฟล์</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header: Avatar + Info */}
        <View style={styles.userHeaderRow}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={32} color={Colors.purple} />
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* 2. Active Mission Card */}
        <View style={styles.missionCard}>
          <View style={styles.missionTopRow}>
            <View style={styles.missionTitleCol}>
              <Text style={styles.missionTitle}>
                {mission ? mission.programName : 'ยังไม่มีแผนภารกิจ'}
              </Text>
              <View style={styles.missionBadge}>
                <Text style={styles.missionBadgeText}>
                  {mission?.status || 'PENDING'}
                </Text>
              </View>
            </View>

            <CircularProgress
              size={54}
              strokeWidth={5}
              progress={missionProgress}
              color="#FFFFFF"
              backgroundColor="rgba(255, 255, 255, 0.2)"
              centerText={`${missionPercentage}%`}
              textColor="#FFFFFF"
              fontSize={12}
            />
          </View>

          <View style={styles.divider} />

          {/* Stats Sub-row */}
          <View style={styles.missionStatsRow}>
            <View style={styles.missionStatBox}>
              <Text style={styles.missionStatLabel}>เริ่มเมื่อ</Text>
              <Text style={styles.missionStatVal}>
                {mission ? formatDate(mission.startAt) : '-'}
              </Text>
            </View>

            <View style={styles.missionStatBox}>
              <Text style={styles.missionStatLabel}>ดำเนินไปแล้ว</Text>
              <Text style={styles.missionStatVal}>
                {mission ? `${mission.current} วัน` : '0 วัน'}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Body Stats Grid (Height, Weight, Age, Gender) */}
        <View style={styles.statsGrid}>
          {/* Height */}
          <View style={styles.statGridCard}>
            <Ionicons name="person-add-outline" size={36} color="#334155" />
            <Text style={styles.statGridLabel}>
              ส่วนสูง : <Text style={styles.statGridVal}>{user.height} cm</Text>
            </Text>
          </View>

          {/* Weight (with edit icon) */}
          <TouchableOpacity
            style={styles.statGridCard}
            activeOpacity={0.8}
            onPress={() => setEditWeightVisible(true)}
          >
            <View style={styles.editPencilBadge}>
              <Ionicons name="pencil" size={12} color="#000000" />
            </View>
            <MaterialIcons name="monitor-weight" size={36} color="#334155" />
            <Text style={styles.statGridLabel}>
              น้ำหนัก : <Text style={styles.statGridVal}>{user.weight} Kg</Text>
            </Text>
          </TouchableOpacity>

          {/* Age */}
          <View style={styles.statGridCard}>
            <Ionicons name="hourglass-outline" size={36} color="#334155" />
            <Text style={styles.statGridLabel}>
              อายุ : <Text style={styles.statGridVal}>{user.age}</Text>
            </Text>
          </View>

          {/* Gender */}
          <View style={styles.statGridCard}>
            <MaterialIcons name="transgender" size={36} color="#334155" />
            <Text style={styles.statGridLabel}>
              เพศ : <Text style={styles.statGridVal}>{user.gender}</Text>
            </Text>
          </View>
        </View>

        {/* 4. Workout History Timeline */}
        <View style={styles.historyHeaderRow}>
          <Text style={styles.historyTitle}>ประวัติ</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('ประวัติทั้งหมด', 'แสดงประวัติการฝึกแพลงก์ของคุณ')}
          >
            <Text style={styles.historySeeAll}>ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyList}>
          {history.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyIconWrapper}>
                <MaterialIcons name="fitness-center" size={26} color={Colors.primary} />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyPlanTitle}>{item.planName}</Text>
                <Text style={styles.historyScoreRow}>
                  {item.score} แต้ม • {Math.round(item.duration / 60)} นาที ({item.kcal} แคล)
                </Text>
                <Text style={styles.historyDate}>{formatDate(item.createdAt)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Logout / Switch Account */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
            navigation.replace('Login');
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Weight Modal */}
      <Modal
        visible={editWeightVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditWeightVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.editModalTitle}>อัปเดตน้ำหนัก</Text>
            <TextInput
              style={styles.editModalInput}
              keyboardType="numeric"
              value={newWeight}
              onChangeText={setNewWeight}
              placeholder="น้ำหนัก (กก.)"
            />
            <View style={styles.editModalBtnsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditWeightVisible(false)}
              >
                <Text style={styles.cancelBtnText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveWeightBtn}
                onPress={handleSaveWeight}
              >
                <Text style={styles.saveWeightBtnText}>บันทึก</Text>
              </TouchableOpacity>
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
    backgroundColor: Colors.background,
  },
  appBar: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  appBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  userHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.purpleLight,
    borderWidth: 2,
    borderColor: Colors.purpleBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  userInfoCol: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  missionCard: {
    backgroundColor: '#1F65CD',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#1F65CD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  missionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionTitleCol: {
    flex: 1,
    marginRight: 12,
  },
  missionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  missionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  missionBadgeText: {
    color: '#CECBF6',
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 14,
  },
  missionStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  missionStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  missionStatLabel: {
    fontSize: 11,
    color: '#CECBF6',
  },
  missionStatVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statGridCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  editPencilBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statGridLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginTop: 8,
  },
  statGridVal: {
    fontWeight: 'bold',
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  historySeeAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  historyList: {
    gap: 12,
    marginBottom: 30,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cyanLight,
    borderRadius: 16,
    padding: 14,
  },
  historyIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  historyInfo: {
    flex: 1,
  },
  historyPlanTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  historyScoreRow: {
    fontSize: 13,
    color: '#0066CC',
    fontWeight: '600',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 11,
    color: '#64748B',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FFEBEB',
    marginBottom: 20,
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 15,
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
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  editModalInput: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  editModalBtnsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  saveWeightBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveWeightBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
