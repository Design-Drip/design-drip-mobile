import { queryOptions } from "@tanstack/react-query";
import { CartKeys } from "./keys";
import usePrivateAxios from "@/hooks/usePrivateAxios";

export const getCartQuery = () => {
  const axiosPrivate = usePrivateAxios();
  return queryOptions({
    queryKey: [CartKeys.GetCartQuery],
    queryFn: async () => {
      const response = await axiosPrivate.get("/cart");

      if (response.status !== 200) {
        throw new Error("Failed to fetch cart");
      }

      return response.data;
    },
  });
};

export const getCartItemCountQuery = () => {
  const axiosPrivate = usePrivateAxios();
  return queryOptions({
    queryKey: [CartKeys.GetCartItemCountQuery],
    queryFn: async () => {
      const response = await axiosPrivate.get("/cart/item-count");

      if (response.status !== 200) {
        throw new Error("Failed to fetch cart item count");
      }

      return response.data as number;
    },
  });
};
