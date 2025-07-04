import { Order } from "@/types/order";

export interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    totalOrders: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
