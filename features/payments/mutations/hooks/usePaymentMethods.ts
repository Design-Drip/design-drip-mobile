import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentsKeys } from "@/features/payments/queries/keys";
import { usePaymentMutations } from "..";
import {
  AddPaymentMethodRequest,
  DeletePaymentMethodRequest,
  SetDefaultPaymentMethodRequest,
} from "../../types";
import useCustomToast from "@/hooks/useCustomToast";

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();
  const { addPaymentMethod } = usePaymentMutations();
  const toast = useCustomToast();

  return useMutation({
    mutationKey: [PaymentsKeys.AddPaymentMethod],
    mutationFn: (data: AddPaymentMethodRequest) => {
      console.log("Adding payment method with data:", data); // Log the data we're sending
      return addPaymentMethod(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PaymentsKeys.GetPaymentMethodsQuery],
      });
      toast.toastSuccess("Payment method added successfully");
    },
    onError: (error: Error | any) => {
      // Check for various error responses from API
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      console.error("Payment method addition error:", error); // Log the full error
      toast.toastError(`Failed to add payment method: ${errorMessage}`);
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  const { deletePaymentMethod } = usePaymentMutations();
  const toast = useCustomToast();

  return useMutation({
    mutationKey: [PaymentsKeys.DeletePaymentMethod],
    mutationFn: (data: DeletePaymentMethodRequest) => deletePaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PaymentsKeys.GetPaymentMethodsQuery],
      });
      toast.toastSuccess("Payment method deleted successfully");
    },
    onError: (error: Error | any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      toast.toastError(`Failed to delete payment method: ${errorMessage}`);
    },
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();
  const { setDefaultPaymentMethod } = usePaymentMutations();
  const toast = useCustomToast();

  return useMutation({
    mutationKey: [PaymentsKeys.SetDefaultPaymentMethod],
    mutationFn: (data: SetDefaultPaymentMethodRequest) =>
      setDefaultPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PaymentsKeys.GetPaymentMethodsQuery],
      });
      toast.toastSuccess("Default payment method updated successfully");
    },
    onError: (error: Error | any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      toast.toastError(
        `Failed to update default payment method: ${errorMessage}`
      );
    },
  });
};
