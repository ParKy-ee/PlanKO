import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

type UserDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UserDetail'
>;

interface Props {
  navigation: UserDetailScreenNavigationProp;
}

export const UserDetailScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateUser } = useApp();
  const [weight, setWeight] = useState(user.weight ? user.weight.toString() : '65');
  const [height, setHeight] = useState(user.height ? user.height.toString() : '170');
  const [age, setAge] = useState(user.age ? user.age.toString() : '25');
  const [gender, setGender] = useState(user.gender || 'ผู้ชาย');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const genderOptions = ['ผู้ชาย', 'ผู้หญิง', 'อื่นๆ'];

  const handleSaveAndNext = () => {
    const numWeight = parseFloat(weight) || 60;
    const numHeight = parseFloat(height) || 170;
    const numAge = parseInt(age, 10) || 25;

    updateUser({
      weight: numWeight,
      height: numHeight,
      age: numAge,
      gender,
    });

    // Navigate to Mission selection
    navigation.replace('MissionPlan');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ข้อมูลส่วนตัว</Text>
          <Text style={styles.subtitle}>
            กรุณาระบุข้อมูลร่างกายเพื่อปรับโปรแกรมการฝึกให้เหมาะสมกับคุณ
          </Text>
        </View>

        {/* Blue Card Form */}
        <View style={styles.cardContainer}>
          {/* Weight */}
          <Text style={styles.inputLabel}>น้ำหนัก (กก.) :</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอก น้ำหนัก"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          {/* Height */}
          <Text style={styles.inputLabel}>ส่วนสูง (ซม.) :</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอก ส่วนสูง"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />

          {/* Age */}
          <Text style={styles.inputLabel}>อายุ (ปี) :</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอก อายุ"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />

          {/* Gender */}
          <Text style={styles.inputLabel}>เพศ :</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowGenderDropdown(!showGenderDropdown)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownButtonText}>{gender}</Text>
            <Ionicons
              name={showGenderDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#334155"
            />
          </TouchableOpacity>

          {showGenderDropdown && (
            <View style={styles.dropdownList}>
              {genderOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.dropdownItem,
                    gender === opt && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setGender(opt);
                    setShowGenderDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      gender === opt && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                  {gender === opt && (
                    <Ionicons name="checkmark" size={18} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSaveAndNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>ต่อไป</Text>
          <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 22,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  dropdownButton: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemSelected: {
    backgroundColor: '#EAF5FF',
  },
  dropdownItemText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  dropdownItemTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 56,
    borderRadius: 20,
    marginTop: 40,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
