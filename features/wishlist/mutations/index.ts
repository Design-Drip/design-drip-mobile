import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WishlistKeys } from "../queries/keys";
import usePrivateAxios from "@/hooks/usePrivateAxios";

export const useAddToWishlistMutation = () => {
  const axiosPrivate = usePrivateAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await axiosPrivate.post(`/wish-list/${productId}`);

      if (response.status !== 200) {
        throw new Error("Failed to add product to wishlist");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WishlistKeys.GetWishlistQuery],
      });
    },
  });
};

export const useRemoveFromWishlistMutation = () => {
  const axiosPrivate = usePrivateAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await axiosPrivate.delete(`/wish-list/${productId}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete product to wishlist");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WishlistKeys.GetWishlistQuery],
      });
    },
  });
};
