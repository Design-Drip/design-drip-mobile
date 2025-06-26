import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        // Đảm bảo style nhất quán cho tất cả các màn hình
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Profile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payment-methods/index"
        options={{
          title: "Payment Methods",
          headerTitle: "Payment Methods",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
      <Stack.Screen
        name="account/index"
        options={{
          title: "Update Profile",
          headerTitle: "Update Profile",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
      <Stack.Screen
        name="designs/index"
        options={{
          title: "Saved Designs",
          headerTitle: "Saved Designs",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
    </Stack>
  );
}
