import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { Icon } from "@/components/ui/icon";
import { ShoppingBag, ArrowLeft } from "lucide-react-native";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { useGetCheckoutInfoQuery } from "@/features/payments/queries/hooks/useGetCheckoutInfo";
import { useProcessCheckoutMutation } from "@/features/payments/mutations/hooks/useCheckout";
import useCustomToast from "@/hooks/useCustomToast";
import { formatPrice } from "@/utils/price";
import { PaymentMethodsList } from "@/features/payments/components/PaymentMethodsList";
import { AddPaymentMethodForm } from "@/features/payments/components/AddPaymentMethodForm";
import useGetPaymentMethods from "@/features/payments/queries/hooks/useGetPaymentMethods";

const CheckoutScreen = () => {
  const router = useRouter();
  const toast = useCustomToast();
  const { confirmPayment } = useStripe();
  const { itemIds } = useLocalSearchParams<{ itemIds: string }>();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >(undefined);
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    data: checkoutInfo,
    isLoading,
    isError,
    refetch,
  } = useGetCheckoutInfoQuery(itemIds);

  const { paymentMethods } = useGetPaymentMethods();

  const { mutate: processCheckout, isPending } = useProcessCheckoutMutation();

  useEffect(() => {
    if (checkoutInfo?.defaultPaymentMethod) {
      setSelectedPaymentMethod(checkoutInfo.defaultPaymentMethod.id);
    }
  }, [checkoutInfo]);

  const handleSetDefaultPaymentMethod = (id: string) => {
    setSelectedPaymentMethod(id);
  };

  const handleAddPaymentMethod = () => {
    setShowAddForm(true);
  };

  const handleAddPaymentMethodComplete = () => {
    setShowAddForm(false);
    refetch();
  };

  const handleCheckout = async () => {
    if (!checkoutInfo || !selectedPaymentMethod) {
      toast.toastError("Please select a payment method");
      return;
    }

    processCheckout(
      {
        paymentMethodId: selectedPaymentMethod,
        itemIds: itemIds?.split(","),
        return_url: "designdripmobile://orders",
      },
      {
        onSuccess: async (data) => {
          if (data.requiresAction && data.clientSecret) {
            try {
              // Handle 3D Secure authentication if needed
              const { error, paymentIntent } = await confirmPayment(
                data.clientSecret
              );

              if (error) {
                toast.toastError(`Payment failed: ${error.message}`);
              } else if (paymentIntent.status === "Succeeded") {
                toast.toastSuccess("Payment successful!");
                router.navigate(
                  `/(tabs)/(profile)/orders/${
                    data.orderId || data.paymentIntentId
                  }`
                );
              } else {
                toast.toastSuccess("Order created, payment processing");
                router.navigate("/(tabs)/(profile)/orders");
              }
            } catch (e) {
              console.error("Payment confirmation error:", e);
              toast.toastError("Payment confirmation failed");
            }
          } else if (data.status.toLowerCase() === "succeeded") {
            toast.toastSuccess("Payment successful!");
            router.navigate(
              `/(tabs)/(profile)/orders/${data.orderId || data.paymentIntentId}`
            );
          } else {
            toast.toastSuccess("Order created, payment processing");
            router.navigate("/(tabs)/(profile)/orders");
          }
        },
        onError: (error: Error | any) => {
          const errorMessage =
            error?.response?.data?.error || error?.message || "Payment failed";
          toast.toastError(errorMessage);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box className="flex-1 bg-background-0">
        <Center className="flex-1">
          <VStack space="md" className="items-center">
            <Spinner size="large" />
            <Text className="text-typography-600">
              Loading checkout information...
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (isError || !checkoutInfo) {
    return (
      <Box className="flex-1 bg-background-0 p-4">
        <VStack space="md" className="items-center justify-center flex-1">
          <Text className="text-error-500 mb-4">
            There was an error loading your checkout information.
          </Text>
          <Button onPress={() => refetch()}>
            <ButtonText>Try Again</ButtonText>
          </Button>
          <Button
            variant="outline"
            onPress={() => router.back()}
            className="flex-row items-center mt-2"
          >
            <Icon as={ArrowLeft} size="sm" className="mr-2" />
            <ButtonText>Return to Cart</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  if (!checkoutInfo.items || checkoutInfo.items.length === 0) {
    return (
      <Box className="flex-1 bg-background-0 p-4">
        <VStack space="md" className="items-center justify-center flex-1">
          <Icon as={ShoppingBag} size="xl" className="text-typography-300" />
          <Heading size="lg" className="text-typography-900 mb-2">
            No Items Selected
          </Heading>
          <Text className="text-typography-500 mb-6 text-center">
            Please select items from your cart to proceed with checkout.
          </Text>
          <Button onPress={() => router.push("/(tabs)/(cart)")}>
            <ButtonText>Return to Cart</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Order Summary */}
        <Card className="p-4 mb-4">
          <VStack space="md">
            <Heading size="lg">Order Summary</Heading>
            <Divider />

            {checkoutInfo.items.map((item) => (
              <HStack key={item.id} className="justify-between mb-2">
                <VStack>
                  <Text className="font-medium">{item.designName}</Text>
                  <Text className="text-typography-600">
                    {item.name} ({item.color})
                  </Text>
                </VStack>
                <Text className="font-medium">{formatPrice(item.total)}</Text>
              </HStack>
            ))}
          </VStack>
        </Card>

        {/* Payment Method */}
        <Card className="p-4 mb-4">
          <VStack space="md">
            <Heading size="lg">Payment Method</Heading>
            <Divider />

            {showAddForm ? (
              <AddPaymentMethodForm
                onSubmit={() => {}}
                onCancel={() => setShowAddForm(false)}
                isLoading={false}
                onSuccess={handleAddPaymentMethodComplete}
              />
            ) : (
              <VStack space="md">
                {checkoutInfo.hasPaymentMethods ? (
                  <PaymentMethodsList
                    paymentMethods={paymentMethods || []}
                    isLoading={false}
                    onAddPaymentMethod={handleAddPaymentMethod}
                    selectMode={true}
                    onSelectPaymentMethod={handleSetDefaultPaymentMethod}
                    selectedPaymentMethod={selectedPaymentMethod}
                  />
                ) : (
                  <VStack space="md" className="items-center py-4">
                    <Text className="text-typography-600 text-center">
                      You don't have any saved payment methods.
                    </Text>
                    <Button onPress={handleAddPaymentMethod} className="mt-2">
                      <ButtonText>Add Payment Method</ButtonText>
                    </Button>
                  </VStack>
                )}
              </VStack>
            )}
          </VStack>
        </Card>

        {/* Order Total */}
        <Card className="p-4">
          <VStack space="md">
            <Heading size="lg">Order Total</Heading>
            <Divider />

            <HStack className="justify-between">
              <Text className="text-typography-600">Subtotal</Text>
              <Text>{formatPrice(checkoutInfo.totalAmount)}</Text>
            </HStack>

            <HStack className="justify-between">
              <Text className="font-bold text-lg">Total</Text>
              <Text className="font-bold text-lg">
                {formatPrice(checkoutInfo.totalAmount)}
              </Text>
            </HStack>

            <Button
              onPress={handleCheckout}
              disabled={isPending || !selectedPaymentMethod}
              className="w-full mt-4"
            >
              {isPending ? (
                <HStack space="sm" className="items-center">
                  <Spinner size="small" color="white" />
                  <ButtonText className="text-white">Processing...</ButtonText>
                </HStack>
              ) : (
                <ButtonText className="text-white">
                  Pay {formatPrice(checkoutInfo.totalAmount)}
                </ButtonText>
              )}
            </Button>
          </VStack>
        </Card>
      </ScrollView>
    </Box>
  );
};

export default CheckoutScreen;
