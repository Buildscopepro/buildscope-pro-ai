const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
let failed=false;
const pass=(name,ok,detail="")=>{
  console.log(`${ok?"PASS":"FAIL"}  ${name}${detail?` — ${detail}`:""}`);
  if(!ok) failed=true;
};

const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
const app=JSON.parse(fs.readFileSync(path.join(root,"app.json"),"utf8"));

pass("Version 5.15.0",pkg.version==="5.15.0"&&app.expo.version==="5.15.0");
pass("Stripe SDK pinned",pkg.dependencies?.["@stripe/stripe-react-native"]==="0.64.0");
pass("Expo Constants pinned",pkg.dependencies?.["expo-constants"]==="~57.0.12");
pass("Expo Notifications pinned",pkg.dependencies?.["expo-notifications"]==="~57.0.12");
pass("React aligned",pkg.dependencies?.react==="19.2.3");
pass("App URL scheme",app.expo.scheme==="buildscopeproai");
pass("Production root shell",fs.existsSync(path.join(root,"App.js")));
pass("Core app preserved",fs.existsSync(path.join(root,"AppCore.js")));
pass("Error boundary",fs.existsSync(path.join(root,"src/components/AppErrorBoundary.js")));
pass("Production health service",fs.existsSync(path.join(root,"src/services/productionHealth.js")));
pass("No private mobile .env packaged",!fs.existsSync(path.join(root,".env")));

const forbidden=["OPENAI_API_KEY=","SUPABASE_SERVICE_ROLE_KEY=","STRIPE_SECRET_KEY="];
function scan(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(["node_modules",".git"].includes(e.name))continue;
  const p=path.join(dir,e.name);
  if(e.isDirectory())scan(p);
  else if(/\.(js|jsx|json|md|txt|example)$/.test(e.name)){
    const t=fs.readFileSync(p,"utf8");
    for(const x of forbidden){
      const rel=path.relative(root,p);
      const allowedReference =
        p.endsWith(path.join("server",".env.example")) ||
        p.endsWith(".md") ||
        /_RESULT\.txt$/.test(rel) ||
        rel===path.join("scripts","bootstrap.js") ||
        rel===path.join("scripts","source-audit.js");
      if(t.includes(x) && !allowedReference){
        pass(`No embedded ${x}`,false,rel);
      }
    }
  }
 }
}
scan(root);
if(!failed) console.log("PASS  Secret-source scan");
process.exit(failed?1:0);
