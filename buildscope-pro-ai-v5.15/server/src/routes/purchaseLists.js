import {Router} from "express";
import {purchaseListSchema} from "../lib/schemas.js";
import {adminClient} from "../lib/supabase.js";
const router=Router();

router.post("/",async(req,res,next)=>{
  try{
    const input=purchaseListSchema.parse(req.body);
    const {profile}=req.auth;

    const {data:project,error}=await adminClient.from("projects")
      .select("id,company_id").eq("id",input.projectId).single();
    if(error||!project||project.company_id!==profile.company_id)
      return res.status(404).json({error:"Project not found"});

    const {data:list,error:listError}=await adminClient.from("purchase_lists").insert({
      company_id:profile.company_id,
      project_id:input.projectId,
      design_id:input.designId,
      created_by:req.auth.user.id,
      status:"draft"
    }).select().single();
    if(listError) throw listError;

    const rows=input.items.map(i=>({
      company_id:profile.company_id,purchase_list_id:list.id,
      product_id:i.productId,product_name:i.name,quantity:i.quantity,unit:i.unit||null,
      price:i.price??null,retailer_name:i.retailerName||null,retailer_url:i.retailerUrl||null
    }));
    const {error:itemsError}=await adminClient.from("purchase_list_items").insert(rows);
    if(itemsError) throw itemsError;

    res.json({purchaseListId:list.id,status:list.status,items:rows});
  }catch(e){next(e)}
});

export default router;
