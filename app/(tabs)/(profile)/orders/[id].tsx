import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>{id}</Text>;
};

export default OrderDetailsScreen;
