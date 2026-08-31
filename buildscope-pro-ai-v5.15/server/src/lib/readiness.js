import {getConfig} from "./config.js";

export function readiness(){
  const c=getConfig();
  const checks={
    supabaseUrl:Boolean(c.SUPABASE_URL),
    supabasePublishableKey:Boolean(c.SUPABASE_PUBLISHABLE_KEY),
    supabaseServerSecret:Boolean(c.SUPABASE_SECRET_KEY||c.SUPABASE_SERVICE_ROLE_KEY),
    openaiKey:(c.PRODUCT_PROVIDER==="openai_web"||c.IMAGE_PROVIDER==="openai")
      ? Boolean(c.OPENAI_API_KEY)
      : true
  };

  return {
    ready:Object.values(checks).every(Boolean),
    checks
  };
}
