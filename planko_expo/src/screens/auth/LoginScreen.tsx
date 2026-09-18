import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('somchai.fit@planko.app');
  const [password, setPassword] = useState('123456');
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.brandTitle}>PlanKO</Text>
          <Text style={styles.welcomeTitle}>ยินดีต้อนรับกลับมา</Text>
          <Text style={styles.welcomeSubtitle}>
            เข้าสู่ระบบเพื่อติดตามและพัฒนาการฝึกแพลงก์ของคุณ
          </Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <CustomInput
            label="ชื่อผู้ใช้งาน หรือ อีเมล"
            placeholder="กรอกที่อยู่ชื่อผู้ใช้งาน หรือ อีเมล"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(null);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <CustomInput
            label="รหัสผ่าน"
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError(null);
            }}
            isPassword
          />

          {error ? <Text style={styles.generalError}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => Alert.alert('ลืมรหัสผ่าน', 'ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ')}
          >
            <Text style={styles.forgotPasswordText}>ลืมรหัสผ่าน?</Text>
          </TouchableOpacity>

          <View style={styles.buttonWrapper}>
            <CustomButton title="ลงชื่อเข้าใช้" onPress={handleLogin} />
          </View>

          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerPromptText}>คุณยังไม่มีบัญชีใช่ไหม? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLinkText}>สร้างบัญชีผู้ใช้</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Demo Skip */}
          <TouchableOpacity
            style={styles.demoSkipButton}
            onPress={() => navigation.replace('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.demoSkipText}>⚡ ข้ามเพื่อดู Demo ทันที (Guest Mode)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 36,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
  },
  generalError: {
    color: Colors.danger,
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  buttonWrapper: {
    marginBottom: 24,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerPromptText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  registerLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textBlack,
  },
  demoSkipButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  demoSkipText: {
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
});
