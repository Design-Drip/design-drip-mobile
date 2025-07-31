import { create } from "zustand";
import {
  persist,
  DevtoolsOptions,
  PersistOptions,
  createJSONStorage,
  devtools,
} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ProductSortType } from "@/constants/sort";
import { ProductCategory } from "../types";

export const devtoolsConfig: DevtoolsOptions = {
  name: "products-query-store",
  enabled: process.env.NODE_ENV === "development",
};

interface ProductsQueryState {
  // UI state
  isFilterOpen: boolean;
  isSortOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  setIsSortOpen: (isOpen: boolean) => void;

  // Filter options
  search: string;
  categories: Omit<ProductCategory, "description">[];
  sizes: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;

  // Sort option
  sort: ProductSortType;
  page: number;
  limit: number;

  // Actions
  setSearch: (search: string) => void;
  setCategories: (categories: Omit<ProductCategory, "description">[]) => void;
  setSizes: (sizes: string[]) => void;
  setColors: (colors: string[]) => void;
  setPriceRange: (min: number | undefined, max: number | undefined) => void;
  setSort: (sort: ProductSortType) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
  toggleCategory: (
    category:
      | Omit<ProductCategory, "description">
      | Omit<ProductCategory, "description">[],
    replaceAll?: boolean
  ) => void;
  toggleSize: (size: string) => void;
  toggleColor: (color: string | string[], replaceAll?: boolean) => void;
}

const persistConfig: PersistOptions<ProductsQueryState, ProductsQueryState> = {
  name: "products-query-state-persist-store",
  storage: createJSONStorage(() => AsyncStorage),
};

const initialState = {
  isFilterOpen: false,
  isSortOpen: false,
  search: "",
  categories: [],
  sizes: [],
  colors: [],
  minPrice: undefined,
  maxPrice: undefined,
  sort: "newest" as ProductSortType,
  page: 1,
  limit: 12,
};

export const useProductsQueryStore = create<ProductsQueryState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
        setIsSortOpen: (isOpen) => set({ isSortOpen: isOpen }),

        setSearch: (search) => set({ search, page: 1 }),
        setCategories: (categories) => set({ categories, page: 1 }),
        setSizes: (sizes) => set({ sizes, page: 1 }),
        setColors: (colors) => set({ colors, page: 1 }),
        setPriceRange: (minPrice, maxPrice) =>
          set({ minPrice, maxPrice, page: 1 }),
        setSort: (sort) => set({ sort }),
        setPage: (page) => set({ page }),
        setLimit: (limit) => set({ limit }),

        resetFilters: () => set({ ...initialState }),

        toggleCategory: (category, replaceAll = false) =>
          set((state) => {
            // Handle array input (for replacing all categories)
            if (Array.isArray(category)) {
              return {
                categories: replaceAll ? category : state.categories,
                page: 1,
              };
            }

            // Handle single category toggle
            const isInList = state.categories.some(
              (cat) => cat.id === category.id
            );
            return {
              categories: isInList
                ? state.categories.filter((cat) => cat.id !== category.id)
                : [...state.categories, category],
              page: 1,
            };
          }),

        toggleSize: (size) =>
          set((state) => {
            const isInList = state.sizes.includes(size);
            return {
              sizes: isInList
                ? state.sizes.filter((s) => s !== size)
                : [...state.sizes, size],
              page: 1,
            };
          }),

        toggleColor: (color, replaceAll = false) =>
          set((state) => {
            // Handle array input (for replacing all colors)
            if (Array.isArray(color)) {
              return {
                colors: replaceAll ? color : state.colors,
                page: 1,
              };
            }

            // Handle single color toggle
            const isInList = state.colors.includes(color);
            return {
              colors: isInList
                ? state.colors.filter((c) => c !== color)
                : [...state.colors, color],
              page: 1,
            };
          }),
      }),
      persistConfig
    )
  )
);
