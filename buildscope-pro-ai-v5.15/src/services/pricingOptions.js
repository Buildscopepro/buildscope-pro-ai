export function pricingTiers(internalCost,taxPercent=0,margins={Bueno:25,Mejor:32,Premium:40}){
  const tax=Number(taxPercent||0)/100;
  return Object.entries(margins).map(([tier,pct])=>{
    const margin=Math.min(.95,Math.max(0,Number(pct||0)/100));
    const beforeTax=Number(internalCost||0)/(1-margin);
    return {
      tier,marginPercent:Number(pct||0),
      beforeTax,
      taxAmount:beforeTax*tax,
      total:beforeTax*(1+tax)
    };
  });
}
