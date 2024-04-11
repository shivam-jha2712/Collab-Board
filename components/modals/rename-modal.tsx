// We could over here use confirm-modal as well, which was used with the help of certain triggers in Actions.tsx
// But this is going to be called and used diffrently as because it is going to work according to the "zustand store" that has been created as a modal functionality.
// This zustand is going to be programatically be opened depending upon the needs.
"use client";
import { useState, useEffect, FormEventHandler } from "react";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRenameModal } from "@/store/use-rename-modals";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

export const RenameModal = () => {
  const { isOpen, onClose, intialValues } = useRenameModal();

  const [title, setTitle] = useState(intialValues.title);

  // Although it is not the perfect practice to implement but we will take it as an exception
  useEffect(() => {
    setTitle(intialValues.title);
  }, [intialValues.title]);

  const { mutate, pending } = useApiMutation(api.board.update);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({
      id: intialValues.id,
      title,
    })
      .then(() => {
        toast.success("Board Renamed Succesfully");
        onClose();
      })
      .catch(() => {
        toast.error("Unable to rename the Board");
        onClose();
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Board Title?</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a New Title for this Board</DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <Input
            disabled={pending}
            required
            maxLength={60}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board Title"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// If we directly use our Modal "here: "RenameModal" " directly in the root layout

// In Next.js when we use programitic control of our modals using something like zustand.
// That can create hydration errors.

// So we would be understanding a practice of of creating a provider something like a modal provider: that would help us get over these Hydration errors and that would help us in not writing same piece of code again and again.
