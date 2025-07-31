import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { OrderStatus } from "@/constants/orders";

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusColor = () => {
    switch (status) {
      case "delivered":
        return "bg-success-100 text-success-800";
      case "shipped":
        return "bg-info-100 text-info-800";
      case "processing":
        return "bg-warning-100 text-warning-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "canceled":
        return "bg-error-100 text-error-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabel = status.at(0)?.toUpperCase() + status.slice(1);

  return (
    <Box className={`px-2 py-1 rounded-full ${getStatusColor()}`}>
      <Text className="text-base font-semibold">{statusLabel}</Text>
    </Box>
  );
};

export default OrderStatusBadge;
