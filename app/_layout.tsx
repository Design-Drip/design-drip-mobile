import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "react-native-reanimated";

import { Providers } from "@/components/providers";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import "@/global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",

  // Ensure screens exist in stacks before loading them
  "(tabs)": {
    initialRouteName: "(home)",
  },
  "(tabs)/(profile)": {
    initialRouteName: "index",
  },
  // Configure routes for better navigation
  "/(tabs)/(profile)/account": "/(tabs)/(profile)/account/index",
  "/(tabs)/(profile)/payment-methods":
    "/(tabs)/(profile)/payment-methods/index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
    </Stack>
  );
}
