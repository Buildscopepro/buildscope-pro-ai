function positive(n){return Math.max(0,Number(n||0));}
function waste(q,pct){return q*(1+positive(pct)/100);}

export function calculateWallFinish({
 lengthFt,heightFt,openingsSqFt=0,wastePercent=10,finishId,coverage=1,unit="ft²"
}){
 const netSqFt=Math.max(0,positive(lengthFt)*positive(heightFt)-positive(openingsSqFt));
 const orderSqFt=waste(netSqFt,wastePercent);
 let qty=orderSqFt;
 if(unit==="sheet"||unit==="gal"||unit==="bucket") qty=Math.ceil(orderSqFt/positive(coverage||1));
 else qty=Math.ceil(orderSqFt);
 return {surface:"wall",finishId,netSqFt,orderSqFt,qty,unit};
}

export function calculateCeilingFinish({
 lengthFt,widthFt,wastePercent=10,finishId,coverage=1,unit="ft²"
}){
 const netSqFt=positive(lengthFt)*positive(widthFt);
 const orderSqFt=waste(netSqFt,wastePercent);
 let qty=orderSqFt;
 if(unit==="sheet"||unit==="gal"||unit==="bucket") qty=Math.ceil(orderSqFt/positive(coverage||1));
 else qty=Math.ceil(orderSqFt);
 return {surface:"ceiling",finishId,netSqFt,orderSqFt,qty,unit};
}

export function calculateTrim({perimeterLf,doorsLf=0,wastePercent=10}){
 const netLf=Math.max(0,positive(perimeterLf)-positive(doorsLf));
 return {surface:"wall",finishId:"baseboard",netLf,qty:Math.ceil(waste(netLf,wastePercent)),unit:"LF"};
}
