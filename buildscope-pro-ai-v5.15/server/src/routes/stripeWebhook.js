import {Router} from "express";
import express from "express";
import {getStripe} from "../lib/stripe.js";
import {getConfig} from "../lib/config.js";
import {adminClient} from "../lib/supabase.js";

const router=Router();

router.post("/",express.raw({type:"application/json"}),async(req,res)=>{
  const c=getConfig();
  if(!c.STRIPE_WEBHOOK_SECRET) return res.status(503).send("Webhook secret not configured");
  let event;
  try{
    const sig=req.headers["stripe-signature"];
    event=getStripe().webhooks.constructEvent(req.body,sig,c.STRIPE_WEBHOOK_SECRET);
  }catch(e){
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  try{
    if(event.type==="payment_intent.succeeded"){
      const pi=event.data.object;
      const requestId=pi.metadata?.payment_request_id;
      if(requestId){
        await adminClient.from("payment_requests").update({
          status:"paid",paid_at:new Date().toISOString(),external_payment_id:pi.id
        }).eq("id",requestId);
      }
    } else if(event.type==="payment_intent.payment_failed"){
      const pi=event.data.object;
      const requestId=pi.metadata?.payment_request_id;
      if(requestId){
        await adminClient.from("payment_requests").update({
          status:"failed",external_payment_id:pi.id
        }).eq("id",requestId);
      }
    }
    res.json({received:true});
  }catch(e){
    res.status(500).json({error:"Webhook processing failed"});
  }
});

export default router;
