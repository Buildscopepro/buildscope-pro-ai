import {supabase} from "./supabase";

export async function createPaymentRequest({projectId,proposalId,amount,description}){
  const {data,error}=await supabase.from("payment_requests").insert({
    project_id:projectId,
    proposal_id:proposalId||null,
    amount:Number(amount||0),
    description:description||null,
    status:"pending"
  }).select().single();
  if(error) throw error;
  return data;
}

export async function listProjectPaymentRequests(projectId){
  const {data,error}=await supabase.from("payment_requests")
    .select("*").eq("project_id",projectId).order("created_at",{ascending:false});
  if(error) throw error;
  return data||[];
}
