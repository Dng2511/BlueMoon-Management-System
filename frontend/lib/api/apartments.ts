import { privateApi } from "./client";
import {
  Apartment,
  ApartmentsResponse,
  CreateApartmentRequest,
  UpdateApartmentRequest,
} from "../types/apartment";

interface GetApartmentsParams {
  page?: number;
  size?: number;
  search?: string;
}

export const apartmentsApi = {
  getApartments: async (params?: GetApartmentsParams) => {
    const response = await privateApi.get<ApartmentsResponse>("/apartments", {
      params,
    });
    return response.data;
  },

  getApartment: async (id: number) => {
    const response = await privateApi.get<Apartment>(`/apartments/${id}`);
    return response.data;
  },

  createApartment: async (data: CreateApartmentRequest) => {
    const response = await privateApi.post<Apartment>("/apartments", data);
    return response.data;
  },

  updateApartment: async (id: number, data: UpdateApartmentRequest) => {
    const response = await privateApi.put<Apartment>(`/apartments/${id}`, data);
    return response.data;
  },

  deleteApartment: async (id: number) => {
    await privateApi.delete(`/apartments/${id}`);
  },
};
