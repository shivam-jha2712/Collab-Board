"use client";

// Importing necessary components and hooks from Clerk and custom components
// The useOrganization hook is simply used to make sure that the Invite membbers button only works when there is an active organisation already present.
import {
  UserButton,
  OrganizationSwitcher,
  useOrganization,
} from "@clerk/nextjs"; // Importing components and hooks from Clerk for user authentication and organization management
import { SearchInput } from "./search-input"; // Importing the SearchInput component from a local file
import { InviteButton } from "./invite-button"; // Importing the InviteButton component from a local file
import { ModeToggle } from "@/components/mode-toggle";
import { Hint } from "@/components/hint";

/**
 * Component representing the navigation bar of the application.
 * Displays search input, organization switcher, invite button (if an organization is selected), and user button.
 */
export const Navbar = () => {
  // Accessing the organization information using the useOrganization hook
  const { organization } = useOrganization(); // Explained at Line 65 - Destructuring**

  return (
    // Container for navigation bar with flex layout and padding
    <div className="flex items-center gap-x-4 p-5">
      <Hint label="Switch Theme">
        <div className="flex items-center justify-center fixed z-10 right-2 bottom-2 ">
          <ModeToggle />
        </div>
      </Hint>

      {/* Search input field (visible only on larger screens) */}
      <div className="hidden lg:flex lg:flex-1  font-serif">
        <SearchInput />
      </div>
      {/* Organization switcher (visible only on smaller screens) */}
      <div className="block lg:hidden flex-1">
        {/* Organization switcher component */}
        <OrganizationSwitcher
          hidePersonal // Hides personal organizations from the switcher
          // Custom appearance styles for the organization switcher

          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: "376px",
                borderRadius: "8px",
                backgroundColor: "white",
              },
              organizationSwitcherTrigger: {
                padding: "6px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                justifyContent: "space-between",
                backgroundColor: "white",
                opacity: 50,
              },
            },
          }}
        />
      </div>
      {/* Invite button (visible only when an organization is selected) */}
      {/* This is symbolised that the Invite members button is only valid when the organization is selected */}
      {organization && <InviteButton />}
      {/* User button for authentication */}
      <UserButton />
    </div>
  );
};

{
  /*

The destructuring assignment `const { organization } = useOrganization();` is used to directly extract the `organization` property from the object returned by the `useOrganization()` hook. This allows you to directly access the `organization` variable, which represents the current organization.

Previously, the condition for rendering the invite button was `organization && <InviteButton />`, where `organization` was the entire object returned by `useOrganization()`. This condition checks if the `organization` object exists, and if it does, it renders the `InviteButton`. However, if the `organization` object exists but is empty or falsy, the button would still be rendered.

By using destructuring, you specifically extract the `organization` property from the returned object. If `organization` is `null`, `undefined`, or an empty object, the condition `organization && <InviteButton />` will evaluate to `false`, and the `InviteButton` will not be rendered. This ensures that the button is only rendered when there is a valid organization object present.

In summary, the use of destructuring in `const { organization } = useOrganization();` allows for more precise control over the condition for rendering the invite button, ensuring that it is only displayed when there is an actual organization object present.

*/
}
