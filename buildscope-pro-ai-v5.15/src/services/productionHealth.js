import {runtimeConfig} from "./runtimeConfig";

export async function checkProductionHealth(){
  const cfg=runtimeConfig();
  const result={
    supabaseConfigured:cfg.supabaseConfigured,
    backendConfigured:cfg.backendConfigured,
    backendHealth:false,
    backendReady:false,
    details:{}
  };

  if(!cfg.backendConfigured) return result;
  const base=cfg.backendUrl.replace(/\/$/,"");
  try{
    const h=await fetch(base+"/health");
    result.backendHealth=h.ok;
    result.details.health=await h.json().catch(()=>({}));
  }catch(e){result.details.healthError=String(e.message||e)}

  try{
    const r=await fetch(base+"/ready");
    result.backendReady=r.ok;
    result.details.ready=await r.json().catch(()=>({}));
  }catch(e){result.details.readyError=String(e.message||e)}

  return result;
}
