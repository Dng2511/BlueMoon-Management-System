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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus } from "@tabler/icons-react";
import { CreatePaymentRequest } from "@/lib/types/payment";

const formSchema = z.object({
  resident_id: z.number().min(1, "Resident is required"),
  fee_id: z.number().min(1, "Fee is required"),
  quantity: z.number(),
  payment_method: z.string().min(1, "Payment method is required"),
}).superRefine((data, ctx) => {
  if (data.payment_method === "not_yet_paid" && data.quantity !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Quantity must be 0 when payment method is 'Not Yet Paid'",
      path: ["quantity"],
    });
  } else if (data.payment_method !== "not_yet_paid" && data.quantity <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Quantity must be greater than 0 for other payment methods",
      path: ["quantity"],
    });
  }
});

interface CreatePaymentDialogProps {
  onSubmit: (data: CreatePaymentRequest) => Promise<void>;
  isLoading?: boolean;
  residents: Array<{ id: number; fullName: string; apartment?: string }>;
  fees: Array<{ id: number; type: string }>;
}

export function CreatePaymentDialog({
  onSubmit,
  isLoading,
  residents,
  fees,
}: CreatePaymentDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resident_id: 0,
      fee_id: 0,
      quantity: 1,
      payment_method: "cash",
    },
  });

  const paymentMethod = form.watch("payment_method");
  React.useEffect(() => {
    if (paymentMethod === "not_yet_paid") {
      form.setValue("quantity", 0);
    } else if (form.getValues("quantity") === 0) {
      form.setValue("quantity", 1);
    }
  }, [paymentMethod, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create payment:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Add Payment</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new payment to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="resident_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resident</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a resident" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {residents.map((resident) => (
                          <SelectItem key={resident.id} value={resident.id.toString()}>
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
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fee type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fees.map((fee) => (
                          <SelectItem key={fee.id} value={fee.id.toString()}>
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
                        <SelectItem value="not_yet_paid">Not Yet Paid</SelectItem>
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
                        placeholder="Enter quantity"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={paymentMethod === "not_yet_paid"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Payment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 