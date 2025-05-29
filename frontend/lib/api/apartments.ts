import { privateApi } from "./client";
import {
  Apartment,
  ApartmentsResponse,
  CreateApartmentRequest,
} from "../types/apartment";

interface GetApartmentsParams {
  page?: number;
  size?: number;
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
};
