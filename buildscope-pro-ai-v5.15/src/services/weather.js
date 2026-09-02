export async function getRoofingWeather(latitude,longitude){
 if(latitude==null||longitude==null) return null;
 const url=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_probability_max,precipitation_sum,wind_speed_10m_max,temperature_2m_max&timezone=auto&forecast_days=7`;
 const r=await fetch(url);
 if(!r.ok) throw new Error("Weather service unavailable");
 const j=await r.json();
 return j.daily.time.map((date,i)=>{
  const rainProb=Number(j.daily.precipitation_probability_max?.[i]||0);
  const rain=Number(j.daily.precipitation_sum?.[i]||0);
  const wind=Number(j.daily.wind_speed_10m_max?.[i]||0);
  const risk=rainProb>=50||rain>=2||wind>=35?"high":rainProb>=25||wind>=25?"medium":"low";
  return {date,rainProb,rain,wind,temp:Number(j.daily.temperature_2m_max?.[i]||0),risk};
 });
}
