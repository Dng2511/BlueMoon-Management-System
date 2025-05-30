import { privateApi } from "./client";
import {
  CreateResidentRequest,
  Resident,
  ResidentsResponse,
  UpdateResidentRequest,
} from "../types/resident";

interface GetResidentsParams {
  search?: string;
  gender?: string;
  page?: number;
  size?: number;
}

export const residentsApi = {
  getResidents: async (params?: GetResidentsParams) => {
    const response = await privateApi.get<ResidentsResponse>("/residents", {
      params,
    });
    return response.data;
  },

  getResident: async (id: number) => {
    const response = await privateApi.get<Resident>(`/residents/${id}`);
    return response.data;
  },

  createResident: async (data: CreateResidentRequest) => {
    const response = await privateApi.post<Resident>("/residents", data);
    return response.data;
  },

  updateResident: async (id: number, data: UpdateResidentRequest) => {
    const response = await privateApi.put<Resident>(`/residents/${id}`, data);
    return response.data;
  },

  deleteResident: async (id: number) => {
    await privateApi.delete(`/residents/${id}`);
  },
};
