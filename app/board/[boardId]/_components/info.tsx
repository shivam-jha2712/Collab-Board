"use client";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Actions } from "@/components/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Hint } from "@/components/hint";
import { useRenameModal } from "@/store/use-rename-modals";
import { Menu } from "lucide-react";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"], // Specifying the subset of characters for the font
  weight: ["600"], // Specifying the font weight
});

// This is for getting the name of the gievn board that we are using
const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5"></div>;
};

export const Info = ({ boardId }: InfoProps) => {
  // This is for renaming the board as well
  const { onOpen } = useRenameModal();

  // This api.board.get is the simple query that we created in boards.ts when we needed the auth of the room
  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  if (!data) {
    return <InfoSkeleton />;
  }

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md dark:text-white dark:bg-slate-900 ">
      {/* <TabSeparator/> */}
      <Actions id={data._id} title={data.title} side="bottom" sideOffset={10}>
        <div>
          <Hint label="Main menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="board">
              <Menu className="dark:white" />
            </Button>
          </Hint>
        </div>
      </Actions>
      <Hint
        label="Go Back to All Boards"
        side="bottom"
        align="start"
        sideOffset={10}
      >
        <Button asChild variant="board" className="px-2 ">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              height={120}
              width={120}
              className="dark:invert hidden md:block"
            />
            <Image
              src="/logo2.svg"
              alt="Logo"
              height={40}
              width={40}
              className="dark:invert hidden"
            />
            {/* <span
              className={cn(
                "font-semibold text-xl ml-2 text-black",
                font.className
              )}
            >
              Board
            </span> */}
          </Link>
        </Button>
      </Hint>
      {/* <TabSeparator /> */}
      <Hint label="Edit Title" side="bottom" sideOffset={10}>
        <Button
          variant="board"
          className="text-base font-normal px-2 dark:text-white"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
      {/* <TabSeparator /> */}
      
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div
      className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]
      "
    />
  );
};
