import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });


  useEffect(() => {
    async function prepare() {
      try {
        // Load any resources here
        // For example, you might preload images, make API calls, etc.
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    if (fontsLoaded || fontError) {
      prepare();
    }
  }, [fontsLoaded, fontError]);

  return { isReady: isLoadingComplete && (fontsLoaded || !!fontError) };
}