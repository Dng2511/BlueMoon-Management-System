import { privateApi } from "./client";
import { Payment, PaymentsResponse, CreatePaymentRequest } from "../types/payment";

interface GetPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const paymentsApi = {
  getPayments: async (params?: GetPaymentsParams) => {
    const response = await privateApi.get<PaymentsResponse>("/payments", {
      params,
    });
    return response.data;
  },

  deletePayment: async (id: number) => {
    const response = await privateApi.delete(`/payments/${id}`);
    return response.data;
  },

  bulkDeletePayments: async (ids: number[]) => {
    const response = await privateApi.post(`/payments/bulk-delete`, { ids });
    return response.data;
  },

  getPayment: async (id: number) => {
    const response = await privateApi.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (data: CreatePaymentRequest) => {
    const response = await privateApi.post<Payment>("/payments", data);
    return response.data;
  },

  updatePayment: async (id: number, data: Partial<Omit<Payment, 'id' | 'resident' | 'fee'> & { 
    residentId?: number; 
    feeId?: number;
    date_paid?: string | null;
  }>) => {
    const response = await privateApi.put<Payment>(`/payments/${id}`, data);
    return response.data;
  },
};
