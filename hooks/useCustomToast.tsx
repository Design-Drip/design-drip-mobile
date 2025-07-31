import { useCallback } from "react";
import { HelpCircleIcon } from "lucide-react-native";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { HStack } from "@/components/ui/hstack";
import { CheckIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (message: string, variant: "success" | "error") => {
      const isSuccess = variant === "success";
      const newId = Math.random().toString();
      toast.show({
        id: newId,
        placement: "top right",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toast
              nativeID={uniqueToastId}
              action={isSuccess ? "success" : "error"}
              variant="outline"
              className={[
                "p-4 gap-6 w-full shadow-hard-5 max-w-[443px] flex-row justify-between",
                isSuccess ? "border-success-500" : "border-error-500",
              ].join(" ")}
            >
              <HStack className="items-center" space="md">
                {isSuccess ? (
                  <Icon as={CheckIcon} className="stroke-success-500 mt-0.5" />
                ) : (
                  <Icon
                    as={HelpCircleIcon}
                    className="stroke-error-500 mt-0.5"
                  />
                )}
                <VStack space="xs">
                  <ToastTitle
                    className={[
                      "font-semibold",
                      isSuccess ? "text-success-500" : "text-error-500",
                    ].join(" ")}
                  >
                    {isSuccess ? "Success" : "Error"}
                  </ToastTitle>
                  <ToastDescription size="sm">{message}</ToastDescription>
                </VStack>
              </HStack>
              <HStack className="min-[450px]:gap-3 gap-1 items-center">
                <Pressable onPress={() => toast.close(id)}>
                  <Icon as={CloseIcon} />
                </Pressable>
              </HStack>
            </Toast>
          );
        },
      });
    },
    []
  );

  const toastSuccess = (message: string) => {
    showToast(message, "success");
  };

  const toastError = (message: string) => {
    showToast(message, "error");
  };

  return {
    toastSuccess,
    toastError,
    toastClose: toast.close,
  };
};

export default useCustomToast;
