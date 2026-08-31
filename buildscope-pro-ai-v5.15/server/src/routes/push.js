import {Router} from "express";
import {adminClient} from "../lib/supabase.js";
const router=Router();

router.post("/project-reminder",async(req,res,next)=>{
  try{
    const {projectId,title,message,audience="crew"}=req.body||{};
    if(!projectId||!title||!message) return res.status(400).json({error:"projectId, title and message required"});

    const {profile}=req.auth;
    const {data:project,error}=await adminClient.from("projects").select("id,company_id").eq("id",projectId).single();
    if(error||!project||project.company_id!==profile.company_id) return res.status(404).json({error:"Project not found"});

    const {data:users,error:uerr}=await adminClient.from("project_assignments").select("user_id").eq("project_id",projectId).eq("status","active");
    if(uerr) throw uerr;
    const userIds=[...new Set((users||[]).map(x=>x.user_id))];
    const {data:devices,error:derr}=await adminClient.from("notification_devices").select("push_token,user_id")
      .in("user_id",userIds.length?userIds:["00000000-0000-0000-0000-000000000000"]).eq("enabled",true);
    if(derr) throw derr;

    // Delivery provider intentionally externalized. Queue the notification payload.
    const {data:queued,error:qerr}=await adminClient.from("push_outbox").insert((devices||[]).map(d=>({
      company_id:profile.company_id,project_id:projectId,user_id:d.user_id,push_token:d.push_token,
      title,message,audience,status:"queued"
    }))).select();
    if(qerr) throw qerr;
    res.json({queued:(queued||[]).length});
  }catch(e){next(e)}
});

export default router;
