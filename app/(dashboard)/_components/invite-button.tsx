import { Plus } from "lucide-react"; // Importing the Plus icon from lucide-react for the invite button
import { OrganizationProfile } from "@clerk/nextjs"; // Importing OrganizationProfile component from Clerk for organization details

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Importing Dialog components from a custom UI library

import { Button } from "@/components/ui/button"; // Importing Button component from a custom UI library

/**
 * Component representing an invite button for inviting members to the organization.
 * Opens a dialog box with organization profile details upon click.
 */
export const InviteButton = () => {
  return (
    // Dialog component for displaying organization profile details
    <Dialog>
      {/* Dialog trigger component (asChild) */}
      <DialogTrigger asChild>
        {/* Button component for the invite button */}
        <Button variant="outline">
          {/* Plus icon for the invite button */}
          <Plus className="h-4 w-4 mr-2" />
          Invite Members
        </Button>
      </DialogTrigger>
      {/* Dialog content for organization profile details */}
      <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
        {/* OrganizationProfile component to display organization details */}
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};
