import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apartmentsApi } from "../api/apartments";
import { CreateApartmentRequest } from "../types/apartment";

export function useApartments(params?: { page?: number; size?: number }) {
  const queryClient = useQueryClient();

  const apartments = useQuery({
    queryKey: ["apartments", params],
    queryFn: () => apartmentsApi.getApartments(params),
  });

  const createApartment = useMutation({
    mutationFn: (data: CreateApartmentRequest) =>
      apartmentsApi.createApartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
    },
  });

  return {
    apartments,
    createApartment,
  };
}
