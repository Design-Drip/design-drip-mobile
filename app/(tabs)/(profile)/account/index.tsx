import React, { useState } from "react";
import { ScrollView, Alert, Image, TouchableOpacity, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button-text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { CameraIcon, Trash as TrashIcon } from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Spinner } from "@/components/ui/spinner";
import * as ImagePicker from "expo-image-picker";

export default function AccountSettingsScreen() {
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.imageUrl || "");

  // Pick image from gallery or take a photo
  const pickImage = async () => {
    try {
      // Kiểm tra kết nối internet trước
      // (Có thể thêm NetInfo để kiểm tra kết nối nếu cần)

      // Ask for permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need permission to access your photos to set a profile picture."
        );
        return;
      }

      // Sửa lỗi MediaTypeOptions
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", // Sử dụng "images" thay vì ImagePicker.MediaTypeOptions.Images
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7, // Giảm chất lượng để file nhỏ hơn
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUploading(true);
        try {
          const localUri = result.assets[0].uri;
          setAvatarUrl(localUri);

          console.log("Uploading image from:", localUri); // Dùng base64 thay vì FormData (phổ biến hơn cho React Native)
          const response = await fetch(localUri);
          const blob = await response.blob();

          // Chuyển đổi blob sang base64
          const reader = new FileReader();
          reader.readAsDataURL(blob);

          reader.onloadend = async () => {
            try {
              // Make sure base64data is a string before passing it to the API
              const base64data = reader.result as string;
              console.log("Image converted to base64, uploading...");

              // Upload với base64 as a string
              await user?.setProfileImage({
                file: base64data,
              });

              console.log("Upload successful");
              Alert.alert("Success", "Profile picture updated!");
            } catch (uploadError) {
              console.error("Error in base64 upload:", uploadError);
              Alert.alert(
                "Upload Error",
                "Failed to upload image. Please try again."
              );
            } finally {
              setAvatarUploading(false);
            }
          };
          reader.onerror = (error: ProgressEvent<FileReader>) => {
            console.error("Error converting to base64:", error);
            Alert.alert("Error", "Failed to process image");
            setAvatarUploading(false);
          };
        } catch (error) {
          console.error("Error in upload process:", error);
          Alert.alert(
            "Error",
            "Failed to upload. Check your internet connection."
          );
          setAvatarUploading(false);
        }
      }
    } catch (error) {
      console.error("Error in pickImage function:", error);
      Alert.alert("Error", "An error occurred while selecting an image.");
      setAvatarUploading(false);
    }
  };

  // Function to delete avatar
  const deleteAvatar = async () => {
    if (!avatarUrl) {
      return;
    }

    try {
      setAvatarUploading(true);

      // Delete avatar from Clerk
      await user?.setProfileImage({
        file: null,
      });

      // Update local state
      setAvatarUrl("");
      Alert.alert("Success", "Profile picture deleted successfully");
    } catch (error) {
      console.error("Error deleting avatar:", error);
      Alert.alert(
        "Error",
        "Failed to delete profile picture. Please try again."
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);

      if (user) {
        await user.update({
          firstName,
          lastName,
          username,
        });

        Alert.alert("Success", "Your profile has been updated successfully.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <Box className="p-4">
        <VStack space="lg">
          <FormControl>
            <TouchableOpacity
              onPress={pickImage}
              className="flex-row rounded-full mb-4 items-center justify-center"
            >
              {avatarUrl ? (
                <>
                  <Image
                    source={{ uri: avatarUrl }}
                    className="h-24 w-24 rounded-full"
                  />
                </>
              ) : (
                <View className="h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <Icon as={CameraIcon} className="h-8 w-8 text-gray-400" />
                  <Text className="text-xs text-gray-500 mt-1">Add Photo</Text>
                </View>
              )}
              {avatarUploading && (
                <View className="absolute w-24 h-24  bg-black bg-opacity-50 rounded-full items-center justify-center">
                  <Spinner color="white" size="large" />
                </View>
              )}
            </TouchableOpacity>
            {/* Delete avatar button - only show if avatar exists */}
            {avatarUrl && (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Delete Profile Picture",
                    "Are you sure you want to delete your profile picture?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        onPress: deleteAvatar,
                        style: "destructive",
                      },
                    ]
                  );
                }}
                className="mt-2"
              >
                <HStack className="items-center justify-center">
                  <Icon
                    as={TrashIcon}
                    size="sm"
                    className="text-error-500 mr-1"
                  />
                  <Text className="text-error-500 font-medium">
                    Remove Photo
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input className="bg-gray-100">
              <InputField
                defaultValue={user?.emailAddresses?.[0]?.emailAddress || ""}
                editable={false}
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Username</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>First Name</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Last Name</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
              />
            </Input>
          </FormControl>

          <Button onPress={handleSave} disabled={isUpdating} className="mt-4">
            {isUpdating ? (
              <HStack space="sm" className="items-center">
                <Spinner size="small" color="white" />
                <ButtonText className="text-white">Updating...</ButtonText>
              </HStack>
            ) : (
              <ButtonText className="text-white">Save Changes</ButtonText>
            )}
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
}
