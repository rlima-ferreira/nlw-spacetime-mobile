import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree';
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';
import { SplashScreen, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import Stripes from '../assets/stripes.svg';

const StyledStripes = styled(Stripes);

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) =>
      setIsAuthenticated(!!token)
    );
  }, []);

  if (!hasLoadedFonts) return <SplashScreen />;

  return (
    <ImageBackground
      source={require('../assets/luz.png')}
      className=" relative flex-1 bg-gray-900"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StatusBar style="light" translucent />
      <StyledStripes className="absolute left-2" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" redirect={isAuthenticated} />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new" />
      </Stack>
    </ImageBackground>
  );
}
