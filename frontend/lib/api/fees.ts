import { privateApi } from "./client";
import { CreateFeeRequest, Fee, FeesResponse, UpdateFeeRequest } from "../types/fee";
import { PaginationParams } from "../types/common";
import { PaymentsResponse } from "../types/payment";

export const feesApi = {
  getFees: async (params?: PaginationParams) => {
    const response = await privateApi.get<FeesResponse>("/fees/search", { params });
    return response.data;
  },

  getFee: async (id: number, params?: PaginationParams) => {
    const response = await privateApi.get<PaymentsResponse>(`/fees/${id}`, { params });
    return response.data;
  },

  getFeesByMonth: async (month: string) => {
    // month format is "YYYY-MM", we need to split it into year and month
    const [year, monthNum] = month.split("-");
    const response = await privateApi.get<Fee[]>(`/fees/month/${year}-${monthNum}`);
    return response.data;
  },

  createFee: async (data: CreateFeeRequest) => {
    const response = await privateApi.post<Fee>("/fees", data);
    return response.data;
  },

  updateFee: async (id: number, data: UpdateFeeRequest) => {
    const response = await privateApi.put<Fee>(`/fees/${id}`, data);
    return response.data;
  },

  deleteFee: async (id: number) => {
    const response = await privateApi.delete(`/fees/${id}`);
    return response.data;
  },
};
