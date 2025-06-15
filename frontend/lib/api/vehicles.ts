import { privateApi } from "./client";
import {
  CreateVehicleRequest,
  Vehicle,
  VehiclesResponse,
  UpdateVehicleRequest,
} from "../types/vehicle";

interface GetVehiclesParams {
  search?: string;
  type?: string;
  page?: number;
  size?: number;
}

export const vehiclesApi = {
  getVehicles: async (params?: GetVehiclesParams) => {
    const response = await privateApi.get<VehiclesResponse>("/vehicles", {
      params,
    });
    return response.data;
  },

  getVehicle: async (id: number) => {
    const response = await privateApi.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (data: CreateVehicleRequest) => {
    const response = await privateApi.post<Vehicle>("/vehicles", data);
    return response.data;
  },

  updateVehicle: async (id: number, data: UpdateVehicleRequest) => {
    const response = await privateApi.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: number) => {
    await privateApi.delete(`/vehicles/${id}`);
  },
};
