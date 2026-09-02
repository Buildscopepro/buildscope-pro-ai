import {supabase} from "./supabase";
const BASE=process.env.EXPO_PUBLIC_BUILDSCOPE_API_URL;

async function api(path,body){
 const {data}=await supabase.auth.getSession();
 const token=data.session?.access_token;
 if(!token) throw new Error("User is not authenticated");
 const r=await fetch(`${BASE.replace(/\/$/,"")}${path}`,{
   method:"POST",
   headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
   body:JSON.stringify(body)
 });
 const out=await r.json();
 if(!r.ok) throw new Error(out.error||`HTTP ${r.status}`);
 return out;
}

export const requestAutomaticRoofGeometry=input=>api("/v1/roof-geometry/measure",input);
export const saveRoofGeometryOverride=input=>api("/v1/roof-geometry/override",input);

export function geometryForTakeoff(autoArea,geometry){
 return {
   areaSqFt:Number(geometry?.roofAreaSqFt??autoArea?.estimatedRoofAreaSqFt??0),
   squares:Number(geometry?.squares??autoArea?.estimatedSquares??0),
   ridgeLf:Number(geometry?.ridgeLf||0),
   eaveLf:Number(geometry?.eaveLf||0),
   rakeLf:Number(geometry?.rakeLf||0),
   valleyLf:Number(geometry?.valleyLf||0),
   hipLf:Number(geometry?.hipLf||0),
   source:geometry?.provider||autoArea?.provider||"manual",
   completeLinearGeometry:Boolean(geometry?.completeLinearGeometry)
 };
}
