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
import { CreateFeeRequest } from "@/lib/types/fee";
import { IconPlus } from "@tabler/icons-react";
import { MonthSelect } from "@/components/ui/month-select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  type: z.string().min(2, "Fee type must be at least 2 characters"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  month: z.string().min(1, "Month is required"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  compulsory: z.boolean(),
});

interface CreateFeeDialogProps {
  onSubmit: (data: CreateFeeRequest) => Promise<void>;
  isLoading?: boolean;
}

export function CreateFeeDialog({
  onSubmit,
  isLoading,
}: CreateFeeDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isAreaFee, setIsAreaFee] = React.useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      amount: 0,
      month: "",
      description: "",
      compulsory: true,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create fee:", error);
    }
  };

  // Cập nhật giá trị type và compulsory khi toggle thay đổi
  React.useEffect(() => {
    if (isAreaFee) {
      form.setValue("type", "area");
      form.setValue("compulsory", true);
    } else {
      form.setValue("type", "");
    }
  }, [isAreaFee, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Add Fee</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Fee</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new fee to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Fee Type</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="area-fee" className="text-sm text-muted-foreground">Phí diện tích</Label>
                        <Switch
                          id="area-fee"
                          checked={isAreaFee}
                          onCheckedChange={setIsAreaFee}
                        />
                      </div>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="Enter fee type" 
                        {...field} 
                        disabled={isAreaFee}
                        value={isAreaFee ? "area" : field.value}
                        onChange={(e) => {
                          if (!isAreaFee) {
                            field.onChange(e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <FormControl>
                        <MonthSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          id="month"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compulsory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compulsory</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "true")}
                      defaultValue={field.value ? "true" : "false"}
                      disabled={isAreaFee}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Is this fee compulsory?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes - Compulsory</SelectItem>
                        <SelectItem value="false">No - Optional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Fee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 