import {supabase} from "./supabase";

export async function listScheduledProjects(){
 const {data,error}=await supabase.from("projects")
 .select("id,project_number,address,start_date,end_date,latitude,longitude")
 .not("start_date","is",null).order("start_date");
 if(error) throw error; return data||[];
}

export async function listAssignments(){
 const {data,error}=await supabase.from("project_assignments")
 .select("project_id,user_id,status,profiles(display_name)")
 .eq("status","active");
 if(error) throw error; return data||[];
}

function overlap(aStart,aEnd,bStart,bEnd){
 const a1=new Date(aStart),a2=new Date(aEnd||aStart),b1=new Date(bStart),b2=new Date(bEnd||bStart);
 return a1<=b2 && b1<=a2;
}

export function findCrewConflicts(projects,assignments){
 const byCrew={};
 for(const a of assignments){
  if(!byCrew[a.user_id])byCrew[a.user_id]=[];
  const p=projects.find(x=>x.id===a.project_id);
  if(p)byCrew[a.user_id].push({...p,crewName:a.profiles?.display_name||a.user_id});
 }
 const conflicts=[];
 for(const [userId,jobs] of Object.entries(byCrew)){
  for(let i=0;i<jobs.length;i++)for(let j=i+1;j<jobs.length;j++){
   if(overlap(jobs[i].start_date,jobs[i].end_date,jobs[j].start_date,jobs[j].end_date)){
    conflicts.push({userId,crewName:jobs[i].crewName,a:jobs[i],b:jobs[j]});
   }
  }
 }
 return conflicts;
}
