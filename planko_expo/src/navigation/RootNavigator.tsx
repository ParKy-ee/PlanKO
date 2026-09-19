import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { UserDetailScreen } from '../screens/onboarding/UserDetailScreen';
import { MissionPlanScreen } from '../screens/onboarding/MissionPlanScreen';
import { PostureListScreen } from '../screens/posture/PostureListScreen';
import { PostureDetailScreen } from '../screens/posture/PostureDetailScreen';
import { CustomWorkoutScreen } from '../screens/activity/CustomWorkoutScreen';
import { PlankWorkoutScreen } from '../screens/activity/PlankWorkoutScreen';
import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useApp();

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
        <Stack.Screen name="UserDetail" component={UserDetailScreen} />
        <Stack.Screen name="MissionPlan" component={MissionPlanScreen} />

        {/* Main 4-Tab Application */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Sub-Screens & Interactive Workouts */}
        <Stack.Screen name="PostureList" component={PostureListScreen} />
        <Stack.Screen name="PostureDetail" component={PostureDetailScreen} />
        <Stack.Screen name="CustomWorkout" component={CustomWorkoutScreen} />
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
