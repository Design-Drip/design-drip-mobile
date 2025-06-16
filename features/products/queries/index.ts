import { queryOptions } from "@tanstack/react-query";
import qs from "qs";
import { ProductsKeys } from "./keys";
import { useProductsQueryStore } from "../store/useProductsQueryStore";
import { customAxios } from "@/config/axios";
import { ListResponse } from "@/types/response";
import { ProductCategory } from "../types";
import {
  ProductDetailResponse,
  ProductListColorsResponse,
  ProductListItemResponse,
} from "./types";

// Get products based on filters and sort options
export const getProductsQuery = () => {
  const {
    search,
    categories,
    sizes,
    colors,
    minPrice,
    maxPrice,
    sort,
    page,
    limit,
  } = useProductsQueryStore.getState();

  return queryOptions({
    queryKey: [
      ProductsKeys.GetProductsQuery,
      {
        search,
        categories,
        sizes,
        colors,
        minPrice,
        maxPrice,
        sort,
        page,
        limit,
      },
    ],
    queryFn: async ({ signal }) => {
      const response = await customAxios.get("/products", {
        signal,
        params: {
          search: search.length > 0 ? search : undefined,
          categories: categories.map((cat) => cat.id),
          sizes,
          colors,
          minPrice: minPrice?.toString(),
          maxPrice: maxPrice?.toString(),
          sort,
          page: page.toString(),
          limit: limit.toString(),
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, {
            arrayFormat: "repeat",
          });
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch products");
      }

      return response.data as ListResponse<ProductListItemResponse>;
    },
  });
};

// Get all categories
export const getCategoriesQuery = () =>
  queryOptions({
    queryKey: [ProductsKeys.GetCategoriesQuery],
    queryFn: async () => {
      const response = await customAxios.get("/products/categories");

      if (response.status !== 200) {
        throw new Error("Failed to fetch categories");
      }

      return response.data?.categories as Omit<
        ProductCategory,
        "description"
      >[];
    },
  });

// Get product colors
export const getColorsQuery = () =>
  queryOptions({
    queryKey: [ProductsKeys.GetColorsQuery],
    queryFn: async () => {
      const response = await customAxios.get("/products/colors");

      if (response.status !== 200) {
        throw new Error("Failed to fetch colors");
      }

      return response.data?.colors as ProductListColorsResponse;
    },
  });

// Get product details by ID
export const getProductDetailQuery = (productId: string) =>
  queryOptions({
    queryKey: [ProductsKeys.GetProductDetailsQuery, productId],
    queryFn: async () => {
      const response = await customAxios.get(`/products/${productId}`);

      if (response.status !== 200) {
        throw new Error("Failed to fetch product details");
      }

      return response.data as ProductDetailResponse;
    },
  });
