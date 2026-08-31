import {createClient} from "@supabase/supabase-js";
import {getConfig} from "./config.js";

const c=getConfig();
const elevatedKey=c.SUPABASE_SECRET_KEY||c.SUPABASE_SERVICE_ROLE_KEY;

if(!elevatedKey){
  throw new Error("SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is required");
}

export const authClient=createClient(
  c.SUPABASE_URL,
  c.SUPABASE_PUBLISHABLE_KEY,
  {auth:{persistSession:false,autoRefreshToken:false}}
);

export const adminClient=createClient(
  c.SUPABASE_URL,
  elevatedKey,
  {auth:{persistSession:false,autoRefreshToken:false}}
);
