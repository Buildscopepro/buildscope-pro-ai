import {adminClient} from "../lib/supabase.js";
import {sendExpoPush} from "../lib/expoPush.js";

export async function runPushBatch(limit=100){
  const {data:rows,error}=await adminClient.from("push_outbox")
    .select("*").eq("status","queued").order("created_at").limit(limit);
  if(error) throw error;
  if(!rows?.length) return {processed:0};

  const messages=rows.map(r=>({
    to:r.push_token,
    title:r.title,
    body:r.message,
    sound:"default",
    data:{projectId:r.project_id,audience:r.audience}
  }));

  const tickets=await sendExpoPush(messages);
  for(let i=0;i<rows.length;i++){
    const ticket=tickets[i]||{};
    const ok=ticket.status==="ok";
    await adminClient.from("push_outbox").update({
      status:ok?"sent":"failed",
      provider_message_id:ticket.id||null,
      error_message:ok?null:(ticket.message||ticket.details?.error||"Push failed"),
      sent_at:ok?new Date().toISOString():null
    }).eq("id",rows[i].id);
  }
  return {processed:rows.length,sent:tickets.filter(x=>x.status==="ok").length};
}
