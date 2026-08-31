import {Router} from "express";
import {z} from "zod";
import {adminClient} from "../lib/supabase.js";
import {getStripe} from "../lib/stripe.js";

const router=Router();

const createSchema=z.object({
  paymentRequestId:z.string().uuid()
});

router.post("/intent",async(req,res,next)=>{
  try{
    const {paymentRequestId}=createSchema.parse(req.body);
    const {profile}=req.auth;

    const {data:pr,error}=await adminClient.from("payment_requests")
      .select("id,company_id,project_id,amount,description,status")
      .eq("id",paymentRequestId).single();
    if(error||!pr||pr.company_id!==profile.company_id)
      return res.status(404).json({error:"Payment request not found"});
    if(pr.status!=="pending")
      return res.status(409).json({error:"Payment request is not pending"});

    // Server is authoritative for the amount.
    const amountCents=Math.round(Number(pr.amount)*100);
    if(!Number.isInteger(amountCents)||amountCents<50)
      return res.status(400).json({error:"Invalid payment amount"});

    const stripe=getStripe();
    const intent=await stripe.paymentIntents.create({
      amount:amountCents,
      currency:"usd",
      automatic_payment_methods:{enabled:true},
      metadata:{
        payment_request_id:pr.id,
        project_id:pr.project_id,
        company_id:pr.company_id
      },
      description:pr.description||"BuildScope project payment"
    },{idempotencyKey:`payment-request:${pr.id}`});

    await adminClient.from("payment_requests").update({
      external_payment_id:intent.id
    }).eq("id",pr.id);

    res.json({
      paymentIntentId:intent.id,
      clientSecret:intent.client_secret,
      amount:pr.amount,
      currency:"usd"
    });
  }catch(e){next(e)}
});

export default router;
