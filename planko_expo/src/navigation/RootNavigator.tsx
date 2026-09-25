import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { UserDetailScreen } from '../screens/onboarding/UserDetailScreen';
import { MissionPlanScreen } from '../screens/onboarding/MissionPlanScreen';
import { PostureListScreen } from '../screens/posture/PostureListScreen';
import { PostureDetailScreen } from '../screens/posture/PostureDetailScreen';
import { CustomWorkoutScreen } from '../screens/activity/CustomWorkoutScreen';
import { WorkoutHistoryScreen } from '../screens/history/WorkoutHistoryScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { PlankWorkoutScreen } from '../screens/activity/PlankWorkoutScreen';
import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoadingAuth } = useApp();

  if (isLoadingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0084FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Auth & Onboarding */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="UserDetail" component={UserDetailScreen} />
        <Stack.Screen name="MissionPlan" component={MissionPlanScreen} />

        {/* Main 4-Tab Application */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Sub-Screens & Interactive Workouts */}
        <Stack.Screen name="PostureList" component={PostureListScreen} />
        <Stack.Screen name="PostureDetail" component={PostureDetailScreen} />
        <Stack.Screen name="CustomWorkout" component={CustomWorkoutScreen} />
        <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen
          name="PlankWorkout"
          component={PlankWorkoutScreen}
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#EDF5FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
