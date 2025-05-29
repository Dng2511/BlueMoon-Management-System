import { privateApi } from "./client";
import { CreateFeeRequest, Fee, FeesResponse } from "../types/fee";

interface GetFeesParams {
  page?: number;
  size?: number;
}

export const feesApi = {
  getFees: async (params?: GetFeesParams) => {
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
};
