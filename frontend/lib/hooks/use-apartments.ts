import { useState, useEffect } from "react";
import { apartmentsApi } from "../api/apartments";
import {
  Apartment,
  CreateApartmentRequest,
  UpdateApartmentRequest,
} from "../types/apartment";
import { toast } from "sonner";

export function useApartments(params?: {
  search?: string;
  page?: number;
  size?: number;
}) {
  const [apartments, setApartments] = useState<{
    data?: { content: Apartment[] };
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
    const fetchApartments = async () => {
      try {
        setApartments((prev) => ({ ...prev, isLoading: true, isError: false }));
        const data = await apartmentsApi.getApartments(params);
        setApartments({ data, isLoading: false, isError: false });
      } catch (error) {
        setApartments({ isLoading: false, isError: true, error });
        toast.error("Failed to load apartments");
      }
    };

    fetchApartments();
  }, [params]);

  const createApartment = async (data: CreateApartmentRequest) => {
    try {
      setCreateLoading(true);
      await apartmentsApi.createApartment(data);
      const updatedData = await apartmentsApi.getApartments(params);
      setApartments((prev) => ({ ...prev, data: updatedData }));
      toast.success("Apartment created successfully");
    } catch (error) {
      toast.error("Failed to create apartment");
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateApartment = async (id: number, data: UpdateApartmentRequest) => {
    try {
      setUpdateLoading(true);
      await apartmentsApi.updateApartment(id, data);
      const updatedData = await apartmentsApi.getApartments(params);
      setApartments((prev) => ({ ...prev, data: updatedData }));
      toast.success("Apartment updated successfully");
    } catch (error) {
      toast.error("Failed to update apartment");
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteApartment = async (id: number) => {
    try {
      setDeleteLoading(true);
      await apartmentsApi.deleteApartment(id);
      const updatedData = await apartmentsApi.getApartments(params);
      setApartments((prev) => ({ ...prev, data: updatedData }));
      toast.success("Apartment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete apartment");
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    apartments,
    createApartment: { mutateAsync: createApartment, isLoading: createLoading },
    updateApartment: { mutateAsync: updateApartment, isLoading: updateLoading },
    deleteApartment: { mutateAsync: deleteApartment, isLoading: deleteLoading },
  };
}

export function useApartment(id?: number, refreshKey?: number) {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    apartmentsApi
      .getApartment(id)
      .then((data) => {
        setApartment(data);
      })
      .catch((err) => {
        setIsError(true);
        setError(err);
        toast.error("Failed to load apartment");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, refreshKey]);

  return { apartment, isLoading, isError, error };
}
