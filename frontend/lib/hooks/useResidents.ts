import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { residentsApi } from "../api/residents";
import { Resident } from "../types/resident";

export function useResidents(page = 0, size = 10, name?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["residents", { page, size, name }],
    queryFn: () => residentsApi.getAll({ page, size, name }),
  });

  const createMutation = useMutation({
    mutationFn: (newResident: Omit<Resident, "id">) =>
      residentsApi.create(newResident),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Resident> }) =>
      residentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => residentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  return {
    residents: data?.content ?? [],
    pagination: {
      currentPage: data?.number ?? 0,
      totalPages: data?.totalPages ?? 0,
      totalItems: data?.totalElements ?? 0,
      pageSize: data?.size ?? 10,
    },
    isLoading,
    error,
    createResident: createMutation.mutate,
    updateResident: updateMutation.mutate,
    deleteResident: deleteMutation.mutate,
  };
}
