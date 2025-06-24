import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { PROFILE_ROUTES } from "@/constants/routes";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { ArrowLeftIcon } from "lucide-react-native";
import { PaymentMethodsList } from "@/features/payments/components/PaymentMethodsList";
import { AddPaymentMethodForm } from "@/features/payments/components/AddPaymentMethodForm";
import useGetPaymentMethods from "@/features/payments/queries/hooks/useGetPaymentMethods";
import {
  useAddPaymentMethod,
  useDeletePaymentMethod,
  useSetDefaultPaymentMethod,
} from "@/features/payments/mutations/hooks/usePaymentMethods";
import { AddPaymentMethodRequest } from "@/types/payment";
import { PAYMENT_CONFIG } from "@/constants/config";
import { A } from "@expo/html-elements";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  // Queries
  const { paymentMethods, isLoading } = useGetPaymentMethods();

  // Mutations
  const addPaymentMethodMutation = useAddPaymentMethod();
  const deletePaymentMethodMutation = useDeletePaymentMethod();
  const setDefaultPaymentMethodMutation = useSetDefaultPaymentMethod();

  const handleAddPaymentMethod = () => {
    setShowAddForm(true);
  };
  const handleSubmitPaymentMethod = (data: AddPaymentMethodRequest) => {
    console.log("Payment Methods Screen: submitting with data:", data);
    addPaymentMethodMutation.mutate(data, {
      onSuccess: (response) => {
        console.log("Payment method added successfully, response:", response);
        // Make sure we refresh the payment methods list to reflect the new default status
        setShowAddForm(false);
      },
      onError: (error) => {
        console.error("Error adding payment method from screen:", error);
      },
    });
  };

  const handleDeletePaymentMethod = (id: string) => {
    deletePaymentMethodMutation.mutate({ paymentMethodId: id });
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setDefaultPaymentMethodMutation.mutate({ paymentMethodId: id });
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <Box className="p-4">
        {/* Remove redundant header as this is already in the navigation header */}
        <VStack space="lg">
          {showAddForm ? (
            <VStack>
              <AddPaymentMethodForm
                onSubmit={handleSubmitPaymentMethod}
                onCancel={() => setShowAddForm(false)}
                isLoading={addPaymentMethodMutation.isPending}
              />
            </VStack>
          ) : (
            <>
              <Text className="mb-4">
                Click the button below to add a new credit or debit card to your
                account.
              </Text>
              <PaymentMethodsList
                paymentMethods={paymentMethods || []}
                isLoading={isLoading}
                onAddPaymentMethod={handleAddPaymentMethod}
                onDeletePaymentMethod={handleDeletePaymentMethod}
                onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
              />
            </>
          )}
        </VStack>
      </Box>
    </ScrollView>
  );
}
