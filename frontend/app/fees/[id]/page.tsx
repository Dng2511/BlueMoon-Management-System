"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, FileText, Tag, Check, X, Users, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import React, { use } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { useFee, useFeesByMonth } from "@/lib/hooks/use-fees";
import { usePagination } from "@/lib/hooks/use-pagination";
import { usePayments } from "@/lib/hooks/use-payments";
import { Fee } from "@/lib/types/fee";
import { FeesDetailCard } from "@/components/fees/FeesDetailCard";
import { useResidents } from "@/lib/hooks/use-residents";
import { CreatePaymentRequest } from "@/lib/types/payment";

interface FeeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    feeDetails?: string;
  }>;
}

export default function FeeDetailPage({ params, searchParams }: FeeDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const feeId = parseInt(resolvedParams.id);

  let preloadedFeeDetails: Fee | null = null;
  if (resolvedSearchParams?.feeDetails) {
    try {
      preloadedFeeDetails = JSON.parse(decodeURIComponent(resolvedSearchParams.feeDetails)) as Fee;
      console.log(preloadedFeeDetails);
    } catch (error) {
      console.error("Failed to parse feeDetails from searchParams:", error);
    }
  }

  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  if (isNaN(feeId)) {
    notFound();
  }

  const { 
    data: paymentsResponse,
    isLoading: feeLoading, 
    isError: feeError 
  } = useFee(feeId, {
    page: pagination.currentPage,
    limit: pagination.pageSize,
  });

  const { residents } = useResidents();
  const residentsList = residents?.data?.content?.map(resident => ({
    id: resident.id,
    fullName: resident.fullName,
    apartment: resident.apartment?.name
  })) || [];

  const { 
    deletePayment, 
    bulkDeletePayments,
    createPayment
  } = usePayments({ feeId });

  if (feeLoading) {
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

  const handleDeletePayment = async (id: number) => {
    await deletePayment.mutateAsync(id);
  };

  const handleBulkDeletePayments = async (ids: number[]) => {
    await bulkDeletePayments.mutateAsync(ids);
  };

  const handleCreatePayment = async (data: CreatePaymentRequest) => {
    await createPayment.mutateAsync(data);
  };

  if (!paymentsResponse) {
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
          <h2 className="text-lg font-semibold mb-2">Error Loading Fee Details or Payments</h2>
          <p>Could not load details for this fee, or no associated payments found.</p>
        </div>
      </div>
    );
  }
  
  const paymentsForTable = paymentsResponse;

  // Calculate values for FeesDetailCard
  const totalPayments = paymentsForTable?.content?.reduce((sum, payment) => sum + (payment.amountPaid * payment.quantity || 0), 0) || 0;
  const notYetPaidCount = paymentsForTable?.content?.filter(payment => payment.status === "not_yet_paid").length || 0;

  const currentFee = preloadedFeeDetails ? {
    id: preloadedFeeDetails.id,
    type: preloadedFeeDetails.type
  } : null;

  return (
    <div className="flex flex-col gap-6 py-6 px-12">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fees
        </Button>
      </div>

      <FeesDetailCard
        totalFee={(preloadedFeeDetails?.amount || 0) * paymentsForTable.totalElements || 0}
        totalPayments={totalPayments}
        totalResidentsAssigned={paymentsForTable.totalElements}
        notYetPaidCount={notYetPaidCount}
      />
      
      <h2 className="text-xl font-semibold mt-4 mb-2 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        Payments for: {preloadedFeeDetails?.type}
      </h2>
         <PaymentsTable
          paymentsResponse={paymentsForTable}
          onPageChange={handlePageChange}
          onDelete={handleDeletePayment}
          onBulkDelete={handleBulkDeletePayments}
          onCreate={handleCreatePayment}
          isDeleting={deletePayment.isPending || bulkDeletePayments.isPending}
          isCreating={createPayment.isPending}
          residents={residentsList}
          fees={currentFee ? [currentFee] : []}
        />
    </div>
  );
}