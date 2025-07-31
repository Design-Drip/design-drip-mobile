import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddToCartPayload,
  AddToCartResponse,
  UpdateCartItemPayload,
  UpdateCartItemResponse,
} from "./types";
import { CartKeys } from "../queries/keys";
import usePrivateAxios from "@/hooks/usePrivateAxios";

export const useAddToCartMutation = () => {
  const axiosPrivate = usePrivateAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddToCartPayload) => {
      const response = await axiosPrivate.post("/cart", payload);
      if (response.status !== 201) {
        throw new Error("Failed to add item to cart");
      }

      return response.data as AddToCartResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CartKeys.GetCartQuery],
      });

      queryClient.invalidateQueries({
        queryKey: [CartKeys.GetCartItemCountQuery],
      });
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const axiosPrivate = usePrivateAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, payload }: UpdateCartItemPayload) => {
      const response = await axiosPrivate.put(`/cart/${itemId}`, payload);

      if (response.status !== 200) {
        throw new Error("Failed to update cart item");
      }

      return response.data as UpdateCartItemResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CartKeys.GetCartQuery],
      });
    },
  });
};

export const useRemoveFromCartMutation = () => {
  const axiosPrivate = usePrivateAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await axiosPrivate.delete(`/cart/${itemId}`);
      if (response.status !== 200) {
        throw new Error("Failed to remove item from cart");
      }

      return response.data as AddToCartResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CartKeys.GetCartQuery],
      });

      queryClient.invalidateQueries({
        queryKey: [CartKeys.GetCartItemCountQuery],
      });
    },
  });
};
