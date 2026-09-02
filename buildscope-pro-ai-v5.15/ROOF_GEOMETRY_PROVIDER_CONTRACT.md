# BuildScope Pro AI v5.10 — Roof Geometry Provider Contract

## Why this layer exists
Google Solar API gives roof area and segment tilt/orientation, but it does not directly return roofing-specific ridge/eave/rake/valley linear footage.

v5.10 adds a provider-independent API for a specialized roof report / geometry service.

## BuildScope backend request
`POST {ROOF_GEOMETRY_PROVIDER_URL}/measure`

```json
{
  "projectId":"uuid",
  "latitude":28.0,
  "longitude":-81.0,
  "address":"..."
}
```

## Expected normalized response
```json
{
  "provider":"provider-name",
  "reportId":"...",
  "roofAreaSqFt":3200,
  "squares":32,
  "ridgeLf":80,
  "eaveLf":180,
  "rakeLf":120,
  "valleyLf":40,
  "hipLf":0,
  "flashingLf":25,
  "facets":[],
  "confidence":"provider_report",
  "sourceDocumentUrl":"https://...",
  "generatedAt":"ISO-8601"
}
```

## Integrity rule
If any ridge/eave/rake/valley field is absent, BuildScope marks `completeLinearGeometry=false`.
Missing values are never fabricated.

## Field override
The `/v1/roof-geometry/override` endpoint allows a salesperson/field user to replace or complete geometry with field-verified measurements. Those records are labeled `field_verified`.

## Takeoff combination
BuildScope can combine:
- automatic area/squares from Google Solar;
- exact lineal geometry from a specialized provider;
- manual/field-verified overrides.

This gives the estimating engine the best available source per measurement instead of pretending all measurements come from one API.
