export function runWorkflowChecks({roofMeasurement,roofLines,remodelLines,finishSchedule=[]}={}){
 const checks=[
  {name:"Roof measurement nonnegative",pass:!roofMeasurement||Number(roofMeasurement.orderFt2)>=0},
  {name:"Roof takeoff quantities valid",pass:!roofLines||roofLines.every(x=>Number(x.qty)>=0)},
  {name:"Remodel takeoff quantities valid",pass:!remodelLines||remodelLines.every(x=>Number(x.qty)>=0)},
  {name:"Finish schedule statuses valid",pass:finishSchedule.every(x=>["exact","equivalent","pending"].includes(x.match_status))}
 ];
 return {pass:checks.every(x=>x.pass),checks};
}
