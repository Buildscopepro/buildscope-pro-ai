import {Router} from "express";
import {visualizationSchema} from "../lib/schemas.js";
import {getImageProvider} from "../providers/images.js";
import {getConfig} from "../lib/config.js";
import {adminClient} from "../lib/supabase.js";
const router=Router();

router.post("/generate",async(req,res,next)=>{
  try{
    const input=visualizationSchema.parse(req.body);
    const {profile}=req.auth;

    const {data:project,error}=await adminClient.from("projects")
      .select("id,company_id").eq("id",input.projectId).single();
    if(error||!project||project.company_id!==profile.company_id)
      return res.status(404).json({error:"Project not found"});

    const provider=getImageProvider(getConfig().IMAGE_PROVIDER);
    const result=await provider.generate(input);

    await adminClient.from("ai_generation_audit").insert({
      company_id:profile.company_id,
      project_id:input.projectId,
      user_id:req.auth.user.id,
      provider:getConfig().IMAGE_PROVIDER,
      request_summary:{
        spaceType:input.spaceType,
        productIds:input.products.map(p=>p.productId)
      },
      result_summary:{
        designId:result.designId,
        status:result.status,
        productManifest:result.productManifest
      }
    });

    res.json(result);
  }catch(e){next(e)}
});

export default router;
