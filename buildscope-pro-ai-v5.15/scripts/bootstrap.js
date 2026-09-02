const fs=require("fs");
const path=require("path");
const readline=require("readline");

const root=path.resolve(__dirname,"..");
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
const ask=q=>new Promise(r=>rl.question(q,r));

(async()=>{
  console.log("\nBuildScope Pro AI v5.5 Production Bootstrap\n");
  const supabaseUrl=(await ask("Supabase URL: ")).trim();
  const publishable=(await ask("Supabase publishable key: ")).trim();
  const serviceRole=(await ask("Supabase service-role key (server only): ")).trim();
  const openai=(await ask("OpenAI API key (server only): ")).trim();
  const backendUrl=(await ask("Deployed backend URL (or http://localhost:8787 for local test): ")).trim();

  fs.writeFileSync(path.join(root,".env"),
`EXPO_PUBLIC_SUPABASE_URL=${supabaseUrl}
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishable}
EXPO_PUBLIC_BUILDSCOPE_API_URL=${backendUrl}
`);

  fs.writeFileSync(path.join(root,"server",".env"),
`PORT=8787
SUPABASE_URL=${supabaseUrl}
SUPABASE_PUBLISHABLE_KEY=${publishable}
SUPABASE_SERVICE_ROLE_KEY=${serviceRole}
PRODUCT_PROVIDER=openai_web
IMAGE_PROVIDER=openai
OPENAI_API_KEY=${openai}
OPENAI_TEXT_MODEL=gpt-5.6
OPENAI_IMAGE_MODEL=gpt-image-2
`);

  console.log("\nEnvironment files created.");
  console.log("Next:");
  console.log("  npm run verify-env");
  console.log("  npm run preflight");
  console.log("  npm run production-check");
  console.log("  npm run server:start");
  rl.close();
})().catch(e=>{console.error(e);rl.close();process.exit(1)});
