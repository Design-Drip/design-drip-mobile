import { useQuery } from "@tanstack/react-query";
import { getWishlistQuery } from "../queries";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../mutations";
import useCustomToast from "@/hooks/useCustomToast";

const useWishlist = () => {
  const { toastSuccess } = useCustomToast();
  const addToWishlist = useAddToWishlistMutation();
  const removeFromWishlist = useRemoveFromWishlistMutation();

  const { data: wishlistItems = [], isLoading } = useQuery({
    ...getWishlistQuery(),
  });

  const addItem = (productId: string) => {
    return addToWishlist.mutate(productId, {
      onSuccess: () => {
        toastSuccess("Product added to wishlist!");
      },
    });
  };

  const removeItem = (productId: string) => {
    return removeFromWishlist.mutate(productId, {
      onSuccess: () => {
        toastSuccess("Product removed from wishlist!");
      },
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  return {
    wishlistItems,
    isLoading,
    addItem,
    removeItem,
    isInWishlist,
  };
};

export default useWishlist;
