export function reconcileDesignProducts(renderManifest=[],selectedProducts=[]){
  const byId=new Map(selectedProducts.map(p=>[p.productId,p]));
  const items=renderManifest.map(x=>{
    const p=byId.get(x.productId);
    return {
      productId:x.productId,
      usage:x.usage||"",
      location:x.location||"",
      exact:Boolean(p),
      product:p||null,
      status:p?"exact":"pending"
    };
  });
  const unresolved=items.filter(x=>x.status!=="exact");
  return {
    items,
    unresolved,
    readyForApproval:items.length>0 && unresolved.length===0
  };
}

export function buildPurchaseList(reconciled){
  return reconciled.items.filter(x=>x.product).map(x=>({
    productId:x.product.productId,
    name:x.product.name,
    brand:x.product.brand,
    model:x.product.model,
    sku:x.product.sku,
    retailerName:x.product.retailerName,
    retailerUrl:x.product.retailerUrl,
    quantity:Number(x.product.quantity||0),
    unit:x.product.unit,
    price:Number(x.product.price||0),
    subtotal:Number(x.product.quantity||0)*Number(x.product.price||0),
    usage:x.usage,
    location:x.location
  }));
}
