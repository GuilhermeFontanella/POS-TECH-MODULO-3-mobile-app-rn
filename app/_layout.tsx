import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  console.log(colorScheme)

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='mainPage' options={{headerShown: false}} />
        <Stack.Screen name='login' options={{headerShown: false}} />
        <Stack.Screen name='+not-found' options={{headerShown: true}} />
      </Stack>
    </ThemeProvider>
  );
}
