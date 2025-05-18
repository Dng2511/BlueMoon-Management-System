import { Apartment, ApartmentsResponse } from "../types/apartment";
import { API_ENDPOINTS } from "../config";
import axiosInstance from "./axios";

interface GetApartmentsParams {
  page?: number;
  size?: number;
  name?: string;
}

export const apartmentsApi = {
  getAll: async (params?: GetApartmentsParams): Promise<ApartmentsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.apartments, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Apartment> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.apartments}/${id}`
    );
    return response.data;
  },

  create: async (data: Omit<Apartment, "id">): Promise<Apartment> => {
    const response = await axiosInstance.post(API_ENDPOINTS.apartments, data);
    return response.data;
  },

  update: async (id: number, data: Partial<Apartment>): Promise<Apartment> => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.apartments}/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.apartments}/${id}`);
  },
};
