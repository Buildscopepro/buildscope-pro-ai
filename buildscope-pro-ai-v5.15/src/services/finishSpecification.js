import {MATCH_STATUS,normalizeProduct,validateDesignProducts} from "./productBackedDesign";

export function createFinishSpecification({
 surface,room,finishType,product,quantity,unit,designId=null
}){
 const p=normalizeProduct({...product,quantity,unit,category:finishType});
 return {
  designId,surface,room,finishType,
  product:p,
  matchStatus:p.matchStatus||MATCH_STATUS.PENDING,
  readyForClient:validateDesignProducts([p]).valid
 };
}

export function validateFinishSchedule(specs=[]){
 const products=specs.map(x=>x.product);
 const validation=validateDesignProducts(products);
 const missingSurface=specs.filter(x=>!x.surface||!x.room||!x.finishType);
 return {
  valid:validation.valid && missingSurface.length===0,
  issues:[
   ...validation.issues,
   ...missingSurface.map((_,i)=>`Finish ${i+1}: room, surface and finish type are required`)
  ]
 };
}
