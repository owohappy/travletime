import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimat';

import { useColorScheme } from '@/hooks/useColorScheme';
import { startLocationTracking } from './services/LocationService';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Start location tracking when the app loads
    startLocationTracking();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/register_2" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/settings" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/tracking" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/overviewHours" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/dashboard" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
