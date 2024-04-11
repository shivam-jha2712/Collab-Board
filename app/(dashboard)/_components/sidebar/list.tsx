"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./item";

// Paid section of board feature (Paid Board/ Board Limits)

/**
 * Component responsible for rendering a list of user memberships.
 * Uses the useOrganizationList hook to fetch user memberships from the server.
 * If there are no user memberships, the component returns null.
 * Otherwise, it renders a list of organization names.
 */
export const List = () => {
  // Fetch user memberships using the useOrganizationList hook
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true, // Retrieve memberships infinitely
    },
  });

  // If there are no user memberships, return null
  if (!userMemberships.data?.length) return null;

  // Render a list of organization names
  return (
    <ul className="space-y-4">
      {/* Map through user memberships and render each organization name */}
      {userMemberships.data?.map((mem) => (
        <Item
          key={mem.organization.id}
          id={mem.organization.id}
          name={mem.organization.name}
          imageUrl={mem.organization.imageUrl}
          
        />
      ))}
    </ul>
  );
};
