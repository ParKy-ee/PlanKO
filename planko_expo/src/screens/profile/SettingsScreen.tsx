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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, updateUser, logout } = useApp();

  // 1. Edit Body Stats Modal State (ส่วนสูง, น้ำหนัก, อายุ, เพศ)
  const [editBodyModalVisible, setEditBodyModalVisible] = useState(false);
  const [editHeight, setEditHeight] = useState(user.height.toString());
  const [editWeight, setEditWeight] = useState(user.weight.toString());
  const [editAge, setEditAge] = useState(user.age.toString());
  const [editGender, setEditGender] = useState(user.gender);

  // 2. Edit Account Info Modal State (ชื่อ, นามสกุล, อีเมล)
  const [editAccountModalVisible, setEditAccountModalVisible] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState(user.email);

  const handleOpenEditBody = () => {
    setEditHeight(user.height.toString());
    setEditWeight(user.weight.toString());
    setEditAge(user.age.toString());
    setEditGender(user.gender);
    setEditBodyModalVisible(true);
  };

  const handleSaveBody = () => {
    const h = parseFloat(editHeight);
    const w = parseFloat(editWeight);
    const a = parseInt(editAge, 10);

    updateUser({
      height: !isNaN(h) && h > 50 && h < 250 ? h : user.height,
      weight: !isNaN(w) && w > 20 && w < 300 ? w : user.weight,
      age: !isNaN(a) && a > 5 && a < 120 ? a : user.age,
      gender: editGender,
    });

    setEditBodyModalVisible(false);
    Alert.alert('สำเร็จ', 'บันทึกข้อมูลร่างกายเรียบร้อยแล้ว');
  };

  const handleOpenEditAccount = () => {
    const nameParts = (user.name || '').trim().split(' ');
    setEditFirstName(nameParts[0] || '');
    setEditLastName(nameParts.slice(1).join(' ') || '');
    setEditEmail(user.email);
    setEditAccountModalVisible(true);
  };

  const handleSaveAccount = () => {
    if (!editFirstName.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกชื่อของคุณ');
      return;
    }

    const fullName = `${editFirstName.trim()} ${editLastName.trim()}`.trim();
    updateUser({
      name: fullName,
      email: editEmail.trim() || user.email,
    });

    setEditAccountModalVisible(false);
    Alert.alert('สำเร็จ', 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว');
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
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถถ่ายรูปภาพได้');
    }
  };

  const handleChoosePhotoSource = () => {
    Alert.alert('เปลี่ยนรูปโปรไฟล์', 'เลือกวิธีการอัปโหลดรูปภาพที่คุณต้องการ', [
      { text: 'ถ่ายภาพใหม่', onPress: handleTakePhoto },
      { text: 'เลือกจากคลังรูปภาพ', onPress: handlePickImageFromLibrary },
      { text: 'ยกเลิก', style: 'cancel' },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('ออกจากระบบ', 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ออกจากระบบ',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0084FF" />

      {/* 1. Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ตั้งค่า</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Curved background decoration */}
      <View style={styles.topCurveBg} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Body Stats Card with Edit Button */}
        <View style={styles.statsCardContainer}>
          <View style={styles.statsCardHeaderRow}>
            <View style={styles.statsCardTitleRow}>
              <Ionicons name="body" size={17} color="#0084FF" style={{ marginRight: 6 }} />
              <Text style={styles.statsCardTitle}>ข้อมูลร่างกาย</Text>
            </View>
            <TouchableOpacity
              style={styles.editProfileBtn}
              activeOpacity={0.8}
              onPress={handleOpenEditBody}
            >
              <Ionicons
                name="pencil"
                size={13}
                color="#0084FF"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.editProfileText}>แก้ไขข้อมูล</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bodyStatsRow}>
            {/* Height */}
            <View style={styles.statMiniBox}>
              <View style={[styles.statMiniIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="body-outline" size={18} color="#0284C7" />
              </View>
              <Text style={styles.statMiniLabel}>ส่วนสูง</Text>
              <Text style={styles.statMiniVal}>{user.height} cm</Text>
            </View>

            {/* Weight */}
            <View style={styles.statMiniBox}>
              <View style={[styles.statMiniIcon, { backgroundColor: '#E0F2FE' }]}>
                <MaterialCommunityIcons name="scale-bathroom" size={18} color="#0284C7" />
              </View>
              <Text style={styles.statMiniLabel}>น้ำหนัก</Text>
              <Text style={styles.statMiniVal}>{user.weight} Kg</Text>
            </View>

            {/* Age */}
            <View style={styles.statMiniBox}>
              <View style={[styles.statMiniIcon, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="hourglass-outline" size={17} color="#4F46E5" />
              </View>
              <Text style={styles.statMiniLabel}>อายุ</Text>
              <Text style={styles.statMiniVal}>{user.age} ปี</Text>
            </View>

            {/* Gender */}
            <View style={styles.statMiniBox}>
              <View style={[styles.statMiniIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="male-outline" size={18} color="#0284C7" />
              </View>
              <Text style={styles.statMiniLabel}>เพศ</Text>
              <Text style={styles.statMiniVal}>{user.gender}</Text>
            </View>
          </View>
        </View>

        {/* 3. Settings Menu Card */}
        <View style={styles.menuCard}>
          {/* Row 1: Profile Info (ชื่อ, อีเมล) */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={handleOpenEditAccount}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="person" size={20} color="#0084FF" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>ข้อมูลส่วนตัว</Text>
              <Text style={styles.menuSubtitle}>แก้ไขชื่อ และอีเมล</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Row 3: Notifications */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('การแจ้งเตือน', 'เปิดใช้งานการแจ้งเตือนเตือนฝึกแพลงก์ประจำวันแล้ว')
            }
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="notifications" size={20} color="#0084FF" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>การแจ้งเตือน</Text>
              <Text style={styles.menuSubtitle}>เปิด/ปิด การแจ้งเตือนต่าง ๆ</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Row 4: Privacy */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('ความเป็นส่วนตัว', 'ข้อมูลสุขภาพของคุณถูกจัดเก็บบนอุปกรณ์อย่างปลอดภัย')
            }
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="shield-checkmark" size={20} color="#0084FF" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>ความเป็นส่วนตัว</Text>
              <Text style={styles.menuSubtitle}>จัดการข้อมูลและความปลอดภัย</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Row 5: Help & FAQ */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'ช่วยเหลือ & คำถามที่พบบ่อย',
                'หากมีข้อสงสัยหรือปัญหาการใช้งาน ติดต่อทีมงานได้ที่ support@planko.app'
              )
            }
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="help-circle" size={20} color="#0084FF" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>ช่วยเหลือ & คำถามที่พบบ่อย</Text>
              <Text style={styles.menuSubtitle}>ดูวิธีการใช้งาน และติดต่อทีมสนับสนุน</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Row 6: About App */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('เกี่ยวกับแอป PlankO', 'PlankO เวอร์ชัน 1.0.0\nแอปพลิเคชันช่วยฝึกแพลงก์เพื่อสุขภาพแกนกลางลำตัวที่แข็งแรง')
            }
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="document-text" size={20} color="#0084FF" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>เกี่ยวกับแอป</Text>
              <Text style={styles.menuSubtitle}>เวอร์ชัน 1.0.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* 4. Red Logout Card */}
        <TouchableOpacity
          style={styles.logoutCard}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <View style={styles.logoutIconCircle}>
            <Ionicons name="log-out" size={22} color="#EF4444" />
          </View>
          <View style={styles.logoutTextCol}>
            <Text style={styles.logoutTitle}>ออกจากระบบ</Text>
            <Text style={styles.logoutSubtitle}>หากต้องการเข้าสู่ระบบด้วยบัญชีอื่น</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#EF4444" />
        </TouchableOpacity>
      </ScrollView>

      {/* 1. Modal แก้ไขข้อมูลร่างกาย (ส่วนสูง, น้ำหนัก, อายุ, เพศ) */}
      <Modal
        visible={editBodyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditBodyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>แก้ไขข้อมูลร่างกาย</Text>
              <TouchableOpacity
                onPress={() => setEditBodyModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Row: Height & Weight */}
              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>ส่วนสูง (ซม.) :</Text>
                  <TextInput
                    style={styles.input}
                    value={editHeight}
                    onChangeText={setEditHeight}
                    keyboardType="numeric"
                    placeholder="ส่วนสูง"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.inputLabel}>น้ำหนัก (กก.) :</Text>
                  <TextInput
                    style={styles.input}
                    value={editWeight}
                    onChangeText={setEditWeight}
                    keyboardType="numeric"
                    placeholder="น้ำหนัก"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Row: Age & Gender */}
              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>อายุ (ปี) :</Text>
                  <TextInput
                    style={styles.input}
                    value={editAge}
                    onChangeText={setEditAge}
                    keyboardType="numeric"
                    placeholder="อายุ"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.inputLabel}>เพศ :</Text>
                  <View style={styles.genderSelectRow}>
                    {['ผู้ชาย', 'ผู้หญิง'].map((g) => {
                      const isSel = editGender === g;
                      return (
                        <TouchableOpacity
                          key={g}
                          onPress={() => setEditGender(g)}
                          style={[styles.genderChip, isSel && styles.genderChipSel]}
                        >
                          <Text style={[styles.genderChipText, isSel && styles.genderChipTextSel]}>
                            {g}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalBtnsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditBodyModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveBody}
              >
                <Text style={styles.saveBtnText}>บันทึกข้อมูล</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. Modal แก้ไขข้อมูลส่วนตัว (ชื่อ-นามสกุล, อีเมล) */}
      <Modal
        visible={editAccountModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditAccountModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>แก้ไขข้อมูลส่วนตัว</Text>
              <TouchableOpacity
                onPress={() => setEditAccountModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Row: First Name & Last Name */}
              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>ชื่อ :</Text>
                  <TextInput
                    style={styles.input}
                    value={editFirstName}
                    onChangeText={setEditFirstName}
                    placeholder="กรอกชื่อ"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.inputLabel}>นามสกุล :</Text>
                  <TextInput
                    style={styles.input}
                    value={editLastName}
                    onChangeText={setEditLastName}
                    placeholder="กรอกนามสกุล"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Email */}
              <Text style={styles.inputLabel}>อีเมล :</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="กรอกอีเมล"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </ScrollView>

            <View style={styles.modalBtnsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditAccountModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveAccount}
              >
                <Text style={styles.saveBtnText}>บันทึกข้อมูล</Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    paddingHorizontal: 16,
  },
  statsCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F1FC',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statsCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  statsCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsCardTitle: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  editProfileText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#0084FF',
  },
  bodyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statMiniBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statMiniIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statMiniLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  statMiniVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F1FC',
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 56,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  logoutTextCol: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 2,
  },
  logoutSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#1E293B',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderSelectRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    marginRight: 4,
  },
  genderChipSel: {
    borderColor: '#0084FF',
    backgroundColor: '#0084FF',
  },
  genderChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  genderChipTextSel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalBtnsRow: {
    flexDirection: 'row',
    marginTop: 18,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  saveBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#0084FF',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
