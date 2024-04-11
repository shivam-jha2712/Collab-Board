// This is also going to be an API endpoint which will help us render the boards

// Unlike board.ts, this is used for querying and displaying the contents of multiple boards
import { v } from "convex/values";

import { query } from "./_generated/server";
import { getAll, getAllOrThrow} from "convex-helpers/server/relationships";

// This is to let the querying component to work based on the given arguements
export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Retrieve user identity from the context
    const identity = await ctx.auth.getUserIdentity();

    // Check if user identity is present
    if (!identity) {
      // Throw an error if user is not authorized
      throw new Error("Unauthorized");
    }

    if(args.favorites){
      const favoritedBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) => 
        q
          .eq("userId", identity.subject)
          .eq("orgId", args.orgId)
          )

          .order("desc")
          .collect();

          const ids = favoritedBoards.map((b) => b.boardId);

            const boards = await getAllOrThrow(ctx.db, ids);

            return boards.map((board) => ({
              ...board,
              isFavorite: true
            }))


    }

    const title = args.search as string;
    let boards = [];

    if(title){
      boards= await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) => 
        q
          .search("title", title)
          .eq("orgId", args.orgId)
        )
        .collect();
    }
    else{
       // Query the database for boards belonging to the specified organization
     boards = await ctx.db
    .query("boards")
    // Use the "by_org" index for faster querying based on organization ID
    .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
    // We have fetched this index from the schema and we can also use orgId arguement for faster querying.

    // We could have used the manual checker but that is not and index instead it will be a file sort. Which is comparetively much slower

    // Order the boards in descending order (latest first)
    .order("desc")
    // Collect and return the queried boards
    .collect();

    }

   
    // For favorite relation over here
    const boardsWithFavoriteRelation = boards.map((board) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => {
          return {
            ...board,
            isFavorite: !!favorite,
          };
        });
    });

    const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoriteRelation);
    return boardsWithFavoriteBoolean;
  },
});
