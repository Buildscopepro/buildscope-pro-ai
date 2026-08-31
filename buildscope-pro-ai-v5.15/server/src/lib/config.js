import "dotenv/config";
import {z} from "zod";

const schema=z.object({
  PORT:z.coerce.number().default(8787),
  SUPABASE_URL:z.string().url(),
  SUPABASE_PUBLISHABLE_KEY:z.string().min(1),
  SUPABASE_SECRET_KEY:z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY:z.string().optional(),
  PRODUCT_PROVIDER:z.string().default("mock"),
  IMAGE_PROVIDER:z.string().default("mock"),
  OPENAI_API_KEY:z.string().optional(),
  OPENAI_TEXT_MODEL:z.string().default("gpt-5.6"),
  OPENAI_IMAGE_MODEL:z.string().default("gpt-image-2"),
  GOOGLE_SOLAR_API_KEY:z.string().optional(),
  ROOF_PROVIDER:z.string().default("google_solar"),
  STRIPE_SECRET_KEY:z.string().optional(),
  STRIPE_WEBHOOK_SECRET:z.string().optional(),
  EXPO_ACCESS_TOKEN:z.string().optional(),
  ROOF_GEOMETRY_PROVIDER:z.string().default("external"),
  ROOF_GEOMETRY_PROVIDER_URL:z.string().url().optional(),
  ROOF_GEOMETRY_PROVIDER_API_KEY:z.string().optional()
});

export function getConfig(){
  const parsed=schema.safeParse(process.env);
  if(!parsed.success){
    const msg=parsed.error.issues.map(i=>`${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid server configuration: ${msg}`);
  }
  return parsed.data;
}
