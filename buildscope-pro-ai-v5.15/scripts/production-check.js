const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");

const required=[
 "eas.json",
 ".env.production.example",
 "server/Dockerfile",
 "server/.env.example",
 "server/src/index.js",
 "server/src/providers/products.js",
 "server/src/providers/images.js",
 "backend/openai_providers.sql",
 "backend/production_backend.sql",
 "RELEASE_CHECKLIST.md"
];

let fail=false;
for(const rel of required){
 const ok=fs.existsSync(path.join(root,rel));
 console.log(`${ok?"PASS":"FAIL"}  ${rel}`);
 if(!ok)fail=true;
}

const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
console.log(`${pkg.version==="5.15.0"?"PASS":"FAIL"}  package version 5.15.0`);
if(pkg.version!=="5.15.0")fail=true;

process.exit(fail?1:0);
