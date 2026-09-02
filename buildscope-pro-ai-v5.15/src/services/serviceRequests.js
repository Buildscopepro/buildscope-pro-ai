import {supabase} from "./supabase";

export async function createServiceRequest(payload){
  const {data,error}=await supabase.from("service_requests").insert({
    client_name:payload.clientName,
    phone:payload.phone||null,
    email:payload.email||null,
    address:payload.address,
    service_type:payload.serviceType,
    description:payload.description||null,
    preferred_contact:payload.preferredContact||"phone",
    status:"new"
  }).select().single();
  if(error) throw error;
  return data;
}

export async function listServiceRequests(){
  const {data,error}=await supabase.from("service_requests")
    .select("*").order("created_at",{ascending:false});
  if(error) throw error;
  return data||[];
}

export async function updateServiceRequestStatus(id,status){
  const {data,error}=await supabase.from("service_requests")
    .update({status}).eq("id",id).select().single();
  if(error) throw error;
  return data;
}
