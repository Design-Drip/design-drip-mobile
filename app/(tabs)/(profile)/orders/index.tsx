import React, { useState } from "react";
import { FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { Icon } from "@/components/ui/icon";
import { useGetOrdersQuery } from "@/features/orders/queries";
import { useRouter } from "expo-router";
import { PackageIcon } from "lucide-react-native";
import { OrderStatus } from "@/constants/orders";
import OrderItem from "@/features/orders/components/OrderItem";

const OrdersScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();

  const { data, isLoading, isError, refetch, isRefetching } = useGetOrdersQuery(
    currentPage,
    10,
    selectedStatus
  );

  const handleOrderPress = (orderId: string) => {
    router.push(`/(tabs)/(profile)/orders/${orderId}`);
  };

  const handleStatusFilter = (status?: string) => {
    setCurrentPage(1);
    setSelectedStatus(status);
  };

  const renderFilterButtons = () => (
    <Box className="py-2">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
        data={[
          { label: "All", value: undefined },
          { label: "Delivered", value: OrderStatus.DELIVERED },
          { label: "Shipped", value: OrderStatus.SHIPPED },
          { label: "Shipping", value: OrderStatus.SHIPPING },
          { label: "Processing", value: OrderStatus.PROCESSING },
          { label: "Pending", value: OrderStatus.PENDING },
          { label: "Canceled", value: OrderStatus.CANCELED },
        ]}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <Button
            className={`mr-2 ${
              selectedStatus === item.value ? "bg-primary-600" : "bg-gray-200"
            }`}
            size="sm"
            onPress={() => handleStatusFilter(item.value)}
          >
            <ButtonText
              className={
                selectedStatus === item.value ? "text-white" : "text-gray-800"
              }
            >
              {item.label}
            </ButtonText>
          </Button>
        )}
      />
    </Box>
  );

  const renderEmptyList = () => {
    if (isLoading) return null;

    return (
      <Box className="flex-1 justify-center items-center py-10">
        <Icon as={PackageIcon} size="xl" className="text-gray-400 mb-4" />
        <Heading size="md" className="text-gray-600 mb-2 text-center">
          No Orders Found
        </Heading>
        <Text className="text-gray-500 text-center mb-4">
          {selectedStatus
            ? "Try selecting a different status filter"
            : "Your order history will appear here"}
        </Text>
        {selectedStatus && (
          <Button onPress={() => handleStatusFilter(undefined)}>
            <ButtonText>Show All Orders</ButtonText>
          </Button>
        )}
      </Box>
    );
  };

  const handleLoadMore = () => {
    if (
      data?.pagination.hasNextPage &&
      !isLoading &&
      !isRefetching &&
      currentPage < data.pagination.totalPages
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <Box className="py-4 items-center justify-center">
        <ActivityIndicator size="small" color="#6366F1" />
      </Box>
    );
  };

  if (isError) {
    return (
      <Box className="flex-1 justify-center items-center p-4">
        <Text className="text-error-600 mb-4">
          Failed to load orders. Please try again.
        </Text>
        <Button onPress={() => refetch()}>
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <VStack className="flex-1">
        {renderFilterButtons()}

        <FlatList
          data={data?.orders || []}
          renderItem={({ item }) => (
            <OrderItem item={item} onDetailsPress={handleOrderPress} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={refetch}
            />
          }
          ListEmptyComponent={renderEmptyList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </VStack>
    </Box>
  );
};

export default OrdersScreen;
