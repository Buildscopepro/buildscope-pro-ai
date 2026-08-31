import {getConfig} from "../lib/config.js";

function num(v){ return v==null?null:Number(v); }

export class ExternalRoofGeometryProvider{
  async measure({projectId,latitude,longitude,address}){
    const c=getConfig();
    if(!c.ROOF_GEOMETRY_PROVIDER_URL) throw new Error("ROOF_GEOMETRY_PROVIDER_URL is not configured");
    const headers={"Content-Type":"application/json"};
    if(c.ROOF_GEOMETRY_PROVIDER_API_KEY) headers.Authorization=`Bearer ${c.ROOF_GEOMETRY_PROVIDER_API_KEY}`;

    const r=await fetch(`${c.ROOF_GEOMETRY_PROVIDER_URL.replace(/\/$/,"")}/measure`,{
      method:"POST",
      headers,
      body:JSON.stringify({projectId,latitude,longitude,address})
    });
    const body=await r.json();
    if(!r.ok) throw new Error(body.error||`Roof geometry provider HTTP ${r.status}`);

    const result={
      provider:body.provider||"external",
      reportId:body.reportId||null,
      roofAreaSqFt:num(body.roofAreaSqFt),
      squares:num(body.squares),
      ridgeLf:num(body.ridgeLf),
      eaveLf:num(body.eaveLf),
      rakeLf:num(body.rakeLf),
      valleyLf:num(body.valleyLf),
      hipLf:num(body.hipLf),
      flashingLf:num(body.flashingLf),
      facets:Array.isArray(body.facets)?body.facets:[],
      confidence:body.confidence||"provider_report",
      sourceDocumentUrl:body.sourceDocumentUrl||null,
      generatedAt:body.generatedAt||new Date().toISOString()
    };

    const required=["ridgeLf","eaveLf","rakeLf","valleyLf"];
    const missing=required.filter(k=>result[k]==null);
    result.completeLinearGeometry=missing.length===0;
    result.missingFields=missing;
    return result;
  }
}

export function getRoofGeometryProvider(name){
  if(name==="external") return new ExternalRoofGeometryProvider();
  throw new Error(`Roof geometry provider '${name}' is not implemented`);
}
