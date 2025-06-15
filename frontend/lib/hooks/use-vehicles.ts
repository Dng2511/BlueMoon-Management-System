import { useState, useEffect } from "react";
import { vehiclesApi } from "../api/vehicles";
import {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  Vehicle,
  VehiclesResponse,
} from "../types/vehicle";
import { toast } from "sonner";
import { useDebounce } from "./use-debounce";
import { logActivity } from "@/lib/utils/activity-logger";

export function useVehicles(params?: {
  search?: string;
  type?: string;
  page?: number;
  size?: number;
}) {
  const [searchQuery, setSearchQuery] = useState(params?.search || "");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [vehicles, setVehicles] = useState<{
    data?: VehiclesResponse;
    isLoading: boolean;
    isError: boolean;
    error?: any;
  }>({
    isLoading: true,
    isError: false,
  });

  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setVehicles((prev) => ({ ...prev, isLoading: true, isError: false }));
        const data = await vehiclesApi.getVehicles({
          ...params,
          search: debouncedSearch,
        });
        setVehicles({ data, isLoading: false, isError: false });
      } catch (error) {
        setVehicles({ isLoading: false, isError: true, error });
      }
    };

    fetchVehicles();
  }, [debouncedSearch, params?.page, params?.size]);

  const createVehicle = async (data: CreateVehicleRequest) => {
    try {
      setCreateLoading(true);
      await vehiclesApi.createVehicle(data);
      const updatedData = await vehiclesApi.getVehicles({
        ...params,
        search: debouncedSearch,
      });
      setVehicles((prev) => ({ ...prev, data: updatedData }));
      logActivity(
        "Create Vehicle",
        `Created vehicle: ${data.license} (${data.type})`,
        "CREATE"
      );
      toast.success("Vehicle created successfully");
    } catch (error) {
      toast.error("Failed to create vehicle");
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateVehicle = async (id: number, data: UpdateVehicleRequest) => {
    try {
      setUpdateLoading(true);
      await vehiclesApi.updateVehicle(id, data);
      const updatedData = await vehiclesApi.getVehicles({
        ...params,
        search: debouncedSearch,
      });
      setVehicles((prev) => ({ ...prev, data: updatedData }));
      logActivity(
        "Update Vehicle",
        `Updated vehicle: ${data.license} (${data.type})`,
        "UPDATE"
      );
      toast.success("Vehicle updated successfully");
    } catch (error) {
      toast.error("Failed to update vehicle");
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteVehicle = async (id: number) => {
    try {
      setDeleteLoading(true);
      const vehicle = vehicles.data?.content.find((v) => v.id === id);
      await vehiclesApi.deleteVehicle(id);
      const updatedData = await vehiclesApi.getVehicles({
        ...params,
        search: debouncedSearch,
      });
      setVehicles((prev) => ({ ...prev, data: updatedData }));
      logActivity(
        "Delete Vehicle",
        `Deleted vehicle: ${vehicle?.license} (${vehicle?.type})`,
        "DELETE"
      );
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      toast.error("Failed to delete vehicle");
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    vehicles,
    searchQuery,
    setSearchQuery,
    createVehicle: { mutateAsync: createVehicle, isLoading: createLoading },
    updateVehicle: { mutateAsync: updateVehicle, isLoading: updateLoading },
    deleteVehicle: { mutateAsync: deleteVehicle, isLoading: deleteLoading },
  };
}
