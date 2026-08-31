import {toFile} from "openai";
import {getOpenAI} from "../lib/openai.js";
import {getConfig} from "../lib/config.js";
import {adminClient} from "../lib/supabase.js";

function productSpec(products=[]){
  return products.map((p,i)=>`${i+1}. PRODUCT_ID=${p.productId}
Name=${p.name}
Brand=${p.brand||"unspecified"}
Model/SKU=${p.model||p.sku||"unspecified"}
Color=${p.color||"unspecified"}
Finish=${p.finish||"unspecified"}
Size=${p.size||"unspecified"}`).join("\n\n");
}

export class MockImageProvider{
  async generate({products=[]}){
    return {
      designId:`demo-${Date.now()}`,renderUrl:null,status:"provider_not_configured",
      productManifest:products.map(p=>({productId:p.productId,usage:"selected product constraint",location:"unspecified"}))
    };
  }
}

export class OpenAIImageProvider{
  async generate({projectId,sourcePhotoUrl,spaceType,styleNotes="",products=[]}){
    const openai=getOpenAI();
    const c=getConfig();

    const src=await fetch(sourcePhotoUrl);
    if(!src.ok) throw new Error(`Could not download source photo: HTTP ${src.status}`);
    const contentType=src.headers.get("content-type")||"image/jpeg";
    const bytes=Buffer.from(await src.arrayBuffer());
    if(bytes.length>50*1024*1024) throw new Error("Source image exceeds 50MB");
    const sourceFile=await toFile(bytes,"source-image",{type:contentType});

    const prompt=`Edit this real client photo into a photorealistic ${spaceType} remodel.
Preserve the room/property geometry, camera viewpoint, openings, structural layout, and scale unless explicitly requested otherwise.

CRITICAL PRODUCT-INTEGRITY RULE:
Use the visual appearance of the exact selected real products below. Do not silently substitute a different visible material, color, finish, pattern, cabinet style, flooring, wall/ceiling finish, siding, roofing material, fixture, or countertop.
If a selected product cannot be represented faithfully, keep that area conservative and do not introduce a contradictory replacement.

Selected products:
${productSpec(products)}

Client/design notes:
${styleNotes||"No additional notes."}

The result is a client-facing construction visualization, so realism and product consistency are more important than decorative creativity.`;

    const rsp=await openai.images.edit({
      model:c.OPENAI_IMAGE_MODEL,
      image:sourceFile,
      prompt,
      size:"1536x1024",
      quality:"high"
    });

    const b64=rsp.data?.[0]?.b64_json;
    if(!b64) throw new Error("Image provider returned no image");
    const render=Buffer.from(b64,"base64");
    const designId=crypto.randomUUID();
    const path=`${projectId}/${designId}.png`;

    const {error:uploadError}=await adminClient.storage.from("design-renders")
      .upload(path,render,{contentType:"image/png",upsert:false});
    if(uploadError) throw uploadError;

    const {data:signed,error:signedError}=await adminClient.storage.from("design-renders")
      .createSignedUrl(path,60*60*24*7);
    if(signedError) throw signedError;

    return {
      designId,
      renderPath:path,
      renderUrl:signed.signedUrl,
      status:"generated",
      productManifest:products.map(p=>({
        productId:p.productId,
        usage:"exact selected product constraint",
        location:spaceType
      }))
    };
  }
}

export function getImageProvider(name){
  if(name==="mock") return new MockImageProvider();
  if(name==="openai") return new OpenAIImageProvider();
  throw new Error(`Image provider '${name}' is not implemented`);
}
