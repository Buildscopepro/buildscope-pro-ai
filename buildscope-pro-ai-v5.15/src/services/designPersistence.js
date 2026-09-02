import {supabase} from "./supabase";

export async function createDesign(projectId,{spaceType,sourcePhotoPath,renderPath,styleNotes}){
 const {data,error}=await supabase.from("design_visualizations").insert({
  project_id:projectId,space_type:spaceType,source_photo_path:sourcePhotoPath,
  render_path:renderPath,style_notes:styleNotes,status:"draft"
 }).select().single();
 if(error) throw error; return data;
}

export async function addDesignProduct(designId,p){
 const {data,error}=await supabase.from("design_products").insert({
  design_id:designId,product_name:p.name,brand:p.brand||null,model:p.model||null,sku:p.sku||null,
  category:p.category||null,finish:p.finish||null,color:p.color||null,size:p.size||null,
  quantity:p.quantity||0,unit:p.unit||null,retailer_name:p.retailerName||null,
  retailer_url:p.retailerUrl||null,price:p.price||0,availability:p.availability||"unknown",
  match_status:p.matchStatus||"pending",verified_at:p.verifiedAt||null,notes:p.notes||null
 }).select().single();
 if(error) throw error; return data;
}

export async function approveDesign(designId){
 const {data,error}=await supabase.rpc("approve_product_backed_design",{p_design_id:designId});
 if(error) throw error; return data;
}
