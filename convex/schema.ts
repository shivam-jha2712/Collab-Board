import { v } from "convex/values"; // Importing v function from Convex for defining data types
import { defineSchema, defineTable } from "convex/server"; // Importing functions for defining schema and table

// Define initial board schema using Convex
export default defineSchema({
  // Define 'boards' table with specified columns
  boards: defineTable({
    // Define column types for board data
    title: v.string(), // Title of the board (string)
    orgId: v.string(), // Organization ID associated with the board (string)
    authorId: v.string(), // Author ID of the board (string)
    authorName: v.string(), // Name of the author (string)
    imageUrl: v.string(), // URL of the image associated with the board (string)
  })
    // Add index to optimize queries by organization ID
    .index("by_org", ["orgId"])
    // Add search index for searching boards by title within an organization
    .searchIndex("search_title", {
      searchField: "title", // Field to search for (title)
      filterFields: ["orgId"], // Fields to filter results by (orgId)
    }),

  // Here we are extending the schema in order to even store the favorites in the database
  userFavorites: defineTable({
    orgId: v.string(),
    userId: v.string(),
    boardId: v.id("boards"),
  })
    .index("by_board", ["boardId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_board", ["userId", "boardId"])
    .index("by_user_board_org", ["userId", "boardId", "orgId"]),


    orgSubscription: defineTable({
    orgId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    stripeCurrentPeriodEnd: v.number(), // This is the date but it is number in convex schema
    })

    .index("by_org", ["orgId"])
    .index("by_subscription", ["stripeSubscriptionId"]),


});

// The images used here are from undraw and are just random images

// Convex even allows you to wroks with both SQL and NoSQL kind of schema