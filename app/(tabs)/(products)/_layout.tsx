import { Stack } from "expo-router";
import { Button } from "@/components/ui/button";
import { useProductsQueryStore } from "@/features/products/store/useProductsQueryStore";
import { Icon } from "@/components/ui/icon";
import { Filter } from "lucide-react-native";
import ProductWishlistButton from "@/features/products/components/ProductWishlistButton";

export default function ProductsLayout() {
  const { setIsFilterOpen } = useProductsQueryStore();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Product List",
          headerRight: () => (
            <Button
              variant="outline"
              size="sm"
              onPress={() => setIsFilterOpen(true)}
            >
              <Icon as={Filter} size="sm" />
            </Button>
          ),
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
