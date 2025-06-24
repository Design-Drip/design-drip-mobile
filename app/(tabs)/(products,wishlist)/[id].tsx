import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import RenderHtml from "react-native-render-html";
import { useState } from "react";

import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Center } from "@/components/ui/center";
import { getProductDetailQuery } from "@/features/products/queries";
import { formatPrice } from "@/utils/price";
import ImageCarousel, { ImageItem } from "@/components/ImageCarousel";
import ColorPanel from "@/features/products/components/ColorPanel";
import { ProductListItemColor } from "@/features/products/queries/types";
import { ProductColor } from "@/features/products/types";
import { Image } from "@/components/ui/image";
import ProductWishlistButton from "@/features/products/components/ProductWishlistButton";

export default function ProductDetailsScreen() {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const {
    data: productData,
    isLoading,
    error,
  } = useQuery(getProductDetailQuery(id));

  if (isLoading) {
    return (
      <Center className="flex-1">
        <Spinner size="large" />
      </Center>
    );
  }

  if (error || !productData) {
    return (
      <Center className="flex-1 p-4">
        <Text className="text-red-500">Failed to load product details</Text>
      </Center>
    );
  }

  const { product, colors, sizes } = productData;

  // Initialize selected color if not set
  if (!selectedColor && colors.length > 0 && !selectedColor) {
    setSelectedColor(colors[0]);
  }

  // Convert colors to format needed by ColorPanel
  const colorOptions: ProductListItemColor[] = colors.map((color) => ({
    id: color.id,
    color: color.color,
    color_value: color.color_value,
    image: color.images.find((img) => img.view_side === "front") || null,
  }));

  // Get unique sizes
  const uniqueSizes = Array.from(new Set(sizes.map((size) => size.size))).sort(
    (a, b) => {
      const sizeOrder = { S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
      return (
        (sizeOrder[a as keyof typeof sizeOrder] || 99) -
        (sizeOrder[b as keyof typeof sizeOrder] || 99)
      );
    }
  );

  // Get current color images
  const currentImages = selectedColor?.images || [];

  const handleColorSelect = (color: ProductListItemColor) => {
    const fullColor = colors.find((c) => c.id === color.id);
    if (fullColor) {
      setSelectedColor(fullColor);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: () => <ProductWishlistButton id={product.id} />,
        }}
      />

      <Box className="mb-4">
        {currentImages.length === 0 ? (
          <Image
            source={require("@/assets/images/shirt-placeholder.webp")}
            resizeMode="cover"
            className="h-[300px] w-full rounded-lg"
            alt="Product image placeholder"
          />
        ) : (
          <ImageCarousel
            images={currentImages as ImageItem[]}
            height={350}
            width={width}
            autoPlay={false}
          />
        )}
      </Box>

      <Box className="px-4 pb-6">
        <VStack space="md">
          <Heading size="lg">{product.name}</Heading>

          <Heading size="md" className="text-primary-600">
            {formatPrice(product.base_price)}
          </Heading>

          {colors.length > 0 && (
            <View>
              <Text className="font-bold mb-2">Colors</Text>
              <ColorPanel
                colors={colorOptions}
                selectedColor={
                  colorOptions.find((c) => c.id === selectedColor?.id) || null
                }
                onSelectColor={handleColorSelect}
              />
            </View>
          )}

          {uniqueSizes.length > 0 && (
            <Box>
              <Text className="font-bold mb-2">Sizes</Text>
              <HStack space="sm" className="flex-wrap">
                {uniqueSizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "solid" : "outline"}
                    className={`mb-2 min-w-[60px] ${
                      selectedSize === size
                        ? "bg-primary-600"
                        : "border-outline-300"
                    }`}
                    onPress={() => setSelectedSize(size)}
                  >
                    <ButtonText
                      className={
                        selectedSize === size
                          ? "text-white"
                          : "text-typography-600"
                      }
                    >
                      {size}
                    </ButtonText>
                  </Button>
                ))}
              </HStack>
            </Box>
          )}

          <Box className="mt-2">
            <Text className="font-bold mb-2">Description</Text>
            <RenderHtml
              contentWidth={width - 32} // Account for padding
              source={{
                html: product.description,
              }}
              enableExperimentalGhostLinesPrevention
            />
          </Box>

          <Button
            className="flex-1 mt-4"
            size="lg"
            isDisabled={!selectedSize || !selectedColor}
          >
            <ButtonText>Add to Cart</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
}
