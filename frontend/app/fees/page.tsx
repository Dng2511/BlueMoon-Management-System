"use client";

import { FeesTable } from "@/components/fees/FeesTable";
import { useFees } from "@/lib/hooks/use-fees";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreateFeeRequest,
  UpdateFeeRequest,
} from "@/lib/types/fee";
import { usePagination } from "@/lib/hooks/use-pagination";

export default function FeesPage() {
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const { fees, createFee, updateFee, deleteFee } = useFees({
    page: pagination.currentPage,
    limit: pagination.pageSize,
  });

  const handleCreate = async (data: CreateFeeRequest) => {
    try {
      await createFee.mutateAsync(data);
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  const handleUpdate = async (id: number, data: UpdateFeeRequest) => {
    try {
      await updateFee.mutateAsync({ id, data });
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFee.mutateAsync(id);
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    pagination.setPage(page + 1); // Convert from 0-based to 1-based
    if (pageSize !== pagination.pageSize) {
      pagination.setPageSize(pageSize);
    }
  };

  if (fees.isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="space-y-4 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
            <Skeleton className="h-8 w-[120px]" />
          </div>
          <div className="rounded-md border">
            <div className="relative w-full">
              <div className="space-y-2 p-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fees.isError) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold">Fees Management</h1>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive mx-4 lg:mx-6">
          <p>Failed to load fees. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-6 md:gap-6 px-12">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Fees Management</h1>
      </div>

      <FeesTable
        data={fees.data}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onPageChange={handlePageChange}
        isCreating={createFee.isPending}
        isUpdating={updateFee.isPending}
        isDeleting={deleteFee.isPending}
      />
    </div>
  );
}
