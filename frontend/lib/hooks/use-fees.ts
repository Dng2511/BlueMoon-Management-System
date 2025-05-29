import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feesApi } from "../api/fees";
import { CreateFeeRequest } from "../types/fee";

export function useFees(params?: { page?: number; size?: number }) {
  const queryClient = useQueryClient();

  const fees = useQuery({
    queryKey: ["fees", params],
    queryFn: () => feesApi.getFees(params),
  });

  const createFee = useMutation({
    mutationFn: (data: CreateFeeRequest) => feesApi.createFee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
    },
  });

  return {
    fees,
    createFee,
  };
}

export function useFeesByMonth(month: string) {
  return useQuery({
    queryKey: ["fees", month],
    queryFn: () => feesApi.getFeesByMonth(month),
  });
}
