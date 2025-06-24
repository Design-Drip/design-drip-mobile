# Payment Methods Management

This feature handles the management of payment methods in the Design Drip mobile app, aligned with the web app implementation.

## Overview

The payment flow follows these steps:

1. User adds a card via the `AddPaymentMethodForm` component
2. Card details are validated client-side
3. A payment method is created directly with Stripe using `createPaymentMethod`
4. The resulting payment method ID is sent to the backend via `/api/payments/payment-methods/attach`
5. The backend attaches the payment method to the customer's account
6. The user can view, set as default, or delete payment methods

## API Endpoints

The mobile app uses the same API endpoints as the web app:

- `GET /api/payments/payment-methods` - List payment methods
- `POST /api/payments/payment-methods/attach` - Add a payment method (accepts: `{ paymentMethodId: string, setAsDefault?: boolean }`)
- `POST /api/payments/payment-methods/default` - Set default payment method (accepts: `{ paymentMethodId: string }`)
- `DELETE /api/payments/payment-methods/:id` - Delete a payment method

## Components

- **AddPaymentMethodForm**: Handles the creation of a new Stripe payment method
- **PaymentMethodsList**: Displays the user's saved payment methods
- **PaymentMethodCard**: Displays a single payment method with options to delete or set as default

## Configuration

Payment configuration is defined in `constants/config.ts`:

- `USE_MOCK_PAYMENTS`: Set to `false` to use real production endpoints
- `MERCHANT_NAME`: Display name shown in the Stripe payment form
- `API_ENDPOINTS`: Configuration for all payment API endpoints

## Data Flow

1. The user enters card details in the `CardField` component
2. On form submission, Stripe's `createPaymentMethod` is called directly
3. The returned payment method ID is sent to the backend using the `attachPaymentMethod` service
4. The backend returns Stripe payment method objects that need to be transformed to the mobile app format
5. After successful attachment, the payment methods list is refreshed

## Response Handling

- The backend API returns Stripe payment method objects directly as an array
- The mobile app transforms these objects to a simpler format with properties:
  - `id`: Payment method ID
  - `brand`: Card brand (Visa, Mastercard, etc.)
  - `last4`: Last 4 digits of the card
  - `expMonth`: Card expiration month
  - `expYear`: Card expiration year
  - `isDefault`: Whether this is the default payment method

## Security

- All API requests are made with authentication using `usePrivateAxios`
- No sensitive card details are stored in the app - everything is handled by Stripe SDK
- Payment method data is only stored on the backend

## Error Handling

- Form validation errors are handled client-side before submitting
- API errors are caught and displayed using toast notifications
- Common error cases like card declined, invalid details, or connection issues are handled appropriately
- All API responses include consistent error formats for easier handling

## Production vs Development

The app is configured to use real Stripe endpoints in production. No mock endpoints are used.
