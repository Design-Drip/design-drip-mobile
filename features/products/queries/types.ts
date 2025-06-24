import { Product, ProductColor, ProductSize } from "../types";

export type ProductListColorsResponse = (Omit<ProductColor, "images"> & {
  count: number;
})[];

export interface ProductDetailResponse {
  product: Product;
  sizes: ProductSize[];
  colors: ProductColor[];
}

export interface ProductListItemColor {
  id: string;
  color: string;
  color_value: string;
  image: {
    id: string;
    url: string;
    view_side: "front" | "back" | "left" | "right";
  } | null;
}

export interface ProductListItemResponse {
  _id: string;
  name: string;
  base_price: number;
  colors: ProductListItemColor[];
}
