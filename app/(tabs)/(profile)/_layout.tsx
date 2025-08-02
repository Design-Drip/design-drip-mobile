import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
          headerTitle: "Profile",
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
      <Stack.Screen
        name="orders/index"
        options={{
          headerTitle: "Orders",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
      <Stack.Screen
        name="orders/[id]"
        options={{
          title: "Order Details",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
    </Stack>
  );
}
