"use client"

import * as React from "react"
import { useMemo } from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
  IconTrash,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type Updater,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Payment, PaymentsResponse, CreatePaymentRequest, UpdatePaymentRequest } from "@/lib/types/payment"
import { usePagination } from "@/lib/hooks/use-pagination"
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog"
import { CreatePaymentDialog } from "./CreatePaymentDialog"
import { UpdatePaymentDialog } from "./UpdatePaymentDialog"

interface PaymentsTableProps {
  paymentsResponse: PaymentsResponse;
  onPageChange: (page: number, pageSize: number) => void;
  onDelete?: (id: number) => Promise<void>;
  onBulkDelete?: (ids: number[]) => Promise<void>;
  onCreate?: (data: CreatePaymentRequest) => Promise<void>;
  onUpdate?: (id: number, data: UpdatePaymentRequest) => Promise<void>;
  isDeleting?: boolean;
  isCreating?: boolean;
  isUpdating?: boolean;
  residents: Array<{ id: number; fullName: string; apartment?: string }>;
  fees: Array<{ id: number; type: string }>;
}

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon" className="text-muted-foreground size-7 hover:bg-transparent">
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function DraggableRow({ row }: { row: Row<Payment> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function PaymentsTable({ 
  paymentsResponse: response, 
  onPageChange, 
  onDelete, 
  onBulkDelete,
  onCreate,
  onUpdate,
  isDeleting,
  isCreating,
  isUpdating,
  residents,
  fees
}: PaymentsTableProps) {

  const columns: ColumnDef<Payment>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "id", header: "ID", cell: ({ row }) => row.original.id },
    { accessorKey: "resident.fullName", header: "Resident Name", cell: ({ row }) => row.original.resident.fullName },
    { accessorKey: "resident.apartment", header: "Apartment", cell: ({ row }) => row.original.resident.apartment || "-" },
    { 
      accessorKey: "fee.type", 
      header: "Fee Type", 
      cell: ({ row }) => row.original.fee?.type || "-" 
    },
    { 
      accessorKey: "quantity", 
      header: "Quantity", 
      cell: ({ row }) => row.original.quantity === 0 ? "-" : row.original.quantity 
    },
    {
      accessorKey: "amountPaid",
      header: "Amount Paid",
      cell: ({ row }) => row.original.amountPaid === 0 ? "-" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.original.amountPaid),
    },
    { accessorKey: "payment_method", header: "Payment Method", cell: ({ row }) => row.original.status },
    { accessorKey: "date_paid", header: "Date Paid", cell: ({ row }) => row.original.date_paid ? new Date(row.original.date_paid).toLocaleDateString() : "-" },
    {
      id: "actions",
      cell: ({ row }) => {
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
        const handleDeleteConfirm = () => {
          if (onDelete) {
            onDelete(row.original.id)
              .then(() => setIsDeleteDialogOpen(false))
              .catch(() => setIsDeleteDialogOpen(false));
          }
        };
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <UpdatePaymentDialog
                payment={row.original}
                onSubmit={onUpdate ? (data) => onUpdate(row.original.id, data) : undefined}
                isLoading={isUpdating}
                residents={residents}
                fees={fees}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                variant="destructive" 
                onSelect={(e) => e.preventDefault()}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <IconTrash className="mr-2 size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
            {isDeleteDialogOpen && (
              <ConfirmationDialog
                open={isDeleteDialogOpen} 
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Payment?"
                description={`Are you sure you want to delete payment ID ${row.original.id}? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                isConfirming={isDeleting}
                confirmButtonVariant="destructive"
              />
            )}
          </DropdownMenu>
        );
      },
    },
  ];
  
  const [data, setData] = React.useState<Payment[]>(response?.content || []);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false);

  const { currentPage, pageSize, setPage, setPageSize } = usePagination({
    initialPage: (response?.number || 0) + 1,
    initialPageSize: response?.size || 10,
    onPageChange: (page, pageSize) => { onPageChange?.(page - 1, pageSize); },
  });

  React.useEffect(() => { setData(response?.content || []); }, [response]);

  const pageCount = useMemo(() => response?.totalPages ?? 0, [response]);
  const displayedPayments = useMemo(() => data, [data]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const sortableId = React.useId();
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));
  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data]);

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    let newPageIndex: number, newPageSize: number;
    if (typeof updater === 'function') {
      const updatedState = updater({ pageIndex: currentPage - 1, pageSize });
      newPageIndex = updatedState.pageIndex; newPageSize = updatedState.pageSize;
    } else { newPageIndex = updater.pageIndex; newPageSize = updater.pageSize; }
    setPage(newPageIndex + 1);
    if (newPageSize !== pageSize) { setPageSize(newPageSize); }
  };

  const table = useReactTable({
    data: displayedPayments,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination: { pageIndex: currentPage - 1, pageSize } },
    pageCount,
    manualPagination: true,
    onPaginationChange: handlePaginationChange,
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((currentItems) => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id);
        const newIndex = currentItems.findIndex(item => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return currentItems;
        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  }

  const handleBulkDeleteConfirm = async () => {
    if (onBulkDelete) {
      const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
      try {
        await onBulkDelete(selectedIds);
        table.resetRowSelection();
      } finally {
        setShowBulkDeleteDialog(false);
      }
    }
  };

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="past-performance">Past Performance</SelectItem>
            <SelectItem value="key-personnel">Key Personnel</SelectItem>
            <SelectItem value="focus-documents">Focus Documents</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <ConfirmationDialog
              open={showBulkDeleteDialog}
              onOpenChange={setShowBulkDeleteDialog}
              trigger={
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => {}}
                  disabled={isDeleting || table.getFilteredSelectedRowModel().rows.length === 0}
                >
                  <IconTrash className="mr-1 size-4" /> 
                  Delete ({table.getFilteredSelectedRowModel().rows.length})
                </Button>
              }
              title={`Delete ${table.getFilteredSelectedRowModel().rows.length} Payment(s)?`}
              description="Are you sure you want to delete the selected payments? This action cannot be undone."
              onConfirm={handleBulkDeleteConfirm}
              isConfirming={isDeleting}
              confirmButtonVariant="destructive"
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
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
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <CreatePaymentDialog
            onSubmit={onCreate || (() => Promise.resolve())}
            isLoading={isCreating}
            residents={residents}
            fees={fees}
          />
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
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
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
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
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}


function TableCellViewer({ item }: { item: Payment }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.resident.fullName}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.resident.fullName}</DrawerTitle>
          <DrawerDescription>
            Payment details
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="id">ID</Label>
              <Input id="id" defaultValue={item.id} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="residentName">Resident Name</Label>
              <Input id="residentName" defaultValue={item.resident.fullName} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" defaultValue={item.quantity} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="amountPaid">Amount Paid</Label>
              <Input id="amountPaid" defaultValue={item.amountPaid} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Input id="payment_method" defaultValue={item.status} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="date_paid">Date Paid</Label>
              <Input id="date_paid" defaultValue={item.date_paid ? item.date_paid : "-"} />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

