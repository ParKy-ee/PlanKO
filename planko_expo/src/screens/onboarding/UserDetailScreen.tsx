import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

type UserDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UserDetail'
>;

interface Props {
  navigation: UserDetailScreenNavigationProp;
}

// Custom vector outline icons tailored to match design specs precisely
const ScaleIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Rect x="3" y="3" width="18" height="18" rx="4.5" stroke="#0080FF" strokeWidth="1.8" fill="none" />
    <Path d="M8 7.5 C8 9.8 9.8 11.5 12 11.5 C14.2 11.5 16 9.8 16 7.5" stroke="#0080FF" strokeWidth="1.6" fill="none" />
    <Circle cx="12" cy="7.5" r="1.2" fill="#0080FF" />
    <Path d="M12 7.5 L13.5 5.5" stroke="#0080FF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </Svg>
);

const HeightIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    {/* Standing figure */}
    <Circle cx="7.5" cy="4.5" r="2" stroke="#0080FF" strokeWidth="1.8" fill="none" />
    <Path
      d="M5.5 8.5 C4.5 8.5 3.5 9.5 3.5 11 L3.5 15 C3.5 15.6 4.5 15.6 4.5 15 L4.5 12 L5.5 12 L5.5 21 C5.5 21.6 6.8 21.6 6.8 21 L6.8 15 L8.2 15 L8.2 21 C8.2 21.6 9.5 21.6 9.5 21 L9.5 12 L10.5 12 L10.5 15 C10.5 15.6 11.5 15.6 11.5 15 L11.5 11 C11.5 9.5 10.5 8.5 9.5 8.5 Z"
      stroke="#0080FF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Vertical measuring bar */}
    <Path
      d="M16.5 4 L20.5 4 M18.5 4 L18.5 21 M16.5 21 L20.5 21"
      stroke="#0080FF"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

const CakeIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    {/* 3 Candles */}
    <Path d="M8 4 L8 8 M12 4 L12 8 M16 4 L16 8" stroke="#0080FF" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Top tier */}
    <Rect x="5" y="8" width="14" height="5" rx="1.5" stroke="#0080FF" strokeWidth="1.8" fill="none" />
    {/* Bottom tier */}
    <Rect x="3" y="13" width="18" height="6.5" rx="1.5" stroke="#0080FF" strokeWidth="1.8" fill="none" />
  </Svg>
);

const GenderIcon: React.FC<{ gender: string }> = ({ gender }) => {
  if (gender === 'Female') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Circle cx="12" cy="9" r="5" stroke="#0080FF" strokeWidth="2" fill="none" />
        <Path d="M12 14 L12 21 M9 18 L15 18" stroke="#0080FF" strokeWidth="2" strokeLinecap="round" fill="none" />
      </Svg>
    );
  }
  if (gender === 'Other') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="5" stroke="#0080FF" strokeWidth="2" fill="none" />
        <Path d="M12 7 L12 2 M15.5 8.5 L19.5 4.5 M16 4.5 L19.5 4.5 L19.5 8" stroke="#0080FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    );
  }
  // Default Male ♂
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Circle cx="9.5" cy="14.5" r="4.5" stroke="#0080FF" strokeWidth="2" fill="none" />
      <Path d="M13 11 L19 5 M14.5 5 L19 5 L19 9.5" stroke="#0080FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
};

const AvatarFigure = () => (
  <Image
    source={require('../../../assets/icons/avatar_figure.png')}
    style={{ width: 32, height: 48 }}
    resizeMode="contain"
  />
);

