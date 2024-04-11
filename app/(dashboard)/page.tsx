// Component Definition:
// This code defines a functional component named DashboardPage. It doesn't take any props and simply returns a div element containing the text "Dashboard Root Page".

"use client";
// This is also much helpful in our terms because we are using convex agar apan nahi use krte toh we needed to use React Server Component Things.
// Us hackle se bachne ke liye apan ne Convex use kara hai taki hum "use client" ko use kar paaye.

import { useOrganization } from "@clerk/nextjs"; // Importing useOrganization hook from Clerk for accessing organization data
import { EmptyOrg } from "./_components/empty-org"; // Importing EmptyOrg component for displaying when no organization exists
import { BoardList } from "./_components/board-list";


// Interface defining the props expected by the DashboardPage component
interface DashboardPageProps {
  searchParams: {
    search?: string; // Search parameter for filtering boards
    favorites?: string; // Favorites parameter for filtering favorite boards
  };
}

/**
 * DashboardPage component represents the main dashboard page of the application.
 * It receives search parameters as props to filter the board list.
 * If no organization exists, it renders the EmptyOrg component.
 * Otherwise, it renders the board list.
 */
const DashboardPage = ({ searchParams }: DashboardPageProps) => {
  // Destructuring to extract the 'organization' property from the result of useOrganization hook
  const { organization } = useOrganization();

  return (
    // Main container with flex layout
    <div className=" flex-1 h-[calc(100%-80px)] p-6">
      {/* Displaying the search parameters for debugging */}
      {/* {JSON.stringify(searchParams)} */}

      
      {/* Conditional rendering based on the presence of 'organization' */}
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList 
        orgId={organization.id}
        query={searchParams} />
      )}
    </div>
  );
};

// Exporting the Component:

// This line exports the DashboardPage component as the default export of the module. It allows other parts of the application to import and use DashboardPage without curly braces. For example: import DashboardPage from './DashboardPage';.
export default DashboardPage;
