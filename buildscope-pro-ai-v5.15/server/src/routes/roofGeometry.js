import {Router} from "express";
import {roofGeometrySchema} from "../lib/schemas.js";
import {getRoofGeometryProvider} from "../providers/roofGeometry.js";
import {getConfig} from "../lib/config.js";
import {adminClient} from "../lib/supabase.js";
const router=Router();

router.post("/measure",async(req,res,next)=>{
  try{
    const input=roofGeometrySchema.parse(req.body);
    const {profile}=req.auth;

    const {data:project,error}=await adminClient.from("projects")
      .select("id,company_id,address").eq("id",input.projectId).single();
    if(error||!project||project.company_id!==profile.company_id)
      return res.status(404).json({error:"Project not found"});

    const provider=getRoofGeometryProvider(getConfig().ROOF_GEOMETRY_PROVIDER);
    const result=await provider.measure({...input,address:input.address||project.address||undefined});

    const {data:saved,error:saveError}=await adminClient.from("roof_geometry_reports").insert({
      company_id:profile.company_id,
      project_id:input.projectId,
      provider:result.provider,
      provider_report_id:result.reportId,
      roof_area_sqft:result.roofAreaSqFt,
      squares:result.squares,
      ridge_lf:result.ridgeLf,
      eave_lf:result.eaveLf,
      rake_lf:result.rakeLf,
      valley_lf:result.valleyLf,
      hip_lf:result.hipLf,
      flashing_lf:result.flashingLf,
      facets:result.facets,
      confidence:result.confidence,
      complete_linear_geometry:result.completeLinearGeometry,
      source_document_url:result.sourceDocumentUrl,
      raw_summary:result,
      created_by:req.auth.user.id
    }).select().single();
    if(saveError) throw saveError;

    res.json({...result,geometryReportId:saved.id});
  }catch(e){next(e)}
});

router.post("/override",async(req,res,next)=>{
  try{
    const {projectId,ridgeLf,eaveLf,rakeLf,valleyLf,hipLf,notes}=req.body||{};
    const {profile}=req.auth;
    const {data:project,error}=await adminClient.from("projects")
      .select("id,company_id").eq("id",projectId).single();
    if(error||!project||project.company_id!==profile.company_id)
      return res.status(404).json({error:"Project not found"});

    const vals={ridgeLf,eaveLf,rakeLf,valleyLf,hipLf};
    for(const [k,v] of Object.entries(vals)){
      if(v!=null && (!Number.isFinite(Number(v)) || Number(v)<0))
        return res.status(400).json({error:`Invalid ${k}`});
    }

    const {data:saved,error:saveError}=await adminClient.from("roof_geometry_reports").insert({
      company_id:profile.company_id,project_id:projectId,provider:"manual_override",
      ridge_lf:ridgeLf??null,eave_lf:eaveLf??null,rake_lf:rakeLf??null,valley_lf:valleyLf??null,
      hip_lf:hipLf??null,confidence:"field_verified",
      complete_linear_geometry:[ridgeLf,eaveLf,rakeLf,valleyLf].every(v=>v!=null),
      raw_summary:{notes:notes||"",override:true},
      created_by:req.auth.user.id
    }).select().single();
    if(saveError) throw saveError;
    res.json(saved);
  }catch(e){next(e)}
});

export default router;
