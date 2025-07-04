import { Stack } from "expo-router";

const OrdersLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "My Orders",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Order Details",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
    </Stack>
  );
};

export default OrdersLayout;
