import {supabase} from "./supabase";

export async function listMyReminders(){
 const {data,error}=await supabase.from("job_reminders")
 .select("id,project_id,title,message,remind_at,status,projects(project_number,address)")
 .order("remind_at",{ascending:true});
 if(error) throw error;
 return data||[];
}

export async function createReminder({projectId,userId,title,message,remindAt,audience="crew"}){
 const {data,error}=await supabase.from("job_reminders").insert({
  project_id:projectId,user_id:userId,title,message,remind_at:remindAt,audience,status:"scheduled"
 }).select().single();
 if(error) throw error;
 return data;
}

export async function markReminderSent(id){
 const {error}=await supabase.from("job_reminders")
 .update({status:"sent",sent_at:new Date().toISOString()}).eq("id",id);
 if(error) throw error;
}
