"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Resident } from "@/lib/types/resident";
import { format } from "date-fns";

interface ResidentsTableProps {
  residents: Resident[];
  onEdit?: (resident: Resident) => void;
  onDelete?: (id: number) => void;
}

export function ResidentsTable({
  residents,
  onEdit,
  onDelete,
}: ResidentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>CCCD</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Occupation</TableHead>
            <TableHead>Apartment</TableHead>
            <TableHead>Relation</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residents.map((resident) => (
            <TableRow key={resident.id}>
              <TableCell>{resident.id}</TableCell>
              <TableCell>{resident.fullName || "N/A"}</TableCell>
              <TableCell>
                {format(new Date(resident.dob), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{resident.cccd}</TableCell>
              <TableCell>{resident.gender}</TableCell>
              <TableCell>{resident.occupation}</TableCell>
              <TableCell>{resident.apartment?.name || "N/A"}</TableCell>
              <TableCell>{resident.relation || "N/A"}</TableCell>
              <TableCell>{resident.phoneNumber}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(resident)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete?.(resident.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
