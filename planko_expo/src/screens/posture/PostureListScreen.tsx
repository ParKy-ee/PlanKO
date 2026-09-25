import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { Posture } from '../../types';
import {
  PostureIllustratedIcon,
  getPostureTheme,
} from '../../components/common/PostureIllustratedIcon';

export const PostureListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { postures } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  const categories = [
    { id: 0, name: 'ทั้งหมด' },
    ...Array.from(
      new Map(
        postures
          .filter((p) => p.postureCategory)
          .map((p) => [p.postureCategory!.id, p.postureCategory!])
      ).values()
    ),
  ];

  const filteredPostures =
    selectedCategoryId === 0
      ? postures
      : postures.filter((p) => p.postureCategory?.id === selectedCategoryId);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ข้อมูลท่า Plank</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Horizontal Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Posture Cards List */}
        <View style={styles.postureList}>
          {filteredPostures.map((posture: Posture) => {
            const theme = getPostureTheme(posture.id, posture.name);
            return (
              <TouchableOpacity
                key={posture.id}
                style={styles.postureCard}
                activeOpacity={0.88}
                onPress={() => navigation.navigate('PostureDetail', { posture })}
              >
                {/* Left Illustrated Icon Box */}
                <View style={[styles.leftIconBlock, { backgroundColor: theme.bgColor }]}>
                  <PostureIllustratedIcon
                    postureId={posture.id}
                    postureName={posture.name}
                    size={48}
                  />
                </View>

                {/* Right Content */}
                <View style={styles.cardContent}>
                  <Text style={styles.postureName} numberOfLines={1}>
                    {posture.name}
                  </Text>

                  <Text style={styles.postureDesc} numberOfLines={1}>
                    {posture.description}
                  </Text>

                  {/* Category & Tags Pill Row */}
                  <View style={styles.cardBottomRow}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryPillText}>
                        {posture.postureCategory?.name || 'พื้นฐาน'}
                      </Text>
                    </View>
                    <View style={[styles.categoryPill, styles.secondaryPill]}>
                      <Text style={styles.secondaryPillText}>
                        {posture.id === 2
                          ? 'แขนและไหล่'
                          : posture.id === 5
                          ? 'แขนและไหล่'
                          : 'แกนกลางลำตัว'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right Arrow Chevron */}
                <View style={styles.arrowBox}>
                  <Ionicons name="chevron-forward" size={18} color="#0084FF" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F9FD',
  },
  topHeader: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  chipRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
  },
  filterChipText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#0284C7',
    fontWeight: 'bold',
  },
  postureList: {
    padding: 16,
    gap: 12,
  },
  postureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF3F8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  leftIconBlock: {
    width: 66,
    height: 66,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  postureName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 3,
  },
  postureDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
    lineHeight: 16,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
  secondaryPill: {
    backgroundColor: '#F1F5F9',
  },
  secondaryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  arrowBox: {
    paddingLeft: 4,
    paddingRight: 2,
  },
});

