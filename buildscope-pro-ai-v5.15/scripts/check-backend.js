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
  const base=(env.EXPO_PUBLIC_BUILDSCOPE_API_URL||"").replace(/\/$/,"");
  if(!base){console.error("FAIL  Missing EXPO_PUBLIC_BUILDSCOPE_API_URL");process.exit(1)}
  for(const endpoint of ["/health","/ready"]){
    try{
      const r=await fetch(base+endpoint);
      const text=await r.text();
      console.log(`${r.ok?"PASS":"FAIL"}  ${endpoint}  HTTP ${r.status}  ${text}`);
      if(!r.ok) process.exitCode=1;
    }catch(e){
      console.error(`FAIL  ${endpoint}  ${e.message}`);
      process.exitCode=1;
    }
  }
})();
