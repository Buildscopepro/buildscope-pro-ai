export function baseRoofTakeoff({system,orderSqFt,ridgeLf=0,eaveLf=0,rakeLf=0,valleyLf=0}){
  const square=Number(orderSqFt||0)/100;
  const common={
    system,
    orderSqFt:Number(orderSqFt||0),
    squares:+square.toFixed(2),
    ridgeLf:Number(ridgeLf||0),
    eaveLf:Number(eaveLf||0),
    rakeLf:Number(rakeLf||0),
    valleyLf:Number(valleyLf||0)
  };
  if(system==="Shingles"){
    return {...common,lines:[
      {key:"shingles",label:"Architectural Shingles",qty:+square.toFixed(2),unit:"square"},
      {key:"starter",label:"Starter Strip",qty:Math.ceil((common.eaveLf+common.rakeLf)*1.05),unit:"LF"},
      {key:"ridge_cap",label:"Ridge Cap",qty:Math.ceil(common.ridgeLf*1.05),unit:"LF"},
      {key:"underlayment",label:"Synthetic Underlayment",qty:Math.ceil(common.orderSqFt),unit:"ft²"},
      {key:"drip_edge",label:"Drip Edge",qty:Math.ceil((common.eaveLf+common.rakeLf)*1.05),unit:"LF"}
    ]};
  }
  return {...common,lines:[
    {key:"metal",label:system+" Metal Panels",qty:Math.ceil(common.orderSqFt),unit:"ft²"},
    {key:"ridge_cap",label:"Ridge Cap",qty:Math.ceil(common.ridgeLf*1.05),unit:"LF"},
    {key:"eave_trim",label:"Eave Trim",qty:Math.ceil(common.eaveLf*1.05),unit:"LF"},
    {key:"rake_trim",label:"Rake Trim",qty:Math.ceil(common.rakeLf*1.05),unit:"LF"},
    {key:"valley_trim",label:"Valley Trim",qty:Math.ceil(common.valleyLf*1.05),unit:"LF"},
    {key:"underlayment",label:"Underlayment",qty:Math.ceil(common.orderSqFt),unit:"ft²"}
  ]};
}
