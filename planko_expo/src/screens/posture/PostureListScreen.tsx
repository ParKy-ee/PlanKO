import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { Posture } from '../../types';

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

  const renderDifficultyBadge = (difficulty: string) => {
    let color = '#34C759';
    let text = 'ง่าย';
    let bgColor = '#E8F8EE';

    if (difficulty === 'medium') {
      color = '#FF9500';
      text = 'ปานกลาง';
      bgColor = '#FFF4E5';
    } else if (difficulty === 'hard') {
      color = '#FF3B30';
      text = 'ยาก';
      bgColor = '#FFEBEB';
    }

    return (
      <View style={[styles.diffBadge, { backgroundColor: bgColor, borderColor: color }]}>
        <Text style={[styles.diffBadgeText, { color }]}>{text}</Text>
      </View>
    );
  };

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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          {filteredPostures.map((posture: Posture) => (
            <TouchableOpacity
              key={posture.id}
              style={styles.postureCard}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('PostureDetail', { posture })}
            >
              {/* Left Gradient Icon Block */}
              <View style={styles.leftIconBlock}>
                <MaterialIcons
                  name={(posture.iconName as any) || 'fitness-center'}
                  size={36}
                  color="#FFFFFF"
                />
              </View>

              {/* Right Content */}
              <View style={styles.cardContent}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.postureName} numberOfLines={1}>
                    {posture.name}
                  </Text>
                  {renderDifficultyBadge(posture.difficulty)}
                </View>

                <Text style={styles.postureDesc} numberOfLines={2}>
                  {posture.description}
                </Text>

                <View style={styles.cardBottomRow}>
                  <View style={styles.categoryTag}>
                    <Ionicons name="star" size={14} color="#D97706" />
                    <Text style={styles.categoryTagText}>
                      {posture.postureCategory?.name || 'ทั่วไป'}
                    </Text>
                  </View>

                  <View style={styles.viewDetailLink}>
                    <Text style={styles.viewDetailText}>ดูรายละเอียด</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    paddingBottom: 40,
  },
  chipRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: '#64748B',
  },
  filterChipTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  postureList: {
    padding: 16,
    gap: 16,
  },
  postureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  leftIconBlock: {
    width: 90,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  postureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  postureDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B45309',
  },
  viewDetailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
