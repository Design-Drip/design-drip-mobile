import React, { useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/icon";
import { XIcon } from "lucide-react-native";

interface SearchInputProps {
  placeholder?: string;
  debounceTime?: number;
  onSearchChange: (value: string) => void;
  defaultValue?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SearchInput = ({
  placeholder = "Search...",
  debounceTime = 500,
  onSearchChange,
  defaultValue = "",
  className = "",
  size = "md",
}: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  // Create a debounced function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, debounceTime),
    [debounceTime, onSearchChange]
  );

  // Update the debounced value when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    // Cancel the debounce on useEffect cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  // Handle input change
  const handleChange = (text: string) => {
    setSearchTerm(text);
  };

  // Handle clearing the search input
  const handleClear = () => {
    setSearchTerm("");
    onSearchChange("");
  };

  return (
    <Input size={size} variant="rounded" className={className}>
      <InputSlot className="pl-3">
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={placeholder}
        value={searchTerm}
        onChangeText={handleChange}
      />
      {searchTerm ? (
        <InputSlot onPress={handleClear} className="pr-3">
          <XIcon size={16} color="#9CA3AF" />
        </InputSlot>
      ) : null}
    </Input>
  );
};

export default SearchInput;
