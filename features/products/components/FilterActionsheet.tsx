import React from "react";
import { View } from "react-native";

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetScrollView,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Divider } from "@/components/ui/divider";

import { useProductsQueryStore } from "../store/useProductsQueryStore";
import { ProductListColorsResponse } from "../queries/types";
import { ProductCategory } from "../types";

interface FilterActionsheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Omit<ProductCategory, "description">[];
  colors: ProductListColorsResponse;
  isLoading: boolean;
}

export default function FilterActionsheet({
  isOpen,
  onClose,
  categories,
  colors,
  isLoading,
}: FilterActionsheetProps) {
  const {
    categories: selectedCategories,
    colors: selectedColors,
    toggleCategory,
    toggleColor,
    resetFilters,
  } = useProductsQueryStore();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[90]}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="bg-secondary-400">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View className="w-full flex-row justify-between items-center p-4">
          <Heading size="lg">Filter Products</Heading>
          <Button variant="solid" action="negative" onPress={resetFilters}>
            <ButtonText>Reset</ButtonText>
          </Button>
        </View>

        <Divider />

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <Spinner size="large" />
            <Text className="mt-2">Loading filters...</Text>
          </View>
        ) : (
          <ActionsheetScrollView contentContainerClassName="p-4">
            {/* Categories Section */}
            <View className="mb-6">
              <Heading size="md" className="mb-2">
                Categories
              </Heading>
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  value={category.id}
                  isChecked={selectedCategories.some(
                    (cat) => cat.id === category.id
                  )}
                  onChange={() => toggleCategory(category)}
                  className="mb-2 flex-row items-center"
                >
                  <CheckboxIndicator className="mr-2" />
                  <CheckboxLabel>{category.name}</CheckboxLabel>
                </Checkbox>
              ))}
            </View>

            {/* Colors Section */}
            <View className="mb-6">
              <Heading size="md" className="mb-2">
                Colors
              </Heading>
              <ActionsheetFlatList
                data={colors}
                renderItem={({ item }) => (
                  <Checkbox
                    id={`color-${item.color_value}`}
                    value={item.color_value}
                    isChecked={selectedColors.includes(item.color)}
                    onChange={() => toggleColor(item.color)}
                    className="mb-2 flex-row items-center"
                  >
                    <CheckboxIndicator className="mr-2" />
                    <View
                      className="w-4 h-4 rounded-full m-0.5"
                      style={{ backgroundColor: item.color_value }}
                    />
                    <CheckboxLabel>
                      {item.color} ({item.count})
                    </CheckboxLabel>
                  </Checkbox>
                )}
                keyExtractor={(item) => item.color_value}
                scrollEnabled={false}
              />
            </View>
          </ActionsheetScrollView>
        )}

        <View className="p-4 flex-row justify-end">
          <Button onPress={onClose}>
            <ButtonText>Apply</ButtonText>
          </Button>
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
}
