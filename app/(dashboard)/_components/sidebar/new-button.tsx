import { Plus } from "lucide-react"; // Importing the Plus icon from the lucide-react library
import { CreateOrganization } from "@clerk/nextjs"; // Importing the CreateOrganization component from Clerk
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Importing dialog components
import { Hint } from "@/components/hint";

/**
 * Component representing a button to create a new organization.
 * When clicked, it triggers a dialog containing the CreateOrganization form.
 */
export const NewButton = () => {
  return (
    <Dialog>
      {/* Trigger for the dialog */}
      <DialogTrigger asChild>
        <div className="aspect-square">
          <Hint
            label="Create Organization"
            side="right"
            align="start"
            sideOffset={18}
          >
            {/* Button triggering the dialog */}
            <button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
              {/* Plus icon for visual representation */}
              <Plus className="text-white"></Plus>
            </button>
          </Hint>
        </div>
      </DialogTrigger>
      {/* Content of the dialog */}
      <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
        {/* Form for creating a new organization */}
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
