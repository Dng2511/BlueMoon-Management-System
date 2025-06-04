"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconArrowLeft,
  IconUsers,
  IconCalendar,
  IconHome,
} from "@tabler/icons-react";
import { ResidentsTable } from "@/components/residents/ResidentsTable";
import { Badge } from "@/components/ui/badge";
import { useApartment } from "@/lib/hooks/use-apartments";
import { format } from "date-fns";
import { useResidents } from "@/lib/hooks/use-residents";

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);
  const { apartment, isLoading, isError, error } = useApartment(id);
  const { createResident, updateResident, deleteResident } = useResidents();

  // Local state for residents
  const [residents, setResidents] = useState<any[]>([]);

  // Sync local state with fetched data
  useEffect(() => {
    if (apartment?.residents) {
      setResidents(
        apartment.residents.map((r) => ({
          ...r,
          apartment: { id: apartment.id, name: apartment.name },
          relation: r.relation as import("@/lib/types/resident").Relation,
          stay_status:
            r.stay_status as import("@/lib/types/resident").StayStatus,
        }))
      );
    }
  }, [apartment]);

  // Local update handlers
  const handleCreateResident = async (data: any) => {
    let newResident: any = undefined;
    try {
      newResident = await createResident.mutateAsync(data);
    } catch (e) {
      return;
    }
    if ((!newResident && newResident !== 0) || !apartment) {
      newResident = {};
    }
    setResidents((prev) => [
      ...prev,
      {
        ...(typeof newResident === "object" ? newResident : {}),
        fullName: newResident.fullName ?? data.fullName,
        dob: newResident.dob ?? data.dob,
        cccd: newResident.cccd ?? data.cccd,
        gender: newResident.gender ?? data.gender,
        occupation: newResident.occupation ?? data.occupation,
        phoneNumber: newResident.phoneNumber ?? data.phoneNumber,
        apartment: { id: apartment?.id ?? 0, name: apartment?.name ?? "" },
        relation: (newResident.relation ??
          data.relation) as import("@/lib/types/resident").Relation,
        stay_status: (newResident.stay_status ??
          data.stay_status) as import("@/lib/types/resident").StayStatus,
        id: newResident.id ?? Math.random(), // fallback id
        avatar: newResident.avatar ?? "default.jpg",
      },
    ]);
  };

  const handleEditResident = async (rid: number, data: any) => {
    let updatedResident: any = undefined;
    try {
      updatedResident = await updateResident.mutateAsync(rid, data);
    } catch (e) {
      return;
    }
    if ((!updatedResident && updatedResident !== 0) || !apartment) {
      updatedResident = {};
    }
    if (!apartment) return;
    if (
      (updatedResident.apartmentId ?? data.apartmentId) != null &&
      Number(updatedResident.apartmentId ?? data.apartmentId) !== apartment.id
    ) {
      setResidents((prev) => prev.filter((r) => r.id !== rid));
      return;
    }
    setResidents((prev) =>
      prev.map((r) =>
        r.id === rid
          ? {
              ...(typeof updatedResident === "object" ? updatedResident : {}),
              fullName: updatedResident.fullName ?? data.fullName,
              dob: updatedResident.dob ?? data.dob,
              cccd: updatedResident.cccd ?? data.cccd,
              gender: updatedResident.gender ?? data.gender,
              occupation: updatedResident.occupation ?? data.occupation,
              phoneNumber: updatedResident.phoneNumber ?? data.phoneNumber,
              apartment: {
                id: apartment?.id ?? 0,
                name: apartment?.name ?? "",
              },
              relation: (updatedResident.relation ??
                data.relation) as import("@/lib/types/resident").Relation,
              stay_status: (updatedResident.stay_status ??
                data.stay_status) as import("@/lib/types/resident").StayStatus,
              id: updatedResident.id ?? rid,
              avatar: updatedResident.avatar ?? "default.jpg",
            }
          : r
      )
    );
  };

  const handleDeleteResident = async (rid: number) => {
    await deleteResident.mutateAsync(rid);
    setResidents((prev) => prev.filter((r) => r.id !== rid));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6 px-12">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !apartment) {
    return (
      <div className="flex flex-col gap-6 py-6 px-12">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
          <h2 className="text-lg font-semibold mb-2">
            Error Loading Apartment Details
          </h2>
          <p>
            {error?.message || "Could not load details for this apartment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6 px-12">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to Apartments
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Apartment Name</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {apartment.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconHome className="size-5" />
              <span>ID: {apartment.id}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Area</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {apartment.area} m²
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Usable area</span>
            </div>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Residents</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {apartment.residentCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconUsers className="size-5" />
              <span>Current residents</span>
            </div>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Created Date</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {format(new Date(apartment.date_created), "dd/MM/yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconCalendar className="size-5" />
              <span>Date added to system</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-xl font-semibold mt-4 mb-2 flex items-center gap-2">
        <IconUsers className="h-5 w-5 text-primary" />
        Residents in this Apartment
      </h2>
      <ResidentsTable
        residents={residents}
        onCreate={handleCreateResident}
        onEdit={handleEditResident}
        onDelete={handleDeleteResident}
        apartmentId={apartment?.id}
      />
    </div>
  );
}
