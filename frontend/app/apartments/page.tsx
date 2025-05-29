"use client";

import { ApartmentsTable } from "@/components/apartments/ApartmentsTable";
import { useApartments } from "@/lib/hooks/use-apartments";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreateApartmentRequest,
  UpdateApartmentRequest,
} from "@/lib/types/apartment";

export default function ApartmentsPage() {
  const { apartments, createApartment, updateApartment, deleteApartment } =
    useApartments();

  const handleCreate = async (data: CreateApartmentRequest) => {
    try {
      await createApartment.mutateAsync(data);
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  const handleUpdate = async (id: number, data: UpdateApartmentRequest) => {
    try {
      await updateApartment.mutateAsync(id, data);
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteApartment.mutateAsync(id);
    } catch (error) {
      // Error is already handled by the hook with toast
    }
  };

  if (apartments.isLoading) {
    return (
      <div className="container mx-auto py-6 px-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="space-y-4">
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

  if (apartments.isError) {
    return (
      <div className="container mx-auto py-6 px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Apartments Management</h1>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p>Failed to load apartments. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Apartments Management</h1>
      </div>

      <ApartmentsTable
        apartments={apartments.data?.content ?? []}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isCreating={createApartment.isLoading}
        isUpdating={updateApartment.isLoading}
        isDeleting={deleteApartment.isLoading}
      />
    </div>
  );
}
