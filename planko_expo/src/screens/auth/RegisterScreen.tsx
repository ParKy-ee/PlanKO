import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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
import { useApp } from '../../context/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const [emailFocused, setEmailFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleRegister = () => {
    let isValid = true;
    setEmailError(null);
    setNameError(null);
    setPasswordError(null);
    setConfirmError(null);

    if (!email.trim()) {
      setEmailError('กรุณากรอกอีเมล');
      isValid = false;
    }
    if (!name.trim()) {
      setNameError('กรุณากรอกชื่อผู้ใช้งาน');
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError('กรุณากรอกรหัสผ่าน');
      isValid = false;
    }
    if (!confirmPassword.trim()) {
      setConfirmError('กรุณากรอกยืนยันรหัสผ่าน');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('รหัสผ่านไม่ตรงกัน');
      isValid = false;
    }

    if (!isValid) return;

    register(name, email, password);
    navigation.replace('UserDetail');
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
          <SvgGradient id="regScreenBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#D8EBFC" />
            <Stop offset="30%" stopColor="#E8F3FD" />
            <Stop offset="70%" stopColor="#F5FAFF" />
            <Stop offset="100%" stopColor="#E1F0FD" />
          </SvgGradient>

          <SvgGradient id="regWaveTopGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#BADDFB" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#E2F1FE" stopOpacity="0.2" />
          </SvgGradient>

          <SvgGradient id="regWaveBottomGrad" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0%" stopColor="#C6E3FB" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#D9ECFD" stopOpacity="0.3" />
          </SvgGradient>
        </Defs>

        {/* Base Background Fill */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#regScreenBgGrad)" />

        {/* Top Organic Ambient Waves */}
        <Path
          d={`M -20 0 L ${SCREEN_WIDTH + 20} 0 L ${SCREEN_WIDTH + 20} 140 Q ${SCREEN_WIDTH * 0.7} 90, ${SCREEN_WIDTH * 0.35} 125 T -20 100 Z`}
          fill="url(#regWaveTopGrad)"
        />
        <Path
          d={`M 0 0 L ${SCREEN_WIDTH} 0 L ${SCREEN_WIDTH} 80 Q ${SCREEN_WIDTH * 0.5} 130, 0 60 Z`}
          fill="rgba(255, 255, 255, 0.4)"
        />

        {/* Decorative Floating Bubbles */}
        <Circle cx={SCREEN_WIDTH * 0.85} cy={40} r={18} fill="rgba(255, 255, 255, 0.35)" />
        <Circle cx={SCREEN_WIDTH * 0.15} cy={120} r={10} fill="rgba(255, 255, 255, 0.4)" />
        <Circle cx={SCREEN_WIDTH * 0.92} cy={160} r={6} fill="rgba(255, 255, 255, 0.5)" />

        {/* Bottom Organic Waves */}
        <Path
          d={`M -20 ${SCREEN_HEIGHT} L ${SCREEN_WIDTH + 20} ${SCREEN_HEIGHT} L ${SCREEN_WIDTH + 20} ${SCREEN_HEIGHT - 90} Q ${SCREEN_WIDTH * 0.6} ${SCREEN_HEIGHT - 40}, 0 ${SCREEN_HEIGHT - 80} Z`}
          fill="url(#regWaveBottomGrad)"
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
                key={`reg-dot-${col}-${row}`}
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Left Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerTextWrapper}>
              <Text style={styles.headerTitle}>สร้างบัญชีใหม่</Text>
              <Text style={styles.headerSubtitle}>
                เริ่มต้นสร้างสุขภาพที่ดีและแตกต่างสำหรับตัวคุณไปกับเรา
              </Text>
            </View>

            {/* 3D Avatar with Orbit Ring & Sparkles */}
            <View style={styles.avatarIllustrationContainer}>
              <Svg width={90} height={90} viewBox="0 0 100 100">
                <Defs>
                  <SvgGradient id="avatarOrbGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#7DD3FC" />
                    <Stop offset="100%" stopColor="#0284C7" />
                  </SvgGradient>
                  <SvgGradient id="avatarRingGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <Stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
                  </SvgGradient>
                  <SvgGradient id="plusBadgeGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#38BDF8" />
                    <Stop offset="100%" stopColor="#0284C7" />
                  </SvgGradient>
                </Defs>

                {/* Sparkling 4-point Stars */}
                <G fill="#38BDF8" opacity={0.9}>
                  <Path d="M 88 18 Q 88 22, 92 22 Q 88 22, 88 26 Q 88 22, 84 22 Q 88 22, 88 18 Z" />
                  <Path d="M 18 36 Q 18 39, 21 39 Q 18 39, 18 42 Q 18 39, 15 39 Q 18 39, 18 36 Z" />
                </G>

                {/* Outer Glass Ring */}
                <Path
                  d="M 14 56 C 14 36, 32 20, 56 20 C 80 20, 92 38, 90 56 C 88 74, 68 88, 44 86 C 26 84, 14 72, 14 56 Z"
                  fill="none"
                  stroke="url(#avatarRingGrad)"
                  strokeWidth="4"
                />

                {/* Central Avatar Disc */}
                <Circle cx="52" cy="50" r="32" fill="url(#avatarOrbGrad)" />

                {/* User Silhouette (White) */}
                <Circle cx="52" cy="42" r="10" fill="#FFFFFF" />
                <Path
                  d="M 36 68 C 36 57, 43 54, 52 54 C 61 54, 68 57, 68 68 Z"
                  fill="#FFFFFF"
                />

                {/* Plus (+) Badge in Bottom Right */}
                <Circle cx="74" cy="68" r="11" fill="url(#plusBadgeGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
                <Path
                  d="M 74 62 L 74 74 M 68 68 L 80 68"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </View>

          {/* Form Cards List */}
          <View style={styles.cardsList}>
            {/* Card 1: ชื่อเมล / อีเมล */}
            <View style={[styles.inputCard, emailFocused && styles.inputCardFocused]}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="person" size={20} color="#0084FF" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>ชื่อเมล</Text>
                <View style={[styles.cardInputWrapper, emailError && styles.cardInputWrapperError]}>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="กรอกชื่อผู้เมล"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
                {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}
              </View>
            </View>

            {/* Card 2: ชื่อผู้ใช้งาน */}
            <View style={[styles.inputCard, nameFocused && styles.inputCardFocused]}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="person-outline" size={20} color="#0084FF" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>ชื่อผู้ใช้งาน</Text>
                <View style={[styles.cardInputWrapper, nameError && styles.cardInputWrapperError]}>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="กรอกชื่อผู้ใช้งาน"
                    placeholderTextColor="#94A3B8"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (nameError) setNameError(null);
                    }}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                </View>
                {nameError ? <Text style={styles.fieldErrorText}>{nameError}</Text> : null}
              </View>
            </View>

            {/* Card 3: รหัสผ่าน */}
            <View style={[styles.inputCard, passwordFocused && styles.inputCardFocused]}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="lock-closed" size={20} color="#0084FF" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>รหัสผ่าน</Text>
                <View style={[styles.cardInputWrapper, passwordError && styles.cardInputWrapperError]}>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="กรอกรหัสผ่าน"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError(null);
                    }}
                    secureTextEntry={hidePassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconBtn}
                    onPress={() => setHidePassword(!hidePassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.fieldErrorText}>{passwordError}</Text> : null}
              </View>
            </View>

            {/* Card 4: ยืนยันรหัสอีกครั้ง */}
            <View style={[styles.inputCard, confirmFocused && styles.inputCardFocused]}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="shield-checkmark" size={20} color="#0084FF" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>ยืนยันรหัสอีกครั้ง</Text>
                <View style={[styles.cardInputWrapper, confirmError && styles.cardInputWrapperError]}>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    placeholderTextColor="#94A3B8"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (confirmError) setConfirmError(null);
                    }}
                    secureTextEntry={hideConfirmPassword}
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => setConfirmFocused(false)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconBtn}
                    onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={hideConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
                {confirmError ? <Text style={styles.fieldErrorText}>{confirmError}</Text> : null}
              </View>
            </View>
          </View>

          {/* Submit Button (สมัครใช้งาน ->) */}
          <TouchableOpacity
            style={styles.submitButtonContainer}
            onPress={handleRegister}
            activeOpacity={0.88}
          >
            <View style={styles.submitButtonGradient}>
              <Svg
                width={SCREEN_WIDTH - 40}
                height={52}
                style={StyleSheet.absoluteFillObject}
              >
                <Defs>
                  <SvgGradient id="regBtnGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#2F95F6" />
                    <Stop offset="50%" stopColor="#0080FF" />
                    <Stop offset="100%" stopColor="#0066EE" />
                  </SvgGradient>
                </Defs>
                <Rect
                  x="0"
                  y="0"
                  width={SCREEN_WIDTH - 40}
                  height={52}
                  rx="26"
                  ry="26"
                  fill="url(#regBtnGrad)"
                />
              </Svg>
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonText}>สมัครใช้งาน</Text>
                <Ionicons name="arrow-forward" size={19} color="#FFFFFF" style={styles.submitButtonIcon} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Divider with Login Link */}
          <View style={styles.loginDividerContainer}>
            <View style={styles.dividerLine} />
            <View style={styles.loginTextRow}>
              <Text style={styles.loginPromptText}>คุณมีบัญชีอยู่แล้วใช่ไหม? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLinkText}>ลงชื่อเข้าใช้</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dividerLine} />
          </View>
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7DB9F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 2,
  },
  headerTextWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  avatarIllustrationContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsList: {
    marginBottom: 16,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: 'rgba(219, 234, 254, 0.75)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputCardFocused: {
    borderColor: '#93C5FD',
    backgroundColor: '#FBFDFF',
  },
  cardIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    height: 38,
    paddingHorizontal: 12,
  },
  cardInputWrapperError: {
    borderColor: Colors.danger,
    backgroundColor: '#FEF2F2',
  },
  cardInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#1E293B',
    height: '100%',
    padding: 0,
  },
  eyeIconBtn: {
    padding: 4,
    marginLeft: 4,
  },
  fieldErrorText: {
    color: Colors.danger,
    fontSize: 11,
    marginTop: 2,
    marginLeft: 2,
  },
  submitButtonContainer: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  submitButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  submitButtonIcon: {
    marginLeft: 8,
  },
  loginDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  loginTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  loginPromptText: {
    fontSize: 13,
    color: '#64748B',
  },
  loginLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0070E0',
  },
  guestDemoButton: {
    backgroundColor: '#EAF3FE',
    borderRadius: 20,
    height: 38,
    paddingHorizontal: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestIcon: {
    marginRight: 6,
  },
  guestDemoText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0077E6',
    marginRight: 4,
  },
});
