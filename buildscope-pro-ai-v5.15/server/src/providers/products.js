import {getOpenAI} from "../lib/openai.js";
import {getConfig} from "../lib/config.js";

function stripFence(text=""){
  return text.trim()
    .replace(/^```(?:json)?\s*/i,"")
    .replace(/\s*```$/,"");
}

function normalize(p){
  return {
    productId:String(p.productId||p.url||`${p.brand||""}:${p.model||p.sku||p.name||""}`),
    name:String(p.name||""),
    brand:String(p.brand||""),
    model:String(p.model||""),
    sku:String(p.sku||""),
    category:String(p.category||""),
    color:String(p.color||""),
    finish:String(p.finish||""),
    size:String(p.size||""),
    retailerName:String(p.retailerName||""),
    retailerUrl:String(p.retailerUrl||p.url||""),
    price:p.price==null?null:Number(p.price),
    currency:String(p.currency||"USD"),
    availability:String(p.availability||"unknown"),
    verifiedAt:String(p.verifiedAt||new Date().toISOString()),
    sourceMode:"openai_web"
  };
}

export class MockProductProvider{
  async search({query,category}){
    return [{
      productId:`mock:${Buffer.from(`${category||""}:${query}`).toString("base64url").slice(0,16)}`,
      name:`Demo ${query}`,brand:"DEMO ONLY",model:"NOT-FOR-PRODUCTION",sku:"DEMO",
      category:category||"General",color:"",finish:"",size:"",
      retailerName:"Demo Retailer",retailerUrl:"",price:null,currency:"USD",
      availability:"unknown",verifiedAt:new Date().toISOString(),sourceMode:"mock"
    }];
  }
  async availability(productIds=[]){
    return productIds.map(productId=>({productId,availability:"unknown",price:null,verifiedAt:new Date().toISOString(),sourceMode:"mock"}));
  }
}

export class OpenAIWebProductProvider{
  async search({query,category,location}){
    const openai=getOpenAI();
    const c=getConfig();
    const where=location?.postalCode?` near ZIP/postal code ${location.postalCode}`:"";
    const prompt=`Search the public web for real currently sold construction/remodeling products matching:
Query: ${query}
Category: ${category||"unspecified"}${where}

Return ONLY valid JSON with shape:
{"products":[{"productId":"","name":"","brand":"","model":"","sku":"","category":"","color":"","finish":"","size":"","retailerName":"","retailerUrl":"","price":null,"currency":"USD","availability":"in_stock|out_of_stock|limited|unknown","verifiedAt":"ISO-8601"}]}

Rules:
- Only include products you can support from live web results.
- retailerUrl must point to the product/retailer source you found.
- Never invent model, SKU, price, stock, or brand; use empty string/null/unknown when not supported.
- Prefer exact manufacturer/retailer product pages over aggregators.
- Maximum 8 products.`;

    const response=await openai.responses.create({
      model:c.OPENAI_TEXT_MODEL,
      tools:[{type:"web_search"}],
      input:prompt
    });

    const parsed=JSON.parse(stripFence(response.output_text));
    return (parsed.products||[]).map(normalize).filter(p=>p.name&&p.retailerUrl);
  }

  async availability(productIds=[]){
    // Search by product IDs/URLs again to refresh current state. IDs are expected to be stable URLs or provider IDs.
    const openai=getOpenAI();
    const c=getConfig();
    const prompt=`Refresh current retail availability and price for these product identifiers:
${productIds.map((x,i)=>`${i+1}. ${x}`).join("\n")}
Return ONLY JSON:
{"products":[{"productId":"","price":null,"currency":"USD","availability":"in_stock|out_of_stock|limited|unknown","retailerUrl":"","verifiedAt":"ISO-8601"}]}
Do not invent stock or price.`;
    const response=await openai.responses.create({
      model:c.OPENAI_TEXT_MODEL,
      tools:[{type:"web_search"}],
      input:prompt
    });
    const parsed=JSON.parse(stripFence(response.output_text));
    return (parsed.products||[]).map(x=>({
      productId:String(x.productId||""),
      price:x.price==null?null:Number(x.price),
      currency:String(x.currency||"USD"),
      availability:String(x.availability||"unknown"),
      retailerUrl:String(x.retailerUrl||""),
      verifiedAt:String(x.verifiedAt||new Date().toISOString()),
      sourceMode:"openai_web"
    }));
  }
}

export function getProductProvider(name){
  if(name==="mock") return new MockProductProvider();
  if(name==="openai_web") return new OpenAIWebProductProvider();
  throw new Error(`Product provider '${name}' is not implemented`);
}
