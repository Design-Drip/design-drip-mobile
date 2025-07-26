export interface CartItemData {
  size: string;
  quantity: number;
  pricePerSize: number;
  totalPrice: number;
}

export interface CartItem {
  id: string;
  designId: string;
  designName: string;
  name: string;
  colorId: string;
  color: string;
  colorValue?: string;
  data: CartItemData[];
  previewImages: {
    id: string;
    url: string;
  }[];
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
}
