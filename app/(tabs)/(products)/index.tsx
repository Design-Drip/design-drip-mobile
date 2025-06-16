import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { SlidersHorizontal } from "lucide-react-native";

import {
  getProductsQuery,
  getCategoriesQuery,
  getColorsQuery,
} from "@/features/products/queries";
import { useProductsQueryStore } from "@/features/products/store/useProductsQueryStore";
import ProductListItem from "@/features/products/components/ProductListItem";
import FilterActionsheet from "@/features/products/components/FilterActionsheet";
import SortModal from "@/features/products/components/SortModal";
import { ProductSortType } from "@/constants/sort";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Spinner } from "@/components/ui/spinner";

export default function ProductsScreen() {
  // Get store actions and state
  const {
    isFilterOpen,
    isSortOpen,
    page,
    sort,
    setIsSortOpen,
    setIsFilterOpen,
    setPage,
    setSort,
  } = useProductsQueryStore();

  // Fetch products data
  const {
    data: products,
    refetch,
    isFetching,
    isLoading,
    isError,
  } = useQuery(getProductsQuery());

  // Fetch categories and colors data for filters
  const { data: categories, isLoading: categoriesLoading } = useQuery(
    getCategoriesQuery()
  );
  const { data: colors, isLoading: colorsLoading } = useQuery(getColorsQuery());

  // Handle load more (pagination)
  const handleLoadMore = () => {
    if (
      products &&
      products.items.length < products.totalItems &&
      !isFetching
    ) {
      setPage(page + 1);
    }
  };

  // Handle sort change
  const handleSortChange = (newSort: ProductSortType) => {
    setSort(newSort);
    setIsSortOpen(false);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="p-4 flex-row justify-between items-center">
        <Text className="font-bold">{products?.totalItems || 0} Products</Text>
        <Button
          variant="outline"
          size="sm"
          onPress={() => setIsSortOpen(true)}
          className="flex-row items-center"
        >
          <SlidersHorizontal size={16} className="mr-1" />
          <ButtonText>Sort</ButtonText>
        </Button>
      </View>

      <Divider />

      {isLoading && !products ? (
        <View className="flex-1 justify-center items-center">
          <Spinner size="large" />
          <Text className="mt-2">Loading products...</Text>
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500">Failed to load products</Text>
          <Button className="mt-4" onPress={refetch}>
            <ButtonText>Try Again</ButtonText>
          </Button>
        </View>
      ) : (
        <FlatList
          data={products?.items || []}
          renderItem={({ item }) => (
            <View className="p-2 w-1/2">
              <ProductListItem product={item} />
            </View>
          )}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={refetch}
            />
          }
          ListFooterComponent={
            isFetching && page > 1 ? (
              <View className="py-4 items-center">
                <Spinner />
              </View>
            ) : null
          }
        />
      )}

      {/* Filter Drawer */}
      <FilterActionsheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories || []}
        colors={colors || []}
        isLoading={categoriesLoading || colorsLoading}
      />

      {/* Sort Modal */}
      <SortModal
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        currentSort={sort}
        onSortChange={handleSortChange}
      />
    </View>
  );
}
