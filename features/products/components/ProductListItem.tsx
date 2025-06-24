import { useState } from "react";
import { Pressable, View } from "react-native";
import { Link } from "expo-router";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
  ProductListItemColor,
  ProductListItemResponse,
} from "../queries/types";
import { formatPrice } from "@/utils/price";
import ColorPanel from "./ColorPanel";

export interface ProductListItemProps {
  product: ProductListItemResponse;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const [selectedColor, setSelectedColor] =
    useState<ProductListItemColor | null>(
      product.colors.length > 0 ? product.colors[0] : null
    );

  return (
    <View className="flex-1">
      <Card className="p-5 rounded-lg flex-1">
        <Link href={`/(products)/${product._id}`} asChild>
          <Pressable className="w-full">
            <Image
              source={
                selectedColor?.image?.url
                  ? {
                      uri: selectedColor.image.url,
                    }
                  : require("@/assets/images/shirt-placeholder.webp")
              }
              className="mb-6 h-[240px] w-full rounded-md"
              alt={`${product.name} image`}
              resizeMode="contain"
            />
            <Text className="text-base font-bold mb-2 text-typography-700">
              {product.name}
            </Text>
            <Heading size="md" className="mb-4">
              {formatPrice(product.base_price)}
            </Heading>
          </Pressable>
        </Link>

        <ColorPanel
          colors={product.colors}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />

        <Link href={`/${product._id}`} asChild>
          <Pressable className="w-full">
            <Text className="text-primary-600 font-medium text-center">
              View Details
            </Text>
          </Pressable>
        </Link>
      </Card>
    </View>
  );
}
