import { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import ProductListItem from "@/features/products/components/ProductListItem";
import useWishlist from "@/features/wishlist/hooks/useWishlist";
import { getProductsQuery } from "@/features/products/queries";
import { ProductListItemResponse } from "@/features/products/queries/types";
import { Button, ButtonText } from "@/components/ui/button";

const WishlistScreen = () => {
  const { wishlistItems } = useWishlist();
  const [products, setProducts] = useState<ProductListItemResponse[]>([]);
  const {
    data: productsData,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    ...getProductsQuery(wishlistItems),
    enabled: wishlistItems.length > 0,
  });

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.items);
    }
  }, [productsData]);

  return isError ? (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-red-500">Failed to load products</Text>
      <Button className="mt-4" onPress={refetch}>
        <ButtonText>Try Again</ButtonText>
      </Button>
    </View>
  ) : (
    <FlatList
      data={products || []}
      renderItem={({ item }) => (
        <View className="p-2 w-1/2">
          <ProductListItem product={item} />
        </View>
      )}
      keyExtractor={(item) => item._id}
      numColumns={2}
      contentContainerStyle={{ padding: 8 }}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
    />
  );
};

export default WishlistScreen;
