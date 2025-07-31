import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { Divider } from "@/components/ui/divider";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/utils/price";

interface OrderSummaryActionsheetProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  hasSelectedItems: boolean;
  onCheckout: () => void;
  isPending?: boolean;
}

export default function OrderSummaryActionsheet({
  isOpen,
  onClose,
  subtotal,
  shipping,
  total,
  itemCount,
  hasSelectedItems,
  onCheckout,
  isPending = false,
}: OrderSummaryActionsheetProps) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <Heading size="lg" className="mb-4">
          Order Summary
        </Heading>

        <VStack space="md" className="w-full mb-6">
          <HStack className="justify-between">
            <Text className="text-typography-600">Items Selected</Text>
            <Text className="font-medium">{itemCount}</Text>
          </HStack>

          <HStack className="justify-between">
            <Text className="text-typography-600">Subtotal</Text>
            <Text className="font-medium">{formatPrice(subtotal)}</Text>
          </HStack>

          <HStack className="justify-between">
            <Text className="text-typography-600">Shipping</Text>
            <Text className="text-success-600">FREE</Text>
          </HStack>

          <Box className="p-3 bg-info-50 rounded-lg">
            <Text className="text-sm text-info-700 text-center">
              Standard shipping is always free! Choose express shipping at checkout for faster delivery.
            </Text>
          </Box>

          <Divider className="my-2" />

          <HStack className="justify-between">
            <Text className="text-typography-900 font-bold text-lg">Total</Text>
            <Text className="text-typography-900 font-bold text-lg">
              {formatPrice(total)}
            </Text>
          </HStack>
        </VStack>

        <Button
          className="bg-primary-600 w-full"
          disabled={!hasSelectedItems || isPending}
          onPress={onCheckout}
        >
          {isPending ? (
            <HStack space="sm" className="items-center">
              <Spinner size="small" />
              <ButtonText className="text-white">Processing...</ButtonText>
            </HStack>
          ) : (
            <ButtonText className="text-white">Proceed to Checkout</ButtonText>
          )}
        </Button>
      </ActionsheetContent>
    </Actionsheet>
  );
}
