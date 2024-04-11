"use client";

import Image from "next/image";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
// This is from the shadcn ui which was installed earlier while setting up the project
/**
 * Component responsible for rendering an item with its image.
 * Props include 'id', 'name', and 'imageUrl'.
 * Uses the 'Image' component to display the item's image.
 * Provides a clickable interface with a hover effect.
 */
interface ItemProps {
  id: string; // Unique identifier for the item
  name: string; // Name of the item
  imageUrl: string; // URL of the item's image
}

export const Item = ({ id, name, imageUrl }: ItemProps) => {
  // Fetching organization data using the 'useOrganization' hook
  const { organization } = useOrganization();

  // Fetching setActive function from the 'useOrganizationList' hook
  const { setActive } = useOrganizationList();

  // Checking if the current item is active based on organization id
  const isActive = organization?.id === id;

  // Function to handle item click
  const onClick = () => {
    if (!setActive) return;

    // Setting the active organization
    setActive({ organization: id });
  };

  return (
    <div className="aspect-square relative">
      {/* Displaying the item's image */}
      <Hint label={name} side="right" align="start" sideOffset={18}>
        <Image
          fill
          alt={name}
          src={imageUrl}
          onClick={onClick}
          // Applying classNames based on conditions using 'classnames' library
          className={cn(
            "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
            isActive && "opacity-100" // Conditionally applying className based on 'isActive'
          )}
        />
      </Hint>
    </div>
  );
};
