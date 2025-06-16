import React, { useState, useEffect } from "react";
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
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderLeftThumb,
  RangeSliderRightThumb,
} from "@/components/ui/range-slider";
import { Input, InputField } from "@/components/ui/input";

import { useProductsQueryStore } from "../store/useProductsQueryStore";
import { ProductListColorsResponse } from "../queries/types";
import { ProductCategory } from "../types";
import { formatPrice } from "@/utils/price";

interface FilterActionsheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Omit<ProductCategory, "description">[];
  colors: ProductListColorsResponse;
  isLoading: boolean;
}

const MIN_PRICE = 0;
const MAX_PRICE = 10000; // in thousands dong

export default function FilterActionsheet({
  isOpen,
  onClose,
  categories,
  colors,
  isLoading,
}: FilterActionsheetProps) {
  const {
    categories: reduxCategories,
    colors: reduxColors,
    minPrice: reduxMinPrice,
    maxPrice: reduxMaxPrice,
    toggleCategory,
    toggleColor,
    setPriceRange,
    resetFilters,
  } = useProductsQueryStore();

  // Local state for all filters
  const [localCategories, setLocalCategories] = useState<
    Omit<ProductCategory, "description">[]
  >([]);
  const [localColors, setLocalColors] = useState<string[]>([]);
  const [localMinPrice, setLocalMinPrice] = useState<number | undefined>(
    undefined
  ); // it should be thousands dong
  const [localMaxPrice, setLocalMaxPrice] = useState<number | undefined>(
    undefined
  ); // it should be thousands dong

  // Initialize local state from Redux store when the actionsheet opens
  useEffect(() => {
    if (isOpen) {
      setLocalCategories(reduxCategories);
      setLocalColors(reduxColors);
      setLocalMinPrice(
        reduxMinPrice ? Math.floor(reduxMinPrice / 1000) : undefined
      ); // Convert to thousands dong
      setLocalMaxPrice(
        reduxMaxPrice ? Math.floor(reduxMaxPrice / 1000) : undefined
      ); // Convert to thousands dong
    }
  }, [isOpen, reduxCategories, reduxColors, reduxMinPrice, reduxMaxPrice]);

  // Handle toggling local category state
  const handleToggleCategory = (
    category: Omit<ProductCategory, "description">
  ) => {
    setLocalCategories((prev) => {
      const isInList = prev.some((cat) => cat.id === category.id);
      return isInList
        ? prev.filter((cat) => cat.id !== category.id)
        : [...prev, category];
    });
  };

  // Handle toggling local color state
  const handleToggleColor = (color: string) => {
    setLocalColors((prev) => {
      const isInList = prev.includes(color);
      return isInList ? prev.filter((c) => c !== color) : [...prev, color];
    });
  };

  // Handle min price input change
  const handleMinPriceChange = (text: string) => {
    const value = text.trim() === "" ? undefined : Number(text);
    setLocalMinPrice(value);
  };

  // Handle max price input change
  const handleMaxPriceChange = (text: string) => {
    const value = text.trim() === "" ? undefined : Number(text);
    setLocalMaxPrice(value);
  };

  // Handle range slider change
  const handleRangeSliderChange = (values: number[]) => {
    if (values.length >= 2) {
      setLocalMinPrice(values[0]);
      setLocalMaxPrice(values[1]);
    }
  };

  // Handle applying filters to Redux store
  const handleApplyFilters = () => {
    // Apply the selected filters to the Redux store
    toggleCategory(localCategories, true);
    toggleColor(localColors, true);
    setPriceRange(
      localMinPrice ? localMinPrice * 1000 : undefined,
      localMaxPrice ? localMaxPrice * 1000 : undefined
    );

    onClose();
  };

  // Handle local reset
  const handleReset = () => {
    setLocalCategories([]);
    setLocalColors([]);
    setLocalMinPrice(undefined);
    setLocalMaxPrice(undefined);
    resetFilters();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[90]}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="bg-secondary-400">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View className="w-full flex-row justify-between items-center p-4">
          <Heading size="lg">Filter Products</Heading>
          <Button variant="solid" action="negative" onPress={handleReset}>
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
            {/* Price Range Section */}
            <View className="mb-6">
              <Heading size="md" className="mb-2">
                Price Range (in Thousands VND)
              </Heading>
              <View className="flex-row justify-between mb-2 items-center">
                <View className="flex-row items-center">
                  <Text className="mr-2">Min:</Text>
                  <Input size="sm" className="w-20">
                    <InputField
                      keyboardType="numeric"
                      value={localMinPrice?.toString() || ""}
                      onChangeText={handleMinPriceChange}
                      placeholder="Min"
                      className="text-center"
                    />
                  </Input>
                </View>
                <View className="flex-row items-center">
                  <Text className="mr-2">Max:</Text>
                  <Input size="sm" className="w-20">
                    <InputField
                      keyboardType="numeric"
                      value={localMaxPrice?.toString() || ""}
                      onChangeText={handleMaxPriceChange}
                      placeholder="Max"
                      className="text-center"
                    />
                  </Input>
                </View>
              </View>
              <RangeSlider
                minValue={MIN_PRICE}
                maxValue={MAX_PRICE}
                step={50}
                value={[localMinPrice ?? MIN_PRICE, localMaxPrice ?? MAX_PRICE]}
                onChange={handleRangeSliderChange}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderLeftThumb />
                <RangeSliderRightThumb />
              </RangeSlider>
              <View className="flex-row justify-between mt-5">
                <Text className="text-xs">{formatPrice(MIN_PRICE * 1000)}</Text>
                <Text className="text-xs">{formatPrice(MAX_PRICE * 1000)}</Text>
              </View>
            </View>

            {/* Categories Section */}
            <View className="mb-6">
              <Heading size="md" className="mb-2">
                Categories
              </Heading>
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  value={category.id}
                  isChecked={localCategories.some(
                    (cat) => cat.id === category.id
                  )}
                  onChange={() => handleToggleCategory(category)}
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
                    isChecked={localColors.includes(item.color)}
                    onChange={() => handleToggleColor(item.color)}
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
          <Button onPress={handleApplyFilters}>
            <ButtonText>Apply</ButtonText>
          </Button>
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
}
