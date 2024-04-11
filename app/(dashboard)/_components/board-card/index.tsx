"use client";
// Component responsible for rendering a card representing a board.

// Importing necessary modules and components
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

import { Footer } from "./footer";
import { Overlay } from "./overlay";
import { toast } from "sonner";

// Defining props for the BoardCard component
interface BoardCardProps {
  id: string; // Unique identifier for the board
  title: string; // Title of the board
  authorName: string; // Name of the board's author
  authorId: string; // Unique identifier of the board's author
  createdAt: number; // Timestamp representing the creation date of the board
  imageUrl: string; // URL of the image representing the board
  orgId: string; // Unique identifier of the organization to which the board belongs
  isFavorite: boolean; // Indicates whether the board is marked as favorite
}

// BoardCard component definition
export const BoardCard = ({
  id,
  title,
  authorId,
  authorName,
  createdAt,
  imageUrl,
  orgId,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();

  // This is regarding the lable for the boards like who created it and when was it created
  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  // What this does is that it takes up a create action of making a replica of the board within the favorite section as well. In terms of schema it creates up a seperate schema in convex of user
  const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(
    api.board.favorite
  );

  const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(
    api.board.unfavorite
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      onUnfavorite({ id }).catch(() => toast.error("Failed to UnFavorite"));
    } else {
      onFavorite({ id, orgId }).catch(() => toast.error("Failed to Favorite"));
    }
  };
  return (
    // Link to navigate to the board's details page
    <Link href={`/board/${id}`}>
      {/* Container for the board card */}
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        {/* Container for the board image */}
        <div className="relative flex-1 bg-amber-50">
          {/* Rendering the board image */}
          <Image src={imageUrl} alt={title} fill className="object-fit" />
          {/* The overlay is the grey veil on the card present on Hover*/}
          <Overlay />

          {/* The Actions is responsibe for the delete, rename, favoruriting and other functions of the card  */}
          <Actions id={id} title={title} side="right">
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none:">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>
        <Footer
          isFavorite={isFavorite}
          title={
            <span
              style={{  fontSize: "13px", color: "black" }}
            >
              {title}
            </span>
          }
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={toggleFavorite}
          disabled={pendingFavorite || pendingUnfavorite}
        />
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className=" aspect-[100/127]  rounded-lg  justify-between overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
