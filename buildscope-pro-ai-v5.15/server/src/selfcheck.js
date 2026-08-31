import fs from "fs";
const required=[
 "src/index.js","src/app.js","api/index.js","src/lib/config.js","src/lib/auth.js","src/lib/openai.js","src/lib/stripe.js","src/lib/expoPush.js","src/routes/products.js",
 "src/routes/visualizations.js","src/routes/purchaseLists.js","src/routes/roof.js","src/routes/roofGeometry.js","src/routes/payments.js","src/routes/stripeWebhook.js","src/workers/pushWorker.js","src/providers/products.js","src/providers/images.js","src/providers/roof.js","src/providers/roofGeometry.js"
];
let fail=false;
for(const f of required){
 const ok=fs.existsSync(new URL(`../${f}`,import.meta.url));
 console.log(`${ok?"PASS":"FAIL"} ${f}`);
 if(!ok) fail=true;
}
process.exit(fail?1:0);
