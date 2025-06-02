import { IconCash, IconReceipt, IconCheck, IconAlertCircle, IconUsers } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface FeesDetailCardProps {
  totalFee: number;
  totalPayments: number;
  totalResidentsAssigned: number;
  notYetPaidCount: number;
}

export function FeesDetailCard({ 
  totalFee,
  totalPayments,
  totalResidentsAssigned,
  notYetPaidCount,
}: FeesDetailCardProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Estimated Fee</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalFee)}
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Amount spent <IconCash className="size-4 mt-0.5" />
          </div>
          <div className="text-muted-foreground">
            Across all residents and types
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Payments Received</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalPayments)}
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sum of all recorded payments <IconReceipt className="size-4 mt-0.5" />
          </div>
          <div className="text-muted-foreground">
            Reflects actual collections
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Residents Assigned</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalResidentsAssigned}
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Number of residents assigned to this fee <IconUsers className="size-4 mt-0.5" />
          </div>
          <div className="text-muted-foreground">Indicates residents assigned to this fee</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Residents Not Yet Paid</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {notYetPaidCount}
          </CardTitle>
          <CardAction>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Number of outstanding fee items <IconAlertCircle className="size-4 text-red-500 mt-0.5" />
          </div>
          <div className="text-muted-foreground">Requires follow-up</div>
        </CardFooter>
      </Card>
    </div>
  )
}
