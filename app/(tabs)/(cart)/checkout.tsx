import { useState, useEffect, useCallback } from "react";
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
import AddressElement from "@/features/payments/components/AddressElement";
import { ShippingAddress } from "@/features/payments/types";
import { CollectAddressResult } from "@stripe/stripe-react-native/lib/typescript/src/components/AddressSheet";

const CheckoutScreen = () => {
  const router = useRouter();
  const toast = useCustomToast();
  const { confirmPayment } = useStripe();
  const { itemIds } = useLocalSearchParams<{ itemIds: string }>();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >(undefined);
  const [showAddForm, setShowAddForm] = useState(false);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [addressComplete, setAddressComplete] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [showAddressSheet, setShowAddressSheet] = useState(false);

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

    if (!addressComplete || !shippingAddress) {
      toast.toastError("Please provide a complete shipping address");
      return;
    }

    processCheckout(
      {
        paymentMethodId: selectedPaymentMethod,
        itemIds: itemIds?.split(","),
        return_url: "designdripmobile://orders",
        shipping: shippingAddress,
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

  const handleAddressSubmit = useCallback(
    (address: CollectAddressResult) => {
      const shippingAddress: ShippingAddress = {
        name: address.name || "",
        phone: address.phone || "",
        address: {
          line1: address.address.line1 || "",
          city: address.address.city || "",
          state: address.address.state || "",
          postal_code: address.address.postalCode || "",
          country: address.address.country || "VN",
        },
        method: shippingMethod,
        cost: shippingMethod === "express" ? 30000 : 0,
      };

      setShippingAddress(shippingAddress);

      const isComplete = !!(
        shippingAddress.name &&
        shippingAddress.address.line1 &&
        shippingAddress.address.city &&
        shippingAddress.address.state &&
        shippingAddress.address.postal_code &&
        shippingAddress.address.country
      );

      setAddressComplete(isComplete);
      setShowAddressSheet(false);
    },
    [shippingMethod]
  );

  const handleShippingMethodChange = useCallback(
    (method: "standard" | "express") => {
      setShippingMethod(method);
      const cost = method === "express" ? 30000 : 0;
      setShippingCost(cost);

      if (shippingAddress) {
        const updatedAddress = {
          ...shippingAddress,
          method,
          cost,
        };
        setShippingAddress(updatedAddress);
      }
    },
    [shippingAddress]
  );

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

        {/* Shipping Address */}
        <Card className="p-4 mb-4">
          <VStack space="md">
            <Heading size="lg">Shipping Information</Heading>
            <Divider />
            <AddressElement
              openAddressSheet={showAddressSheet}
              address={shippingAddress}
              shippingMethod={shippingMethod}
              onSubmit={handleAddressSubmit}
              onShippingMethodChange={handleShippingMethodChange}
              onOpenAddressSheet={() => setShowAddressSheet(true)}
              onError={(error) => {
                console.error("Address error:", error);
                setShowAddressSheet(false);
              }}
            />
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
              <Text className="text-typography-600">Shipping</Text>
              <Text>
                {shippingCost > 0 ? formatPrice(shippingCost) : "Free"}
              </Text>
            </HStack>

            <Divider className="my-2" />

            <HStack className="justify-between">
              <Text className="font-bold text-lg">Total</Text>
              <Text className="font-bold text-lg">
                {formatPrice(checkoutInfo.totalAmount + shippingCost)}
              </Text>
            </HStack>

            <Button
              onPress={handleCheckout}
              disabled={isPending || !selectedPaymentMethod || !addressComplete}
              className="w-full mt-4"
            >
              {isPending ? (
                <HStack space="sm" className="items-center">
                  <Spinner size="small" color="white" />
                  <ButtonText className="text-white">Processing...</ButtonText>
                </HStack>
              ) : (
                <ButtonText className="text-white">
                  Pay {formatPrice(checkoutInfo.totalAmount + shippingCost)}
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
