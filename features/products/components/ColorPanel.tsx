import React from "react";
import { View, Pressable } from "react-native";
import { ProductListItemColor } from "../queries/types";

interface ColorPanelProps {
  colors: ProductListItemColor[];
  selectedColor: ProductListItemColor | null;
  onSelectColor: (color: ProductListItemColor) => void;
}

export default function ColorPanel({
  colors,
  selectedColor,
  onSelectColor,
}: ColorPanelProps) {
  if (colors.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2 mb-4">
      {colors.map((color) => (
        <Pressable
          key={color.id}
          className={`w-6 h-6 rounded-full ${
            selectedColor?.id === color.id
              ? "border-2 border-primary-500"
              : "border border-gray-300"
          }`}
          onPress={() => onSelectColor(color)}
        >
          <View
            className="flex-1 rounded-full m-0.5"
            style={{ backgroundColor: color.color_value }}
          />
        </Pressable>
      ))}
    </View>
  );
}
