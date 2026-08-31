import {getConfig} from "./config.js";

export async function sendExpoPush(messages=[]){
  if(!messages.length) return [];
  const c=getConfig();
  const headers={"Content-Type":"application/json","Accept":"application/json"};
  if(c.EXPO_ACCESS_TOKEN) headers.Authorization=`Bearer ${c.EXPO_ACCESS_TOKEN}`;

  const results=[];
  for(let i=0;i<messages.length;i+=100){
    const chunk=messages.slice(i,i+100);
    const r=await fetch("https://exp.host/--/api/v2/push/send",{
      method:"POST",headers,body:JSON.stringify(chunk)
    });
    const body=await r.json();
    if(!r.ok) throw new Error(body?.errors?.[0]?.message||`Expo push HTTP ${r.status}`);
    results.push(...(body.data||[]));
  }
  return results;
}
