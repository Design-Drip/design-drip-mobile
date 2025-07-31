import { ProductSortType } from "@/constants/sort";

export const getSortDisplayName = (sort: ProductSortType) => {
  switch (sort) {
    case "newest":
      return "Newest First";
    case "oldest":
      return "Oldest First";
    case "price_high":
      return "Price: High to Low";
    case "price_low":
      return "Price: Low to High";
    default:
      return sort;
  }
};
