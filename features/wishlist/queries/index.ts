import { queryOptions } from "@tanstack/react-query";
import usePrivateAxios from "@/hooks/usePrivateAxios";
import { WishlistKeys } from "./keys";

export const getWishlistQuery = () => {
  const axiosPrivate = usePrivateAxios();
  return queryOptions({
    queryKey: [WishlistKeys.GetWishlistQuery],
    queryFn: async () => {
      const response = await axiosPrivate.get("/wish-list");

      if (response.status !== 200) {
        throw new Error("Failed to fetch wishlist");
      }

      return response.data as string[];
    },
  });
};
