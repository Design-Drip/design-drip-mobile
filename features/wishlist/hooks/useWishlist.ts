import { useQuery } from "@tanstack/react-query";
import { getWishlistQuery } from "../queries";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../mutations";

const useWishlist = () => {
  const addToWishlist = useAddToWishlistMutation();
  const removeFromWishlist = useRemoveFromWishlistMutation();

  const { data: wishlistItems = [], isLoading } = useQuery({
    ...getWishlistQuery(),
  });

  const addItem = (productId: string) => {
    return addToWishlist.mutate(productId);
  };

  const removeItem = (productId: string) => {
    return removeFromWishlist.mutate(productId);
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
