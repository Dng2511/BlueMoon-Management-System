"use client"

import * as React from "react"
import { IconLoader, IconTrendingUp } from "@tabler/icons-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
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
import { UpdateFeeRequest } from "@/lib/types/fee"
import { MonthSelect } from "@/components/ui/month-select"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const feeSchema = z.object({
  id: z.number(),
  type: z.string(),
  amount: z.number(),
  month: z.string(),
  description: z.string(),
  compulsory: z.boolean(),
})

interface FeeEditDrawerProps {
  item: z.infer<typeof feeSchema>
  onEdit?: (id: number, data: UpdateFeeRequest) => Promise<void>
  isUpdating?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function FeeEditDrawer({ 
  item, 
  onEdit, 
  isUpdating, 
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger 
}: FeeEditDrawerProps) {
  const isMobile = useIsMobile()
  const [internalOpen, setInternalOpen] = React.useState(false)
  
  // Use external open state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
  const setIsOpen = externalOnOpenChange || setInternalOpen
  
  // Form state
  const [formData, setFormData] = React.useState({
    type: item.type,
    amount: item.amount,
    month: item.month,
    description: item.description,
    compulsory: item.compulsory,
  })

  // Generate array of last 11 months (current month + 10 previous months)
  const monthOptions = React.useMemo(() => {
    const months = []
    const seenMonths = new Set()
    for (let i = 0; i < 11; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStr = date.toISOString().slice(0, 7) // Format: YYYY-MM
      if (seenMonths.has(monthStr)) continue
      seenMonths.add(monthStr)
      const displayStr = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      months.push({ value: monthStr, label: displayStr })
    }
    return months
  }, [])

  // Reset form when item changes or drawer opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        type: item.type,
        amount: item.amount,
        month: item.month,
        description: item.description,
        compulsory: item.compulsory,
      })
    }
  }, [item, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!onEdit) return
    
    try {
      await onEdit(item.id, {
        type: formData.type,
        amount: formData.amount,
        month: formData.month,
        description: formData.description,
        compulsory: formData.compulsory,
      })
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update fee:', error)
    }
  }

  const defaultTrigger = (
    <Button variant="link" className="text-foreground w-fit px-0 text-left">
      {item.type}
    </Button>
  )

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen}>
      {trigger !== null && (
        <DrawerTrigger asChild>
          {trigger || defaultTrigger}
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Edit {item.type}</DrawerTitle>
          <DrawerDescription>
            Update fee details for {item.month}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Monthly fee tracking{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Manage and track apartment fees for {item.month}. 
                  This fee is {item.compulsory ? 'compulsory' : 'optional'} for all residents.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="type">Fee Type</Label>
              <Input 
                id="type" 
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Enter fee type"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="amount">Amount (VND)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="month">Month</Label>
                <MonthSelect
                  value={formData.month}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
                  id="month"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="compulsory">Compulsory</Label>
              <Select 
                value={formData.compulsory ? "true" : "false"} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, compulsory: value === "true" }))}
              >
                <SelectTrigger id="compulsory" className="w-full">
                  <SelectValue placeholder="Is this fee compulsory?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes - Compulsory</SelectItem>
                  <SelectItem value="false">No - Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating && <IconLoader className="size-4 animate-spin" />}
            {isUpdating ? "Updating..." : "Update Fee"}
          </Button>
          <DrawerClose asChild>
          <Button 
            variant="outline"
          >
            Cancel
          </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
} 