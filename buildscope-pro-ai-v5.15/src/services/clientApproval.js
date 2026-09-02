import {supabase} from "./supabase";

export async function getClientFinishSchedule(projectId){
 const {data,error}=await supabase.from("finish_schedules")
  .select("id,room_name,surface,finish_type,product_name,brand,model,sku,color,finish,size,quantity,unit,retailer_name,retailer_url,price,availability,match_status,verified_at,notes")
  .eq("project_id",projectId).order("room_name");
 if(error) throw error; return data||[];
}

export function approvalReadiness(finishes=[]){
 const issues=[];
 finishes.forEach((f,i)=>{
   if(f.match_status==="pending") issues.push(`${f.room_name||"Finish"}: product pending`);
   if(f.match_status==="exact" && (!f.brand || (!f.model && !f.sku)))
     issues.push(`${f.room_name||"Finish"}: exact product needs brand + model/SKU`);
   if(f.match_status==="exact" && !f.retailer_name)
     issues.push(`${f.room_name||"Finish"}: exact product needs where-to-buy source`);
 });
 return {ready:finishes.length>0 && issues.length===0,issues};
}

export async function submitClientApproval(projectId,designId,finishes,decision,clientName,notes=""){
 const readiness=approvalReadiness(finishes);
 if(decision==="approved"&&!readiness.ready) throw new Error("Finish schedule is not ready for approval");
 const snapshot={finishes,readiness,capturedAt:new Date().toISOString()};
 const {data,error}=await supabase.from("client_design_approvals").insert({
   project_id:projectId,design_id:designId||null,decision,client_name:clientName,
   client_notes:notes,finish_snapshot:snapshot
 }).select().single();
 if(error) throw error; return data;
}
