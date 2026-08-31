import {Router} from "express";
import {productSearchSchema,availabilitySchema} from "../lib/schemas.js";
import {getProductProvider} from "../providers/products.js";
import {getConfig} from "../lib/config.js";
const router=Router();

router.post("/search",async(req,res,next)=>{
  try{
    const input=productSearchSchema.parse(req.body);
    const provider=getProductProvider(getConfig().PRODUCT_PROVIDER);
    const products=await provider.search(input);
    res.json({products});
  }catch(e){next(e)}
});

router.post("/availability",async(req,res,next)=>{
  try{
    const input=availabilitySchema.parse(req.body);
    const provider=getProductProvider(getConfig().PRODUCT_PROVIDER);
    const products=await provider.availability(input.productIds);
    res.json({products});
  }catch(e){next(e)}
});

export default router;
