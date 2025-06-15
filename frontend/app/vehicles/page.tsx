"use client";

import { VehiclesTable } from "@/components/vehicles/VehiclesTable";
import { useVehicles } from "@/lib/hooks/use-vehicles";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/lib/hooks/use-pagination";
import React from "react";

export default function VehiclesPage() {
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const isFirstMount = React.useRef(true);

  const { vehicles, createVehicle, updateVehicle, deleteVehicle } = useVehicles(
    {
      page: pagination.currentPage,
      size: pagination.pageSize,
      search: searchQuery || undefined,
    }
  );

  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
    }
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await createVehicle.mutateAsync(data);
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
      await updateVehicle.mutateAsync(id, data);
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVehicle.mutateAsync(id);
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

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
  };

  if (vehicles.isLoading && isFirstMount.current) {
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

  if (vehicles.isError) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold">Vehicles Management</h1>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive mx-4 lg:mx-6">
          <p>Failed to load vehicles. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-6 md:gap-6 px-12">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Vehicles Management</h1>
      </div>

      <VehiclesTable
        data={vehicles.data}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onPageChange={handlePageChange}
        isCreating={createVehicle.isLoading}
        isUpdating={updateVehicle.isLoading}
        isDeleting={deleteVehicle.isLoading}
        isLoading={vehicles.isLoading}
        onSearch={handleSearch}
      />
    </div>
  );
}
