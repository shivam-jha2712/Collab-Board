"use client";
import { toast } from "sonner"; // Importing the toast notification library
import { cn } from "@/lib/utils"; // Importing utility function for classnames
// import { useMutation } from "convex/react"; // Importing useMutation hook from Convex library
import { Plus } from "lucide-react"; // Importing Plus icon from Lucide-React library
import { api } from "@/convex/_generated/api"; // Importing the API endpoint from the Convex generated files
import { useApiMutation } from "@/hooks/use-api-mutation"; // Importing custom hook for handling API mutations
import { useRouter } from "next/navigation";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

/**
 * NewBoardButton Component: Renders a button to create a new board.
 * @param orgId - The organization ID.
 * @param disabled - Specifies if the button should be disabled.
 * @returns JSX.Element
 */
export const NewBoardButton = ({
  orgId,
  disabled,
}: NewBoardButtonProps): JSX.Element => {
  const router = useRouter();
  // Using the useApiMutation hook for handling API mutations
  const { mutate, pending } = useApiMutation(api.board.create);

  // Function to handle button click event
  const onClick = () => {
    mutate({
      orgId,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board Created Successfully!"); // Displaying success message on board creation
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error("Failed to create board!")); // Displaying error message on failure
  };

  return (
    <button
      disabled={pending || disabled} // Disabling the button if there's a pending mutation or if explicitly disabled
      onClick={onClick} // Handling click event with onClick function
      className={cn(
        "col-span-1 aspect-[100/127] bg-slate-600 rounded-lg hover:bg-slate-800 flex flex-col items-center justify-center py-6",
        (pending || disabled) &&
          "opacity-75 hover:bg-slate-600 cursor-not-allowed" // Applying conditional styles based on pending or disabled state
      )}
    >
      <div />
      <Plus className="h-12 w-12 text-white stroke-1" />{" "}
      {/* Plus icon for visual representation */}
      <p className="text-sm text-white font-light">New Board</p>{" "}
      {/* Text label for the button */}
    </button>
  );
};
