const fs=require("fs");
const path=require("path");

let failed=false;
function ok(name,pass,detail=""){
  console.log(`${pass?"PASS":"FAIL"}  ${name}${detail?` — ${detail}`:""}`);
  if(!pass) failed=true;
}
const root=path.resolve(__dirname,"..");
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
const app=JSON.parse(fs.readFileSync(path.join(root,"app.json"),"utf8"));
const eas=JSON.parse(fs.readFileSync(path.join(root,"eas.json"),"utf8"));

ok("Version is 5.15.0",pkg.version==="5.15.0"&&app.expo.version==="5.15.0");
ok("Android package configured",!!app.expo.android?.package,app.expo.android?.package||"");
ok("iOS bundle identifier configured",!!app.expo.ios?.bundleIdentifier,app.expo.ios?.bundleIdentifier||"");
ok("Preview APK profile exists",eas.build?.preview?.android?.buildType==="apk");
ok("Production AAB profile exists",eas.build?.production?.android?.buildType==="app-bundle");
ok("Supabase client service exists",fs.existsSync(path.join(root,"src/services/supabase.js")));
ok("Core v4.9 QA checklist exists",fs.existsSync(path.join(root,"QA_CHECKLIST.md")));
ok("Product-backed design exists",fs.existsSync(path.join(root,"PRODUCT_BACKED_AI_DESIGN.md")));
ok("Wall/ceiling finishes exist",fs.existsSync(path.join(root,"WALL_CEILING_FINISHES.md")));
ok("No .env secret file packaged",!fs.existsSync(path.join(root,".env")));
ok("Production env template exists",fs.existsSync(path.join(root,".env.production.example")));

const migrationNames=[
 "consolidated_workflow.sql","remodel_workflow.sql","product_backed_design.sql",
 "wall_ceiling_finishes.sql","client_approval.sql"
];
for(const m of migrationNames) ok(`Migration ${m}`,fs.existsSync(path.join(root,"backend",m)));

ok("Backend gateway exists",fs.existsSync(path.join(root,"src/services/backendGateway.js")));
ok("Product-backed AI flow exists",fs.existsSync(path.join(root,"src/services/productBackedAiFlow.js")));
ok("Product search UI exists",fs.existsSync(path.join(root,"src/components/ProductSearchPanel.js")));
ok("Backend API contract exists",fs.existsSync(path.join(root,"server-reference/API_CONTRACT.md")));

ok("Runnable backend exists",fs.existsSync(path.join(root,"server/src/index.js")));
ok("Backend auth middleware exists",fs.existsSync(path.join(root,"server/src/lib/auth.js")));
ok("Production backend migration exists",fs.existsSync(path.join(root,"backend/production_backend.sql")));

ok("OpenAI provider migration exists",fs.existsSync(path.join(root,"backend/openai_providers.sql")));
ok("OpenAI provider setup exists",fs.existsSync(path.join(root,"OPENAI_PROVIDER_SETUP.md")));

ok("Docker backend exists",fs.existsSync(path.join(root,"server/Dockerfile")));
ok("Deployment guide exists",fs.existsSync(path.join(root,"DEPLOYMENT_GUIDE.md")));
ok("Production check exists",fs.existsSync(path.join(root,"scripts/production-check.js")));

ok("Bootstrap script exists",fs.existsSync(path.join(root,"scripts/bootstrap.js")));
ok("Environment verifier exists",fs.existsSync(path.join(root,"scripts/verify-env.js")));
ok("Go-live guide exists",fs.existsSync(path.join(root,"GO_LIVE.md")));

ok("Backend checker exists",fs.existsSync(path.join(root,"scripts/check-backend.js")));
ok("Supabase checker exists",fs.existsSync(path.join(root,"scripts/check-supabase.js")));
ok("Android preview guide exists",fs.existsSync(path.join(root,"ANDROID_PREVIEW_BUILD.md")));

ok("Service request flow exists",fs.existsSync(path.join(root,"src/services/serviceRequests.js")));
ok("Payment request service exists",fs.existsSync(path.join(root,"src/services/payments.js")));
ok("Remote push service exists",fs.existsSync(path.join(root,"src/services/pushRemote.js")));
ok("Push outbox migration exists",fs.existsSync(path.join(root,"backend/push_outbox.sql")));

ok("Automatic roof service exists",fs.existsSync(path.join(root,"src/services/autoRoofMeasurement.js")));
ok("Roof provider exists",fs.existsSync(path.join(root,"server/src/providers/roof.js")));
ok("Roof measurement migration exists",fs.existsSync(path.join(root,"backend/automatic_roof_measurements.sql")));

ok("Stripe payment service exists",fs.existsSync(path.join(root,"src/services/stripePayments.js")));
ok("Stripe server route exists",fs.existsSync(path.join(root,"server/src/routes/payments.js")));
ok("Stripe webhook exists",fs.existsSync(path.join(root,"server/src/routes/stripeWebhook.js")));
ok("Expo push worker exists",fs.existsSync(path.join(root,"server/src/workers/pushWorker.js")));

ok("Roof geometry service exists",fs.existsSync(path.join(root,"src/services/roofGeometry.js")));
ok("Roof geometry provider exists",fs.existsSync(path.join(root,"server/src/providers/roofGeometry.js")));
ok("Roof geometry migration exists",fs.existsSync(path.join(root,"backend/roof_geometry_reports.sql")));
ok("Roof geometry contract exists",fs.existsSync(path.join(root,"ROOF_GEOMETRY_PROVIDER_CONTRACT.md")));

ok("Production root shell exists",fs.existsSync(path.join(root,"App.js")));
ok("Core app preserved",fs.existsSync(path.join(root,"AppCore.js")));
ok("Production health service exists",fs.existsSync(path.join(root,"src/services/productionHealth.js")));
ok("Source audit exists",fs.existsSync(path.join(root,"scripts/source-audit.js")));

ok("Release QA screen exists",fs.existsSync(path.join(root,"src/components/ReleaseQaScreen.js")));
ok("QA manifest exists",fs.existsSync(path.join(root,"src/services/qaManifest.js")));
ok("Final QA plan exists",fs.existsSync(path.join(root,"FINAL_QA_PLAN.md")));

ok("Smoke test exists",fs.existsSync(path.join(root,"scripts/smoke.js")));
ok("QA scenarios exist",fs.existsSync(path.join(root,"QA_SCENARIOS.md")));
ok("First live test card exists",fs.existsSync(path.join(root,"FIRST_LIVE_TEST.md")));

ok("Live Supabase config exists",fs.existsSync(path.join(root,".env.production")));
ok("Live Supabase checker exists",fs.existsSync(path.join(root,"scripts/check-live-supabase.js")));
ok("Live Supabase documentation exists",fs.existsSync(path.join(root,"LIVE_SUPABASE_CONNECTION.md")));

ok("Vercel backend entry exists",fs.existsSync(path.join(root,"server/api/index.js")));
ok("Vercel config exists",fs.existsSync(path.join(root,"server/vercel.json")));
ok("Vercel deployment guide exists",fs.existsSync(path.join(root,"VERCEL_BACKEND_DEPLOY.md")));

console.log(failed?"\nPRE-FLIGHT FAILED":"\nPRE-FLIGHT PASSED");
process.exit(failed?1:0);
