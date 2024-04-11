// This is used for creating updating and deletion of board Individually.

import { v } from "convex/values"; // Importing v function from Convex for defining argument types
import { mutation, query } from "./_generated/server"; // Importing generated mutation from server module

// Array of placeholder image URLs
const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
];

/**
 * 1.  create mutation to create a new board.
 * It takes orgId and title as arguments and handles the creation of a new board.
 */
export const create = mutation({
  // Define argument types for orgId and title
  args: {
    orgId: v.string(), // Argument type for organization ID
    title: v.string(), // Argument type for board title
  },
  // Handler function to create a new board
  handler: async (ctx, args) => {
    // Retrieve user identity from context
    const identity = await ctx.auth.getUserIdentity();

    // Check if user identity exists
    if (!identity) {
      // Throw error if user is unauthorized
      throw new Error("Unauthorised");
    }

    // Select a random image URL from the array
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Insert a new board into the database
    const board = await ctx.db.insert("boards", {
      title: args.title, // Set board title
      orgId: args.orgId, // Set organization ID
      authorId: identity.subject, // Set author ID
      authorName: identity.name!, // Set author name
      imageUrl: randomImage, // Set random image URL
    });

    // Return the created board
    return board;
  },
});

// This module defines an API route using Convex for creating a new board.

//2.  The below funcytion will work on Deleting the board itself and it would work in the similar fashion as that of creating using the API Route as well.
export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("UnAuthorised");
    }

    // TODO: Later Check to delete favorite relation as well

    // The index and query are all fetched from schema.ts
    const userId = identity.subject;
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q
        .eq("userId", userId)
        .eq("boardId", args.id)
      )
      .unique();


      if(existingFavorite){
        await ctx.db.delete(existingFavorite._id)
      }

    // Here what we do is simply delete the id assosiated to that respective board schema
    await ctx.db.delete(args.id);
  },
});

// 3. This is for the renaming of the board or say for updating details regarding the board

export const update = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const title = args.title.trim();

    if (!identity) {
      throw new Error("UnAuthorised");
    }

    if (!title) {
      throw new Error("Title is Required!");
    }

    if (title.length > 60) {
      throw new Error("Title can't be of more than 60 characters!");
    }

    const board = await ctx.db.patch(args.id, { title: args.title });

    return board;
  },
});

// This is for making a board Favorite or remove from favorite
export const favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorised");
    }

    // Since we are not seraching for the board and using a single board thus in place of   .query we can use .get
    // Also since the id has already been defined thus we could directly use args.id in place v.id("boards")
    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board Not Found");
    }

    // This is to check if the board favoriting already exists in the favorite board schema
    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();
    // you can also use ".first()" to get the first occurence
    // And ".collect()" to get the array of the boards having same props

    // If favorite already throw error
    if (existingFavorite) {
      throw new Error("Board Already Favorited!");
    }

    // If not favorited insert it within the database of the favorites
    await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

// This is for making unfavorite
export const unfavorite = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorised");
    }

    // Since we are not seraching for the board and using a single board thus in place of   .query we can use .get
    // Also since the id has already been defined thus we could directly use args.id in place v.id("boards")
    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board Not Found");
    }

    // This is to check if the board favoriting already exists in the favorite board schema
    const userId = identity.subject;

    // Also it is important to note that while unfavoriting we don't need teh orgId because we do already know that from which organisation do we need to remove the board thus we can implement it without the schema clause of orgs as well
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex(
        "by_user_board",
        (q) => q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();
    // you can also use ".first()" to get the first occurence
    // And ".collect()" to get the array of the boards having same props

    // If wish to unfavorite that does not exists throw an error
    if (!existingFavorite) {
      throw new Error("Favorited Baord Not Found");
    }

    // While unfavoriting just delete it from the existingFavorite database on the basis of its id
    await ctx.db.delete(existingFavorite._id);

    return board;
  },
});


// This is a simple get query inside the convex function to the get the board based on id
export const get  = query({
  args: {id: v.id("boards")},
  handler: async (ctx, args) => {
    const board = ctx.db.get(args.id);

    return board;
  },
});
