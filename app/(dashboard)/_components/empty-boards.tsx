"use client";

import Image from "next/image"; // Importing Image component from Next.js for optimized image rendering
import { useMutation } from "convex/react"; // Importing useMutation hook from Convex for performing mutations
import { api } from "@/convex/_generated/api"; // Importing generated API from Convex for accessing board creation endpoint
import { Button } from "@/components/ui/button"; // Importing Button component from a custom UI library
import { useOrganization } from "@clerk/nextjs"; // Importing useOrganization hook from Clerk for accessing organization data
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProModal } from "@/store/use-pro-modals";

/**
 * EmptyBoards component represents the UI when there are no boards present.
 * It provides an option to create a new board.
 */
export const EmptyBoards = () => {

  const router = useRouter();
  const proModal = useProModal();

  // Retrieving organization data using the useOrganization hook
  const { organization } = useOrganization();

  // Using the useMutation hook to perform board creation mutation

  // Will be creating a loading indicator while the board is being created although it is very fast but, we don't need to do it every time thus we will be creating a reusable Mutation hook. So that we can have our loading exported from there. AS because create is only taking care of the action of actually creating the board.

  // >> under hooks >> use-api-mutation.ts

  const { mutate, pending } = useApiMutation(api.board.create);

  // Function to handle click event for creating a new board
  const onClick = () => {
    // Check if organization exists
    if (!organization) return;

    // Perform board creation mutation
    mutate({
      orgId: organization?.id,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board Created");
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error("Failed to Create Board! Please Try Again"));
  };

  // Render the UI for empty boards with option to create a new board
  return (
    <div className="h-full flex flex-col items-center justify-center mt-20">
      {/* Image representing empty state for boards */}
      <Image src="/note.svg" alt="Empty Boards" height={120} width={120} />
      {/* Title indicating empty state */}
      <h2 className="text-2xl font-semibold mt-6">No Boards Present!</h2>
      {/* Description guiding users to create a new board */}
      <p className="text-muted-foreground text-sm mt-2">
        Try Creating a New Board!
      </p>
      {/* Button for triggering board creation */}
      <div className="mt-6">
        <Button disabled={pending} onClick={onClick} size="lg">
          Create Board!
        </Button>
      </div>
    </div>
  );
};
