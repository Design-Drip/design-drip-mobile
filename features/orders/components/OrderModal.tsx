import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { XCircle } from "lucide-react-native";
import { SIZES } from "@/constants/sizes";
import {
  useAddToCartMutation,
  useUpdateCartItemMutation,
} from "@/features/cart/mutations";
import useCustomToast from "@/hooks/useCustomToast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalBackdrop,
} from "@/components/ui/modal";

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  designId: string;
  designName: string;
  mode?: "add" | "edit";
  itemId?: string;
  initialQuantities?: { size: string; quantity: number }[];
}

export function OrderModal({
  visible,
  onClose,
  designId,
  designName,
  mode = "add",
  itemId,
  initialQuantities,
}: OrderModalProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const addToCartMutation = useAddToCartMutation();
  const updateCartMutation = useUpdateCartItemMutation();
  const toast = useCustomToast();

  const isPending =
    mode === "add" ? addToCartMutation.isPending : updateCartMutation.isPending;

  useEffect(() => {
    if (initialQuantities && visible) {
      const quantityMap = initialQuantities.reduce((acc, curr) => {
        acc[curr.size] = curr.quantity;
        return acc;
      }, {} as { [key: string]: number });
      setQuantities(quantityMap);
    } else if (visible) {
      setQuantities({});
    }
  }, [initialQuantities, visible]);

  const handleQuantityChange = (size: string, value: string) => {
    const quantity = parseInt(value) || 0;
    setQuantities((prev) => ({
      ...prev,
      [size]: quantity < 0 ? 0 : quantity,
    }));
  };

  const handleSubmit = () => {
    const quantityBySize = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([size, quantity]) => ({ size, quantity }));

    if (quantityBySize.length === 0) {
      toast.toastError("Please select at least one size and quantity");
      return;
    }

    if (mode === "add") {
      addToCartMutation.mutate(
        { designId, quantityBySize },
        {
          onSuccess: () => {
            toast.toastSuccess(`${designName} added to your cart`);
            onClose();
            setQuantities({});
          },
          onError: (error: any) => {
            toast.toastError(error.message || "Failed to add item to cart");
          },
        }
      );
    } else if (mode === "edit" && itemId) {
      updateCartMutation.mutate(
        { itemId, payload: { quantityBySize } },
        {
          onSuccess: () => {
            toast.toastSuccess(`Cart updated successfully`);
            onClose();
          },
          onError: (error: any) => {
            toast.toastError(error.message || "Failed to update cart");
          },
        }
      );
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="m-4">
        <ModalHeader className="flex flex-col">
          <HStack className="flex w-full justify-between mb-2">
            <Heading size="lg">
              {mode === "add" ? "Add to Cart" : "Update Cart Item"}
            </Heading>

            <Pressable onPress={onClose} disabled={isPending}>
              <XCircle className="text-typography-600" />
            </Pressable>
          </HStack>
          <Text className="text-typography-500">{designName}</Text>
        </ModalHeader>

        <ModalBody>
          <VStack space="md" className="my-4">
            {Object.values(SIZES).map((size) => (
              <HStack key={size} className="items-center justify-between">
                <Text className="font-medium w-12">{size}:</Text>
                <Input size="sm" className="w-20 text-center">
                  <InputField
                    keyboardType="numeric"
                    value={quantities[size]?.toString() || ""}
                    onChangeText={(value) => handleQuantityChange(size, value)}
                    textAlign="center"
                  />
                </Input>
              </HStack>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack className="justify-end gap-4">
            <Button variant="outline" onPress={onClose} disabled={isPending}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={handleSubmit}
              variant="solid"
              action="primary"
              disabled={isPending}
            >
              {isPending ? (
                <HStack space="sm" className="items-center">
                  <Spinner size="small" />
                  <ButtonText className="text-white">
                    {mode === "add" ? "Adding..." : "Updating..."}
                  </ButtonText>
                </HStack>
              ) : (
                <ButtonText className="text-white">
                  {mode === "add" ? "Add to Cart" : "Update Cart"}
                </ButtonText>
              )}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
