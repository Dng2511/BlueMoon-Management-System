import { Resident, ResidentsResponse } from "../types/resident";
import { API_ENDPOINTS } from "../config";
import axiosInstance from "./axios";

interface GetResidentsParams {
  page?: number;
  size?: number;
  name?: string;
}

export const residentsApi = {
  getAll: async (params?: GetResidentsParams): Promise<ResidentsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.residents, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Resident> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.residents}/${id}`
    );
    return response.data;
  },

  create: async (data: Omit<Resident, "id">): Promise<Resident> => {
    const response = await axiosInstance.post(API_ENDPOINTS.residents, data);
    return response.data;
  },

  update: async (id: number, data: Partial<Resident>): Promise<Resident> => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.residents}/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.residents}/${id}`);
  },
};
