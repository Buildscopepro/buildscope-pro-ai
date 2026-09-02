const fs=require("fs");
const path=require("path");

function parseEnv(file){
  if(!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file,"utf8").split(/\r?\n/)
    .map(x=>x.trim()).filter(x=>x&&!x.startsWith("#")&&x.includes("="))
    .map(line=>{const i=line.indexOf("=");return [line.slice(0,i),line.slice(i+1)]}));
}
(async()=>{
  const root=path.resolve(__dirname,"..");
  const env=parseEnv(path.join(root,".env"));
  const url=(env.EXPO_PUBLIC_SUPABASE_URL||"").replace(/\/$/,"");
  const key=env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY||"";
  if(!url||!key){console.error("FAIL  Missing Supabase public configuration");process.exit(1)}
  try{
    const r=await fetch(url+"/auth/v1/settings",{headers:{apikey:key}});
    const text=await r.text();
    console.log(`${r.ok?"PASS":"FAIL"}  Supabase Auth endpoint HTTP ${r.status}`);
    if(!r.ok){console.log(text);process.exit(1)}
  }catch(e){
    console.error("FAIL  Supabase connectivity:",e.message);process.exit(1)
  }
})();
