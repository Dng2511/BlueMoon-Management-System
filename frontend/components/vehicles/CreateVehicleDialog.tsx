"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconPlus } from "@tabler/icons-react";

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
import { CreateVehicleRequest } from "@/lib/types/vehicle";
import { useApartments } from "@/lib/hooks/use-apartments";

const formSchema = z.object({
  license: z.string().min(2, "License plate must be at least 2 characters"),
  type: z.string().min(1, "Please select a vehicle type"),
  apartmentId: z.number().min(1, "Please select an apartment"),
});

interface CreateVehicleDialogProps {
  onSubmit: (data: CreateVehicleRequest) => Promise<void>;
  isLoading?: boolean;
}

export function CreateVehicleDialog({
  onSubmit,
  isLoading,
}: CreateVehicleDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { apartments } = useApartments();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      license: "",
      type: "",
      apartmentId: 0,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
      form.reset();
      setOpen(false);
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 size-4" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle to the system. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="license"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Plate</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter license plate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="motorbike">Motorbike</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apartmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apartment</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select apartment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {apartments.data?.content.map((apartment) => (
                        <SelectItem
                          key={apartment.id}
                          value={apartment.id.toString()}
                        >
                          {apartment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
