"use client";

import { ReactNode } from "react";
// This is an NPM Package
import { ClientSideSuspense } from "@liveblocks/react";

// Whereas this is an alis to the file that we installed just now
import { RoomProvider } from "@/liveblocks.config";
import { LiveMap, LiveList, LiveObject } from "@liveblocks/client";

import { Layer } from "@/types/canvas";
/**
 * Room component represents a room in the application.
 * It wraps its children with a RoomProvider to provide room-specific context.
 * @param children The content to be rendered within the room.
 * @param roomId The unique identifier of the room.
 */

interface RoomProps {
  children: ReactNode; // Children elements to be rendered within the room
  roomId: string; // Unique identifier of the room
  fallback: NonNullable<ReactNode> | null;
}

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  return (
    // Wrapping children with RoomProvider to provide room-specific context
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selection: [],
        pencilDraft: null,
        penColor: null,
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList(),
      }}
    >
      {/* ClientSideSuspense for handling client-side loading state */}
      <ClientSideSuspense fallback={fallback}>
        {/* Render children */}
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
