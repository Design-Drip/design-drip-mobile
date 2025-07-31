import React from "react";
import { PaymentMethod } from "@/types/payment";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import {
  CheckCircle2Icon,
  CreditCardIcon,
  TrashIcon,
} from "lucide-react-native";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  selectMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const PaymentMethodCard = ({
  paymentMethod,
  onDelete,
  onSetDefault,
  selectMode = false,
  isSelected = false,
  onSelect,
}: PaymentMethodCardProps) => {
  const { brand, last4, expMonth, expYear, isDefault, id } = paymentMethod;

  // Format expiration date to MM/YY
  const formattedExpDate = `${expMonth.toString().padStart(2, "0")}/${expYear
    .toString()
    .slice(-2)}`;

  // Map card brand to display text
  const displayBrand = brand.charAt(0).toUpperCase() + brand.slice(1);

  const cardContent = (
    <Box
      className={`p-4 border rounded-lg ${
        isDefault
          ? "border-primary-500"
          : isSelected
          ? "border-primary-600 bg-primary-50"
          : "border-gray-200"
      } mb-2`}
    >
      <HStack className="justify-between items-center">
        <HStack className="items-center space-x-2">
          <Icon as={CreditCardIcon} className="mr-2" />
          <VStack>
            <HStack className="items-center space-x-2">
              <Text className="font-medium">{displayBrand}</Text>
              <Text>•••• {last4}</Text>
              {isDefault && (
                <HStack className="items-center space-x-1 bg-gray-200 px-2 py-0.5 rounded-md ml-2">
                  <Icon
                    as={CheckCircle2Icon}
                    size="xs"
                    className="text-primary-500"
                  />
                  <Text className="text-primary-500 text-xs ml-1">Default</Text>
                </HStack>
              )}
            </HStack>
            <Text className="text-gray-500 text-sm">
              Expires {formattedExpDate}
            </Text>
          </VStack>
        </HStack>

        <HStack className="space-x-2">
          {!isDefault && onSetDefault && !selectMode && (
            <Pressable className="p-2" onPress={() => onSetDefault(id)}>
              <Text className="text-primary-500">Set default</Text>
            </Pressable>
          )}
          {onDelete && !selectMode && (
            <Pressable className="p-2" onPress={() => onDelete(id)}>
              <Icon as={TrashIcon} className="text-error-500" />
            </Pressable>
          )}
          {selectMode && isSelected && (
            <Icon
              as={CheckCircle2Icon}
              size="md"
              className="text-primary-500"
            />
          )}
        </HStack>
      </HStack>
    </Box>
  );

  if (selectMode && onSelect) {
    return <Pressable onPress={onSelect}>{cardContent}</Pressable>;
  }

  return cardContent;
};
