"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CreateResidentRequest,
  Relation,
  StayStatus,
} from "@/lib/types/resident";
import { IconPlus } from "@tabler/icons-react";
import { useApartments } from "@/lib/hooks/use-apartments";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dob: z.date({
    required_error: "Date of birth is required",
  }),
  cccd: z.string().min(9, "CCCD must be at least 9 characters"),
  gender: z.string().min(1, "Gender is required"),
  occupation: z.string().min(2, "Occupation must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  apartmentId: z.string().min(1, "Apartment is required"),
  relation: z.string().min(1, "Relation is required"),
  stay_status: z.string().min(1, "Stay status is required"),
});

interface CreateResidentDialogProps {
  onSubmit: (data: CreateResidentRequest) => Promise<void>;
  isLoading?: boolean;
  apartmentId?: number;
}

export function CreateResidentDialog({
  onSubmit,
  isLoading,
  apartmentId,
}: CreateResidentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { apartments } = useApartments();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dob: new Date(),
      cccd: "",
      gender: "",
      occupation: "",
      phoneNumber: "",
      apartmentId: apartmentId ? apartmentId.toString() : "",
      relation: "",
      stay_status: "PERMANENT_RESIDENCE",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit({
        ...values,
        dob: format(values.dob, "yyyy-MM-dd"),
        apartmentId: parseInt(values.apartmentId),
        relation: values.relation as Relation,
        stay_status: values.stay_status as StayStatus,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create resident:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 size-4" />
          Add Resident
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Resident</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new resident to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value ? format(field.value, "yyyy-MM-dd") : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? new Date(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cccd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CCCD</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter CCCD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Nam">Male</SelectItem>
                          <SelectItem value="Nữ">Female</SelectItem>
                          <SelectItem value="Khác">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relation</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OWNER">Owner</SelectItem>
                          <SelectItem value="TENANT">Tenant</SelectItem>
                          <SelectItem value="RELATIVE">Relative</SelectItem>
                          <SelectItem value="VISITOR">Visitor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!!apartmentId}
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

                <FormField
                  control={form.control}
                  name="stay_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stay Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stay status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PERMANENT_RESIDENCE">
                            Permanent Residence
                          </SelectItem>
                          <SelectItem value="TEMPORARY_RESIDENCE">
                            Temporary Residence
                          </SelectItem>
                          <SelectItem value="TEMPORARY_ABSENCE">
                            Temporary Absence
                          </SelectItem>
                          <SelectItem value="UNREGISTERED">
                            Unregistered
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Resident"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
