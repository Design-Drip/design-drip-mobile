export interface SizeQuantity {
  size: string;
  quantity: number;
}

export interface AddToCartPayload {
  designId: string;
  quantityBySize: SizeQuantity[];
}

export interface UpdateCartItemPayload {
  itemId: string;
  payload: {
    quantityBySize: SizeQuantity[];
  };
}

export interface AddToCartResponse {
  success: boolean;
  message: string;
  cartItemCount: number;
}

export interface UpdateCartItemResponse {
  success: boolean;
  message: string;
  updatedItem: {
    id: string;
    designId: string;
    quantityBySize: (SizeQuantity & {
      _id?: string;
    })[];
  };
}
