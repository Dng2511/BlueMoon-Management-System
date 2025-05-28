import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { residentsApi } from "../api/residents";
import {
  CreateResidentRequest,
  UpdateResidentRequest,
} from "../types/resident";

export function useResidents(params?: {
  search?: string;
  gender?: string;
  page?: number;
  size?: number;
}) {
  const queryClient = useQueryClient();

  const residents = useQuery({
    queryKey: ["residents", params],
    queryFn: () => residentsApi.getResidents(params),
  });

  const createResident = useMutation({
    mutationFn: (data: CreateResidentRequest) =>
      residentsApi.createResident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  const updateResident = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateResidentRequest }) =>
      residentsApi.updateResident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  const deleteResident = useMutation({
    mutationFn: (id: number) => residentsApi.deleteResident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  return {
    residents,
    createResident,
    updateResident,
    deleteResident,
  };
}
