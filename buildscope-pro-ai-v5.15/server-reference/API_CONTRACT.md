# BuildScope Backend API Contract — v5.1

The mobile app must call a BuildScope-owned backend. Secret retailer/API/AI credentials stay server-side.

## POST /v1/products/search
Request:
```json
{"query":"white shaker cabinet","category":"Kitchen Cabinets","location":{"postalCode":"32801"}}
```
Response:
```json
{
  "products":[{
    "productId":"provider:123",
    "name":"...",
    "brand":"...",
    "model":"...",
    "sku":"...",
    "color":"...",
    "finish":"...",
    "size":"...",
    "retailerName":"...",
    "retailerUrl":"...",
    "price":0,
    "availability":"in_stock",
    "verifiedAt":"ISO-8601"
  }]
}
```

## POST /v1/visualizations/generate
The server sends the source photo + selected real product constraints to the configured image-generation provider.
Response must include:
- `renderUrl`
- `designId`
- `productManifest[]` containing the exact `productId` references the render claims to use.

## POST /v1/products/availability
Refresh current price/availability before purchase.

## POST /v1/purchase-lists
Persist the final reconciled purchase list.

## Approval rule
A design is not final-client-approvable when any rendered product reference is unresolved.
