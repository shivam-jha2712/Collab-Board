"use node";

import Stripe from "stripe";
import {v} from "convex/values";

import {action} from "./_generated/server";

// Define stripe schema
const url = process.env.NEXT_PUBLIC_APP_URL;
const stripe = new Stripe(
    process.env.STRIPE_API_KEY!,
    {
        apiVersion: "2025-01-27.acacia",
    },
);

export const pay = action({
    args: {orgId: v.string()},
    handler: async(ctx, args)=>  {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        if(!args.orgId) {
            throw new Error("No Organization ID");
        }

        const session = await stripe.checkout.sessions.create({
            success_url: url,
            cancel_url: url,
            customer_email: identity.email,
            line_items: [
                {
                   price_data: {   
                        currency: "inr",
                        product_data: {
                            name: "Board Pro Subscription",
                            description: "Unlimited Boards For Your Organization",
                        },
                        unit_amount: 4000,
                        recurring: {interval: "month"},
                    },

                    quantity: 1,
                },

            ],

            // Meta data is important for us to know which organization is subscribing and to keep it data secured in the convex schema so as to allow it every time to have all the pro features
            metadata: {
                orgId: args.orgId,
            },
            mode: "subscription"

            // This is the most important part of the code where we are creating the session for the user to subscribe to the board pro and this is can not be done using promises as they can't be captured and since they are done using web hooks and thereby we need meta data to make sure that we capture the subscription payement
        });

        return session.url!;
    },
})
