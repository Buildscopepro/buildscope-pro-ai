import {getConfig} from "../lib/config.js";

const M2_TO_FT2=10.7639104167097;

function squaresFromM2(m2){ return (Number(m2||0)*M2_TO_FT2)/100; }

export class GoogleSolarRoofProvider{
  async measure({latitude,longitude,requiredQuality="BASE"}){
    const c=getConfig();
    if(!c.GOOGLE_SOLAR_API_KEY) throw new Error("GOOGLE_SOLAR_API_KEY is not configured");
    const u=new URL("https://solar.googleapis.com/v1/buildingInsights:findClosest");
    u.searchParams.set("location.latitude",String(latitude));
    u.searchParams.set("location.longitude",String(longitude));
    u.searchParams.set("requiredQuality",requiredQuality);
    u.searchParams.set("key",c.GOOGLE_SOLAR_API_KEY);

    const r=await fetch(u);
    const body=await r.json();
    if(!r.ok){
      const e=new Error(body?.error?.message||`Solar API HTTP ${r.status}`);
      e.status=r.status;
      e.code=body?.error?.status||"SOLAR_API_ERROR";
      throw e;
    }

    const sp=body.solarPotential||{};
    const segments=(sp.roofSegmentStats||[]).map((seg,index)=>({
      index,
      areaMeters2:Number(seg.stats?.areaMeters2||0),
      areaSqFt:Number(seg.stats?.areaMeters2||0)*M2_TO_FT2,
      squares:squaresFromM2(seg.stats?.areaMeters2||0),
      groundAreaMeters2:Number(seg.stats?.groundAreaMeters2||0),
      pitchDegrees:Number(seg.pitchDegrees||0),
      azimuthDegrees:Number(seg.azimuthDegrees||0),
      center:seg.center||null,
      boundingBox:seg.boundingBox||null
    }));

    // Google documents wholeRoofStats as the roof assigned to roof segments.
    // buildingStats can include uncharacterized roof parts; roof area there may be unreliable.
    const wholeRoofM2=Number(sp.wholeRoofStats?.areaMeters2||segments.reduce((s,x)=>s+x.areaMeters2,0));
    const wholeGroundM2=Number(sp.wholeRoofStats?.groundAreaMeters2||0);
    const buildingGroundM2=Number(sp.buildingStats?.groundAreaMeters2||0);

    // Optional scaled estimate based on Google's documented suggestion:
    // scale whole-roof area by building-ground / whole-roof-ground when both are available.
    const scaledRoofM2=(wholeRoofM2>0&&wholeGroundM2>0&&buildingGroundM2>0)
      ? wholeRoofM2*(buildingGroundM2/wholeGroundM2)
      : wholeRoofM2;

    return {
      provider:"google_solar",
      imageryQuality:body.imageryQuality||null,
      imageryDate:body.imageryDate||null,
      center:body.center||null,
      postalCode:body.postalCode||null,
      administrativeArea:body.administrativeArea||null,
      regionCode:body.regionCode||null,
      rawWholeRoofAreaMeters2:wholeRoofM2,
      estimatedRoofAreaMeters2:scaledRoofM2,
      estimatedRoofAreaSqFt:scaledRoofM2*M2_TO_FT2,
      estimatedSquares:squaresFromM2(scaledRoofM2),
      segmentCount:segments.length,
      segments,
      confidence:segments.length?"provider_model":"no_segments"
    };
  }
}

export function getRoofProvider(name){
  if(name==="google_solar") return new GoogleSolarRoofProvider();
  throw new Error(`Roof provider '${name}' is not implemented`);
}
