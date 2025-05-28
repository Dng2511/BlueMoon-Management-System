import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../api/payments";

export function usePayments(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => paymentsApi.getPayments(params),
  });
}
