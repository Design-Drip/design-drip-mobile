import React, { useState } from "react";
import {
  useStripe,
  CardField,
  CardFieldInput,
} from "@stripe/stripe-react-native";
import { Alert, Platform, TouchableOpacity } from "react-native";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { AddPaymentMethodRequest } from "../types";
import { PAYMENT_CONFIG } from "@/constants/config";
import { ArrowLeftIcon, Icon } from "@/components/ui/icon";
import { Check } from "lucide-react-native";

interface AddPaymentMethodFormProps {
  onSubmit: (data: AddPaymentMethodRequest) => void;
  onCancel: () => void;
  isLoading: boolean;
  onSuccess?: () => void;
}

export const AddPaymentMethodForm = ({
  onSubmit,
  onCancel,
  isLoading,
  onSuccess,
}: AddPaymentMethodFormProps) => {
  const { createPaymentMethod } = useStripe();
  const [makeDefault, setMakeDefault] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(
    null
  );
  const handleAddPaymentMethod = async () => {
    try {
      setProcessing(true);

      // Check if card details are valid
      if (!cardDetails?.complete) {
        Alert.alert(
          "Error",
          "Please enter complete and valid card information."
        );
        setProcessing(false);
        return;
      }
      // Create a payment method directly using Stripe SDK
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            // Optional: Add billing details if needed
            // name: 'John Doe',
          },
        },
      });

      if (error) {
        console.error("Failed to create payment method:", error);
        Alert.alert(
          "Error",
          `Failed to create payment method: ${error.message}`
        );
        setProcessing(false);
        return;
      }

      if (!paymentMethod) {
        Alert.alert("Error", "Failed to create payment method");
        setProcessing(false);
        return;
      }

      // Submit the payment method to the backend
      onSubmit({
        paymentMethodId: paymentMethod.id,
        setAsDefault: makeDefault,
      });

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      setProcessing(false);
    } catch (err: any) {
      console.error("Add payment method error:", err);
      Alert.alert(
        "Error",
        `An error occurred: ${err.message || "Unknown error"}`
      );
      setProcessing(false);
    }
  };

  const isButtonDisabled = isLoading || processing;
  return (
    <Box className="">
      <VStack space="lg">
        <Text className="text-gray-600">
          Enter your card details below to add a new credit or debit card.
        </Text>
        {/* Card input field */}
        <Box className="border border-gray-300 rounded-md p-2 mb-3">
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: "4242 4242 4242 4242",
            }}
            cardStyle={{
              backgroundColor: "#FFFFFF",
              textColor: "#000000",
              borderRadius: 5,
            }}
            style={{
              width: "100%",
              height: 50,
            }}
            onCardChange={(cardDetails) => {
              setCardDetails(cardDetails);
            }}
          />
        </Box>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setMakeDefault(!makeDefault)}
          className="flex-row items-center mb-2"
        >
          <Box
            className={`w-6 h-6 mr-2 border border-gray-400 rounded-sm ${
              makeDefault ? "bg-blue-500" : "bg-white"
            } items-center justify-center`}
          >
            {makeDefault && <Icon as={Check} size="sm" color="white" />}
          </Box>
          <Text>Set as default payment method</Text>
        </TouchableOpacity>
        <Button
          onPress={handleAddPaymentMethod}
          disabled={
            isButtonDisabled ||
            (!PAYMENT_CONFIG.USE_MOCK_PAYMENTS && !cardDetails?.complete)
          }
        >
          {isButtonDisabled ? (
            <HStack space="sm" className="items-center">
              <Spinner size="small" color="white" />
              <ButtonText className="text-white">Processing...</ButtonText>
            </HStack>
          ) : (
            <ButtonText className="text-white">Add Payment Method</ButtonText>
          )}
        </Button>
        <Button
          onPress={onCancel}
          className="mt-4 flex-row items-center space-x-2"
          variant="outline"
        >
          <Icon as={ArrowLeftIcon} />
          <ButtonText>Back</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
};
