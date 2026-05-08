import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { JarvisProvider } from '../src/store/JarvisContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <JarvisProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </JarvisProvider>
  );
}