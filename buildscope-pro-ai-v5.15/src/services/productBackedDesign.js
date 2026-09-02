export const MATCH_STATUS={
 EXACT:"exact",
 EQUIVALENT:"equivalent",
 PENDING:"pending"
};

export function normalizeProduct(p={}){
 return {
  productId:p.productId||null,
  name:p.name||"",
  brand:p.brand||"",
  model:p.model||"",
  sku:p.sku||"",
  category:p.category||"",
  finish:p.finish||"",
  color:p.color||"",
  size:p.size||"",
  unit:p.unit||"",
  quantity:Number(p.quantity||0),
  retailerName:p.retailerName||"",
  retailerUrl:p.retailerUrl||"",
  price:Number(p.price||0),
  availability:p.availability||"unknown",
  matchStatus:p.matchStatus||MATCH_STATUS.PENDING,
  verifiedAt:p.verifiedAt||null,
  notes:p.notes||""
 };
}

export function validateDesignProducts(products=[]){
 const issues=[];
 products.forEach((raw,i)=>{
  const p=normalizeProduct(raw);
  if(!p.name) issues.push(`Item ${i+1}: product name required`);
  if(p.matchStatus===MATCH_STATUS.EXACT && (!p.brand || (!p.model && !p.sku)))
    issues.push(`Item ${i+1}: exact match requires brand and model/SKU`);
  if(p.matchStatus===MATCH_STATUS.EXACT && !p.retailerName)
    issues.push(`Item ${i+1}: exact match requires where-to-buy source`);
 });
 return {valid:issues.length===0,issues};
}

export function buildApprovedDesign({projectId,sourcePhotoUri,renderUri,spaceType,products,clientNotes=""}){
 const normalized=products.map(normalizeProduct);
 const validation=validateDesignProducts(normalized);
 return {
  projectId,sourcePhotoUri,renderUri,spaceType,
  products:normalized,
  clientNotes,
  validation,
  approvalStatus:validation.valid?"ready_for_client":"needs_product_resolution",
  createdAt:new Date().toISOString()
 };
}
