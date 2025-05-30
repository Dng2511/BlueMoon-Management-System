"use client";

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
import { Button } from "@/components/ui/button";
import { IconLoader, IconTrash } from "@tabler/icons-react";

interface BulkDeleteDialogProps {
  selectedCount: number;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function BulkDeleteDialog({
  selectedCount,
  onConfirm,
  isLoading,
}: BulkDeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <IconLoader className="size-4 animate-spin" />
          ) : (
            <IconTrash className="size-4" />
          )}
          {isLoading 
            ? `Deleting ${selectedCount} fees...` 
            : `Delete ${selectedCount} selected`
          }
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {selectedCount} fees?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{selectedCount}</strong> {selectedCount === 1 ? "fee" : "fees"}{" "}
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <IconLoader className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete All"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 