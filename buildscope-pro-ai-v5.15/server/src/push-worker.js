import {runPushBatch} from "./workers/pushWorker.js";
const interval=Number(process.env.PUSH_WORKER_INTERVAL_MS||15000);
console.log(`BuildScope push worker started: ${interval}ms`);
async function tick(){
  try{
    const r=await runPushBatch();
    if(r.processed) console.log(r);
  }catch(e){console.error("push worker",e)}
}
await tick();
setInterval(tick,interval);
