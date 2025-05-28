import { privateApi } from "./client";
import { Payment, PaymentsResponse } from "../types/payment";

interface GetPaymentsParams {
  page?: number;
  size?: number;
}

export const paymentsApi = {
  getPayments: async (params?: GetPaymentsParams) => {
    const response = await privateApi.get<PaymentsResponse>("/payments", {
      params,
    });
    return response.data;
  },
};
