const EARTH_RADIUS_M=6378137;

export function polygonAreaSqMeters(points){
  if(!points || points.length<3) return 0;
  let area=0;
  for(let i=0;i<points.length;i++){
    const p1=points[i], p2=points[(i+1)%points.length];
    const lon1=p1.longitude*Math.PI/180, lon2=p2.longitude*Math.PI/180;
    const lat1=p1.latitude*Math.PI/180, lat2=p2.latitude*Math.PI/180;
    area+=(lon2-lon1)*(2+Math.sin(lat1)+Math.sin(lat2));
  }
  return Math.abs(area*EARTH_RADIUS_M*EARTH_RADIUS_M/2);
}
export const sqMetersToSqFeet=m2=>m2*10.7639104167;
export const sqFeetToSquares=ft2=>ft2/100;
export const pitchFactor=(rise,run=12)=>Math.sqrt(rise*rise+run*run)/run;
export function calculateRoof({points,pitch=6,waste=10}){
  const planFt2=sqMetersToSqFeet(polygonAreaSqMeters(points));
  const roofFt2=planFt2*pitchFactor(Number(pitch)||0);
  const orderFt2=roofFt2*(1+(Number(waste)||0)/100);
  return {planFt2,roofFt2,orderFt2,squares:sqFeetToSquares(orderFt2)};
}
