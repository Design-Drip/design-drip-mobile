import useCustomToast from "@/hooks/useCustomToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePaymentMutations } from "..";
import { PaymentsKeys } from "../../queries/keys";
import { ProcessCheckoutRequest } from "../../types";
import { OrdersKeys } from "@/features/orders/queries/keys";

export const useProcessCheckoutMutation = () => {
  const queryClient = useQueryClient();
  const { processCheckout } = usePaymentMutations();
  const toast = useCustomToast();

  return useMutation({
    mutationKey: [PaymentsKeys.GetCheckoutInfoQuery],
    mutationFn: (data: ProcessCheckoutRequest) => processCheckout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PaymentsKeys.GetPaymentMethodsQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [PaymentsKeys.GetCheckoutInfoQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [OrdersKeys.GetOrdersQuery],
      });
      toast.toastSuccess("Checkout successfully!");
    },
    onError: (error: Error | any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      console.error("Checkout error:", error);
      toast.toastError(`Failed to process checkout: ${errorMessage}`);
    },
  });
};
