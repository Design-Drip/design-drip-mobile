import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@clerk/clerk-expo";
import colors from "tailwindcss/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: React.ComponentProps<typeof FontAwesome>["color"];
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <Spinner size="large" color={colors.gray[500]} />;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(products)"
        options={{
          title: "Products",
          tabBarIcon: ({ size, color }) => (
            <Feather name="package" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(wishlist)"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ size, color }) => (
            <Feather name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(cart)"
        options={{
          title: " Cart",
          tabBarIcon: ({ size, color }) => (
            <Feather name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
