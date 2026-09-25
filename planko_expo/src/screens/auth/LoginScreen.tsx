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
import { useApp } from '../../context/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('somchai.fit@planko.app');
  const [password, setPassword] = useState('123456');
  const [hidePassword, setHidePassword] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้งานหรืออีเมลและรหัสผ่าน');
      return;
    }
    setError(null);
    const success = login(email, password);
    if (success) {
      navigation.replace('MainTabs', { screen: 'Home' });
    } else {
      setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
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
          <SvgGradient id="screenBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#D8EBFC" />
            <Stop offset="30%" stopColor="#E8F3FD" />
            <Stop offset="70%" stopColor="#F5FAFF" />
            <Stop offset="100%" stopColor="#E1F0FD" />
          </SvgGradient>

          <SvgGradient id="waveTopGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#BADDFB" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#E2F1FE" stopOpacity="0.2" />
          </SvgGradient>

          <SvgGradient id="waveBottomGrad" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0%" stopColor="#C6E3FB" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#D9ECFD" stopOpacity="0.3" />
          </SvgGradient>
        </Defs>

        {/* Base Background Fill */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#screenBgGrad)" />

        {/* Top Organic Ambient Waves */}
        <Path
          d={`M -20 0 L ${SCREEN_WIDTH + 20} 0 L ${SCREEN_WIDTH + 20} 140 Q ${SCREEN_WIDTH * 0.7} 90, ${SCREEN_WIDTH * 0.35} 125 T -20 100 Z`}
          fill="url(#waveTopGrad)"
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
          fill="url(#waveBottomGrad)"
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
                key={`dot-${col}-${row}`}
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.brandRow}>
              <Text style={styles.brandTitle}>PlanKO</Text>
              {/* 3 blue spark dashes over the 'O' */}
              <View style={styles.sparksContainer}>
                <View style={[styles.sparkBar, styles.sparkBar1]} />
                <View style={[styles.sparkBar, styles.sparkBar2]} />
                <View style={[styles.sparkBar, styles.sparkBar3]} />
              </View>
            </View>
            <Text style={styles.welcomeTitle}>ยินดีต้อนรับกลับมา</Text>
            <Text style={styles.welcomeSubtitle}>
              เข้าสู่ระบบเพื่อติดตามและพัฒนาการฝึกแพลงก์ของคุณ
            </Text>
          </View>

          {/* Main Card Container */}
          <View style={styles.card}>
            {/* Input 1: Email / Username */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="mail-outline" size={16} color="#334155" style={styles.labelIcon} />
                <Text style={styles.label}>ชื่อผู้ใช้งาน หรือ อีเมล</Text>
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                  error && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="somchai.fit@planko.app"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
                <Ionicons name="person-outline" size={19} color="#60A5FA" style={styles.inputRightIcon} />
              </View>
            </View>

            {/* Input 2: Password */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="lock-closed-outline" size={16} color="#334155" style={styles.labelIcon} />
                <Text style={styles.label}>รหัสผ่าน</Text>
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                  error && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) setError(null);
                  }}
                  secureTextEntry={hidePassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  style={styles.inputRightIcon}
                  onPress={() => setHidePassword(!hidePassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>ลืมรหัสผ่าน?</Text>
            </TouchableOpacity>

            {/* Gradient Login Button with Arrow */}
            <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={handleLogin}
              activeOpacity={0.88}
            >
              <View style={styles.loginButtonGradient}>
                <Svg
                  width={SCREEN_WIDTH - 76}
                  height={54}
                  style={StyleSheet.absoluteFillObject}
                >
                  <Defs>
                    <SvgGradient id="loginBtnGrad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#2F95F6" />
                      <Stop offset="50%" stopColor="#0080FF" />
                      <Stop offset="100%" stopColor="#0066EE" />
                    </SvgGradient>
                  </Defs>
                  <Rect
                    x="0"
                    y="0"
                    width={SCREEN_WIDTH - 76}
                    height={54}
                    rx="27"
                    ry="27"
                    fill="url(#loginBtnGrad)"
                  />
                </Svg>
                <View style={styles.loginButtonContent}>
                  <Text style={styles.loginButtonText}>ลงชื่อเข้าใช้</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.loginButtonIcon} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Divider with Register Link */}
            <View style={styles.registerDividerContainer}>
              <View style={styles.dividerLine} />
              <View style={styles.registerTextRow}>
                <Text style={styles.registerPromptText}>คุณยังไม่มีบัญชีใช่ไหม? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.registerLinkText}>สร้างบัญชีผู้ใช้</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest / Demo Mode Button */}
            <TouchableOpacity
              style={styles.guestDemoButton}
              onPress={() => {
                login('somchai.fit@planko.app', '123456');
                navigation.replace('MainTabs', { screen: 'Home' });
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="flash" size={14} color="#0080FF" style={styles.guestIcon} />
              <Text style={styles.guestDemoText}>เข้ามาเพื่อดู Demo ทันที (Guest Mode)</Text>
              <Ionicons name="chevron-forward" size={13} color="#0077E6" />
            </TouchableOpacity>
          </View>

          {/* Bottom Pagination Dots */}
          <View style={styles.paginationDotsContainer}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotInactive]} />
            <View style={[styles.dot, styles.dotInactive]} />
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
    paddingTop: 16,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  headerSection: {
    marginBottom: 24,
    paddingHorizontal: 4,
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
    marginTop: 6,
    letterSpacing: -0.2,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 20,
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
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 6,
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
    height: 52,
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
    fontSize: 15,
    color: '#1E293B',
    height: '100%',
  },
  inputRightIcon: {
    padding: 4,
    marginLeft: 4,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 20,
    paddingVertical: 2,
  },
  forgotPasswordText: {
    fontSize: 13.5,
    color: '#007AFF',
    fontWeight: '600',
  },
  loginButtonContainer: {
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  loginButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loginButtonIcon: {
    marginLeft: 8,
  },
  registerDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  registerTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  registerPromptText: {
    fontSize: 13,
    color: '#64748B',
  },
  registerLinkText: {
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
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0084FF',
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BAE6FD',
  },
});
