import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"; // Assuming this path is correct
import type { VariantProps } from "class-variance-authority"; // For button variants

// Assuming your Button component uses CVA for variants
// If not, you might need to define variant types differently or omit them for AlertDialogAction
export const buttonVariants = (props: any) => {}; // Placeholder if not using CVA directly here

interface ConfirmationDialogProps {
  trigger?: React.ReactNode; // Element that opens the dialog
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isConfirming?: boolean;
  confirmButtonVariant?: Parameters<typeof Button>[0]["variant"];
  open?: boolean; // To use as a controlled component
  onOpenChange?: (open: boolean) => void; // To use as a controlled component
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isConfirming,
  confirmButtonVariant = "destructive",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: ConfirmationDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Determine if the dialog is controlled or uncontrolled
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOpen !== undefined ? setControlledOpen! : setInternalOpen;

  const handleConfirm = () => {
    onConfirm();
    // Parent should handle closing if it's a controlled component, otherwise close internally.
    if (controlledOpen === undefined) {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && !controlledOpen && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      {/* If controlled, the parent is responsible for rendering the trigger and managing state */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
          <Button 
            onClick={handleConfirm} 
            disabled={isConfirming} 
            variant={confirmButtonVariant}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            // For shadcn/ui, AlertDialogAction is often a Button, so this structure works.
            // If AlertDialogAction is not a Button, this will need adjustment.
          >
            {isConfirming ? "Processing..." : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 