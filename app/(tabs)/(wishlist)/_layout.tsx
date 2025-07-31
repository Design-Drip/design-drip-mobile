import { Stack } from "expo-router";
import ProductWishlistButton from "@/features/products/components/ProductWishlistButton";

export default function WishlistLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Wish List",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Product Details",
          headerRight: () => <ProductWishlistButton />,
        }}
      />
    </Stack>
  );
}
