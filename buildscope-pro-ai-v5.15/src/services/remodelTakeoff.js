export function calcRemodelTakeoff(m){
  const sidingArea=Math.max(0,Number(m.wallWidth||0)*Number(m.wallHeight||0)-Number(m.openingsArea||0));
  const floorArea=Math.max(0,Number(m.floorWidth||0)*Number(m.floorLength||0));
  return {
    siding:{qty:Math.ceil(sidingArea*(1+(Number(m.sidingWaste||0)/100))),unit:"ft²"},
    soffit:{qty:Math.ceil(Number(m.soffitLf||0)),unit:"LF"},
    gutters:{qty:Math.ceil(Number(m.gutterLf||0)),unit:"LF"},
    coping:{qty:Math.ceil(Number(m.copingLf||0)),unit:"LF"},
    "2x4":{qty:Math.ceil(Number(m.lumber2x4||0)),unit:"piece"},
    "2x6":{qty:Math.ceil(Number(m.lumber2x6||0)),unit:"piece"},
    "1x2":{qty:Math.ceil(Number(m.lumber1x2||0)),unit:"piece"},
    "1x4":{qty:Math.ceil(Number(m.lumber1x4||0)),unit:"piece"},
    flooring:{qty:Math.ceil(floorArea*(1+(Number(m.floorWaste||0)/100))),unit:"ft²"},
    cabinets:{qty:Math.ceil(Number(m.cabinets||0)),unit:"EA"},
    countertop:{qty:Math.ceil(Number(m.countertopLf||0)),unit:"LF"},
    tile:{qty:Math.ceil(Number(m.tileSqFt||0)),unit:"ft²"},
    vanity:{qty:Math.ceil(Number(m.vanity||0)),unit:"EA"}
  };
}
