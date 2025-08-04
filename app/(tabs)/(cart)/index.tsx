import React, { useState, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getCartQuery } from "@/features/cart/queries";
import {
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/features/cart/mutations";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { Spinner } from "@/components/ui/spinner";
import { Center } from "@/components/ui/center";
import { ShoppingBag, ArrowLeft, ChevronUp } from "lucide-react-native";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { CheckIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useRouter } from "expo-router";
import { formatPrice } from "@/utils/price";
import useCustomToast from "@/hooks/useCustomToast";
import CartItem from "@/features/cart/components/CartItem";
import { OrderModal } from "@/features/orders/components/OrderModal";
import { CartItem as CartItemType } from "@/features/cart/queries/types";
import OrderSummaryActionsheet from "@/features/cart/components/OrderSummaryActionsheet";

const ITEMS_PER_PAGE = 4;

const CartScreen = () => {
  const router = useRouter();
  const toast = useCustomToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<CartItemType | null>(
    null
  );

  const {
    data: cartData,
    isLoading,
    isError,
    refetch,
  } = useQuery(getCartQuery());

  const updateCartMutation = useUpdateCartItemMutation();
  const removeCartMutation = useRemoveFromCartMutation();

  useEffect(() => {
    if (cartData?.items) {
      setSelectedItems([]);
    }
  }, [cartData?.items]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const currentCartItems = cartData?.items
    ? cartData.items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : [];

  const totalPages = cartData?.items
    ? Math.ceil(cartData.items.length / ITEMS_PER_PAGE)
    : 1;

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateQuantity = (
    itemId: string,
    size: string,
    quantity: number
  ) => {
    if (!cartData) return;

    const item = cartData.items.find((item) => item.id === itemId);
    if (!item) return;

    const updatedSizes = item.data.map((sizeData) => ({
      size: sizeData.size,
      quantity: sizeData.size === size ? quantity : sizeData.quantity,
    }));

    updateCartMutation.mutate(
      {
        itemId,
        payload: { quantityBySize: updatedSizes },
      },
      {
        onSuccess: () => {
          toast.toastSuccess("Cart updated");
        },
        onError: (error) => {
          toast.toastError("Failed to update cart");
          console.error(error);
        },
      }
    );
  };

  const handleRemoveItem = (itemId: string) => {
    removeCartMutation.mutate(itemId, {
      onSuccess: () => {
        setSelectedItems((prev) => prev.filter((id) => id !== itemId));
        toast.toastSuccess("Item removed from cart");
      },
      onError: (error) => {
        toast.toastError("Failed to remove item");
        console.error(error);
      },
    });
  };

  const handleToggleSelect = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (cartData?.items) {
      if (selectedItems.length === currentCartItems.length) {
        setSelectedItems((prev) =>
          prev.filter((id) => !currentCartItems.some((item) => item.id === id))
        );
      } else {
        const currentIds = currentCartItems.map((item) => item.id);
        setSelectedItems((prev) => {
          const existingIds = prev.filter(
            (id) => !currentCartItems.some((item) => item.id === id)
          );
          return [...existingIds, ...currentIds];
        });
      }
    }
  };

  const handleCheckout = () => {
    if (!hasSelectedItems) {
      toast.toastError("Please select items to checkout");
      return;
    }

    // Pass selected item IDs to checkout screen
    router.push({
      pathname: "/(tabs)/(cart)/checkout",
      params: { itemIds: selectedItems.join(",") },
    });
  };

  const handleEditItem = (item: CartItemType) => {
    setCurrentEditItem(item);
    setEditModalVisible(true);
  };

  const subtotal = cartData?.items
    ? cartData.items
        .filter((item) => selectedItems.includes(item.id))
        .reduce(
          (sum, item) =>
            sum +
            item.data.reduce(
              (sum, sizeData) =>
                sum + sizeData.pricePerSize * sizeData.quantity,
              0
            ),
          0
        )
    : 0;

  // Calculate shipping based on subtotal
  // Standard shipping is free for all orders
  const shipping = 0;
  const total = subtotal + shipping;

  const allVisibleSelected =
    currentCartItems.length > 0 &&
    currentCartItems.every((item) => selectedItems.includes(item.id));
  const hasSelectedItems = selectedItems.length > 0;

  if (isLoading) {
    return (
      <Box className="flex-1 bg-background-0">
        <Center className="flex-1">
          <VStack space="md" className="items-center">
            <Spinner size="large" />
            <Text className="text-typography-600">Loading your cart...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="flex-1 bg-background-0">
        <Center className="flex-1">
          <VStack space="md" className="items-center">
            <Text className="text-error-500 mb-4">
              There was an error loading your cart.
            </Text>
            <Button onPress={() => refetch()}>
              <ButtonText>Try Again</ButtonText>
            </Button>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (!cartData?.items || cartData.items.length === 0) {
    return (
      <Box className="flex-1 bg-background-0 p-4">
        <Center className="flex-1 p-4">
          <VStack space="md" className="items-center">
            <Icon as={ShoppingBag} size="xl" className="text-typography-300" />
            <Heading size="lg" className="text-typography-900 mb-2">
              Your cart is empty
            </Heading>
            <Text className="text-typography-500 mb-6 text-center">
              Looks like you haven't added any items to your cart yet.
            </Text>
            <Button
              className="bg-primary-600"
              onPress={() => router.push("/(tabs)/(products)")}
            >
              <ButtonText className="text-white">Start Shopping</ButtonText>
            </Button>
          </VStack>
        </Center>
      </Box>
    );
  }

  const renderItem = ({ item }: { item: CartItemType }) => {
    // Get the first image as primary image or use placeholder
    const primaryImage =
      item.previewImages?.length > 0
        ? item.previewImages[0].url
        : "/assets/images/shirt-placeholder.webp";

    // Calculate total price for this item
    const itemTotal = item.data.reduce(
      (sum, sizeData) => sum + sizeData.pricePerSize * sizeData.quantity,
      0
    );

    return (
      <CartItem
        id={item.id}
        designId={item.designId}
        name={`${item.designName} - ${item.name}`}
        price={
          itemTotal /
          item.data.reduce((sum, sizeData) => sum + sizeData.quantity, 0)
        }
        image={primaryImage}
        quantity={item.data.reduce(
          (sum, sizeData) => sum + sizeData.quantity,
          0
        )}
        sizes={item.data}
        color={item.color}
        selected={selectedItems.includes(item.id)}
        onEdit={() => handleEditItem(item)}
        onRemove={() => handleRemoveItem(item.id)}
        onToggleSelect={() => handleToggleSelect(item.id)}
      />
    );
  };

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <HStack className="justify-center mt-4 mb-2 space-x-2">
        <Button
          size="sm"
          variant="outline"
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ButtonText>Previous</ButtonText>
        </Button>
        <Text className="self-center mx-2">
          {currentPage} / {totalPages}
        </Text>
        <Button
          size="sm"
          variant="outline"
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ButtonText>Next</ButtonText>
        </Button>
      </HStack>
    );
  };

  return (
    <Box className="flex-1 bg-background-0">
      <FlatList
        data={currentCartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        ItemSeparatorComponent={() => <Box className="h-4" />}
        ListFooterComponent={renderPaginationControls}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <Card className="absolute bottom-0 left-0 right-0 bg-background-0 border-t border-outline-100 shadow-lg">
        <Pressable onPress={() => setSummarySheetOpen(true)}>
          <HStack className="px-4 items-center justify-between">
            <HStack space="xs" className="items-center">
              <Text className="text-typography-600 font-medium">Total:</Text>
              <Text className="text-typography-900 font-bold text-lg">
                {formatPrice(total)}
              </Text>
            </HStack>
            <Icon as={ChevronUp} size="sm" className="text-typography-500" />
          </HStack>
        </Pressable>

        <HStack className="px-4 items-center justify-between">
          <HStack className="space-x-3 gap-2">
            <Checkbox
              value="select-all"
              isChecked={allVisibleSelected && currentCartItems.length > 0}
              onChange={handleSelectAll}
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
            </Checkbox>
            <Text className="text-typography-700 font-medium">
              Select All ({selectedItems.length}/{cartData.totalItems})
            </Text>
          </HStack>
          <Button
            className="bg-primary-600"
            disabled={!hasSelectedItems}
            onPress={handleCheckout}
          >
            <ButtonText className="text-white">
              Checkout ({selectedItems.length})
            </ButtonText>
          </Button>
        </HStack>
      </Card>

      <OrderSummaryActionsheet
        isOpen={summarySheetOpen}
        onClose={() => setSummarySheetOpen(false)}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        itemCount={selectedItems.length}
        hasSelectedItems={hasSelectedItems}
        onCheckout={handleCheckout}
      />

      {currentEditItem && (
        <OrderModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          designId={currentEditItem.designId}
          designName={currentEditItem.designName}
          mode="edit"
          itemId={currentEditItem.id}
          initialQuantities={currentEditItem.data.map((item) => ({
            size: item.size,
            quantity: item.quantity,
          }))}
          colorId={currentEditItem.colorId}
        />
      )}
    </Box>
  );
};

export default CartScreen;
