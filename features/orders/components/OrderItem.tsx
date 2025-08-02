import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { formatPrice } from "@/utils/price";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import OrderStatusBadge from "./OrderStatusBadge";
import { Order } from "@/types/order";

const OrderItem = ({
  item,
  onDetailsPress,
}: {
  item: Order;
  onDetailsPress: (id: string) => void;
}) => {
  return (
    <Box className="mb-3">
      <Box className="bg-white p-4 rounded-lg shadow-sm">
        <HStack className="justify-between items-center mb-2">
          <Text className="font-bold">Order #{item.id.substring(0, 8)}</Text>
          <OrderStatusBadge status={item.status} />
        </HStack>

        <Divider className="my-2" />

        <HStack className="justify-between items-center mb-2">
          <Text className="text-gray-600">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text className="font-bold">{formatPrice(item.totalAmount)}</Text>
        </HStack>

        <HStack className="justify-between items-center">
          <Text className="text-gray-600">
            {item.items.length} {item.items.length === 1 ? "item" : "items"}
          </Text>
          <Button
            size="xs"
            variant="link"
            onPress={() => onDetailsPress(item.id)}
          >
            <ButtonText className="text-primary-600">View Details</ButtonText>
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default OrderItem;
