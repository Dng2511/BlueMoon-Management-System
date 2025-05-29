import { useState, useEffect } from "react";
import { residentsApi } from "../api/residents";
import {
  CreateResidentRequest,
  UpdateResidentRequest,
  Resident,
} from "../types/resident";

export function useResidents(params?: {
  search?: string;
  gender?: string;
  page?: number;
  size?: number;
}) {
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
        const data = await residentsApi.getResidents(params);
        setResidents({ data, isLoading: false, isError: false });
      } catch (error) {
        setResidents({ isLoading: false, isError: true, error });
      }
    };

    fetchResidents();
  }, [params]);

  const createResident = async (data: CreateResidentRequest) => {
    try {
      setCreateLoading(true);
      await residentsApi.createResident(data);
      const updatedData = await residentsApi.getResidents(params);
      setResidents((prev) => ({ ...prev, data: updatedData }));
    } catch (error) {
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateResident = async ({
    id,
    data,
  }: {
    id: number;
    data: UpdateResidentRequest;
  }) => {
    try {
      setUpdateLoading(true);
      await residentsApi.updateResident(id, data);
      const updatedData = await residentsApi.getResidents(params);
      setResidents((prev) => ({ ...prev, data: updatedData }));
    } catch (error) {
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteResident = async (id: number) => {
    try {
      setDeleteLoading(true);
      await residentsApi.deleteResident(id);
      const updatedData = await residentsApi.getResidents(params);
      setResidents((prev) => ({ ...prev, data: updatedData }));
    } catch (error) {
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    residents,
    createResident: { mutateAsync: createResident, isLoading: createLoading },
    updateResident: { mutateAsync: updateResident, isLoading: updateLoading },
    deleteResident: { mutateAsync: deleteResident, isLoading: deleteLoading },
  };
}
