import Image from "next/image"; // Importing the Image component from Next.js for optimized image rendering
import { CreateOrganization } from "@clerk/nextjs"; // Importing the CreateOrganization component from Clerk for organization creation
import { Button } from "@/components/ui/button"; // Importing the Button component from a custom UI library
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Importing Dialog components from a custom UI library

/**
 * Component representing the UI when there are no organizations created yet.
 * Provides options to create a new organization.
 */
export const EmptyOrg = () => {
  return (
    // Container for the empty organization UI with flex layout
    <div className="h-full flex flex-col items-center justify-center">
      {/* Image representing an empty state */}
      <Image src="/elements.svg" alt="Empty" height={200} width={200} />
      {/* Title indicating the empty state */}
      <h2 className="text-2xl font-semibold mt-6">Welcome to Collab Board!</h2>
      {/* Description guiding users to create an organization */}
      <p className="text-muted-foreground text-sm mt-2">
        Create an Organization to get Started
      </p>
      {/* Button to trigger organization creation */}
      <div className="mt-6">
        {/* Dialog component for organization creation */}
        <Dialog>
          {/* Dialog trigger component (asChild) */}
          <DialogTrigger asChild>
            {/* Button component for triggering the dialog */}
            <Button size="lg">Create an Organization</Button>
          </DialogTrigger>
          {/* Dialog content for organization creation */}
          <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
            {/* CreateOrganization component for organization creation form */}
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      </div>
    </div>
    // The Image used here is a free image from a 3-d Illustration pack called sally
    // Link: https://www.figma.com/community/file/890095002328610853
  );
};
