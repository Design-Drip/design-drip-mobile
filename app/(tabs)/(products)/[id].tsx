import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import RenderHtml from "react-native-render-html";

import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
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

export default function ProductDetailsScreen() {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();

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
  const uniqueSizes = Array.from(new Set(sizes.map((size) => size.size)));

  // Find the main product image (front view)
  const mainImage =
    colors[0]?.images.find((img) => img.view_side === "front") ||
    colors[0]?.images?.[0];

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ title: product.name }} />

      <Box className="p-4">
        <Image
          source={
            mainImage
              ? { uri: mainImage.url }
              : require("@/assets/images/shirt-placeholder.webp")
          }
          className="h-[300px] w-full rounded-lg mb-4"
          alt={`${product.name} image`}
          resizeMode="cover"
        />

        <Card className="p-5 rounded-lg w-full">
          <VStack space="md">
            <Heading size="lg">{product.name}</Heading>

            <Heading size="md" className="text-primary-600">
              {formatPrice(product.base_price)}
            </Heading>

            <RenderHtml
              contentWidth={width}
              source={{
                html: product.description,
              }}
              enableExperimentalGhostLinesPrevention
            />

            {uniqueSizes.length > 0 && (
              <Box>
                <Text className="font-bold mb-2">Available Sizes</Text>
                <HStack space="sm" className="flex-wrap">
                  {uniqueSizes.map((size) => (
                    <Box
                      key={size}
                      className="border border-outline-300 rounded-md px-3 py-1 mb-2"
                    >
                      <Text className="text-sm">{size}</Text>
                    </Box>
                  ))}
                </HStack>
              </Box>
            )}

            {colors.length > 0 && (
              <Box>
                <Text className="font-bold mb-2">Available Colors</Text>
                <HStack space="sm" className="flex-wrap">
                  {colors.map((colorObj) => (
                    <Box
                      key={colorObj.id}
                      style={{ backgroundColor: colorObj.color_value }}
                      className="w-8 h-8 rounded-full border border-outline-300 mb-2"
                    />
                  ))}
                </HStack>
              </Box>
            )}

            <HStack space="md" className="mt-4">
              <Button className="flex-1" size="lg">
                <ButtonText>Add to Cart</ButtonText>
              </Button>
              <Button
                variant="outline"
                className="px-4 border-outline-300"
                size="lg"
              >
                <ButtonText className="text-typography-600">
                  Wishlist
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      </Box>
    </ScrollView>
  );
}
