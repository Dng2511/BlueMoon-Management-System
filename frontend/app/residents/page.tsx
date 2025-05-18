"use client";

import { ResidentsTable } from "@/components/residents/ResidentsTable";
import { mockResidentsData } from "@/lib/mocks/residents";
import { Button } from "@/components/ui/button";

export default function ResidentsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Residents Management</h1>
        <Button>Add New Resident</Button>
      </div>

      <ResidentsTable
        residents={mockResidentsData.content}
        onEdit={(resident) => {
          console.log("Edit resident:", resident);
        }}
        onDelete={(id) => {
          console.log("Delete resident:", id);
        }}
      />
    </div>
  );
}
