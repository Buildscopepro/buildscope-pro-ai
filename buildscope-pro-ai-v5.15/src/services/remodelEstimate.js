export function takeoffToLines(takeoff,catalog){
  return Object.entries(takeoff).filter(([,v])=>Number(v.qty)>0).map(([key,v])=>{
    const m=catalog.find(x=>x.id===key);
    const qty=Number(v.qty||0),cost=Number(m?.cost||0),sale=Number(m?.sale||0);
    return {
      key,label:m?.name||key,qty,unit:v.unit,
      unitCost:cost,unitPrice:sale,
      totalCost:qty*cost,totalPrice:qty*sale
    };
  });
}
export function summarize(lines,labor=0,extras=0){
  const materialCost=lines.reduce((s,x)=>s+x.totalCost,0);
  const materialPrice=lines.reduce((s,x)=>s+x.totalPrice,0);
  return {
    materialCost,materialPrice,
    labor:Number(labor||0),extras:Number(extras||0),
    internalCost:materialCost+Number(labor||0)+Number(extras||0),
    customerPrice:materialPrice+Number(labor||0)+Number(extras||0)
  };
}
