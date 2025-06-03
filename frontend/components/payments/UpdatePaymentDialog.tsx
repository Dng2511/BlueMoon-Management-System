"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Payment, UpdatePaymentRequest } from "@/lib/types/payment";

const formSchema = z.object({
  resident_id: z.string().min(1, "Resident is required"),
  fee_id: z.string().min(1, "Fee is required"),
  quantity: z.coerce.number(),
  payment_method: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.payment_method === "not yet paid" && data.quantity !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Quantity must be 0 when payment method is 'Not Yet Paid'",
      path: ["quantity"],
    });
  } else if (data.payment_method !== "not yet paid" && data.quantity <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Quantity must be greater than 0 for other payment methods",
      path: ["quantity"],
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

interface UpdatePaymentDialogProps {
  payment: Payment;
  onSubmit?: (data: UpdatePaymentRequest) => Promise<void>;
  isLoading?: boolean;
  residents: Array<{ id: number; fullName: string; apartment?: string }>;
  fees: Array<{ id: number; type: string }>;
}

export function UpdatePaymentDialog({
  payment,
  onSubmit,
  isLoading,
  residents,
  fees,
}: UpdatePaymentDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resident_id: payment.resident.id.toString(),
      fee_id: payment.fee?.id.toString() || "",
      quantity: payment.quantity,
      payment_method: payment.status || undefined,
    },
  });

  const paymentMethod = form.watch("payment_method");
  React.useEffect(() => {
    if (paymentMethod === "not yet paid") {
      form.setValue("quantity", 0);
    } else if (form.getValues("quantity") === 0) {
      form.setValue("quantity", 1);
    }
  }, [paymentMethod, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit?.({
        resident_id: parseInt(values.resident_id),
        fee_id: parseInt(values.fee_id),
        quantity: values.quantity,
        payment_method: values.payment_method,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update payment:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
          <DialogDescription>
            Update the payment information in the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="resident_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resident</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resident" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {residents.map((resident) => (
                        <SelectItem
                          key={resident.id}
                          value={resident.id.toString()}
                        >
                          {resident.fullName} {resident.apartment ? `(${resident.apartment})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fee_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fees.map((fee) => (
                        <SelectItem
                          key={fee.id}
                          value={fee.id.toString()}
                        >
                          {fee.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="not yet paid">Not Yet Paid</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="Enter quantity" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      disabled={paymentMethod === "not yet paid"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Payment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 