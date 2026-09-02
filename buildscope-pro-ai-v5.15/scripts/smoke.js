const fs=require("fs"),path=require("path");

function parseEnv(file){
  if(!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file,"utf8")
    .split(/\r?\n/).map(x=>x.trim())
    .filter(x=>x&&!x.startsWith("#")&&x.includes("="))
    .map(line=>{const i=line.indexOf("=");return [line.slice(0,i),line.slice(i+1)]}));
}

async function request(url,opts={}){
  const r=await fetch(url,opts);
  const text=await r.text();
  let body={};
  try{body=text?JSON.parse(text):{}}catch{body={text}}
  return {ok:r.ok,status:r.status,body};
}

(async()=>{
  const root=path.resolve(__dirname,"..");
  const env=parseEnv(path.join(root,".env"));
  const backend=(env.EXPO_PUBLIC_BUILDSCOPE_API_URL||"").replace(/\/$/,"");
  const supabase=(env.EXPO_PUBLIC_SUPABASE_URL||"").replace(/\/$/,"");
  const key=env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY||"";

  let fail=false;
  const out=(name,ok,detail="")=>{
    console.log(`${ok?"PASS":"FAIL"}  ${name}${detail?` — ${detail}`:""}`);
    if(!ok)fail=true;
  };

  out("Backend URL configured",Boolean(backend));
  out("Supabase URL configured",Boolean(supabase));
  out("Supabase publishable key configured",Boolean(key));

  if(backend){
    const h=await request(backend+"/health").catch(e=>({ok:false,status:0,body:{error:e.message}}));
    out("Backend /health",h.ok,`HTTP ${h.status}`);

    const rd=await request(backend+"/ready").catch(e=>({ok:false,status:0,body:{error:e.message}}));
    out("Backend /ready",rd.ok,`HTTP ${rd.status}`);
    if(!rd.ok) console.log("INFO  Ready details:",JSON.stringify(rd.body));
  }

  if(supabase&&key){
    const s=await request(supabase+"/auth/v1/settings",{headers:{apikey:key}})
      .catch(e=>({ok:false,status:0,body:{error:e.message}}));
    out("Supabase Auth",s.ok,`HTTP ${s.status}`);
  }

  console.log(fail?"\nSMOKE TEST FAILED":"\nSMOKE TEST PASSED");
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
