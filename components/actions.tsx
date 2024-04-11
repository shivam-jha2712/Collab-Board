// These action will be resued thus are being created in the global components folder itself

"use client";

// We're importing only the dropdown UI from Radix, but we're not actually utilizing the component itself; we'll only be working with its props.
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { ConfirmModal } from "@/components/confirm-modal";

// This import is from the ui components of dropdown menu
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
// This is for the delete function to work using mutation and also using API Based mutation thus api is also imported
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRenameModal } from "@/store/use-rename-modals";

interface ActionProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionProps) => {
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove);

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success("Link Copied Successfully!!"))
      .catch(() => toast.error("Failed to copy Link!"));
  };

  // Here we are using .remove in order to not to take up the js reserved keyword of delete

  const onDelete = () => {
    mutate({ id })
      .then(() => toast.success("Board Deleted SuccessFully!"))
      .catch(() => toast.error("Failed to Delete the Board!"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        // This is done to stop the event "e" to redirect to any part when it is being clicked
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2 " />
          Copy Board Link
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onOpen(id, title)} className="p-3 cursor-pointer">
          <Pencil className="h-4 w-4 mr-2 " />
          Rename Board
        </DropdownMenuItem>

        <ConfirmModal
          header="Delete Board?"
          description="Are you sure you wish to delete the board?"
          disabled={pending}
          onConfirm={onDelete}
        >
          {/* Here were using drop down menu intially but it opens and shuts very quick thus we switched to Button */}
          <Button
            //   onClick={onDelete}
            variant="ghost"
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash2 className="h-4 w-4 mr-2 " />
            Delete Board
          </Button>
        </ConfirmModal>

        
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
