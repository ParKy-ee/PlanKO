import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';

type PostureDetailRouteProp = RouteProp<RootStackParamList, 'PostureDetail'>;
type PostureDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PostureDetail'
>;

export const PostureDetailScreen: React.FC = () => {
  const route = useRoute<PostureDetailRouteProp>();
  const navigation = useNavigation<PostureDetailNavigationProp>();
  const { posture } = route.params;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  const handleStartSoloPosture = () => {
    navigation.navigate('PlankWorkout', {
      mode: 'custom',
      durationPerPosture: posture.targetDurationSeconds || 30,
      restTime: 10,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>รายละเอียด</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Posture Name */}
        <Text style={styles.postureName}>{posture.name}</Text>

        {/* Posture Visual Illustration Box */}
        <View style={styles.illustrationBox}>
          <MaterialIcons
            name={(posture.iconName as any) || 'accessibility-new'}
            size={110}
            color={Colors.primary}
          />
        </View>

        {/* Detail Sections */}
        <View style={styles.detailsGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ประเภท :</Text>
            <Text style={styles.detailValue}>
              {posture.postureCategory?.name || 'ทั่วไป'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>คำอธิบาย :</Text>
            <Text style={styles.detailValue}>{posture.description}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ช่วยด้าน :</Text>
            <Text style={styles.detailValue}>{posture.benefit}</Text>
          </View>
        </View>

        {/* Quick Launch Workout Button */}
        <TouchableOpacity
          style={styles.startPostureBtn}
          onPress={handleStartSoloPosture}
          activeOpacity={0.88}
        >
          <MaterialIcons name="play-arrow" size={24} color="#FFFFFF" />
          <Text style={styles.startPostureText}>ฝึกท่านี้ตอนนี้ (30 วิ)</Text>
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
  topHeader: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    zIndex: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  postureName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  illustrationBox: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  detailsGroup: {
    gap: 22,
    marginBottom: 32,
  },
  detailItem: {},
  detailLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  startPostureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startPostureText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
