# BuildScope Pro AI v5.8 — Automatic Roof Measurement

## Provider implemented
Google Maps Platform Solar API `buildingInsights`.

## What BuildScope extracts automatically when coverage exists
- Roof area accounting for tilt.
- Roofing squares.
- Individual roof segments.
- Pitch degrees per segment.
- Azimuth per segment.
- Segment area.
- Imagery quality/date metadata when returned.

## Accuracy behavior
Google documents that:
- Solar API uses aerial imagery and 3D modelling;
- imagery/model output may be imperfect or out of date;
- `wholeRoofStats.areaMeters2` is roof area accounting for tilt;
- `buildingStats` may contain roof portions whose roof area is not reliable;
- Google suggests scaling whole-roof roof area by the ratio of building ground area to whole-roof ground area when appropriate.

v5.8 implements that documented scaling as an estimated whole-building roof area and preserves the raw whole-roof area.

## What it does NOT invent
Google Solar API does not directly give roofing-specific:
- ridge LF
- eave LF
- rake LF
- valley LF

Those remain manual inputs or require a separate geometry/roof-report provider.

## Fallback
If Solar API returns 404 / no imagery at the requested quality, BuildScope returns:
`fallback: manual_polygon`

The manual satellite polygon measurement already in the app remains available.

## Server env
```env
ROOF_PROVIDER=google_solar
GOOGLE_SOLAR_API_KEY=...
```

The Google key stays server-side.
