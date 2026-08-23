import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import './i18n';

import { Storage } from './utils/storage';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import ExploreScreen from './components/ExploreScreen';
import PlannerScreen from './components/PlannerScreen';
import CommunityScreen from './components/CommunityScreen';
import ProfileScreen from './components/ProfileScreen';
import AddPlaceScreen from './components/AddPlaceScreen';
import AuthScreen from './components/AuthScreen';
import PremiumScreen from './components/PremiumScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabBarIcon({ name, color, size, focused }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Ionicons name={name} size={focused ? 26 : 22} color={color} />
      {focused && <View style={styles.iconDot} />}
    </View>
  );
}

function TabNavigator({ route }) {
  const { profile, country, region, budget, senior } = route.params || {};
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Home: 'home', Explore: 'compass', Plan: 'calendar', Community: 'people', Profile: 'person',
          };
          return <TabBarIcon name={icons[route.name]} color={color} size={size} focused={focused} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ profile, country, region, budget, senior }} />
      <Tab.Screen name="Explore" component={ExploreScreen} initialParams={{ country }} />
      <Tab.Screen name="Plan" component={PlannerScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} initialParams={{ country }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await Storage.getProfile();
    setUserData(data);
    setOnboarded(data.onboarded);
    setLoading(false);
  };

  const handleOnboardingComplete = useCallback(async (data) => {
    await Storage.saveProfile(data);
    setUserData(data);
    setOnboarded(true);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0f0f0f' } }}>
          {!onboarded ? (
            <Stack.Screen name="Onboarding">
              {props => <OnboardingScreen {...props} onComplete={handleOnboardingComplete} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Main" component={TabNavigator} initialParams={userData} />
              <Stack.Screen name="AddPlace" component={AddPlaceScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="Auth" component={AuthScreen} options={{ presentation: 'modal' }} />
              <Stack.Screen name="Premium" component={PremiumScreen} options={{ presentation: 'modal' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' },
  tabBar: {
    backgroundColor: '#1a1a2e',
    borderTopWidth: 0,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
    position: 'absolute',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  tabLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  iconContainer: { alignItems: 'center', justifyContent: 'center', padding: 4 },
  iconFocused: { transform: [{ scale: 1.1 }] },
  iconDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#6366f1', marginTop: 2 },
});
