"use client";

import { memo } from "react";
// We import memo so that this connection is fast thus we need to memoize this component
import { useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { colorToCss, connectionIdToColor } from "@/lib/utils";
import { Cursor } from "./cursor";
import { shallow } from "@liveblocks/client";
import { Path } from "./layer-path";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.penColor,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : "#000"}
            />
          );
        }

        return null;
      })}
    </>
  );
};

export const CursorPresence = memo(() => {
  return (
    <>
      {/* TODO: DRaft Pencil to identify moment of other user */}
      <Drafts />
      <Cursors />
    </>
  );
});

CursorPresence.displayName = "CursorPresence";
