import {supabase} from "./supabase";
const BASE=process.env.EXPO_PUBLIC_BUILDSCOPE_API_URL;

async function bearer(){
 const {data}=await supabase.auth.getSession();
 const token=data.session?.access_token;
 if(!token) throw new Error("User is not authenticated");
 return token;
}

export async function autoMeasureRoof({projectId,latitude,longitude,requiredQuality="BASE"}){
 if(!BASE) throw new Error("BuildScope backend URL is not configured");
 const token=await bearer();
 const r=await fetch(`${BASE.replace(/\/$/,"")}/v1/roof/auto-measure`,{
   method:"POST",
   headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
   body:JSON.stringify({projectId,latitude,longitude,requiredQuality})
 });
 const body=await r.json();
 if(!r.ok){
   const e=new Error(body.error||`HTTP ${r.status}`);
   e.code=body.code;
   e.fallback=body.fallback;
   throw e;
 }
 return body;
}
