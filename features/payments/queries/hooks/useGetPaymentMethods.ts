import usePrivateAxios from "@/hooks/usePrivateAxios";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { PaymentsKeys } from "../keys";

const useGetPaymentMethods = () => {
  const axiosPrivate = usePrivateAxios();
  const { data, error, isLoading } = useQuery(
    queryOptions({
      queryKey: [PaymentsKeys.GetPaymentMethodsQuery],
      queryFn: async () => {
        const response = await axiosPrivate.get("/payments/payment-methods");

        if (response.status !== 200) {
          throw new Error("Failed to fetch payment methods");
        }

        return response.data;
      },
    })
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useGetPaymentMethods;
