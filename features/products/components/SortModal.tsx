import React from "react";
import { X } from "lucide-react-native";

import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";

import { ProductSort, ProductSortType } from "@/constants/sort";
import { getSortDisplayName } from "@/utils/sort";
import { CircleIcon } from "@/components/ui/icon";

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: ProductSortType;
  onSortChange: (sort: ProductSortType) => void;
}

export default function SortModal({
  isOpen,
  onClose,
  currentSort,
  onSortChange,
}: SortModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="mx-4 p-6 rounded-lg">
        <ModalHeader>
          <Heading size="md" className="text-typography-950">
            Sort Products
          </Heading>
          <ModalCloseButton>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody className="mt-4">
          <RadioGroup value={currentSort} className="gap-4">
            {ProductSort.map((sort) => (
              <Radio key={sort} value={sort} onPress={() => onSortChange(sort)}>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>{getSortDisplayName(sort)}</RadioLabel>
              </Radio>
            ))}
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button onPress={onClose} variant="solid" size="sm">
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
