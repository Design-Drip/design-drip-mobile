import usePrivateAxios from "@/hooks/usePrivateAxios";
import { ApiResponse } from "@/types/common";
import {
  AddPaymentMethodRequest,
  DeletePaymentMethodRequest,
  SetDefaultPaymentMethodRequest,
} from "@/types/payment";
import { PAYMENT_CONFIG } from "@/constants/config";

export const usePaymentMutations = () => {
  const axiosPrivate = usePrivateAxios();

  /**
   * Add a payment method using the web app's API structure:
   * POST /api/payments/payment-methods/attach
   */
  const addPaymentMethod = async (data: AddPaymentMethodRequest) => {
    try {
      // Log the exact payload we're sending to the API
      console.log(`Sending to ${PAYMENT_CONFIG.API_ENDPOINTS.ATTACH_PAYMENT_METHOD}:`, {
        paymentMethodId: data.paymentMethodId,
        setAsDefault: data.setAsDefault
      });
      
      const response = await axiosPrivate.post(
        PAYMENT_CONFIG.API_ENDPOINTS.ATTACH_PAYMENT_METHOD,
        {
          paymentMethodId: data.paymentMethodId,
          setAsDefault: data.setAsDefault // Using setAsDefault as expected by the backend
        }
      );
      
      // Log the response 
      console.log('Payment method add response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  };
  
  /**
   * Delete a payment method
   * DELETE /api/payments/payment-methods/:id
   */
  const deletePaymentMethod = async (data: DeletePaymentMethodRequest) => {
    try {
      const response = await axiosPrivate.delete(
        `${PAYMENT_CONFIG.API_ENDPOINTS.DELETE_PAYMENT_METHOD}/${data.paymentMethodId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  };

  /**
   * Set a payment method as default
   * POST /api/payments/payment-methods/default
   */
  const setDefaultPaymentMethod = async (data: SetDefaultPaymentMethodRequest) => {
    try {
      const response = await axiosPrivate.post(
        PAYMENT_CONFIG.API_ENDPOINTS.SET_DEFAULT_PAYMENT_METHOD, 
        {
          paymentMethodId: data.paymentMethodId
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  };

  return {
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  };
};
