const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
const required=[
 "src/components/ReleaseQaScreen.js",
 "src/components/ProductionStatusPanel.js",
 "src/services/qaManifest.js",
 "src/services/productionHealth.js",
 "App.js",
 "AppCore.js",
 "eas.json",
 "ANDROID_PREVIEW_BUILD.md"
];
let fail=false;
for(const rel of required){
 const ok=fs.existsSync(path.join(root,rel));
 console.log(`${ok?"PASS":"FAIL"}  ${rel}`);
 if(!ok)fail=true;
}
const app=JSON.parse(fs.readFileSync(path.join(root,"app.json"),"utf8"));
console.log(`${app.expo.version==="5.15.0"?"PASS":"FAIL"}  app version 5.15.0`);
if(app.expo.version!=="5.15.0")fail=true;
process.exit(fail?1:0);
