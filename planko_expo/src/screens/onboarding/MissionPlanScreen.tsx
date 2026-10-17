import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { Program } from '../../types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type MissionPlanScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MissionPlan'
>;

interface Props {
  navigation: MissionPlanScreenNavigationProp;
}

const dayNames: { [key: number]: string } = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};

export const MissionPlanScreen: React.FC<Props> = ({ navigation }) => {
  const { programs, startMission } = useApp();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenDetail = (program: Program) => {
    setSelectedProgram(program);
    setModalVisible(true);
  };

  const handleStartMission = () => {
    if (!selectedProgram) return;
    startMission(selectedProgram.id, selectedProgram.period);
    setModalVisible(false);
    Alert.alert('Success!', `You have selected the "${selectedProgram.programName}" plan`, [
      {
        text: 'Start Training',
        onPress: () => navigation.replace('MainTabs', { screen: 'Home' }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Mission Plan</Text>
          <Text style={styles.subtitle}>
            Choose a workout program that fits your goals and fitness level
          </Text>
        </View>

        {/* Program Cards */}
        <View style={styles.listContainer}>
          {programs.map((prog) => (
            <TouchableOpacity
              key={prog.id}
              style={styles.programCard}
              activeOpacity={0.9}
              onPress={() => handleOpenDetail(prog)}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons name="fitness-center" size={44} color={Colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.programName}>{prog.programName}</Text>
                <Text style={styles.programPeriod}>
                  Duration: {prog.period} days
                </Text>
                <Text style={styles.programType}>{prog.programType}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Program Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProgram && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedProgram.programName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtn}
                  >
                    <Ionicons name="close" size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalType}>{selectedProgram.programType}</Text>
                <Text style={styles.modalDesc}>{selectedProgram.description}</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Duration : </Text>
                  <Text style={styles.infoValue}>{selectedProgram.period} days</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Workout Days : </Text>
                  <Text style={styles.infoValue}>
                    {selectedProgram.workDays.map((d) => dayNames[d]).join(', ')}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Rest Days : </Text>
                  <Text style={styles.infoValue}>
                    {selectedProgram.restDays.map((d) => dayNames[d]).join(', ')}
                  </Text>
                </View>

                {/* Example Posture Icons */}
                <Text style={styles.previewTitle}>Sample Postures</Text>
                <View style={styles.previewIconsRow}>
                  <View style={styles.previewBox}>
                    <MaterialIcons name="accessibility-new" size={32} color={Colors.primary} />
                  </View>
                  <View style={styles.previewBox}>
                    <MaterialIcons name="directions-run" size={32} color={Colors.primary} />
                  </View>
                  <View style={styles.previewBox}>
                    <MaterialIcons name="fitness-center" size={32} color={Colors.primary} />
                  </View>
                </View>

                {/* Start Button */}
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStartMission}
                  activeOpacity={0.85}
                >
                  <Text style={styles.startButtonText}>Start This Mission</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
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
  listContainer: {
    ...({ gap: 16 } as any),
  },
  programCard: {
    height: 125,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  programPeriod: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 2,
  },
  programType: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalType: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 6,
  },
  modalDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 18,
    marginBottom: 10,
  },
  previewIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  previewBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
