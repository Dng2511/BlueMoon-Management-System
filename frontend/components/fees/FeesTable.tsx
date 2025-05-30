"use client"

import * as React from "react"
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
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
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
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { CreateFeeRequest, UpdateFeeRequest, Fee, FeesResponse } from "@/lib/types/fee"
import { FeeEditDrawer } from "./FeeEditDrawer"
import { DeleteFeeDialog } from "./DeleteFeeDialog"
import { BulkDeleteDialog } from "./BulkDeleteDialog"
import { CreateFeeDialog } from "./CreateFeeDialog"
import { usePagination } from "@/lib/hooks/use-pagination"
import { useFeesByMonth } from "@/lib/hooks/use-fees"
import { FeesTabAll } from "./FeesTabAll"
import { FeesTabCurrentMonth } from "./FeesTabCurrentMonth"

export const schema = z.object({
  id: z.number(),
  type: z.string(),
  amount: z.number(),
  month: z.string(),
  description: z.string(),
  compulsory: z.boolean(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

export function FeesTable({
  data: feesResponse,
  onEdit,
  onDelete,
  onCreate,
  isCreating,
  isUpdating,
  isDeleting,
  onPageChange,
}: {
  data: FeesResponse | undefined
  onEdit?: (id: number, data: UpdateFeeRequest) => Promise<void>
  onDelete?: (id: number) => Promise<void>
  onCreate?: (data: CreateFeeRequest) => Promise<void>
  isCreating?: boolean
  isUpdating?: boolean
  isDeleting?: boolean
  onPageChange?: (page: number, pageSize: number) => void
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [editingItem, setEditingItem] = React.useState<z.infer<typeof schema> | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("outline")
  
  // Get current date and format it as YYYY-MM
  const currentDate = new Date()
  const currentMonth = currentDate.toISOString().slice(0, 7) // Format: YYYY-MM
  
  // Generate array of last 11 months (current month + 10 previous months)
  const monthOptions = React.useMemo(() => {
    const months = []
    const seenMonths = new Set()
    
    for (let i = 0; i < 11; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStr = date.toISOString().slice(0, 7) // Format: YYYY-MM
      
      // Skip if we've already seen this month
      if (seenMonths.has(monthStr)) continue
      
      seenMonths.add(monthStr)
      const displayStr = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      months.push({ value: monthStr, label: displayStr })
    }
    return months
  }, [])

  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth)

  // Use different data sources based on active tab
  const feesByMonth = useFeesByMonth(selectedMonth)
  
  // Use pagination hook
  const pagination = usePagination({
    initialPage: (feesResponse?.number || 0) + 1, // Server uses 0-based, UI uses 1-based
    initialPageSize: feesResponse?.size || 10,
    onPageChange: (page, pageSize) => {
      onPageChange?.(page - 1, pageSize) // Convert back to 0-based for server
    },
  })

  // Choose data source based on active tab
  const data = React.useMemo(() => {
    if (activeTab === "past-performance") {
      return feesByMonth.data || []
    }
    return feesResponse?.content || []
  }, [activeTab, feesByMonth.data, feesResponse?.content])

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!onDelete) return
    
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedIds = selectedRows.map(row => row.original.id)
    
    setIsBulkDeleting(true)
    
    try {
      // Send multiple delete requests
      await Promise.all(selectedIds.map(id => onDelete(id)))
      
      // Clear selection after successful deletion
      setRowSelection({})
    } catch (error) {
      console.error('Failed to delete some fees:', error)
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const baseColumns: ColumnDef<z.infer<typeof schema>>[] = [
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
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      accessorKey: "type",
      header: "Fee Type",
      cell: ({ row }) => (
        <Button 
          variant="link" 
          className="text-foreground w-fit px-0 text-left"
          onClick={() => setEditingItem(row.original)}
        >
          {row.original.type}
        </Button>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "amount",
      header: () => <div className="w-32 text-right">Amount (VND)</div>,
      cell: ({ row }) => (
        <div className="w-32 text-right font-medium">
          {new Intl.NumberFormat('vi-VN').format(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: "month",
      header: "Month",
      cell: ({ row }) => (
        <div className="w-24">
          {row.original.month}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="min-w-48 max-w-72">
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "compulsory",
      header: "Compulsory",
      cell: ({ row }) => (
        <Badge variant={row.original.compulsory ? "default" : "outline"} className="px-2">
          {row.original.compulsory ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
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
            <DropdownMenuItem
              onClick={() => setEditingItem(row.original)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteFeeDialog
              onConfirm={() => {
                if (onDelete) {
                  onDelete(row.original.id);
                }
              }}
              isLoading={isDeleting}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Create columns for different tabs
  const columns = React.useMemo(() => {
    if (activeTab === "past-performance") {
      // Remove month column for past-performance tab
      return baseColumns.filter(column => {
        const columnWithAccessor = column as any
        return columnWithAccessor.accessorKey !== "month"
      })
    }
    return baseColumns
  }, [activeTab, baseColumns])

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: activeTab !== "past-performance", // Enable manual pagination for server-side, disable for past-performance
    pageCount: activeTab === "past-performance" ? -1 : (feesResponse?.totalPages || 0),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      // Note: For server-side pagination, you might want to handle drag reordering differently
      // This is just for local reordering within the current page
      console.log('Drag reordering not implemented for server-side pagination')
    }
  }

  return (
    <div>
      <Tabs
        defaultValue="outline"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="outline" value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">All Fees</SelectItem>
              <SelectItem value="past-performance">Current Month</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-4 w-full">
            <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
              <TabsTrigger value="outline">All Fees</TabsTrigger>
              <TabsTrigger value="past-performance">
                Current Month <Badge variant="secondary">{feesByMonth.data?.length || 0}</Badge>
              </TabsTrigger>
              {/* <TabsTrigger value="key-personnel">
                Compulsory Fees <Badge variant="secondary">7</Badge>
              </TabsTrigger> */}
              {/* <TabsTrigger value="focus-documents">Fee Reports</TabsTrigger> */}
            </TabsList>
            {activeTab === "past-performance" && (
              <div className="flex items-center gap-2 ml-4">
                <Label htmlFor="month-selector" className="text-sm font-medium">
                  Select Month:
                </Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40" size="sm" id="month-selector">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <BulkDeleteDialog
                selectedCount={table.getFilteredSelectedRowModel().rows.length}
                onConfirm={handleBulkDelete}
                isLoading={isBulkDeleting}
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
            <CreateFeeDialog
              onSubmit={onCreate || (() => Promise.resolve())}
              isLoading={isCreating}
            />
          </div>
        </div>
        <TabsContent
          value="outline"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <FeesTabAll
            columns={columns}
            table={table}
            dataIds={dataIds}
            data={data}
            handleDragEnd={handleDragEnd}
          />
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {activeTab === "past-performance" ? data.length : (feesResponse?.totalElements || 0)} item(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              {activeTab !== "past-performance" && (
                <div className="hidden items-center gap-2 lg:flex">
                  <Label htmlFor="rows-per-page" className="text-sm font-medium">
                    Rows per page
                  </Label>
                  <Select
                    value={`${pagination.pageSize}`}
                    onValueChange={(value) => {
                      pagination.setPageSize(Number(value))
                    }}
                  >
                    <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                      <SelectValue
                        placeholder={pagination.pageSize}
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
              )}
              {activeTab !== "past-performance" && (
                <>
                  <div className="flex w-fit items-center justify-center text-sm font-medium">
                    Page {pagination.currentPage} of{" "}
                    {feesResponse?.totalPages || 1}
                  </div>
                  <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => pagination.goToFirstPage()}
                      disabled={!pagination.canGoPrevious()}
                    >
                      <span className="sr-only">Go to first page</span>
                      <IconChevronsLeft />
                    </Button>
                    <Button
                      variant="outline"
                      className="size-8"
                      size="icon"
                      onClick={() => pagination.previousPage()}
                      disabled={!pagination.canGoPrevious()}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <IconChevronLeft />
                    </Button>
                    <Button
                      variant="outline"
                      className="size-8"
                      size="icon"
                      onClick={() => pagination.nextPage()}
                      disabled={!pagination.canGoNext(feesResponse?.totalPages || 1)}
                    >
                      <span className="sr-only">Go to next page</span>
                      <IconChevronRight />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden size-8 lg:flex"
                      size="icon"
                      onClick={() => pagination.goToLastPage(feesResponse?.totalPages || 1)}
                      disabled={!pagination.canGoNext(feesResponse?.totalPages || 1)}
                    >
                      <span className="sr-only">Go to last page</span>
                      <IconChevronsRight />
                    </Button>
                  </div>
                </>
              )}
              {activeTab === "past-performance" && (
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                  Showing {data.length} fees for {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="past-performance"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <FeesTabCurrentMonth
            columns={columns}
            table={table}
            dataIds={dataIds}
            data={data}
            handleDragEnd={handleDragEnd}
            feesByMonth={feesByMonth}
            selectedMonth={selectedMonth}
            monthOptions={monthOptions}
            setSelectedMonth={setSelectedMonth}
          />
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {activeTab === "past-performance" ? data.length : (feesResponse?.totalElements || 0)} item(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              {activeTab !== "past-performance" && (
                <div className="hidden items-center gap-2 lg:flex">
                  <Label htmlFor="rows-per-page" className="text-sm font-medium">
                    Rows per page
                  </Label>
                  <Select
                    value={`${pagination.pageSize}`}
                    onValueChange={(value) => {
                      pagination.setPageSize(Number(value))
                    }}
                  >
                    <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                      <SelectValue
                        placeholder={pagination.pageSize}
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
              )}
              {activeTab !== "past-performance" && (
                <>
                  <div className="flex w-fit items-center justify-center text-sm font-medium">
                    Page {pagination.currentPage} of{" "}
                    {feesResponse?.totalPages || 1}
                  </div>
                  <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => pagination.goToFirstPage()}
                      disabled={!pagination.canGoPrevious()}
                    >
                      <span className="sr-only">Go to first page</span>
                      <IconChevronsLeft />
                    </Button>
                    <Button
                      variant="outline"
                      className="size-8"
                      size="icon"
                      onClick={() => pagination.previousPage()}
                      disabled={!pagination.canGoPrevious()}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <IconChevronLeft />
                    </Button>
                    <Button
                      variant="outline"
                      className="size-8"
                      size="icon"
                      onClick={() => pagination.nextPage()}
                      disabled={!pagination.canGoNext(feesResponse?.totalPages || 1)}
                    >
                      <span className="sr-only">Go to next page</span>
                      <IconChevronRight />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden size-8 lg:flex"
                      size="icon"
                      onClick={() => pagination.goToLastPage(feesResponse?.totalPages || 1)}
                      disabled={!pagination.canGoNext(feesResponse?.totalPages || 1)}
                    >
                      <span className="sr-only">Go to last page</span>
                      <IconChevronsRight />
                    </Button>
                  </div>
                </>
              )}
              {activeTab === "past-performance" && (
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                  Showing {data.length} fees for {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
            Compulsory Fees View - Coming Soon
          </div>
        </TabsContent>
        <TabsContent
          value="focus-documents"
          className="flex flex-col px-4 lg:px-6"
        >
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
            Fee Reports - Coming Soon
          </div>
        </TabsContent>
      </Tabs>
      {editingItem && (
        <FeeEditDrawer
          item={editingItem}
          onEdit={onEdit}
          isUpdating={isUpdating}
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) {
              setEditingItem(null)
            }
          }}
          trigger={null}
        />
      )}
    </div>
  )
}

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

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
  )
}

