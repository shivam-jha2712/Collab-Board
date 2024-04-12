"use client";

import { memo } from "react";
// We import memo so that this connection is fast thus we need to memoize this component
import { useOthersConnectionIds } from "@/liveblocks.config";
import { connectionIdToColor } from "@/lib/utils";
import { Cursor } from "./cursor";

const Cursors = () => {
    const ids = useOthersConnectionIds();

    return (
        <>
        {ids.map((connectionId) => (
            <Cursor
            key = {connectionId}
            connectionId = {connectionId}
            />
        ))}
        </>
    )
}


export const CursorPresence = memo(() => {
    return(
        <>
        {/* TODO: DRaft Pencil to identify moment of other user */}
        
        <Cursors/>
        </>
    );
});

CursorPresence.displayName = "CursorPresence";