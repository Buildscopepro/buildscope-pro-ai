import {supabase} from "./supabase";
const BASE=process.env.EXPO_PUBLIC_BUILDSCOPE_API_URL;

export async function createStripeIntent(paymentRequestId){
  if(!BASE) throw new Error("BuildScope backend URL is not configured");
  const {data}=await supabase.auth.getSession();
  const token=data.session?.access_token;
  if(!token) throw new Error("User is not authenticated");
  const r=await fetch(`${BASE.replace(/\/$/,"")}/v1/payments/intent`,{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
    body:JSON.stringify({paymentRequestId})
  });
  const body=await r.json();
  if(!r.ok) throw new Error(body.error||`HTTP ${r.status}`);
  return body;
}
