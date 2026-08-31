import {authClient,adminClient} from "./supabase.js";

export async function requireAuth(req,res,next){
  try{
    const header=req.headers.authorization||"";
    const token=header.startsWith("Bearer ")?header.slice(7):null;
    if(!token) return res.status(401).json({error:"Missing bearer token"});

    const {data,error}=await authClient.auth.getUser(token);
    if(error||!data?.user) return res.status(401).json({error:"Invalid or expired token"});

    const {data:profile,error:profileError}=await adminClient
      .from("profiles")
      .select("user_id,company_id,role,status")
      .eq("user_id",data.user.id)
      .single();

    if(profileError||!profile) return res.status(403).json({error:"Profile not found"});
    if(profile.status!=="active") return res.status(403).json({error:"User disabled"});

    req.auth={user:data.user,profile,token};
    next();
  }catch(e){next(e)}
}

export function requireRole(...roles){
  return (req,res,next)=>{
    if(!roles.includes(req.auth?.profile?.role))
      return res.status(403).json({error:"Insufficient permission"});
    next();
  };
}
