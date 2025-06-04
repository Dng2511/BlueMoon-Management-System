"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, FileText, Tag, Check, X, Users, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import React from "react";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { usePagination } from "@/lib/hooks/use-pagination";
import { usePayments } from "@/lib/hooks/use-payments";
import { useResidents } from "@/lib/hooks/use-residents";
import { useFees } from "@/lib/hooks/use-fees";
import { CreatePaymentRequest, UpdatePaymentRequest } from "@/lib/types/payment";

export default function PaymentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const { residents } = useResidents();
  const { fees } = useFees();
  
  const residentsList = residents?.data?.content?.map(resident => ({
    id: resident.id,
    fullName: resident.fullName,
    apartment: resident.apartment?.name
  })) || [];

  const feesList = fees?.data?.content?.map(fee => ({
    id: fee.id,
    type: fee.type
  })) || [];

  const { 
    deletePayment, 
    bulkDeletePayments,
    createPayment,
    payments: paymentsResponse,
    searchPayments,
    updatePayment,
  } = usePayments({
    page: pagination.currentPage,
    limit: pagination.pageSize,
    search: searchQuery || undefined,
  });

  const isFirstMount = React.useRef(true);

  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
    }
  }, []);

  if (paymentsResponse.isLoading && isFirstMount.current) {
    return (
      <div className="flex flex-col gap-6 py-6 px-12">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const handlePageChange = (page: number, pageSize: number) => {
    pagination.setPage(page + 1);
    if (pageSize !== pagination.pageSize) {
      pagination.setPageSize(pageSize);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // await searchPayments.mutateAsync(query);
  };

  const handleDeletePayment = async (id: number) => {
    await deletePayment.mutateAsync(id);
  };

  const handleBulkDeletePayments = async (ids: number[]) => {
    await bulkDeletePayments.mutateAsync(ids);
  };

  const handleCreatePayment = async (data: CreatePaymentRequest) => {
    await createPayment.mutateAsync(data);
  };

  const handleUpdatePayment = async (id: number, data: UpdatePaymentRequest) => {
    await updatePayment.mutateAsync({ id, data });
  };

  if (paymentsResponse.isError) {
    return (
      <div className="flex flex-col gap-6 py-6 px-12">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
          <h2 className="text-lg font-semibold mb-2">Error Loading Payments</h2>
          <p>Could not load payments data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-6 md:gap-6 px-12">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Payments Management</h1>
      </div>

      <PaymentsTable
        paymentsResponse={paymentsResponse.data}
        onPageChange={handlePageChange}
        onDelete={handleDeletePayment}
        onBulkDelete={handleBulkDeletePayments}
        onCreate={handleCreatePayment}
        onSearch={handleSearch}
        onUpdate={handleUpdatePayment}
        isDeleting={deletePayment.isPending || bulkDeletePayments.isPending}
        isCreating={createPayment.isPending}
        residents={residentsList}
        fees={feesList}
      />
    </div>
  );
}