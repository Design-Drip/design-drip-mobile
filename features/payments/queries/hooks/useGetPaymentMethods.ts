import usePrivateAxios from "@/hooks/usePrivateAxios";
import { PaymentMethod, StripePaymentMethod } from "@/types/payment";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { PaymentsKeys } from "../keys";
import { PAYMENT_CONFIG } from "@/constants/config";

const useGetPaymentMethods = () => {
  const axiosPrivate = usePrivateAxios();
  const { data, error, isLoading } = useQuery(
    queryOptions({
      queryKey: [PaymentsKeys.GetPaymentMethodsQuery],
      queryFn: async () => {
        // API returns an array of Stripe PaymentMethod objects directly
        const response = await axiosPrivate.get<StripePaymentMethod[]>(
          PAYMENT_CONFIG.API_ENDPOINTS.LIST_PAYMENT_METHODS
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch payment methods");
        }

        // Transform Stripe format to mobile format
        const transformedPaymentMethods: PaymentMethod[] = response.data.map(pm => ({
          id: pm.id,
          brand: pm.card?.brand || 'unknown',
          last4: pm.card?.last4 || '0000',
          expMonth: pm.card?.exp_month || 1,
          expYear: pm.card?.exp_year || 2025,
          isDefault: pm.isDefault || false
        }));

        return transformedPaymentMethods;
      },
    })
  );

  return {
    paymentMethods: data || [],
    error,
    isLoading,
  };
};

export default useGetPaymentMethods;
