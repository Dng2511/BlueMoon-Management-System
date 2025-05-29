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
  UpdateResidentRequest,
  Relation,
  StayStatus,
  Resident,
} from "@/lib/types/resident";
import { useApartments } from "@/lib/hooks/use-apartments";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dob: z.date(),
  cccd: z.string().min(9, "CCCD must be at least 9 characters"),
  gender: z.string().min(1, "Gender is required"),
  occupation: z.string().min(2, "Occupation must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  apartmentId: z.string(),
  relation: z.string(),
  stay_status: z.string(),
});

interface UpdateResidentDialogProps {
  resident: Resident;
  onSubmit?: (data: UpdateResidentRequest) => Promise<void>;
  isLoading?: boolean;
}

export function UpdateResidentDialog({
  resident,
  onSubmit,
  isLoading,
}: UpdateResidentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { apartments } = useApartments();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: resident.fullName,
      dob: new Date(resident.dob),
      cccd: resident.cccd,
      gender: resident.gender,
      occupation: resident.occupation,
      phoneNumber: resident.phoneNumber,
      apartmentId: resident.apartment?.id.toString() || "",
      relation: resident.relation,
      stay_status: resident.stay_status,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit?.({
        ...values,
        dob: format(values.dob, "yyyy-MM-dd"),
        apartmentId: parseInt(values.apartmentId),
        relation: values.relation as Relation,
        stay_status: values.stay_status as StayStatus,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update resident:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Resident</DialogTitle>
          <DialogDescription>
            Update the resident's information in the system.
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                {isLoading ? "Updating..." : "Update Resident"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
