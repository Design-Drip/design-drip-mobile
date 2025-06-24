import { Stack } from "expo-router";

export default function WishlistLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Wish List",
        }}
      />
      <Stack.Screen name="[id]" options={{ title: "Product Details" }} />
    </Stack>
  );
}
