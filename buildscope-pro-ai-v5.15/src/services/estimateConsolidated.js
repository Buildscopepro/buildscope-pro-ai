export function priceTakeoff(lines,catalog){
  return lines.map(line=>{
    const m=catalog.find(x=>x.id===line.key) || catalog.find(x=>x.name.toLowerCase().includes(String(line.label).toLowerCase()));
    const cost=m?Number(m.cost||0):0, sale=m?Number(m.sale||0):0, qty=Number(line.qty||0);
    return {...line,material:m||null,totalCost:qty*cost,totalPrice:qty*sale,unitCost:cost,unitPrice:sale};
  });
}
export function estimateTotals(lines,labor=0,extras=0){
  const materialCost=lines.reduce((s,x)=>s+Number(x.totalCost||0),0);
  const materialPrice=lines.reduce((s,x)=>s+Number(x.totalPrice||0),0);
  return {
    materialCost, materialPrice,
    labor:Number(labor||0), extras:Number(extras||0),
    internalCost:materialCost+Number(labor||0)+Number(extras||0),
    customerPrice:materialPrice+Number(labor||0)+Number(extras||0)
  };
}
