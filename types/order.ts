import { PaymentIntent } from "@stripe/stripe-react-native";

export interface OrderItemSize {
  size: string;
  quantity: number;
  pricePerUnit: number;
}

export interface OrderItem {
  designId: string;
  name: string;
  color: string;
  sizes: OrderItemSize[];
  totalPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: PaymentIntent.Status;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: string;
}
