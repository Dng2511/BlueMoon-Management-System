"use client";

import { ResidentsTable } from "@/components/residents/ResidentsTable";
import { useResidents } from "@/lib/hooks/use-residents";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateResidentRequest } from "@/lib/types/resident";

export default function ResidentsPage() {
  const { residents, createResident, updateResident, deleteResident } =
    useResidents();

  const handleCreate = async (data: CreateResidentRequest) => {
    try {
      await createResident.mutateAsync(data);
    } catch (error) {
      console.error("Failed to create resident:", error);
    }
  };

  if (residents.isLoading) {
    return (
      <div className="container mx-auto py-6 px-8 ">
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

  if (residents.isError) {
    return (
      <div className="container mx-auto py-6 px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Residents Management</h1>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p>Failed to load residents. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Residents Management</h1>
      </div>

      <ResidentsTable
        residents={residents.data?.content ?? []}
        onEdit={(resident) => {
          // TODO: Implement edit dialog
          console.log("Edit resident:", resident);
        }}
        onDelete={async (id) => {
          try {
            await deleteResident.mutateAsync(id);
          } catch (error) {
            console.error("Failed to delete resident:", error);
          }
        }}
        onCreate={handleCreate}
        isCreating={createResident.isLoading}
      />
    </div>
  );
}
