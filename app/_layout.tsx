// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import 'react-native-reanimated';
// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { Stack } from 'expo-router';


// import { useColorScheme } from '@/hooks/useColorScheme';
// import { AuthProvider } from '@/context/AuthContext';


// // export default function RootLayout() {
// //   const colorScheme = useColorScheme();
// //   console.log(colorScheme)

// //   return (
// //     <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
// //       <Stack>
// //         <Stack.Screen name='mainPage' options={{headerShown: false}} />
// //         <Stack.Screen name='login' options={{headerShown: false}} />
// //         <Stack.Screen name='+not-found' options={{headerShown: true}} />
// //       </Stack>
// //     </ThemeProvider>
// //   );
// // }


// // export default function RootLayout() {
// //   const colorScheme = useColorScheme() ?? 'light';

// //   // Use o tema correto: quando o esquema for 'light' usar DefaultTheme
// //   // e deixe o Stack gerenciar as telas automaticamente (file-based routing).
// //   return (
// //     <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
// //       <Stack />
// //     </ThemeProvider>
// //   );
// // }

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeProvider value={colorScheme !== 'light' ? DarkTheme : DefaultTheme}>
//     <>
//       <StatusBar style="light" />
//       <AuthProvider>
//       <Stack screenOptions={{ headerShown: false }} />
//       </AuthProvider>
//     </>
//     </ThemeProvider>
//   );
// }

import { useFonts } from 'expo-font';
import { Slot, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';;
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return <Slot />;
  }

  SplashScreen.hideAsync();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
