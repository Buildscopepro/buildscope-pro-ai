const fs=require("fs");
const path=require("path");

function parseEnv(file){
  if(!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file,"utf8")
    .split(/\r?\n/).map(x=>x.trim())
    .filter(x=>x && !x.startsWith("#") && x.includes("="))
    .map(line=>{
      const i=line.indexOf("=");
      return [line.slice(0,i),line.slice(i+1)];
    }));
}

const root=path.resolve(__dirname,"..");
const mobile=parseEnv(path.join(root,".env"));
const server=parseEnv(path.join(root,"server",".env"));

const checks=[
 ["Mobile Supabase URL",Boolean(mobile.EXPO_PUBLIC_SUPABASE_URL)],
 ["Mobile Supabase publishable key",Boolean(mobile.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY)],
 ["Mobile backend URL",Boolean(mobile.EXPO_PUBLIC_BUILDSCOPE_API_URL)],
 ["Server Supabase URL",Boolean(server.SUPABASE_URL)],
 ["Server Supabase publishable key",Boolean(server.SUPABASE_PUBLISHABLE_KEY)],
 ["Server Supabase service role",Boolean(server.SUPABASE_SERVICE_ROLE_KEY)],
 ["Server OpenAI API key",Boolean(server.OPENAI_API_KEY)],
];

let fail=false;
for(const [name,pass] of checks){
  console.log(`${pass?"PASS":"FAIL"}  ${name}`);
  if(!pass) fail=true;
}

if(server.SUPABASE_SERVICE_ROLE_KEY && mobile.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY){
  console.log("FAIL  Service-role key must never be in mobile env");
  fail=true;
}
process.exit(fail?1:0);