export const UserDetailScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateUser } = useApp();
  const [weight, setWeight] = useState(user.weight ? user.weight.toString() : '68');
  const [height, setHeight] = useState(user.height ? user.height.toString() : '175');
  const [age, setAge] = useState(user.age ? user.age.toString() : '28');
  const [gender, setGender] = useState(user.gender || 'Male');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  const handleSaveAndNext = () => {
    const numWeight = parseFloat(weight) || 68;
    const numHeight = parseFloat(height) || 175;
    const numAge = parseInt(age, 10) || 28;

    updateUser({
      weight: numWeight,
      height: numHeight,
      age: numAge,
      gender,
    });

    // Navigate to Mission selection
    navigation.navigate('MissionPlan');
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0080FF" />

      {/* Top App Header with Back Btn & PlankO Logo */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.logoRow}>
          <MaterialIcons
            name="fitness-center"
            size={24}
            color="#FFFFFF"
            style={styles.logoIconRotate}
          />
          <Text style={styles.logoTitle}>PlankO</Text>
        </View>

        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content Area */}
      <View style={styles.contentWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step Indicator */}
          <View style={styles.stepIndicatorRow}>
            <View style={[styles.stepBar, styles.stepBarActive]} />
            <View style={[styles.stepBar, styles.stepBarInactive]} />
            <View style={[styles.stepBar, styles.stepBarInactive]} />
          </View>
          <Text style={styles.stepText}>Step 1 of 3</Text>

          {/* Title + Subtitle + Avatar Badge */}
          <View style={styles.headerSection}>
            <View style={styles.headerTextCol}>
              <Text style={styles.title}>Personal Details</Text>
              <Text style={styles.subtitle}>Let's personalize your training plan.</Text>
            </View>
            <View style={styles.avatarCircle}>
              <AvatarFigure />
            </View>
          </View>

          {/* White Form Card */}
          <View style={styles.formCard}>
            {/* Weight & Height Row */}
            <View style={styles.twoColRow}>
              {/* Weight */}
              <View style={styles.colItem}>
                <Text style={styles.fieldLabel}>Weight (kg)</Text>
                <View style={styles.inputBox}>
                  <ScaleIcon />
                  <TextInput
                    style={styles.textInputTwoCol}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="68"
                    placeholderTextColor="#94A3B8"
                  />
                  <View style={styles.unitDivider} />
                  <Text style={styles.unitText}>kg</Text>
                </View>
              </View>

              {/* Height */}
              <View style={styles.colItem}>
                <Text style={styles.fieldLabel}>Height (cm)</Text>
                <View style={styles.inputBox}>
                  <HeightIcon />
                  <TextInput
                    style={styles.textInputTwoCol}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    placeholder="175"
                    placeholderTextColor="#94A3B8"
                  />
                  <View style={styles.unitDivider} />
                  <Text style={styles.unitText}>cm</Text>
                </View>
              </View>
            </View>

            {/* Age (years) */}
            <View style={styles.fullWidthField}>
              <Text style={styles.fieldLabel}>Age (years)</Text>
              <View style={styles.inputBox}>
                <CakeIcon />
                <TextInput
                  style={styles.textInputFull}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="28"
                  placeholderTextColor="#94A3B8"
                />
                <View style={styles.unitDivider} />
                <Text style={styles.unitText}>years</Text>
              </View>
            </View>

            {/* Gender */}
            <View style={styles.fullWidthField}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                activeOpacity={0.8}
              >
                <GenderIcon gender={gender} />
                <Text style={styles.dropdownBtnText}>{gender}</Text>
                <Ionicons
                  name={showGenderDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#334155"
                />
              </TouchableOpacity>

              {showGenderDropdown && (
                <View style={styles.dropdownMenu}>
                  {genderOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.dropdownOption,
                        gender === opt && styles.dropdownOptionActive,
                      ]}
                      onPress={() => {
                        setGender(opt);
                        setShowGenderDropdown(false);
                      }}
                    >
                      <View style={styles.dropdownOptionLeft}>
                        <GenderIcon gender={opt} />
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            gender === opt && styles.dropdownOptionTextActive,
                          ]}
                        >
                          {opt}
                        </Text>
                      </View>
                      {gender === opt && (
                        <Ionicons name="checkmark" size={18} color="#0080FF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Security / Help Note */}
          <View style={styles.trustNoteRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#0080FF" />
            <Text style={styles.trustNoteText}>
              Your details help tailor your workouts.
            </Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSaveAndNext}
            activeOpacity={0.88}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Footer Text */}
          <Text style={styles.footerText}>You can update these details later.</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0080FF',
  },
  topHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#0080FF',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconRotate: {
    transform: [{ rotate: '-25deg' }],
    marginRight: 8,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerPlaceholder: {
    width: 42,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F0F6FD',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBar: {
    width: 40,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  stepBarActive: {
    backgroundColor: '#0080FF',
  },
  stepBarInactive: {
    backgroundColor: '#D1E3F6',
  },
  stepText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 10,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  headerTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
    lineHeight: 20,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E0EEFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EBF3FA',
    shadowColor: '#004080',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  twoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colItem: {
    width: '48%',
  },
  fullWidthField: {
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  inputBox: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F3F8FD',
    borderWidth: 1,
    borderColor: '#D3E4F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  textInputTwoCol: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
    paddingVertical: 0,
  },
  textInputFull: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 10,
    paddingVertical: 0,
  },
  unitDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  unitText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  dropdownBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F3F8FD',
    borderWidth: 1,
    borderColor: '#D3E4F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  dropdownBtnText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 10,
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D3E4F6',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownOptionActive: {
    backgroundColor: '#EAF5FF',
  },
  dropdownOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#334155',
    marginLeft: 10,
    fontWeight: '500',
  },
  dropdownOptionTextActive: {
    color: '#0080FF',
    fontWeight: '700',
  },
  trustNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  trustNoteText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 8,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#0080FF',
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 14,
  },
});
