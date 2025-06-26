import React, { useState } from "react";
import { ScrollView, Alert, RefreshControl } from "react-native";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Pressable } from "@/components/ui/pressable";
import { Divider } from "@/components/ui/divider";
import { Center } from "@/components/ui/center";
import { useGetDesign } from "@/features/designs/queries/use-get-design";
import { useDeleteDesign } from "@/features/designs/mutations/use-delete-design";
import { useQueryClient } from "@tanstack/react-query";
import useCustomToast from "@/hooks/useCustomToast";
import { Trash2, Edit, Eye, MoreHorizontal, Plus } from "lucide-react-native";

interface FormattedDesign {
  id: string;
  colorId: string;
  productId: string;
  previewImages: any[];
  productName: string;
  designName: string;
}

interface DesignItemProps {
  id: string;
  designName: string;
  productName: string;
  previewImages: any[];
  colorId: string;
  productId: string;
  onOrder: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const DesignItem = ({
  id,
  designName,
  productName,
  previewImages,
  onOrder,
  onDelete,
  isDeleting = false,
}: DesignItemProps) => {
  const [showActions, setShowActions] = useState(false);

  // Get the first preview image for display
  const mainImage =
    previewImages?.[0]?.[0]?.url || "/assets/images/shirt-placeholder.webp";

  return (
    <Card className="p-4 mb-4 bg-background-0 shadow-soft-1">
      <VStack space="md">
        <HStack space="md" className="items-center">
          {/* Design Image */}
          <Box className="w-16 h-16 rounded-lg overflow-hidden bg-background-100">
            <Image
              source={{ uri: mainImage }}
              className="w-full h-full"
              size="full"
              alt={`${designName} preview`}
            />
          </Box>

          {/* Design Info */}
          <VStack className="flex-1" space="xs">
            <Heading size="sm" className="text-typography-900 font-medium">
              {designName}
            </Heading>
            <Text size="sm" className="text-typography-600">
              {productName}
            </Text>
            <Text size="xs" className="text-typography-500">
              ID: {id.slice(0, 8)}...
            </Text>
          </VStack>

          {/* Actions Button */}
          <Pressable
            onPress={() => setShowActions(!showActions)}
            className="p-2 rounded-full hover:bg-background-100"
          >
            <Icon
              as={MoreHorizontal}
              size="sm"
              className="text-typography-600"
            />
          </Pressable>
        </HStack>

        {/* Action Buttons */}
        {showActions && (
          <>
            <Divider className="my-2" />
            <HStack space="sm" className="justify-end">
              <Button
                size="sm"
                variant="outline"
                onPress={() => onOrder(id)}
                className="flex-row items-center"
              >
                <Icon as={Edit} size="xs" className="mr-1" />
                <ButtonText>Order</ButtonText>
              </Button>

              <Button
                size="sm"
                action="negative"
                variant="outline"
                onPress={() => onDelete(id)}
                disabled={isDeleting}
                className="flex-row items-center"
              >
                {isDeleting ? (
                  <Spinner size="small" className="mr-1" />
                ) : (
                  <Icon as={Trash2} size="xs" className="mr-1" />
                )}
                <ButtonText>{isDeleting ? "Deleting..." : "Delete"}</ButtonText>
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Card>
  );
};

export default function DesignsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, refetch } = useGetDesign();
  const deleteDesignMutation = useDeleteDesign();
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const designsData = data?.data || [];

  const formatData = designsData.map((item: any) => {
    const previewImages = item.design_images
      ? Object.entries(item.design_images).map(([key, url]) => ({
          view: key,
          url: url as string,
        }))
      : [];
    const productId = item.shirt_color_id?.shirt_id?.id || "Unknown Color";
    const colorId = item.shirt_color_id?.id || "Unknown Product";
    return {
      id: item.id,
      colorId: colorId,
      productId: productId,
      previewImages: [previewImages],
      productName: item.shirt_color_id?.shirt_id?.name || "Unknown Product",
      designName: item.name,
    };
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleOrder = (designId: string) => {
    // Navigate to design editor
    toast.toastSuccess("Order functionality to be implemented");
  };

  const handleDelete = (designId: string) => {
    Alert.alert(
      "Delete Design",
      "Are you sure you want to delete this design? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(designId),
        },
      ]
    );
  };

  const confirmDelete = async (designId: string) => {
    try {
      await deleteDesignMutation.mutateAsync(designId);
      queryClient.invalidateQueries({ queryKey: ["design"] });

      toast.toastSuccess("Design deleted successfully");
    } catch (error) {
      toast.toastError("Failed to delete design");
      console.error("Delete design error:", error);
    }
  };

  const handleCreateNew = () => {
    // Navigate to design creation
    toast.toastSuccess("Create new design functionality to be implemented");
  };

  if (isLoading) {
    return (
      <Box className="flex-1 bg-background-0">
        <Center className="flex-1">
          <VStack space="md" className="items-center">
            <Spinner size="large" />
            <Text className="text-typography-600">Loading your designs...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <VStack space="lg" className="mb-6">
          <HStack className="items-center justify-between">
            <VStack space="xs">
              <Heading size="xl" className="text-typography-900">
                My Designs
              </Heading>
              <Text className="text-typography-600">
                Manage your custom shirt designs
              </Text>
            </VStack>

            <Button
              onPress={handleCreateNew}
              className="bg-primary-500 rounded-full p-3"
            >
              <Icon as={Plus} size="sm" className="text-white" />
            </Button>
          </HStack>

          {/* Stats */}
          <Card className="p-4 bg-primary-50">
            <HStack className="items-center justify-between">
              <VStack space="xs">
                <Text size="sm" className="text-primary-600 font-medium">
                  Total Designs
                </Text>
                <Heading size="lg" className="text-primary-900">
                  {formatData.length}
                </Heading>
              </VStack>
              <Icon as={Eye} size="lg" className="text-primary-500" />
            </HStack>
          </Card>
        </VStack>

        {/* Designs List */}
        {formatData.length === 0 ? (
          <Center className="py-12">
            <VStack space="md" className="items-center max-w-sm">
              <Icon as={Plus} size="xl" className="text-typography-400" />
              <VStack space="xs" className="items-center">
                <Text size="lg" className="text-typography-600 font-medium">
                  No designs yet
                </Text>
                <Text className="text-typography-500 text-center">
                  Create your first custom shirt design to get started
                </Text>
              </VStack>
              <Button onPress={handleCreateNew} className="mt-4">
                <ButtonText>Create Your First Design</ButtonText>
              </Button>
            </VStack>
          </Center>
        ) : (
          <VStack space="md">
            {formatData.map((design: FormattedDesign) => (
              <DesignItem
                key={design.id}
                {...design}
                onOrder={handleOrder}
                onDelete={handleDelete}
                isDeleting={deleteDesignMutation.isPending}
              />
            ))}
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
}
