"use client";
import { useQuery } from "convex/react"; // Importing the useQuery hook from the Convex library
import { api } from "@/convex/_generated/api"; // Importing the API endpoint from the Convex generated files

import { BoardCard } from "./board-card"; // Importing the BoardCard component
import { EmptyBoards } from "./empty-boards"; // Importing the EmptyBoards component
import { EmptyFavorites } from "./empty-favorites"; // Importing the EmptyFavorites component
import { EmptySearch } from "./empty-search copy"; // Importing the EmptySearch component
import { NewBoardButton } from "./new-board-button"; // Importing the NewBoardButton component

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

/**
 * BoardList Component: Displays a list of boards based on the provided organization ID and query parameters.
 * @param orgId - The organization ID.
 * @param query - The query parameters, including search and favorites.
 * @returns JSX.Element
 */
export const BoardList = ({ orgId, query }: BoardListProps): JSX.Element => {
  // Fetching the data of boards using the useQuery hook

  // This is the query search based on above gives args
  const data = useQuery(api.boards.get, { 
    orgId, 
    ...query, });

  // If the data is still loading, display skeleton components
  if (data === undefined) {
    return (
      <div>
        {/* Displaying the header based on the query type */}
        <h2 className="text-3xl">
          {query.favorites ? "Favorite Boards" : "Team Boards"}
        </h2>

        {/* Displaying skeleton cards while data is loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled />
          {/* Disabled NewBoardButton */}
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );
  }

  // If no boards are found for the provided search query, display EmptySearch component
  if (!data?.length && query.search) {
    return (
      <div>
        <EmptySearch />
      </div>
    );
  }

  // If no favorite boards are found, display EmptyFavorites component
  if (!data?.length && query.favorites) {
    return (
      <div>
        <EmptyFavorites />
      </div>
    );
  }

  // If no boards are found in general, display EmptyBoards component
  if (!data?.length) {
    return (
      <div>
        <EmptyBoards />
      </div>
    );
  }

  // If data is available, display the list of boards
  return (
    <div>
      {/* Displaying the header based on the query type */}
      <h2 className="text-3xl">
        {query.favorites ? "Favorite Boards" : "Team Boards"}
      </h2>

      {/* Displaying the list of boards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} /> {/* Enabled NewBoardButton */}
        {/* Mapping through the data to render BoardCard components */}
        {data?.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorite} // Assuming all boards are not favorites initially
          />
        ))}
      </div>
    </div>
  );
};
