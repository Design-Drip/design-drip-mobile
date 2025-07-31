import React, { useState, useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Check, MapPin } from "lucide-react-native";
import {
  AddressSheet,
  AddressSheetError,
  StripeError,
} from "@stripe/stripe-react-native";
import { ShippingAddress } from "@/features/payments/types";
import { CollectAddressResult } from "@stripe/stripe-react-native/lib/typescript/src/components/AddressSheet";

interface AddressElementProps {
  openAddressSheet: boolean;
  address: ShippingAddress | null;
  shippingMethod: "standard" | "express";
  onSubmit: (address: CollectAddressResult) => void;
  onShippingMethodChange: (method: "standard" | "express") => void;
  onOpenAddressSheet: () => void;
  onError: (error: StripeError<AddressSheetError>) => void;
}

const AddressElement = ({
  openAddressSheet,
  address,
  shippingMethod,
  onSubmit,
  onShippingMethodChange,
  onOpenAddressSheet,
  onError,
}: AddressElementProps) => {
  return (
    <VStack space="lg">
      {/* Shipping Address Selection */}
      <VStack space="md">
        <Heading size="md">Shipping Address</Heading>

        <Button
          variant="outline"
          onPress={onOpenAddressSheet}
          className="p-4 h-auto justify-start"
        >
          <Box className="flex-row items-center w-full">
            <Icon as={MapPin} size="lg" className="text-primary-600 mr-3" />
            <VStack className="flex-1 items-start">
              {address ? (
                <>
                  <Text className="font-medium text-typography-900">
                    {address.name}
                  </Text>
                  <Text className="text-sm text-typography-600">
                    {address.address.line1}
                    {address.address.line2 && `, ${address.address.line2}`}
                  </Text>
                  <Text className="text-sm text-typography-600">
                    {address.address.city}, {address.address.state}{" "}
                    {address.address.postal_code}
                  </Text>
                  <Text className="text-sm text-typography-600">
                    {address.address.country}
                  </Text>
                  {address.phone && (
                    <Text className="text-sm text-typography-600">
                      {address.phone}
                    </Text>
                  )}
                </>
              ) : (
                <>
                  <Text className="font-medium text-typography-900">
                    Add Shipping Address
                  </Text>
                  <Text className="text-sm text-typography-600">
                    Tap to enter your shipping address
                  </Text>
                </>
              )}
            </VStack>
          </Box>
        </Button>

        <AddressSheet
          visible={openAddressSheet}
          onSubmit={onSubmit}
          onError={onError}
          presentationStyle="pageSheet"
          animationStyle="slide"
          additionalFields={{
            phoneNumber: "required",
          }}
          defaultValues={
            address
              ? {
                  name: address.name,
                  phone: address.phone,
                  address: {
                    line1: address.address.line1,
                    city: address.address.city,
                    state: address.address.state,
                    postalCode: address.address.postal_code,
                    country: address.address.country,
                  },
                }
              : undefined
          }
        />
      </VStack>

      {/* Shipping Method Selection */}
      <VStack space="md">
        <Heading size="md">Shipping Method</Heading>

        <TouchableOpacity
          onPress={() => onShippingMethodChange("standard")}
          className="flex-row items-center p-3 border border-gray-200 rounded-lg"
        >
          <Box
            className={`w-6 h-6 mr-3 border border-gray-400 rounded-full ${
              shippingMethod === "standard" ? "bg-primary-500" : "bg-white"
            } items-center justify-center`}
          >
            {shippingMethod === "standard" && (
              <Icon as={Check} size="sm" color="white" />
            )}
          </Box>
          <VStack className="flex-1">
            <Text className="font-semibold">Standard Shipping (Free)</Text>
            <Text className="text-sm text-gray-600">
              Delivery in 5-7 business days
            </Text>
          </VStack>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onShippingMethodChange("express")}
          className="flex-row items-center p-3 border border-gray-200 rounded-lg"
        >
          <Box
            className={`w-6 h-6 mr-3 border border-gray-400 rounded-full ${
              shippingMethod === "express" ? "bg-primary-500" : "bg-white"
            } items-center justify-center`}
          >
            {shippingMethod === "express" && (
              <Icon as={Check} size="sm" color="white" />
            )}
          </Box>
          <VStack className="flex-1">
            <Text className="font-semibold">Express Shipping (₫30,000)</Text>
            <Text className="text-sm text-gray-600">
              Delivery in 1-2 business days
            </Text>
          </VStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
};

export default AddressElement;
