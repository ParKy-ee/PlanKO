import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ForgotPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordNavigationProp;
}

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSendResetLink = () => {
    if (!identifier.trim()) {
      setError('กรุณากรอกอีเมลหรือชื่อผู้ใช้ของคุณ');
      return;
    }
    setError(null);
    setIsSent(true);
    Alert.alert(
      'ส่งลิงก์สำเร็จ',
      `ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${identifier} เรียบร้อยแล้ว โปรดตรวจสอบกล่องข้อความหรืออีเมลของคุณ`,
      [
        {
          text: 'ตกลง',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'ติดต่อฝ่ายสนับสนุน',
      'หากคุณจำชื่อผู้ใช้หรืออีเมลไม่ได้ กรุณาติดต่อทีมงานได้ที่ support@planko.app หรือ Line Official: @planko',
      [{ text: 'ตกลง' }]
    );
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
          <SvgGradient id="forgotScreenBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#D8EBFC" />
            <Stop offset="30%" stopColor="#E8F3FD" />
            <Stop offset="70%" stopColor="#F5FAFF" />
            <Stop offset="100%" stopColor="#E1F0FD" />
          </SvgGradient>

          <SvgGradient id="forgotWaveTopGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#BADDFB" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#E2F1FE" stopOpacity="0.2" />
          </SvgGradient>

          <SvgGradient id="forgotWaveBottomGrad" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0%" stopColor="#C6E3FB" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#D9ECFD" stopOpacity="0.3" />
          </SvgGradient>
        </Defs>

        {/* Base Background Fill */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#forgotScreenBgGrad)" />

        {/* Top Ambient Waves */}
        <Path
          d={`M -20 0 L ${SCREEN_WIDTH + 20} 0 L ${SCREEN_WIDTH + 20} 140 Q ${SCREEN_WIDTH * 0.7} 90, ${SCREEN_WIDTH * 0.35} 125 T -20 100 Z`}
          fill="url(#forgotWaveTopGrad)"
        />
        <Path
          d={`M 0 0 L ${SCREEN_WIDTH} 0 L ${SCREEN_WIDTH} 80 Q ${SCREEN_WIDTH * 0.5} 130, 0 60 Z`}
          fill="rgba(255, 255, 255, 0.4)"
        />

        {/* Decorative Floating Bubbles */}
        <Circle cx={SCREEN_WIDTH * 0.85} cy={40} r={18} fill="rgba(255, 255, 255, 0.35)" />
        <Circle cx={SCREEN_WIDTH * 0.15} cy={120} r={10} fill="rgba(255, 255, 255, 0.4)" />
        <Circle cx={SCREEN_WIDTH * 0.92} cy={160} r={6} fill="rgba(255, 255, 255, 0.5)" />

        {/* Bottom Waves */}
        <Path
          d={`M -20 ${SCREEN_HEIGHT} L ${SCREEN_WIDTH + 20} ${SCREEN_HEIGHT} L ${SCREEN_WIDTH + 20} ${SCREEN_HEIGHT - 90} Q ${SCREEN_WIDTH * 0.6} ${SCREEN_HEIGHT - 40}, 0 ${SCREEN_HEIGHT - 80} Z`}
          fill="url(#forgotWaveBottomGrad)"
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
                key={`forgot-dot-${col}-${row}`}
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
              <View style={styles.brandRow}>
                <Text style={styles.brandTitle}>PlanKO</Text>
                {/* 3 blue spark dashes over the 'O' */}
                <View style={styles.sparksContainer}>
                  <View style={[styles.sparkBar, styles.sparkBar1]} />
                  <View style={[styles.sparkBar, styles.sparkBar2]} />
                  <View style={[styles.sparkBar, styles.sparkBar3]} />
                </View>
              </View>
              <Text style={styles.welcomeTitle}>ลืมรหัสผ่าน?</Text>
              <Text style={styles.welcomeSubtitle}>
                กรอกอีเมลหรือชื่อผู้ใช้ของคุณ{'\n'}เพื่อรับลิงก์รีเซ็ตรหัสผ่าน
              </Text>
            </View>

            {/* 3D Lock & Reset Illustration Icon */}
            <View style={styles.lockIllustrationContainer}>
              <Svg width={96} height={96} viewBox="0 0 100 100">
                <Defs>
                  <SvgGradient id="lockOrbGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
                    <Stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.3" />
                  </SvgGradient>

                  <SvgGradient id="lockBodyGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#38BDF8" />
                    <Stop offset="40%" stopColor="#0284C7" />
                    <Stop offset="100%" stopColor="#0369A1" />
                  </SvgGradient>

                  <SvgGradient id="shackleGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#60A5FA" />
                    <Stop offset="100%" stopColor="#1D4ED8" />
                  </SvgGradient>

                  <SvgGradient id="planeBadgeGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#FFFFFF" />
                    <Stop offset="100%" stopColor="#EFF6FF" />
                  </SvgGradient>
                </Defs>

                {/* Sparkling 4-point Stars */}
                <G fill="#38BDF8" opacity={0.9}>
                  <Path d="M 88 18 Q 88 22, 92 22 Q 88 22, 88 26 Q 88 22, 84 22 Q 88 22, 88 18 Z" />
                  <Circle cx="92" cy="36" r="1.5" fill="#38BDF8" />
                  <Circle cx="18" cy="46" r="2.5" fill="#BAE6FD" />
                  <Circle cx="90" cy="74" r="2" fill="#BAE6FD" />
                </G>

                {/* Back Glowing Aura */}
                <Circle cx="52" cy="52" r="38" fill="url(#lockOrbGrad)" />

                {/* Circular Reset Arrow in Background */}
                <Path
                  d="M 64 36 A 26 26 0 1 1 54 22"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
                <Path
                  d="M 54 14 L 54 28 L 66 22 Z"
                  fill="#FFFFFF"
                />

                {/* Lock Shackle */}
                <Path
                  d="M 38 42 L 38 28 C 38 18, 62 18, 62 28 L 62 42"
                  fill="none"
                  stroke="url(#shackleGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Lock Body */}
                <Rect
                  x="30"
                  y="36"
                  width="40"
                  height="34"
                  rx="10"
                  ry="10"
                  fill="url(#lockBodyGrad)"
                />

                {/* Keyhole */}
                <Circle cx="50" cy="48" r="4.5" fill="#024473" />
                <Path
                  d="M 47.5 50 L 52.5 50 L 53.5 58 L 46.5 58 Z"
                  fill="#024473"
                />

                {/* Shiny Highlight on Lock */}
                <Path
                  d="M 34 40 L 40 40 C 37 45, 37 58, 35 62 Z"
                  fill="#BAE6FD"
                  opacity={0.5}
                />

                {/* Paper Airplane Badge (Bottom Left) */}
                <Rect
                  x="18"
                  y="54"
                  width="26"
                  height="22"
                  rx="6"
                  ry="6"
                  fill="url(#planeBadgeGrad)"
                  stroke="#DBEAFE"
                  strokeWidth="1.5"
                />
                {/* Paper Airplane Icon */}
                <Path
                  d="M 23 65 L 37 59 L 31 72 L 28 66 Z"
                  fill="#0080FF"
                />
              </Svg>
            </View>
          </View>

          {/* Main Elevated Card Container */}
          <View style={styles.card}>
            {/* Input Group: Email / Username */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <View style={styles.labelIconBadge}>
                  <Ionicons name="mail" size={14} color="#0080FF" />
                </View>
                <Text style={styles.label}>อีเมลหรือชื่อผู้ใช้</Text>
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  isFocused && styles.inputWrapperFocused,
                  error && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="กรอกอีเมลหรือชื่อผู้ใช้ของคุณ"
                  placeholderTextColor="#94A3B8"
                  value={identifier}
                  onChangeText={(text) => {
                    setIdentifier(text);
                    if (error) setError(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <Ionicons name="person-outline" size={19} color="#60A5FA" style={styles.inputRightIcon} />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            {/* Gradient Submit Button */}
            <TouchableOpacity
              style={styles.submitButtonContainer}
              onPress={handleSendResetLink}
              activeOpacity={0.88}
            >
              <View style={styles.submitButtonGradient}>
                <Svg
                  width={SCREEN_WIDTH - 76}
                  height={52}
                  style={StyleSheet.absoluteFillObject}
                >
                  <Defs>
                    <SvgGradient id="forgotBtnGrad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#2F95F6" />
                      <Stop offset="50%" stopColor="#0080FF" />
                      <Stop offset="100%" stopColor="#0066EE" />
                    </SvgGradient>
                  </Defs>
                  <Rect
                    x="0"
                    y="0"
                    width={SCREEN_WIDTH - 76}
                    height={52}
                    rx="26"
                    ry="26"
                    fill="url(#forgotBtnGrad)"
                  />
                </Svg>
                <View style={styles.submitButtonContent}>
                  <Text style={styles.submitButtonText}>ส่งลิงก์รีเซ็ตรหัสผ่าน</Text>
                  <Ionicons name="arrow-forward" size={19} color="#FFFFFF" style={styles.submitButtonIcon} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Divider "หรือ" */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>หรือ</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Support / Help Card */}
            <TouchableOpacity
              style={styles.supportCard}
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <View style={styles.supportIconBadge}>
                <Ionicons name="help" size={18} color="#0080FF" />
              </View>
              <View style={styles.supportTextWrapper}>
                <Text style={styles.supportTitle}>จำชื่อผู้ใช้ไม่ได้?</Text>
                <Text style={styles.supportSubtitle}>ติดต่อฝ่ายสนับสนุนเพื่อขอความช่วยเหลือ</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#60A5FA" />
            </TouchableOpacity>
          </View>

          {/* Bottom Back to Login Link */}
          <TouchableOpacity
            style={styles.backToLoginRow}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color="#0077E6" style={styles.shieldIcon} />
            <Ionicons name="arrow-back" size={14} color="#0077E6" style={styles.arrowIcon} />
            <Text style={styles.backToLoginText}>กลับไปหน้าเข้าสู่ระบบ</Text>
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7DB9F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  headerTextWrapper: {
    flex: 1,
    paddingRight: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0084FF',
    letterSpacing: -0.5,
  },
  sparksContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 3,
    marginTop: 4,
    height: 14,
    gap: 2,
  },
  sparkBar: {
    width: 3,
    backgroundColor: '#0084FF',
    borderRadius: 2,
  },
  sparkBar1: {
    height: 6,
    transform: [{ rotate: '-25deg' }],
  },
  sparkBar2: {
    height: 11,
    transform: [{ rotate: '0deg' }],
  },
  sparkBar3: {
    height: 7,
    transform: [{ rotate: '25deg' }],
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
    letterSpacing: -0.2,
  },
  welcomeSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 19,
  },
  lockIllustrationContainer: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(219, 234, 254, 0.75)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: '#E0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F6FF',
    borderWidth: 1.2,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    height: 50,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: '#0084FF',
    backgroundColor: '#F7FAFF',
  },
  inputWrapperError: {
    borderColor: Colors.danger,
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: '#1E293B',
    height: '100%',
  },
  inputRightIcon: {
    padding: 4,
    marginLeft: 4,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  submitButtonContainer: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 18,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#64748B',
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F6FF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  supportIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D6E8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  supportTextWrapper: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  supportSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  backToLoginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: {
    marginRight: 4,
  },
  arrowIcon: {
    marginRight: 6,
  },
  backToLoginText: {
    fontSize: 13.5,
    color: '#0070E0',
    fontWeight: '600',
  },
});
