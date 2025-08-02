import { Stack } from "expo-router";

export default function CartLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My Cart" }} />
      <Stack.Screen
        name="checkout"
        options={{ title: "Checkout", headerShown: true }}
      />
    </Stack>
  );
}
