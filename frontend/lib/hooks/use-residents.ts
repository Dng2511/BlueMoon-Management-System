import { useState, useEffect } from "react";
import { residentsApi } from "../api/residents";
import {
  CreateResidentRequest,
  UpdateResidentRequest,
  Resident,
} from "../types/resident";
import { toast } from "sonner";
import { useDebounce } from "./use-debounce";
import { logActivity } from "@/lib/utils/activity-logger";

export function useResidents(params?: {
  search?: string;
  gender?: string;
  page?: number;
  size?: number;
}) {
  const [searchQuery, setSearchQuery] = useState(params?.search || "");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [residents, setResidents] = useState<{
    data?: { content: Resident[] };
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
    const fetchResidents = async () => {
      try {
        setResidents((prev) => ({ ...prev, isLoading: true, isError: false }));
        const data = await residentsApi.getResidents({
          ...params,
          search: debouncedSearch,
        });
        setResidents({ data, isLoading: false, isError: false });
      } catch (error) {
        setResidents({ isLoading: false, isError: true, error });
      }
    };

    fetchResidents();
  }, [debouncedSearch, params]);

  const createResident = async (data: CreateResidentRequest) => {
    try {
      setCreateLoading(true);
      await residentsApi.createResident(data);
      const updatedData = await residentsApi.getResidents({
        ...params,
        search: debouncedSearch,
      });
      setResidents((prev) => ({ ...prev, data: updatedData }));
      logActivity(
        "Create Resident",
        `Created resident: ${data.fullName}`,
        "CREATE"
      );
      toast.success("Resident created successfully");
    } catch (error) {
      toast.error("Failed to create resident");
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateResident = async (id: number, data: UpdateResidentRequest) => {
    try {
      setUpdateLoading(true);
      await residentsApi.updateResident(id, data);
      const updatedData = await residentsApi.getResidents({
        ...params,
        search: debouncedSearch,
      });
      setResidents((prev) => ({ ...prev, data: updatedData }));
      logActivity(
        "Update Resident",
        `Updated resident: ${data.fullName}`,
        "UPDATE"
      );
      toast.success("Resident updated successfully");
    } catch (error) {
      toast.error("Failed to update resident");
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteResident = async (id: number) => {
    try {
      setDeleteLoading(true);
      const resident = residents.data?.content.find((r) => r.id === id);
      await residentsApi.deleteResident(id);
      const updatedData = await residentsApi.getResidents({
        ...params,
        search: debouncedSearch,
      });
      setResidents((prev) => ({ ...prev, data: updatedData }));
      logActivity(
        "Delete Resident",
        `Deleted resident: ${resident?.fullName}`,
        "DELETE"
      );
      toast.success("Resident deleted successfully");
    } catch (error) {
      toast.error("Failed to delete resident");
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    residents,
    searchQuery,
    setSearchQuery,
    createResident: { mutateAsync: createResident, isLoading: createLoading },
    updateResident: { mutateAsync: updateResident, isLoading: updateLoading },
    deleteResident: { mutateAsync: deleteResident, isLoading: deleteLoading },
  };
}
