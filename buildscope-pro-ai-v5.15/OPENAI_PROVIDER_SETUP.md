# BuildScope Pro AI v5.3 — OpenAI Provider Setup

## What v5.3 implements
### Product search
`PRODUCT_PROVIDER=openai_web`

The backend uses the OpenAI Responses API with the hosted `web_search` tool to find real retailer/manufacturer products. The adapter is instructed not to invent SKU, model, price or availability.

### Remodeling visualization
`IMAGE_PROVIDER=openai`

The backend downloads the client's source photo and calls the OpenAI Images edit endpoint with `gpt-image-2`. The selected real products are injected as strict product constraints in the edit prompt.

The generated render is stored in the private Supabase bucket `design-renders` and returned to the app with a time-limited signed URL.

## Server environment
```env
PRODUCT_PROVIDER=openai_web
IMAGE_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_TEXT_MODEL=gpt-5.6
OPENAI_IMAGE_MODEL=gpt-image-2
```

## Database
Run:
- all previous migrations;
- `backend/openai_providers.sql`.

## Integrity limitation
AI image generation can be constrained by selected product names/specifications, but a generated image is still a visualization rather than a calibrated physical-material simulation. BuildScope therefore preserves the product manifest and requires product reconciliation before client approval.

## Security
`OPENAI_API_KEY` is server-only. It must never be stored in Expo public environment variables or the Android bundle.
