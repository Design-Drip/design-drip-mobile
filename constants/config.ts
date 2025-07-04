/**
 * Application configuration settings
 */

/**
 * Payment settings
 */
export const PAYMENT_CONFIG = {
  /**
   * When set to true, the app will bypass actual Stripe API calls
   * and use mock data instead. This is useful during development
   * when the backend endpoints are not yet available.
   *
   * Set to false in production.
   */
  USE_MOCK_PAYMENTS: false,

  /**
   * Merchant display name shown in the Stripe payment form
   */
  MERCHANT_NAME: "Design Drip",

  /**
   * API endpoints configuration
   * The mobile app uses the same API endpoints as the web app:
   *
   * - GET /api/payments/payment-methods - List payment methods
   * - POST /api/payments/payment-methods/attach - Add a payment method
   * - POST /api/payments/payment-methods/default - Set default payment method
   * - DELETE /api/payments/payment-methods/:id - Delete a payment method
   */
  API_ENDPOINTS: {
    /**
     * Path to attach a payment method to a customer
     * This endpoint expects { paymentMethodId: string, setAsDefault?: boolean }
     */
    ATTACH_PAYMENT_METHOD: "/payments/payment-methods/attach",

    /**
     * Path to get all payment methods
     */
    LIST_PAYMENT_METHODS: "/payments/payment-methods",

    /**
     * Path to set a payment method as default
     * This endpoint expects { paymentMethodId: string }
     */
    SET_DEFAULT_PAYMENT_METHOD: "/payments/payment-methods/default",

    /**
     * Base path for deleting a payment method
     * Will be appended with /:id for the full path
     */
    DELETE_PAYMENT_METHOD: "/payments/payment-methods",

    /**
     * Base path for processing a checkout
     */
    CHECKOUT: "/payments/checkout",
  },
};
