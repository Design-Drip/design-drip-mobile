import React from "react";
import { PaymentMethod } from "@/types/payment";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { PlusIcon } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  onAddPaymentMethod: () => void;
  onDeletePaymentMethod: (id: string) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
}

export const PaymentMethodsList = ({
  paymentMethods,
  isLoading,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  onSetDefaultPaymentMethod,
}: PaymentMethodsListProps) => {
  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center py-8">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <VStack className="space-y-4">
      {paymentMethods.length === 0 ? (
        <Box className="items-center justify-center py-8">
          <Text className="text-gray-500 mb-4">No payment methods found</Text>
          <Button
            onPress={onAddPaymentMethod}
            className="flex-row items-center space-x-2"
          >
            <Icon as={PlusIcon} className="text-white" />
            <ButtonText className="text-white">Add Payment Method</ButtonText>
          </Button>
        </Box>
      ) : (
        <VStack className="space-y-2">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              paymentMethod={method}
              onDelete={onDeletePaymentMethod}
              onSetDefault={onSetDefaultPaymentMethod}
            />
          ))}

          <Button
            onPress={onAddPaymentMethod}
            className="mt-4 flex-row items-center space-x-2"
            variant="outline"
          >
            <Icon as={PlusIcon} />
            <ButtonText>Add Payment Method</ButtonText>
          </Button>
        </VStack>
      )}
    </VStack>
  );
};
