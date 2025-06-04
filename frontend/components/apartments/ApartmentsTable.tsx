"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
  IconGripVertical,
  IconLoader,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Apartment,
  CreateApartmentRequest,
  UpdateApartmentRequest,
} from "@/lib/types/apartment";
import { Badge } from "@/components/ui/badge";
import { DeleteApartmentDialog } from "./DeleteApartmentDialog";
import { UpdateApartmentDialog } from "./UpdateApartmentDialog";
import { CreateApartmentDialog } from "./CreateApartmentDialog";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { format } from "date-fns";

interface ApartmentsTableProps {
  apartments: Apartment[];
  onEdit?: (id: number, data: UpdateApartmentRequest) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onCreate?: (data: CreateApartmentRequest) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function ApartmentsTable({
  apartments,
  onEdit,
  onDelete,
  onCreate,
  isCreating,
  isUpdating,
  isDeleting,
}: ApartmentsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ id: false });
  const [rowSelection, setRowSelection] = React.useState({});
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Apartment>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
        >
          <IconGripVertical className="text-muted-foreground size-3" />
          <span className="sr-only">Drag to reorder</span>
        </Button>
      ),
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Button
          variant="link"
          className="font-semibold text-foreground w-fit px-0 text-left"
          onClick={() => router.push(`/apartments/${row.original.id}`)}
        >
          {row.getValue("name")}
        </Button>
      ),
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="w-12">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "area",
      header: "Area",
      cell: ({ row }) => <div className="w-20">{row.getValue("area")} m²</div>,
    },
    {
      accessorKey: "residentCount",
      header: "Residents",
      cell: ({ row }) => (
        <div className="w-20">{row.getValue("residentCount")}</div>
      ),
    },
    {
      accessorKey: "date_created",
      header: "Created Date",
      cell: ({ row }) => (
        <div className="w-32">
          {format(
            new Date(row.getValue("date_created") as string),
            "dd/MM/yyyy"
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const apartment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <UpdateApartmentDialog
                apartment={apartment}
                onSubmit={async (data) => {
                  if (onEdit) {
                    await onEdit(apartment.id, data);
                  }
                }}
                isLoading={isUpdating}
              />
              <DropdownMenuSeparator />
              <DeleteApartmentDialog
                onConfirm={async () => {
                  if (onDelete) {
                    await onDelete(apartment.id);
                  }
                }}
                isLoading={isDeleting}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: apartments,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleBulkDelete = async () => {
    if (!onDelete) return;
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => onDelete(id)));
      setRowSelection({});
    } catch (error) {
      // handle error
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CreateApartmentDialog onSubmit={onCreate!} isLoading={isCreating} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap bg-muted"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredRowModel().rows.length} row(s) total.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <ConfirmationDialog
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={isBulkDeleting}
                  >
                    {isBulkDeleting ? (
                      <IconLoader className="size-4 animate-spin" />
                    ) : (
                      <IconTrash className="size-4" />
                    )}
                    {isBulkDeleting
                      ? `Deleting ${
                          table.getFilteredSelectedRowModel().rows.length
                        } apartments...`
                      : `Delete ${
                          table.getFilteredSelectedRowModel().rows.length
                        } selected`}
                  </Button>
                }
                title={`Delete ${
                  table.getFilteredSelectedRowModel().rows.length
                } apartments?`}
                description={`This action cannot be undone. This will permanently delete ${
                  table.getFilteredSelectedRowModel().rows.length
                } apartments from the system.`}
                confirmText={isBulkDeleting ? "Deleting..." : "Delete All"}
                onConfirm={handleBulkDelete}
                isConfirming={isBulkDeleting}
                confirmButtonVariant="destructive"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
