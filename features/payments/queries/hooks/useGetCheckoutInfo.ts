import { queryOptions, skipToken, useQuery } from "@tanstack/react-query";
import { PaymentsKeys } from "../keys";
import usePrivateAxios from "@/hooks/usePrivateAxios";
import { CheckoutInfoResponse } from "../../types";

export const useGetCheckoutInfoQuery = (itemIds?: string) => {
  const axiosPrivate = usePrivateAxios();
  return useQuery(
    queryOptions({
      queryKey: [PaymentsKeys.GetCheckoutInfoQuery, itemIds],
      queryFn: itemIds
        ? async () => {
            const response = await axiosPrivate.get("/payments/checkout/info", {
              params: { itemIds },
            });

            if (response.status !== 200) {
              throw new Error("Failed to fetch checkout information");
            }

            return response.data as CheckoutInfoResponse;
          }
        : skipToken,
    })
  );
};
