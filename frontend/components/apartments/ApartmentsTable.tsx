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
import { Apartment } from "@/lib/types/apartment";
import { Badge } from "@/components/ui/badge";

interface ApartmentsTableProps {
  apartments: Apartment[];
  onEdit?: (apartment: Apartment) => void;
  onDelete?: (id: number) => void;
}

export function ApartmentsTable({
  apartments,
  onEdit,
  onDelete,
}: ApartmentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Residents</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apartments.map((apartment) => (
            <TableRow key={apartment.id}>
              <TableCell>{apartment.id}</TableCell>
              <TableCell>{apartment.name}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {apartment.residents.length === 0 ? (
                    <span className="text-muted-foreground">No residents</span>
                  ) : (
                    apartment.residents.map((resident) => (
                      <div
                        key={resident.id}
                        className="flex items-center gap-2"
                      >
                        <span>{resident.fullName}</span>
                        <Badge variant="secondary">{resident.relation}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(apartment)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete?.(apartment.id)}
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
