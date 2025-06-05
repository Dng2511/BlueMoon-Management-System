import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "../api/payments";
import { toast } from "sonner";
import { Payment, CreatePaymentRequest } from "../types/payment";
import { logActivity } from "@/lib/utils/activity-logger";

interface UsePaymentsParams {
  page?: number;
  limit?: number;
  feeId?: number;
  search?: string;
}

type UpdatePaymentData = Partial<
  Omit<Payment, "id" | "resident" | "fee"> & {
    residentId?: number;
    feeId?: number;
    date_paid?: string | null;
  }
>;

export function usePayments(params?: UsePaymentsParams) {
  const queryClient = useQueryClient();
  const currentFeeId = params?.feeId;

  const paymentsData = useQuery({
    queryKey: ["payments", params],
    queryFn: () => paymentsApi.getPayments(params),
  });

  const deletePayment = useMutation({
    mutationFn: (id: number) => paymentsApi.deletePayment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      if (currentFeeId) {
        queryClient.invalidateQueries({ queryKey: ["fee", currentFeeId] });
      }
      const payment = paymentsData.data?.content.find((p) => p.id === id);
      logActivity(
        "Delete Payment",
        `Deleted payment for ${payment?.fee.type}`,
        "DELETE"
      );
      toast.success("Payment deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete payment");
    },
  });

  const bulkDeletePayments = useMutation({
    mutationFn: async (ids: number[]) => {
      return Promise.all(ids.map((id) => paymentsApi.deletePayment(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      if (currentFeeId) {
        queryClient.invalidateQueries({ queryKey: ["fee", currentFeeId] });
      }
      toast.success("Payments deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete payments in bulk"
      );
    },
  });

  const createPayment = useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentsApi.createPayment(data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["fee", variables.fee_id] });
      if (currentFeeId && currentFeeId !== variables.fee_id) {
        queryClient.invalidateQueries({ queryKey: ["fee", currentFeeId] });
      }
      logActivity(
        "Create Payment",
        `Created payment for ${variables.fee_id}`,
        "CREATE"
      );
      toast.success("Payment created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create payment");
    },
  });

  const updatePayment = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaymentData }) =>
      paymentsApi.updatePayment(id, data),
    onSuccess: (_result, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", id] });

      if (currentFeeId) {
        queryClient.invalidateQueries({ queryKey: ["fee", currentFeeId] });
      }
      if (data.feeId && data.feeId !== currentFeeId) {
        queryClient.invalidateQueries({ queryKey: ["fee", data.feeId] });
      }
      logActivity(
        "Update Payment",
        `Updated payment for fee ID: ${data.feeId}`,
        "UPDATE"
      );
      toast.success("Payment updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update payment");
    },
  });

  const searchPayments = useMutation({
    mutationFn: (query: string) =>
      paymentsApi.getPayments({ ...params, search: query }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to search payments"
      );
    },
  });

  return {
    payments: paymentsData,
    deletePayment,
    bulkDeletePayments,
    createPayment,
    updatePayment,
    searchPayments,
  };
}
