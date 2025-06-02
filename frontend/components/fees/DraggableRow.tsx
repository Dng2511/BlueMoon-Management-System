import { Row } from "@tanstack/react-table"
import { CSS } from "@dnd-kit/utilities"
import { TableRow, TableCell } from "@/components/ui/table"
import { flexRender } from "@tanstack/react-table"
import React from "react"

export function DraggableRow({ row }: { row: Row<any> }) {
  // @ts-ignore: dnd-kit types
  const { transform, transition, setNodeRef, isDragging } = row?.getIsSelected?.() ? {} : { transform: null, transition: null, setNodeRef: undefined, isDragging: false }
  // Nếu dùng useSortable thì import và dùng ở đây, còn không thì bỏ qua
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform?.toString?.(transform ?? null),
        transition: transition || undefined,
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