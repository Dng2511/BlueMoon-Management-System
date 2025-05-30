import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feesApi } from "../api/fees";
import { CreateFeeRequest, UpdateFeeRequest } from "../types/fee";
import { PaginationParams } from "../types/common";
import { toast } from "sonner";

export function useFees(params?: PaginationParams) {
  const queryClient = useQueryClient();

  const fees = useQuery({
    queryKey: ["fees", params],
    queryFn: () => feesApi.getFees(params),
  });

  const createFee = useMutation({
    mutationFn: (data: CreateFeeRequest) => feesApi.createFee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      toast.success("Fee created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create fee");
    },
  });

  const updateFee = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFeeRequest }) => 
      feesApi.updateFee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      toast.success("Fee updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update fee");
    },
  });

  const deleteFee = useMutation({
    mutationFn: (id: number) => feesApi.deleteFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      toast.success("Fee deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete fee");
    },
  });

  return {
    fees,
    createFee,
    updateFee,
    deleteFee,
  };
}

export function useFeesByMonth(month: string) {
  return useQuery({
    queryKey: ["fees", month],
    queryFn: () => feesApi.getFeesByMonth(month),
  });
}
