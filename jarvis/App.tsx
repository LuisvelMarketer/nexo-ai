import 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator } from './src/navigation/MainNavigator';
import { JarvisProvider } from './src/store/JarvisContext';
import { colors } from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <JarvisProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar style="light" />
            <MainNavigator />
          </View>
        </NavigationContainer>
      </JarvisProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});