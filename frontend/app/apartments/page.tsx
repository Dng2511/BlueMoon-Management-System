"use client";

import { ApartmentsTable } from "@/components/apartments/ApartmentsTable";
import { mockApartmentsData } from "@/lib/mocks/apartments";
import { Button } from "@/components/ui/button";

export default function ApartmentsPage() {
  return (
    <div className="container mx-auto py-6 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Apartments Management</h1>
        <Button>Add New Apartment</Button>
      </div>

      <ApartmentsTable
        apartments={mockApartmentsData.content}
        onEdit={(apartment) => {
          console.log("Edit apartment:", apartment);
        }}
        onDelete={(id) => {
          console.log("Delete apartment:", id);
        }}
      />
    </div>
  );
}
