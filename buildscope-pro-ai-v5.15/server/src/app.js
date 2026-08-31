import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import {ZodError} from "zod";
import {getConfig} from "./lib/config.js";
import {readiness} from "./lib/readiness.js";
import {requireAuth,requireRole} from "./lib/auth.js";
import products from "./routes/products.js";
import visualizations from "./routes/visualizations.js";
import purchaseLists from "./routes/purchaseLists.js";
import push from "./routes/push.js";
import roof from "./routes/roof.js";
import payments from "./routes/payments.js";
import roofGeometry from "./routes/roofGeometry.js";
import stripeWebhook from "./routes/stripeWebhook.js";

const app=express();
app.use(helmet());
app.use(cors({origin:false}));
app.use("/webhooks/stripe",stripeWebhook);
app.use(express.json({limit:"1mb"}));
app.use(pinoHttp());

app.get("/health",(req,res)=>res.json({ok:true,service:"buildscope-backend"}));
app.get("/ready",(req,res)=>{const r=readiness();res.status(r.ready?200:503).json(r)});

app.use("/v1/products",requireAuth,products);
app.use("/v1/visualizations",requireAuth,requireRole("Admin","Salesperson"),visualizations);
app.use("/v1/purchase-lists",requireAuth,requireRole("Admin","Salesperson"),purchaseLists);
app.use("/v1/push",requireAuth,requireRole("Admin","Salesperson"),push);
app.use("/v1/roof",requireAuth,requireRole("Admin","Salesperson","Field Crew"),roof);
app.use("/v1/payments",requireAuth,payments);
app.use("/v1/roof-geometry",requireAuth,requireRole("Admin","Salesperson","Field Crew"),roofGeometry);

app.use((err,req,res,next)=>{
  req.log?.error(err);
  if(err instanceof ZodError) return res.status(400).json({error:"Invalid request",issues:err.issues});
  res.status(500).json({error:"Internal server error"});
});

export default app;
