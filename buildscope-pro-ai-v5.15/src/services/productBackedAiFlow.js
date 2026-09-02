import{
 generateProductBackedVisualization,
 refreshProductAvailability,
 createPurchaseList
}from"./backendGateway";
import{reconcileDesignProducts,buildPurchaseList}from"./productReconciliation";

export async function createVerifiedDesign({
 projectId,sourcePhotoUrl,spaceType,styleNotes,products
}){
 if(!products?.length) throw new Error("Select real products before generating the client design.");
 const generation=await generateProductBackedVisualization({
   projectId,sourcePhotoUrl,spaceType,styleNotes,
   products:products.map(p=>({
     productId:p.productId,
     name:p.name,brand:p.brand,model:p.model,sku:p.sku,
     color:p.color,finish:p.finish,size:p.size,
     retailerName:p.retailerName,retailerUrl:p.retailerUrl
   }))
 });
 const reconciliation=reconcileDesignProducts(generation.productManifest||[],products);
 return {...generation,reconciliation};
}

export async function finalizePurchaseList({projectId,designId,reconciliation}){
 if(!reconciliation?.readyForApproval) throw new Error("Design has unresolved product references.");
 const local=buildPurchaseList(reconciliation);
 const availability=await refreshProductAvailability(local.map(x=>x.productId));
 const byId=new Map((availability.products||[]).map(x=>[x.productId,x]));
 const refreshed=local.map(x=>({...x,...(byId.get(x.productId)||{})}));
 return createPurchaseList({projectId,designId,items:refreshed});
}
