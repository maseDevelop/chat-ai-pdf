import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_ApI_KEY! as string, {
  apiVersion: "2023-08-16",
  typescript: true,
});
