import { privateApi } from "./client";
import { CreateFeeRequest, Fee, FeesResponse, UpdateFeeRequest } from "../types/fee";
import { PaginationParams } from "../types/common";

export const feesApi = {
  getFees: async (params?: PaginationParams) => {
    const response = await privateApi.get<FeesResponse>("/fees", { params });
    return response.data;
  },

  getFeesByMonth: async (month: string) => {
    const response = await privateApi.get<Fee[]>(`/fees/${month}`);
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
