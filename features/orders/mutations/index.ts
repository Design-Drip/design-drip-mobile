import usePrivateAxios from "@/hooks/usePrivateAxios";
import { useMutation } from "@tanstack/react-query";

export const useUpdateStatusMutation = () => {
  const axiosPrivate = usePrivateAxios();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      const response = await axiosPrivate.put(
        `/orders/${orderId}/status`,
        { status }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update order status");
      }

      return response.data;
    },
  });
};
