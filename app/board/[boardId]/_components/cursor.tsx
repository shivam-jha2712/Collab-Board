"use client";

import { memo } from "react";
import { connectionIdToColor } from "@/lib/utils";
import { MousePointer2 } from "lucide-react";
import { useOther } from "@/liveblocks.config";

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  const name = info?.name || "Teammate";

  if (!cursor) {
    return null;
  }

  const { x, y } = cursor;

  // In order to render an element inside the svg object we need to use a component called <foreignObject>
  return (
    // And to make the foreign object according to our will we need to manipulate it
    <foreignObject
      style={{
        transform: `translateX(${x}px)  translateY(${y}px)`,
      }}
      height={50}
      // The width needs to be determined dynamically based on the length
      width={name.length * 10 + 24}
      className="relative drop-shadow-md"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: connectionIdToColor(connectionId),
          color: connectionIdToColor(connectionId),
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: connectionIdToColor(connectionId) }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
