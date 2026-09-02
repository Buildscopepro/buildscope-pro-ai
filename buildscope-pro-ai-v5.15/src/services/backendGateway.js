import {supabase} from "./supabase";
const BASE=process.env.EXPO_PUBLIC_BUILDSCOPE_API_URL;

async function api(path,options={}){
  if(!BASE) throw new Error("BuildScope backend URL is not configured.");
  const {data}=await supabase.auth.getSession();
  const token=data.session?.access_token;
  if(!token) throw new Error("User is not authenticated.");

  const r=await fetch(`${BASE.replace(/\/$/,"")}${path}`,{
    ...options,
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token}`,
      ...(options.headers||{})
    }
  });
  const text=await r.text();
  let body={};
  try{body=text?JSON.parse(text):{}}catch{body={message:text}}
  if(!r.ok) throw new Error(body.error||body.message||`HTTP ${r.status}`);
  return body;
}

export const searchRealProducts=input=>api("/v1/products/search",{method:"POST",body:JSON.stringify(input)});
export const generateProductBackedVisualization=input=>api("/v1/visualizations/generate",{method:"POST",body:JSON.stringify(input)});
export const refreshProductAvailability=productIds=>api("/v1/products/availability",{method:"POST",body:JSON.stringify({productIds})});
export const createPurchaseList=input=>api("/v1/purchase-lists",{method:"POST",body:JSON.stringify(input)});
