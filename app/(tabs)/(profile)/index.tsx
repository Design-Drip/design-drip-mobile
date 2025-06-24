import { Box } from "@/components/ui/box";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { ScrollView, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Icon } from "@/components/ui/icon";
import { ArrowRightIcon, CreditCardIcon, UserIcon } from "lucide-react-native";
import { PROFILE_ROUTES } from "@/constants/routes";

export default function ProfileScreen() {
  const { user } = useUser();

  const menuItems = [
    {
      title: "Payment Methods",
      icon: CreditCardIcon,
      route: PROFILE_ROUTES.PAYMENT_METHODS,
    },
    {
      title: "Update Profile",
      icon: UserIcon,
      route: PROFILE_ROUTES.ACCOUNT,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <Box className="p-4">
        <VStack space="xl">
          {/* User Info */}
          <VStack className="items-center py-6">
            <Box className="w-24 h-24 rounded-full bg-gray-200 mb-4 items-center justify-center">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Text className="text-3xl font-bold text-gray-500">
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </Text>
              )}
            </Box>

            <Text className="text-xl font-semibold">
              {user?.firstName
                ? `${user.firstName} ${user.lastName || ""}`
                : user?.username || "User"}
            </Text>

            <Text className="text-gray-500">
              {user?.emailAddresses?.[0]?.emailAddress || ""}
            </Text>
          </VStack>

          {/* Menu */}
          <VStack className="space-y-2">
            <Text className="text-lg font-medium mb-2">Account</Text>
            {menuItems.map((item, index) => (
              <Link href={item.route} key={index} asChild>
                <TouchableOpacity>
                  <Box className="flex-row items-center justify-between p-4 bg-white rounded-lg">
                    <HStack className="items-center space-x-3 gap-1">
                      <Icon as={item.icon} className="text-gray-700" />
                      <Text className="text-base">{item.title}</Text>
                    </HStack>
                    <Icon
                      as={ArrowRightIcon}
                      className="text-gray-400"
                      size="sm"
                    />
                  </Box>
                </TouchableOpacity>
              </Link>
            ))}
          </VStack>

          {/* Sign Out Button */}
          <Box className="mt-6">
            <SignOutButton />
          </Box>
        </VStack>
      </Box>
    </ScrollView>
  );
}
