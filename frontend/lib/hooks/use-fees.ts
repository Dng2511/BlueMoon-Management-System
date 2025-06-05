import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feesApi } from "../api/fees";
import { CreateFeeRequest, UpdateFeeRequest } from "../types/fee";
import { PaginationParams } from "../types/common";
import { toast } from "sonner";
import { logActivity } from "@/lib/utils/activity-logger";

export function useFees(params?: PaginationParams) {
  const queryClient = useQueryClient();

  const fees = useQuery({
    queryKey: ["fees", params],
    queryFn: () => feesApi.getFees(params),
  });

  const createFee = useMutation({
    mutationFn: (data: CreateFeeRequest) => feesApi.createFee(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      logActivity("Create Fee", `Created fee: ${variables.type}`, "CREATE");
      toast.success("Fee created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create fee");
    },
  });

  const updateFee = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFeeRequest }) =>
      feesApi.updateFee(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      queryClient.invalidateQueries({ queryKey: ["fee", id] });
      logActivity("Update Fee", `Updated fee: ${data.type}`, "UPDATE");
      toast.success("Fee updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update fee");
    },
  });

  const deleteFee = useMutation({
    mutationFn: (id: number) => feesApi.deleteFee(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      queryClient.removeQueries({ queryKey: ["fee", id] });
      const fee = fees.data?.content.find((f) => f.id === id);
      logActivity("Delete Fee", `Deleted fee: ${fee?.type}`, "DELETE");
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

export function useFee(id: number, params?: PaginationParams) {
  return useQuery({
    queryKey: ["fee", id, params],
    queryFn: () => feesApi.getFee(id, params),
    enabled: !!id,
  });
}
