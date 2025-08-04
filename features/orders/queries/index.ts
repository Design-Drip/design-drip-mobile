import { queryOptions, skipToken, useQuery } from "@tanstack/react-query";
import { OrdersKeys } from "./keys";
import usePrivateAxios from "@/hooks/usePrivateAxios";
import { OrderListResponse } from "../types";
import { OrderDetail } from "@/types/order";

export const useGetOrdersQuery = (page = 1, limit = 10, status?: string) => {
  const axiosPrivate = usePrivateAxios();

  return useQuery(
    queryOptions({
      queryKey: [OrdersKeys.GetOrdersQuery, page, limit, status],
      queryFn: async () => {
        let queryParams: Record<string, string> = {
          page: page.toString(),
          limit: limit.toString(),
        };
        if (status) {
          queryParams.status = status;
        }
        const response = await axiosPrivate.get("/orders", {
          params: queryParams,
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }

        return response.data as OrderListResponse;
      },
    })
  );
};

export const getOrderDetailQuery = (orderId?: string) => {
  const axiosPrivate = usePrivateAxios();

  return useQuery(
    queryOptions({
      queryKey: [OrdersKeys.GetOrderDetailQuery, orderId],
      queryFn: orderId
        ? async () => {
            const response = await axiosPrivate.get(`/orders/${orderId}`);

            if (response.status !== 200) {
              throw new Error("Failed to fetch order details");
            }

            return response.data as OrderDetail;
          }
        : skipToken,
      enabled: !!orderId,
    })
  );
};
