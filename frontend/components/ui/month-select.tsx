import * as React from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface MonthSelectProps {
  value: string
  onValueChange: (value: string) => void
  id?: string
  placeholder?: string
  className?: string
}

export function MonthSelect({ value, onValueChange, id, placeholder = "Select month", className }: MonthSelectProps) {
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

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {monthOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 