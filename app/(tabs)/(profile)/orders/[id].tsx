import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { getOrderDetailQuery } from "@/features/orders/queries";
import { formatPrice } from "@/utils/price";
import {
  CalendarIcon,
  CreditCardIcon,
  TruckIcon,
} from "lucide-react-native";
import { OrderStatus } from "@/constants/orders";
import { useUpdateStatusMutation } from "@/features/orders/mutations";
import useCustomToast from "@/hooks/useCustomToast";
import { useQueryClient } from "@tanstack/react-query";
import { OrdersKeys } from "@/features/orders/queries/keys";

const OrderStatusColor = {
  delivered: "text-success-600",
  shipped: "text-info-600",
  shipping: "text-info-600",
  processing: "text-warning-600",
  pending: "text-gray-600",
  canceled: "text-error-600",
};

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useCustomToast();
  const updateOrderStatus = useUpdateStatusMutation();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const {
    data: order,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = getOrderDetailQuery(id);
  const handleCancelOrder = () => {
    updateOrderStatus.mutate(
      {
        orderId: id,
        status: OrderStatus.CANCELED,
      },
      {
        onSuccess: () => {
          toast.toastSuccess("Order canceled successfully");
          queryClient.invalidateQueries({
            queryKey: [OrdersKeys.GetOrderDetailQuery, id],
          });
          setShowCancelModal(false);
        },
        onError: (error) => {
          toast.toastError(error.message || "Failed to cancel order");
          setShowCancelModal(false);
        },
      }
    );
  };

  const handleCancelPress = () => {
    setShowCancelModal(true);
  };

  const handleModalClose = () => {
    setShowCancelModal(false);
  };

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </Box>
    );
  }

  if (isError || !order) {
    return (
      <Box className="flex-1 justify-center items-center p-4">
        <Text className="text-error-600 mb-4">
          Failed to load order details. Please try again.
        </Text>
        <Button onPress={() => refetch()}>
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    );
  }

  const statusColor =
    OrderStatusColor[order.status] || "text-gray-600";
  const statusLabel =
    order.status.at(0)?.toUpperCase() + order.status.slice(1);

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      }
    >
      <Box className="p-4">
        {/* Order Header */}
        <Card className="p-4 mb-4">
          <VStack space="sm">
            <HStack className="justify-between items-center">
              <Heading size="md">Order #{id.substring(0, 8)}</Heading>
              <Text className={`font-semibold ${statusColor}`}>
                {statusLabel}
              </Text>
            </HStack>

            <Divider />

            <HStack space="md" className="items-center">
              <Icon
                as={CalendarIcon}
                size="sm"
                className="text-gray-500"
              />
              <Text className="text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </HStack>

            <HStack space="md" className="items-center">
              <Icon
                as={CreditCardIcon}
                size="sm"
                className="text-gray-500"
              />
              <Text className="text-gray-600">
                Paid with {order.paymentMethod || "Credit Card"}
              </Text>
            </HStack>

            <HStack space="md" className="items-center">
              <Icon
                as={TruckIcon}
                size="sm"
                className="text-gray-500"
              />
              <Text className="text-gray-600">
                {order.status === OrderStatus.DELIVERED
                  ? "Delivered"
                  : order.status === OrderStatus.SHIPPED
                  ? "Out for delivery"
                  : order.status === OrderStatus.SHIPPING
                  ? "Shipping soon"
                  : order.status === OrderStatus.PROCESSING
                  ? "Preparing to ship"
                  : order.status === OrderStatus.CANCELED
                  ? "Shipping canceled"
                  : "Not yet shipped"}
              </Text>
            </HStack>
          </VStack>
        </Card>

        {/* Order Items */}
        <Card className="p-4 mb-4">
          <Heading size="md" className="mb-2">
            Items
          </Heading>
          <Divider className="mb-4" />

          <VStack space="md">
            {order.items.map((item, index) => (
              <Box key={index} className="mb-4">
                <HStack className="justify-between mb-1">
                  <VStack className="flex-1 mr-2">
                    <Text className="font-semibold">{item.name}</Text>
                    <Text className="text-gray-600">
                      Design: {item.designId._id}
                    </Text>
                    <Text className="text-gray-600">
                      Color: {item.color}
                    </Text>
                  </VStack>
                  <Text className="font-semibold">
                    {formatPrice(item.totalPrice)}
                  </Text>
                </HStack>

                <Box className="mt-2">
                  {item.sizes.map((size, idx) => (
                    <HStack key={idx} className="justify-between">
                      <Text className="text-gray-600">
                        {size.size} x {size.quantity}
                      </Text>
                      <Text className="text-gray-600">
                        {formatPrice(
                          size.pricePerUnit * size.quantity
                        )}
                      </Text>
                    </HStack>
                  ))}
                </Box>

                {index < order.items.length - 1 && (
                  <Divider className="my-3" />
                )}
              </Box>
            ))}
          </VStack>
        </Card>

        {/* Order Summary */}
        <Card className="p-4">
          <Heading size="md" className="mb-2">
            Order Summary
          </Heading>
          <Divider className="mb-4" />

          <VStack space="sm">
            <HStack className="justify-between">
              <Text className="text-gray-600">Subtotal</Text>
              <Text>{formatPrice(order.totalAmount)}</Text>
            </HStack>

            <HStack className="justify-between">
              <Text className="text-gray-600">Shipping</Text>
              <Text>Free</Text>
            </HStack>

            <Divider className="my-2" />

            <HStack className="justify-between">
              <Text className="font-semibold">Total</Text>
              <Text className="font-bold">
                {formatPrice(order.totalAmount)}
              </Text>
            </HStack>
          </VStack>
        </Card>

        {/* Cancel Order Button - Only show when order is processing */}
        {order.status === OrderStatus.PROCESSING && (
          <Card className="p-4 mt-4">
            <Button
              action="negative"
              onPress={handleCancelPress}
              className="w-full"
              isDisabled={updateOrderStatus.isPending}
            >
              <ButtonText>
                {updateOrderStatus.isPending
                  ? "Canceling..."
                  : "Cancel Order"}
              </ButtonText>
            </Button>
          </Card>
        )}
      </Box>

      {/* Cancel Order Confirmation Modal */}
      <Modal isOpen={showCancelModal} onClose={handleModalClose}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Cancel Order</Heading>
          </ModalHeader>
          <ModalBody>
            <Text>
              Are you sure you want to cancel this order? This action
              cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack space="md" className="w-full">
              <Button
                variant="outline"
                onPress={handleModalClose}
                className="flex-1"
              >
                <ButtonText>Keep Order</ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={handleCancelOrder}
                className="flex-1 text-white"
                isDisabled={updateOrderStatus.isPending}
              >
                <ButtonText>
                  {updateOrderStatus.isPending
                    ? "Canceling..."
                    : "Cancel Order"}
                </ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
};

export default OrderDetailsScreen;
