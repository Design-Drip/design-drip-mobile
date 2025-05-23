import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function AuthRoutesLayout() {
  useWarmUpBrowser();
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/(tabs)/(home)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
      <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
      <Stack.Screen
        name="otp-verification"
        options={{ title: "OTP Verification" }}
      />
    </Stack>
  );
}
