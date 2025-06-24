import React from "react";
import { Text } from "@/components/ui/text";

interface ButtonTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A wrapper component to ensure text is properly wrapped in buttons
 */
export function ButtonText({ children, className = "" }: ButtonTextProps) {
  return <Text className={`font-medium ${className}`}>{children}</Text>;
}
