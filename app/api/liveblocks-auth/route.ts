// This is similar to creating client side pages but instead of page for auth we use route.tsx
import { auth, currentUser } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Instance of my Database in my route handler
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Safetly added the key via env.local

// Instance of my Liveblocks
const liveblocks = new Liveblocks({
  secret:
    process.env.LIVEBLOCKS_SECRET_KEY!,
});

// Since as per documentation we need to have the current user from the database and since along with clerk we have constructed a middleware between both backend and frontend we can make this work using Clerk
export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

  // For test and making auth easier in the terminal
//   console.log("AUTH_INFO", {
//     authorization,
//     user,
//   });

  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 403 });
  }

  // Extraction of room that we are wanting to join and the route will be fired in liveblocks.config.ts
  const { room } = await request.json();
  // This would be done by modifying the API component createClient to target to the given room section whenever a room is rendered.

  const board = await convex.query(api.board.get, { id: room });

  // This is just to debug the data which is being produced to be captured in the terminal
//   console.log("AUTH_INFO", {
//     room,
//     board,
//     boardOrgId: board?.orgId,
//     userOrgId: authorization.orgId,
//   });

  if (board?.orgId !== authorization.orgId) {
    return new Response("Unauthorized", {status: 403});
  }

  // The userINfo that we will be passing bac to the client for making the list of users and cursors as well
  const userInfo = {
    name: user.firstName || "Teammate",
    picture: user.imageUrl,
  };

//  TEST:  console.log({ userInfo });

  // From the docs to prepare a room live session using the given data
  const session = liveblocks.prepareSession(user.id, { userInfo });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
//   CHECK
//   console.log({status, body}, "ALLOWED");
  return new Response(body, { status });
}
