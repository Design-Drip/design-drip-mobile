import React from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { CheckIcon, Icon } from "@/components/ui/icon";
import { Edit2, Trash } from "lucide-react-native";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from "@/components/ui/checkbox";
import { formatPrice } from "@/utils/price";
import { CartItemData } from "@/features/cart/queries/types";

interface CartItemProps {
  id: string;
  designId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sizes: CartItemData[];
  color: string;
  colorValue?: string;
  selected: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onToggleSelect: () => void;
}

export default function CartItem({
  id,
  name,
  price,
  image,
  quantity,
  sizes,
  color,
  colorValue,
  selected,
  onEdit,
  onRemove,
  onToggleSelect,
}: CartItemProps) {
  return (
    <Box className="bg-background-0 p-4 rounded-lg border border-outline-100">
      <HStack space="md" className="items-center">
        <Checkbox value={id} isChecked={selected} onChange={onToggleSelect}>
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
        </Checkbox>

        <Box className="h-20 w-20 rounded-md overflow-hidden bg-background-50">
          <Image
            source={{ uri: image }}
            className="h-full w-full"
            alt={name}
            resizeMode="cover"
          />
        </Box>

        <VStack space="xs" className="flex-1">
          <Text
            className="font-semibold text-typography-900 text-base"
            numberOfLines={2}
          >
            {name}
          </Text>

          <HStack className="items-center">
            <Box
              className="h-4 w-4 rounded-full mr-2 border border-outline-300"
              style={{ backgroundColor: colorValue || "#ccc" }}
            />
            <Text className="text-typography-600 text-sm">{color}</Text>
          </HStack>

          <Text className="text-typography-600 text-sm">
            Sizes: {sizes.map((s) => `${s.size}(x${s.quantity})`).join(", ")}
          </Text>
        </VStack>
      </HStack>

      <HStack className="mt-4 justify-between items-center">
        <Text className="font-semibold text-typography-900">
          {formatPrice(price * quantity)}
        </Text>

        <HStack space="sm">
          <Button size="sm" variant="outline" onPress={onEdit} className="px-2">
            <Icon as={Edit2} size="xs" />
            <ButtonText className="ml-1">Edit</ButtonText>
          </Button>

          <Button
            size="sm"
            action="negative"
            variant="outline"
            onPress={onRemove}
            className="px-2"
          >
            <Icon as={Trash} size="xs" />
            <ButtonText className="ml-1">Remove</ButtonText>
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
