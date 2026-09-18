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
    // Proceed to onboarding user detail screen
    navigation.replace('UserDetail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.brandTitle}>สร้างบัญชีใหม่</Text>
          <Text style={styles.subtitle}>
            เริ่มต้นสร้างสุขภาพที่ดีและแกนกลางลำตัวที่แข็งแรงไปกับเรา
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="อีเมล"
            placeholder="กรอกที่อยู่อีเมล"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError(null);
            }}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="ชื่อผู้ใช้งาน"
            placeholder="กรอกชื่อผู้ใช้งาน"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) setNameError(null);
            }}
            error={nameError}
          />

          <CustomInput
            label="รหัสผ่าน"
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError(null);
            }}
            error={passwordError}
            isPassword
          />

          <CustomInput
            label="ยืนยันรหัสอีกครั้ง"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmError) setConfirmError(null);
            }}
            error={confirmError}
            isPassword
          />

          <View style={styles.buttonWrapper}>
            <CustomButton title="สมัครใช้งาน" onPress={handleRegister} />
          </View>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginPromptText}>คุณมีบัญชีอยู่แล้วใช่ไหม? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>ลงชื่อเข้าใช้</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 28,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
  },
  buttonWrapper: {
    marginTop: 16,
    marginBottom: 20,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textBlack,
  },
});
