import {Router} from "express";
import {roofMeasureSchema} from "../lib/schemas.js";
import {getRoofProvider} from "../providers/roof.js";
import {getConfig} from "../lib/config.js";
import {adminClient} from "../lib/supabase.js";
const router=Router();

router.post("/auto-measure",async(req,res,next)=>{
  try{
    const input=roofMeasureSchema.parse(req.body);
    const {profile}=req.auth;

    const {data:project,error}=await adminClient.from("projects")
      .select("id,company_id").eq("id",input.projectId).single();
    if(error||!project||project.company_id!==profile.company_id)
      return res.status(404).json({error:"Project not found"});

    const provider=getRoofProvider(getConfig().ROOF_PROVIDER);
    const result=await provider.measure(input);

    const {data:measurement,error:merr}=await adminClient.from("automatic_roof_measurements").insert({
      company_id:profile.company_id,
      project_id:input.projectId,
      provider:result.provider,
      latitude:input.latitude,
      longitude:input.longitude,
      imagery_quality:result.imageryQuality,
      imagery_date:result.imageryDate,
      roof_area_sqft:result.estimatedRoofAreaSqFt,
      squares:result.estimatedSquares,
      segment_count:result.segmentCount,
      segments:result.segments,
      provider_response_summary:{
        center:result.center,
        postalCode:result.postalCode,
        administrativeArea:result.administrativeArea,
        regionCode:result.regionCode,
        rawWholeRoofAreaMeters2:result.rawWholeRoofAreaMeters2,
        estimatedRoofAreaMeters2:result.estimatedRoofAreaMeters2
      },
      created_by:req.auth.user.id
    }).select().single();
    if(merr) throw merr;

    res.json({...result,measurementId:measurement.id});
  }catch(e){
    if(e.status===404) return res.status(404).json({
      error:"Automatic roof data not available for this location/quality.",
      code:e.code||"NOT_FOUND",
      fallback:"manual_polygon"
    });
    next(e);
  }
});

export default router;
