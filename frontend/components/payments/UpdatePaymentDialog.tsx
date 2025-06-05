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
  payment_method: z.string().optional(),
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
      payment_method: payment.status || undefined,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      // Kiểm tra xem có sự thay đổi nào không
      const hasChanges =
        parseInt(values.resident_id) !== payment.resident.id ||
        values.payment_method !== payment.status;

      if (!hasChanges) {
        setOpen(false);
        return;
      }

      // Xử lý date_paid
      let date_paid: string | null = null;
      if (values.payment_method && values.payment_method !== "not yet paid") {
        // Nếu payment method mới khác "not yet paid" và khác với payment method cũ
        if (values.payment_method !== payment.status) {
          date_paid = new Date().toISOString();
        } else {
          // Nếu payment method không thay đổi, giữ nguyên date_paid cũ
          date_paid = payment.date_paid;
        }
      }

      const updateData = {
        resident_id: parseInt(values.resident_id),
        fee_id: payment.fee?.id || 0,
        quantity: payment.quantity,
        payment_method: values.payment_method,
        date_paid,
      };

      console.log("Current payment:", payment);
      console.log("Update data:", updateData);

      await onSubmit?.(updateData);
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
                          {resident.fullName}{" "}
                          {resident.apartment ? `(${resident.apartment})` : ""}
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
                      <SelectItem value="bank transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="credit card">Credit Card</SelectItem>
                      <SelectItem value="not yet paid">Not Yet Paid</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
