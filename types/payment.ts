// Định nghĩa interface của Stripe PaymentMethod từ backend
export interface StripePaymentMethod {
  id: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  isDefault?: boolean; // Được thêm bởi API
}

// PaymentMethod cho mobile UI
export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

