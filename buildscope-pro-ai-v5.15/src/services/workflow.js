import {supabase} from "./supabase";

export async function saveMeasurement(projectId,payload){
  const {data,error}=await supabase.from("project_measurements").insert({project_id:projectId,...payload}).select().single();
  if(error) throw error; return data;
}
export async function saveTakeoff(projectId,measurementId,payload){
  const {data,error}=await supabase.from("roof_takeoffs").insert({
    project_id:projectId,measurement_id:measurementId,system:payload.system,measurement:payload.measurement,accessories:payload.lines
  }).select().single();
  if(error) throw error; return data;
}
export async function saveEstimate(projectId,takeoffId,payload){
  const {data,error}=await supabase.from("estimates").insert({
    project_id:projectId,source_takeoff_id:takeoffId,
    material_cost:payload.materialCost,material_price:payload.materialPrice,
    labor:payload.labor,extras:payload.extras,
    total_cost:payload.internalCost,total_price:payload.customerPrice,status:"draft"
  }).select().single();
  if(error) throw error; return data;
}
