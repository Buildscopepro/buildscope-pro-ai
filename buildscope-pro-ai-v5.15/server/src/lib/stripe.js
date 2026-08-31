import Stripe from "stripe";
import {getConfig} from "./config.js";
let client;
export function getStripe(){
  const c=getConfig();
  if(!c.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
  if(!client) client=new Stripe(c.STRIPE_SECRET_KEY);
  return client;
}
