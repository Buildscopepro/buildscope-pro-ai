import {runtimeConfig} from "./runtimeConfig";

export function qaManifest(){
  const cfg=runtimeConfig();
  const stripeConfigured=Boolean(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  return [
    {key:"supabase",label:"Supabase client",ready:cfg.supabaseConfigured,required:true},
    {key:"backend",label:"BuildScope backend",ready:cfg.backendConfigured,required:true},
    {key:"stripe",label:"Stripe publishable key",ready:stripeConfigured,required:false},
    {key:"roofing",label:"Roofing workflow",ready:true,required:true},
    {key:"remodel",label:"Remodeling workflow",ready:true,required:true},
    {key:"finishes",label:"Wall/Ceiling finishes",ready:true,required:true},
    {key:"product_ai",label:"Product-backed AI flow",ready:true,required:true},
    {key:"service_request",label:"Client service request",ready:true,required:true},
    {key:"payments",label:"Payment flow code",ready:true,required:false},
    {key:"push",label:"Push flow code",ready:true,required:false},
    {key:"auto_roof",label:"Automatic roof area/squares",ready:true,required:false},
    {key:"roof_geometry",label:"Roof linear geometry adapter",ready:true,required:false}
  ];
}

export function releaseReadiness(){
  const items=qaManifest();
  const blockers=items.filter(x=>x.required&&!x.ready);
  return {ready:blockers.length===0,items,blockers};
}
